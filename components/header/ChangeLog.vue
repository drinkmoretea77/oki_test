<template>
    <div class="portlet light bordered changes-log portlet-block">
        <div class="portlet-title" id="changes-log-sidebar">
            <div class="caption font-green-sharp w-100">
                <span class="caption-subject bold uppercase">{{
                    $t('Изменения')
                }}</span>
            </div>
            <div
                class="btn-group fieldsets change-log-buttons margin-bottom-10"
            >
                <a
                    href="javascript:"
                    class="btn btn-default"
                    @click="next"
                    :class="page === 1 ? 'disabled' : ''"
                    :title="$t('Следующие')"
                >
                    <i class="fa fa-angle-double-left fa-lg"> </i>
                </a>
                <a
                    href="javascript:"
                    class="btn btn-default"
                    @click="prev"
                    :title="$t('Предыдущие')"
                    :class="items.length < maxCount ? 'disabled' : ''"
                >
                    <i class="fa fa-angle-double-right fa-lg"> </i>
                </a>
                <a
                    href="#"
                    class="btn btn-default"
                    @click="reload"
                    :title="$t('Обновить')"
                >
                    <i class="fa fa-refresh fa-lg"> </i>
                </a>
            </div>
        </div>
        <div class="portlet-body">
            <v-content-spinner :load="load" />
            <div v-if="!items.length && !load" class="text-muted text-center">
                {{ $t('Нет изменений') }}
            </div>
            <div v-if="showError" class="alert alert-danger hidden">
                {{ $t('Ошибка при загрузке данных') }}
            </div>
            <ul class="list-unstyled">
                <li v-for="item in items" class="user-info">
                    <div class="panel panel-default" :data-id="item.log_id">
                        <div class="panel-body">
                            <div class="details-wrapper">
                                <div
                                    :class="'user-icon bg-' + item.color"
                                    v-html="item.icon"
                                />
                                <div class="details">
                                    <div>
                                        <strong>{{ item.user_name }}</strong>
                                    </div>
                                    <div>
                                        <span class="action_text">{{
                                            item.action_text
                                        }}</span>
                                    </div>
                                    <div
                                        class="margin-bottom-5"
                                        v-html="
                                            getIcon(item.object_type) +
                                            ' ' +
                                            item.object_name
                                        "
                                    ></div>
                                </div>
                            </div>
                            <ul class="list-unstyled">
                                <li
                                    v-if="item.linked_id"
                                    v-html="
                                        getIcon(item.linked_type) +
                                        ' ' +
                                        item.linked_name
                                    "
                                />
                                <li v-for="(value, key) in item.list">
                                    <div v-if="typeof value === 'object'">
                                        <div v-html="key" />
                                        <ul class="list-unstyled log-sublist">
                                            <li v-for="(value1, key1) in value">
                                                <div
                                                    v-if="
                                                        typeof value1 ===
                                                        'object'
                                                    "
                                                >
                                                    <div v-html="key1" />
                                                    <ul
                                                        class="list-unstyled log-sublist"
                                                    >
                                                        <template
                                                            v-for="(
                                                                value2, key2
                                                            ) in value1"
                                                        >
                                                            <li
                                                                v-if="
                                                                    value2 !==
                                                                    null
                                                                "
                                                            >
                                                                {{
                                                                    (isArray(
                                                                        value1
                                                                    )
                                                                        ? ''
                                                                        : key2 +
                                                                          ': ') +
                                                                    value2
                                                                }}
                                                            </li>
                                                        </template>
                                                    </ul>
                                                </div>
                                                <div v-else>
                                                    {{
                                                        (isArray(value)
                                                            ? ''
                                                            : key1 + ': ') +
                                                        value1
                                                    }}
                                                </div>
                                            </li>
                                        </ul>
                                    </div>
                                    <div v-else>
                                        {{
                                            (isArray(item.list)
                                                ? ''
                                                : key + ': ') + value
                                        }}
                                    </div>
                                </li>
                            </ul>
                            <div>
                                <time
                                    class="timeago pull-right"
                                    :datetime="item.localtime"
                                    :title="item.dtime"
                                    >{{ item.dtime }}</time
                                >
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
declare let Tipped: any;

export default Vue.extend({
    data(): any {
        return {
            load: false,
            items: [],
            page: 1,
            maxCount: 15,
            showError: false,
        };
    },

    computed: {
        ...mapState({
            show: ({ showHistory }: any) => showHistory,
            side_content: ({ side_content }: any) => side_content,
        }),
    },

    watch: {
        show(status) {
            if (status) {
                this.updateData();
            }
        },
    },

    methods: {
        isArray(array: any) {
            return Array.isArray(array);
        },

        async updateData() {
            let url = this.side_content ? this.side_content.url : null;

            if (!url) return;

            let params: any = {};

            if (this.page > 1) {
                params.page = this.page;
            }

            this.load = true;
            this.showError = false;
            this.items.splice(0, this.items.length);

            const response = await this.$action({
                method: 'get',
                url,
                params,
                silent: true,
            });

            if (response) {
                const items = response.data;

                items.forEach((item: any) => {
                    let ts = new Date(item.unixtime * 1000);
                    item.localtime = ts.toISOString();
                });

                this.items.push(...items);

                await this.$nextTick();
                $(this.$el).find('time.timeago').timeago();

                if (Tipped) {
                    Tipped.create($(this.$el).find('*[title]'), {
                        skin: 'light',
                        maxWidth: 500,
                    });
                }
            } else {
                this.showError = true;
            }

            this.load = false;
        },

        next() {
            this.page--;

            if (this.page < 1) {
                this.page = 1;
            } else {
                this.updateData();
            }
        },

        prev() {
            this.page++;

            if (this.page > this.maxCount) {
                this.page = this.maxCount;
            } else {
                this.updateData();
            }
        },

        reload() {
            this.updateData();
        },

        getIcon(type: any) {
            let color = '',
                icon = '',
                title = '';
            switch (type) {
                case 1:
                    color = 'green';
                    icon = 'user';
                    title = this.$t('Пользователь');
                    break;
                case 2:
                    color = 'red';
                    icon = 'lock';
                    title = this.$t('Роль');
                    break;
                case 3:
                    color = 'blue';
                    icon = 'list';
                    title = this.$t('Очередь');
                    break;
                case 4:
                    color = 'dark';
                    icon = 'cog';
                    title = this.$t('Компания');
                    break;
                case 5:
                    color = 'blue-madison';
                    icon = 'clock-o';
                    title = this.$t('Расписание');
                    break;
                case 6:
                    color = 'green-meadow';
                    icon = 'users';
                    title = this.$t('Группа пользователей');
                    break;
                case 7:
                    color = 'green-jungle';
                    icon = 'sign-out';
                    title = this.$t('Статус');
                    break;
                case 8:
                    color = 'grey-gallery';
                    icon = 'filter';
                    title = this.$t('Фильтр компании');
                    break;
                case 9:
                    color = 'grey-gallery';
                    icon = 'filter';
                    title = this.$t('Правило фильтра компании');
                    break;
                case 10:
                    color = 'yellow';
                    icon = 'globe';
                    title = this.$t('Поставщик');
                    break;
                case 11:
                    color = 'blue-steel';
                    icon = 'sitemap';
                    title = this.$t('Сценарий звонка');
                    break;
                case 12:
                    color = 'yellow-crusta';
                    icon = 'external-link';
                    title = this.$t('Привязка интеграции к событию');
                    break;
                case 13:
                    color = 'blue-chambray';
                    icon = 'folder-o';
                    title = this.$t('Проект');
                    break;
                default:
                    return '';
            }
            return (
                '<span class="label bg-' +
                color +
                '" title="' +
                title +
                '"><i class="fa fa-' +
                icon +
                '"> </i></span>'
            );
        },
    },
});
</script>

<style lang="stylus">
.change-log-buttons
    .btn
        transition: all .15s ease-out!important
        padding: 8px 14px 9px!important
        box-shadow: none!important
        border-radius: 0!important
        border-color: #adadad!important
        &:hover
            background-color: rgba(255,255,255,0.8)!important

.portlet-block
    overflow: hidden
    position: relative
</style>
