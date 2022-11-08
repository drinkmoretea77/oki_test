<template>
    <div>
        <v-modal-sync v-model="is_show" size="md" :load="is_loaded">
            <template #header>
                <h1>{{ title }}</h1>
            </template>
            <template #body>
                <div class="panel-edit-block">
                    <v-search class="margin-bottom-15" :placeholder="$t('Поиск')" @submit="updateSearchItems"/>
                    <div class="row object-project-content">
                        <div v-for="item in localItems" :key="item.id" v-show="!item.hide" class="col-lg-6">
                            <div
                                :class="[
                                { 'btn-primary': item.selected },
                                { 'default': !item.selected }
                            ]"
                                @click="item.selected = !item.selected"
                                class="btn btn-block margin-bottom-10"
                            >
                                {{ item.name }}
                            </div>
                        </div>
                    </div>
                    <br>
                    <div class="row">
                        <div class="col-md-5">
                            <div class="btn btn-success" @click="selectAll()">{{ $t('Выбрать все') }}</div>&nbsp;
                            <div class="btn btn-warning" @click="deselectAll()">{{ $t('Убрать все') }}</div>
                        </div>
                        <div class="col-md-7">
                            <div class="btn btn-default" @click="cancel">{{ $t('Отмена') }}</div>&nbsp;
                            <div class="btn btn-primary save-btn" @click="save">{{ $t('Сохранить') }}</div>
                        </div>
                    </div>
                </div>
            </template>
        </v-modal-sync>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import {routes} from "~/api";

    interface ObjectItem {
        id: string | number,
        name: any,
        selected: boolean,
        hide: boolean
    }

    interface ProjectObject {
        searchRequest: string,
        localItems: ObjectItem[],
        is_loaded: boolean
    }

    export default Vue.extend({
        props: {
            value: {
                type: Boolean,
                default: false
            },
            project_id: {
                type: [Number, String],
                default: null
            },
            name: {
                type: String,
                default: null
            },
            title: {
                type: String,
                default: null
            },
            items: {
                type: Array,
                default: () => ([])
            }
        },

        data(): any {
            return {
                is_show: false,
                is_loaded: false,
                localItems: [],
                searchRequest: '',
            }
        },

        methods: {
            async loadObjectData() {
                if (!this.project_id && !this.name) {
                    return;
                }

                this.is_loaded = true;
                const response = await this.$api.get(routes.projects.a_projects_new_get_id_name, {id: this.project_id, name: this.name});
                const data = response.data;

                if (data) {
                    if (data.error) {
                        toastr['error'](this.$t('Ошибка загрузки данных'));
                    } else {
                        this.updateData(data);
                    }
                }
                this.is_loaded = false;
            },

            updateData(data: any): void {
                this.localItems.splice(0, this.localItems.length);
                this.searchRequest = '';

                if (!data.items) {
                    return;
                }

                for (const obj of data.items) {
                    obj.selected = this.items.some((item: any) => parseInt(item.id) === parseInt(obj.id));
                    obj.hide = false;
                    this.localItems.push(obj);
                }
            },

            updateSearchItems(request: string): void {
                this.searchRequest = request.toLocaleLowerCase();

                for (const item of this.localItems) {
                    item.hide = (this.searchRequest !== '') && !this.searchFilter(item.name);
                }
            },

            searchFilter(value: string) {
                return value.toLocaleLowerCase().includes(this.searchRequest);
            },

            selectAll() {
                for (const item of this.localItems) {
                    if (!item.hide) {
                        item.selected = true;
                    }
                }
            },

            deselectAll(): void {
                for (const item of this.localItems) {
                    if (!item.hide) {
                        item.selected = false;
                    }
                }
            },

            cancel() {
                this.is_show = false;
            },

            async save(): Promise<any> {
                this.is_loaded = true;

                const selectedItems = this.localItems.filter((item: any) => item.selected).map((item: any) => item.id);

                const response = await this.$api.post(routes.projects.a_projects_new_set_id_name, {
                    id: this.project_id,
                    name: this.name,
                    objects_str: JSON.stringify(selectedItems)
                });

                const data = response.data;

                if (data) {
                    if (data.error) {
                        toastr['error'](this.$t('Ошибка сохранения данных'));
                    } else {
                        let label = '';

                        if (data.added && data.added.length) {
                            label = label + this.$t('Добавлено:') + ' ' + data.added.length + ' ';
                        }

                        if (data.removed && data.removed.length) {
                            label = label + this.$t('Удалено:') + ' ' + data.removed.length + ' ';
                        }

                        toastr['success'](this.$t('Данные сохранены'), label);

                        if (data.items) {
                            this.$emit('update', {
                                name: this.name,
                                items: data.items
                            });
                        }
                    }
                }

                this.is_loaded = false;
            }
        },

        watch: {
            is_show() {
                this.$emit('input', this.is_show);
            },
            value() {
                this.is_show = this.value;
                if (this.is_show) {
                    this.loadObjectData();
                }
            },
        }

    })
</script>

<style>
    .object-project-content {
        overflow-y: auto;
        max-height: 500px;
    }
</style>
