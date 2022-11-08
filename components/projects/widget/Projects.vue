<template>
    <div class="scroller wh-1">
        <div v-if="current_content_name === content_names.all">
            <v-list v-if="items.length" name="projects_list" :defaultView="3">
                <template slot="header">
                    <v-search :placeholder="$t('Поиск')" @submit="updateSearchRequest"/>
                    <button class="btn btn-primary button-create" @click="is_project_create = true">{{ $t('Создать') }}</button>
                </template>
                <template v-if="searchItems.length">
                    <v-list-item v-for="item in searchItems" :key="item.id" :controls="false">
                        <v-list-content>
                            <a class="project-pin"><i class="icon-pin"></i></a>
                            <v-list-title>
                                <a @click="onEdit(item.id)">{{ item.name }}</a>
                                <!--                                <nuxt-link :to="'/n/projects/project/' + item.id">{{ item.name }}</nuxt-link>-->
                            </v-list-title>
                            <v-list-text>
                                <div v-if="item.description">{{ item.description }}</div>
                            </v-list-text>
                            <v-list-date v-if="item.updated">
                                {{ $t('Изменен:')}} {{ item.updated.user_name }}, {{ item.updated.updated_at }}
                            </v-list-date>
                        </v-list-content>
                    </v-list-item>
                </template>
                <template slot="another">
                    <v-empty v-if="!searchItems.length" :label="$t('Ничего не найдено')"/>
                </template>
            </v-list>
            <v-empty v-else />
        </div>

        <div v-show="is_project_edit">
            <project-edit
                v-if="project_id > 0"
                :project_id="project_id"
                v-model="is_project_edit"
                @refresh="is_project_edit = false; refresh();"
            />
        </div>

        <project-create
            v-model="is_project_create"
            @refresh="refresh"
        />

    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { deepCopyObject } from '~/shared/utils';
import {routes} from "~/api";
import ProjectEdit from '~/components/projects/widget/ProjectEdit.vue';
import ProjectCreate from '~/components/projects/widget/ProjectCreate.vue';

export default Vue.extend({
    props: {
        items: {
            type: Array,
            default: () => ([])
        }
    },

    components: {
        ProjectEdit,
        ProjectCreate
    },

    data(): any {
        const content_names = {
            all: 'projects_all',
            edit: 'project_edit',
        };

        return {
            searchRequest: '',
            content_names: content_names,
            current_content_name: content_names.all,
            is_project_edit: false,
            is_project_create: false,
            project_id: null,
            link_project_create: routes.projects.n_projects_create,
        }
    },

    computed: {
        searchItems() {
            let result: any = deepCopyObject(this.items);

            if (this.searchRequest !== '') {
                result = result.filter((item: any) => (
                    this.searchFilter(item.name)
                ));
            }

            return result;
        },
    },

    methods: {
        refresh() {
            this.$emit('refresh');
        },

        searchFilter(value: string | number) {
            return value.toString().toLocaleLowerCase().includes(this.searchRequest);
        },

        updateSearchRequest(request: string) {
            this.searchRequest = request.toLocaleLowerCase();
        },

        onEdit(project_id: string | number) {
            this.current_content_name = this.content_names.edit;
            this.project_id = project_id;
        }
    },

    watch: {
        current_content_name() {
            this.is_project_edit = (this.current_content_name === this.content_names.edit);
        },

        is_project_edit() {
            this.current_content_name = this.is_project_edit ? this.content_names.edit : this.content_names.all;
        }
    }
})
</script>
<style>
    .project-pin {
        display: inline-block;
        width: 28px;
        height: 27px;
        position: absolute;
        top: 10px;
        right: 10px;
        text-align: center;
        padding-top: 6px;
        opacity: 0.5;
    }
    .button-create{
        margin-left: 15px;
    }
</style>
