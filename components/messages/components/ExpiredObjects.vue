<template>
    <div>
        <v-modal-sync
            v-model="modal.open"
            :load="modal.load"
            :close-button="false"
            :freeze="true"
            size="xl"
        >
            <template #header><div ref="modal" tabindex="-1"/>
                    <h4 class="modal-title">{{ $t('Автоархивация') }}</h4>
            </template>

            <template #body>
                <div>
                    {{ $t("Эти объекты очень давно не использовались, а сейчас засоряют хранилище вашей компании. Пожалуйста, отправьте эти объекты в архив поскорее. Возможно, вам будет немного не по себе, но эта операция обратима и архивные объекты легко вернуть в работу. Поэтому смело сметите мусор в архивную коробку.") }}
                </div>
                <template v-if="countAvailableObjects === 0">
                    <div class="note note-warning">
                        {{ $t("Кажется, в системе появились устаревшие объекты, к которым вы не имеете доступа. Обратитесь к администратору вашего колл-центра.") }}
                    </div>
                </template>
                <template v-else>
                    <table class="table table-hover">
                        <thead>
                            <tr>
                                <th></th>
                                <th>{{ $t('Объект') }}</th>
                                <th>{{ $t('Последняя активность') }},<br>{{ $t('дней') }}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            <template v-for="objects in expiredObjects">
                                <tr v-for="item in objects.items" :key="objects.type + item.id">
                                    <td>{{ objects.type_name }}</td>
                                    <td style="word-break: break-word">{{ item.name }}</td>
                                    <td nowrap class="text-center">{{ item.days_ago }}</td>
                                    <td nowrap><a @click="notNow(objects.type, item.id)">{{ $t('Не сейчас')}}</a></td>
                                </tr>
                            </template>
                        </tbody>
                    </table>
                    <template v-if="countAvailableObjects >= 0">
                        <v-checkbox-inline
                            v-model="confirmed"
                            :label="confirmedLabel()"
                        />
                    </template>
                </template>
            </template>

            <template #footer>
                <n-link class="margin-right-10"
                        :to="'/n/company/' + comp_id + '/edit#auto-archive'"
                        @click.native="hide()">{{ $t("К настройкам") }}</n-link>
                <button type="button" class="btn"
                        @click="hide()">{{ $t('Закрыть') }}</button>
                <button type="button" class="btn btn-danger"
                        :disabled="!confirmed || (countAvailableObjects <= 0)"
                        @click="archiveObjects()">{{ $t('Архивировать объекты') }}</button>
            </template>

        </v-modal-sync>
    </div>
</template>

<script>
import {deepCopyObject} from "~/shared/utils";
import {routes} from "~/api";

export default {
    props: {
        comp_id: {
            type: Number,
            default: 0
        },
        expiredObjectsData: {
            type: Array,
            default: null
        }
    },

    data() {
        return {
            expiredObjects: null,
            confirmed: false,
            hook: null,
            modal: {
                open: false,
                load: false,
            }
        }
    },

    created() {
        this.updateData(this.expiredObjectsData);
    },

    mounted() {
        this.show();

        this.hook = this.$router.afterEach(async () => {
                const {data} = await this.$api.get(routes.expired_objects.get);
                if (data?.expired_objects) {
                    this.updateData(data.expired_objects);
                }
                this.show();
            }
        );
    },

    beforeDestroy() {
        if (this.hook) {
            this.hook();
        }
    },

    computed: {
        countAvailableObjects() {
            if (!Array.isArray(this.expiredObjects) || (this.expiredObjects.length === 0)) {
                return -1;
            }

            let count = 0;
            this.expiredObjects.forEach((object) => {
                count += Array.isArray(object.items) ? object.items.length : 0
            });
            return count;
        },
    },

    methods: {
        show() {
            if (this.countAvailableObjects === -1) {
                return;
            }

            if (this.$route.name === 'n-company-id-edit') {
                this.modal.open = false;
                return;
            }

            this.confirmed = false;
            this.modal.open = true;
            this.$nextTick(() => {
                this.$refs.modal.focus();
            })
        },

        hide() {
            this.modal.open = false;
        },

        confirmedLabel() {
            let message = [];
            this.expiredObjects.forEach((object) => {
                const count = Array.isArray(object.items) ? object.items.length : 0
                if (count > 0) {
                    message.push(' ' + this.$t('типа') + ' "' + object.type_name + '" (' + count + ' ' + this.$t('шт.') + ')');
                }
            });
            message = message.join(',');

            return this.$t('Я согласен(на) архивировать объекты') + message + '.';
        },

        async notNow(type, item_id) {
            const objects_index = this.expiredObjects.findIndex(item => item.type === type);
            if (objects_index === -1) {
                console.log('Objects type "' + type + '" not found.');
                return;
            }

            const item_index = this.expiredObjects[objects_index].items.findIndex(item => item.id === item_id);
            if (item_index === -1) {
                console.log('Object id "' + item_id + '" not found.');
                return;
            }

            this.modal.load = true;
            const {data} = await this.$api.post(routes.expired_objects.exclude, {
                    type: type,
                    id: item_id
                },
                {success: this.$t("Автоархивация объекта отложена.")}
            );
            this.modal.load = false;

            if (!data?.success) {
                return;
            }

            this.expiredObjects[objects_index].items.splice(item_index, 1);

            if (this.expiredObjects[objects_index].items.length === 0) {
                this.expiredObjects.splice(objects_index, 1);
            }

            if (this.countAvailableObjects === -1) {
                this.resolved();
            }
        },

        async archiveObjects() {
            if (!this.confirmed) {
                return;
            }

            this.confirmed = false;
            this.modal.load = true;
            const {data} = await this.$api.post(
                routes.expired_objects.archive,
                {expired_objects: this.expiredObjects},
                {success: this.$t('Задание успешно поставлено в очередь. В ближайшее время объекты будут архивированы.')}
            );
            this.modal.load = false;

            if (data?.success) {
                if (data?.expired_objects) {
                    this.updateData(data.expired_objects);

                    if (this.countAvailableObjects !== -1) {
                        return;
                    }
                }

                this.resolved();
            }
        },

        resolved() {
            this.hide();
            this.$emit('resolved');
        },

        updateData(data) {
            this.expiredObjects = deepCopyObject(data);
        }
    },
}
</script>
