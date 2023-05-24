<template>
    <div class="project-object panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">
                {{ title }}&nbsp;<span
                    v-if="items.length"
                    class="badge badge-info"
                    >{{ items.length }}</span
                >
                <a
                    href="javascript:"
                    class="btn btn-xs blue btn-outline pull-right edit_type"
                    data-loading
                    @click="change"
                >
                    <template v-if="!edit">{{ $t('Изменить') }}</template>
                    <template v-else>{{ $t('Отмена') }}</template>
                </a>
            </h3>
        </div>
        <div class="panel-body">
            <v-content-spinner :load="loading" class="spinner--no-space" />
            <div v-if="!edit" class="row">
                <template v-if="items && items.length">
                    <div
                        v-for="item in items"
                        :key="item.id"
                        class="col-lg-3 col-md-4 col-sm-6"
                    >
                        <a :href="getUrl(name, item.id)" :data-name="name">{{
                            item.name
                        }}</a>
                    </div>
                </template>
                <template v-else>
                    <div class="col-lg-3 col-md-4 col-sm-6">
                        {{ $t('Нет выбранных значений') }}
                    </div>
                </template>
            </div>
            <div v-else class="panel-edit-block">
                <div style="display: flex">
                    <v-search
                        class="margin-bottom-15 margin-right-15"
                        :placeholder="$t('Поиск')"
                        @submit="updateSearchItems"
                    />
                    <div v-if="groups" style="max-width: 300px; width: 100%">
                        <v-select-inline
                            :options="groups"
                            v-model="filterGroup"
                            type-value="number"
                            @input="updateHideItems"
                        >
                            <template #selected="{ option }">
                                <template v-if="option">
                                    <i
                                        v-if="option.color"
                                        class="fa fa-circle"
                                        :style="{
                                            color: option.color,
                                            opacity: 0.6,
                                        }"
                                    ></i>
                                    {{ option.text }}
                                </template>
                            </template>
                            <template #options="{ option }">
                                <div
                                    style="
                                        display: flex;
                                        justify-content: space-between;
                                    "
                                >
                                    <span>{{ option.text }}</span>
                                    <span
                                        v-if="option.color"
                                        class="badge"
                                        :style="{
                                            'background-color': option.color,
                                        }"
                                        >{{ option.count || 0 }}</span
                                    >
                                </div>
                            </template>
                        </v-select-inline>
                    </div>
                </div>
                <div class="row">
                    <div
                        v-for="item in localItems"
                        :key="item.id"
                        v-show="!item.hide"
                        class="col-lg-3 col-md-4 col-sm-6"
                    >
                        <div
                            class="project-object__item btn btn-block"
                            :class="[
                                { 'btn-primary': item.selected },
                                { default: !item.selected },
                            ]"
                            @click="item.selected = !item.selected"
                        >
                            <div class="project-object__item-name">
                                {{ item.name }}
                            </div>
                            <template v-if="item.group">
                                <i
                                    class="fa fa-circle"
                                    :style="{
                                        color: item.group.color,
                                        opacity: 0.6,
                                    }"
                                ></i>
                            </template>
                        </div>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-5">
                        <div class="btn btn-success" @click="selectAll()">
                            {{ $t('Выбрать все') }}
                        </div>
                        &nbsp;
                        <div class="btn btn-warning" @click="deselectAll()">
                            {{ $t('Убрать все') }}
                        </div>
                    </div>
                    <div class="col-md-7">
                        <div class="btn btn-default" @click="cancel">
                            {{ $t('Отмена') }}
                        </div>
                        &nbsp;
                        <div class="btn btn-primary save-btn" @click="save">
                            {{ $t('Сохранить') }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { routes } from '~/api';

declare const toastr: any;

interface ObjectItem {
    id: string | number;
    name: any;
    selected: boolean;
    hide: boolean;
    group: any;
}

interface ProjectObject {
    searchRequest: string;
    edit: boolean;
    localItems: ObjectItem[];
    groups: [];
    loading: boolean;
    filterGroup: number;
}

export default Vue.extend({
    props: {
        // Название объекта
        title: {
            type: String,
        },

        // Уникальное название
        name: {
            type: String,
        },

        // Элементы объекта
        items: {
            type: Array,
            default: () => [],
        },
    },

    data(): ProjectObject {
        return {
            // строка поиска - фильтр
            searchRequest: '',

            // Статус редактирования
            edit: false,

            // Локальная копия элементов
            localItems: [],

            // Состояние загрузки
            loading: false,
            groups: [],
            filterGroup: -1,
        };
    },

    methods: {
        searchFilter(value: string) {
            return value.toLocaleLowerCase().includes(this.searchRequest);
        },

        updateSearchItems(request: string): void {
            this.searchRequest = request.toLocaleLowerCase();
            this.updateHideItems();
        },

        updateHideItems(): void {
            for (const item of this.localItems) {
                item.hide =
                    (this.filterGroup !== -1 &&
                        item.group &&
                        item.group.id !== this.filterGroup) ||
                    (this.searchRequest !== '' &&
                        !this.searchFilter(item.name));
            }
        },

        /**
         * Получение url'a для сущности
         */
        getUrl(name: string, id: string | number): string {
            switch (name) {
                case 'interview':
                    return '/n/crm/' + name + '/' + id;
                case 'contact_field':
                    return '/n/crm/contact-fields';
                case 'providers':
                case 'post_companies':
                    return '/providers/' + id;
                case 'users':
                    return '/n/' + name + '/' + id + '/edit';
                default:
                    return '/' + name + '/' + id + '/edit';
            }
        },

        /**
         * Обновление данных объекта
         */
        updateData(data: any): void {
            this.groups = data.groups || null;
            this.filterGroup == -1;
            this.localItems.splice(0, this.localItems.length);
            this.searchRequest = '';

            if (!data.items) {
                return;
            }

            for (const obj of data.items) {
                obj.selected = this.items.some(
                    (item: any) => parseInt(item.id) === parseInt(obj.id)
                );
                obj.hide = false;
                this.localItems.push(obj);
            }
        },

        /**
         * Переключения состояния редактирования
         */
        async change(event: any): Promise<any> {
            event.target.blur();
            if (this.loading) return;

            if (this.edit) {
                this.edit = false;
                return;
            }
            this.loading = true;
            const response = await this.$api.get(
                routes.projects.a_projects_new_get_id_name,
                { id: this.$route.params.id, name: this.name },
                { silent: true }
            );
            this.loading = false;

            const data = response.data;

            if (!data) {
                return;
            }

            if (data.error) {
                toastr['error'](this.$t('Ошибка загрузки данных'));
                return;
            }

            this.updateData(data);
            this.edit = true;
        },

        /**
         * Выбрать все элементы
         */
        selectAll(): void {
            for (const item of this.localItems) {
                if (!item.hide) {
                    item.selected = true;
                }
            }
        },

        /**
         * Снять выделение со всех элементов
         */
        deselectAll(): void {
            for (const item of this.localItems) {
                if (!item.hide) {
                    item.selected = false;
                }
            }
        },

        /**
         * Отменить действия
         */
        cancel(): void {
            this.edit = false;
        },

        /**
         * Сохранить выбор элементов
         */
        async save(): Promise<any> {
            this.loading = true;

            const selectedItems = this.localItems
                .filter((item) => item.selected)
                .map((item) => item.id);

            const response = await this.$api.post(
                routes.projects.a_projects_new_set_id_name,
                {
                    id: this.$route.params.id,
                    name: this.name,
                    objects_str: JSON.stringify(selectedItems),
                },
                { silent: true }
            );
            this.loading = false;

            const data = response.data;

            if (data) {
                if (data.error) {
                    toastr['error'](this.$t('Ошибка сохранения данных'));
                    return;
                }

                let label = '';

                if (data.added && data.added.length) {
                    label =
                        label +
                        this.$t('Добавлено:') +
                        ' ' +
                        data.added.length +
                        ' ';
                }

                if (data.removed && data.removed.length) {
                    label =
                        label +
                        this.$t('Удалено:') +
                        ' ' +
                        data.removed.length +
                        ' ';
                }

                toastr['success'](this.$t('Данные сохранены'), label);

                if (data.items) {
                    if (this.name && data.items) {
                        const items = [];

                        for (const obj of data.items) {
                            obj.selected = true;
                            items.push(obj);
                        }

                        const object_to_save = {
                            name: this.name,
                            items,
                        };

                        this.$emit('save-object', object_to_save);
                    }

                }
            }

            this.edit = false;
        },
    },
});
</script>

<style lang="stylus">
.project-object
    .panel-body
        position: relative
    &__item
        margin-bottom 10px
        display: flex
        justify-content: space-between
    &__item-name
        width:100%
        overflow: hidden
        text-overflow: ellipsis
</style>
