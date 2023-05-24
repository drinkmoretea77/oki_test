<template>
    <div class="content-wrapper">
        <v-page-header :title="title" back="/n/projects" />
        <div class="note note-info">
            <p>
                {{
                    $t(
                        'Укажите пользователей и те объекты (очереди, автообзвоны и т.д.), которые должны видеть пользователи. Подробнее читайте'
                    )
                }}&nbsp;<a
                    href="https://www.oki-toki.net/blog/bezopasnost_proekty_"
                    >{{ $t('тут') }}</a
                >
            </p>
        </div>
        <v-content-spinner :load="load" />
        <v-form
            class="margin-bottom-40"
            v-bind="editForm"
            v-slot="{ values, validate, submitValidate, error, errors }"
        >
            <v-input
                :label="$t('Название проекта')"
                v-model="values['name']"
                rules="required"
                :errors="errors.name"
            />

            <v-textarea
                :label="$t('Описание')"
                v-model="values['description']"
                :errors="errors.description"
            />

            <div class="form-group">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <div v-if="error" class="alert alert-danger">
                        <strong>{{ $t('Ошибка!') }}</strong> {{ error }}
                    </div>
                </div>
            </div>
            <hr />
            <div class="row form-group">
                <div class="col-md-3"></div>
                <div class="col-md-9">
                    <nuxt-link to="/n/projects">
                        <button
                            type="reset"
                            class="btn btn-default reset-button"
                        >
                            {{ $t('Отмена') }}
                        </button>
                    </nuxt-link>
                    &nbsp;
                    <div class="btn-group dropup">
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="submitValidate(validate)"
                        >
                            {{ $t('Сохранить') }}
                        </button>
                    </div>

                    <a class="btn btn-danger pull-right" @click="remove">
                        {{ $t('Удалить') }}
                    </a>
                </div>
            </div>
        </v-form>
        <h2>Объекты проекта</h2>
        <project-object
            v-for="object in project.objects"
            :key="object.name"
            v-bind="object"
            @save-object="handleSaveObject"
        />
    </div>
</template>

<script lang="ts">
import ProjectObject from '~/components/projects/ProjectObject.vue';
import { deepCopyObject } from '~/shared/utils';

import { Context } from '@nuxt/types';
import Vue from 'vue';
import { routes } from '~/api';

export default Vue.extend({
    navigation: 'projects',

    head(): any {
        return {
            title: this.title,
        };
    },

    components: {
        ProjectObject,
    },

    async asyncData({ $api, params }: Context): Promise<any> {
        let projectFromAPI: any = null;
        try {
            const { data } = await $api.get(
                routes.projects.a_projects_new_get + '/' + params.id
            );
            if (data?.project) projectFromAPI = data.project;
        } catch (e) {
            console.log(e);
        }
        return {
            projectFromAPI,
        };
    },

    data(): any {
        return {
            title: '',
            load: false,
            editForm: {
                action: '/a/projects_new/set/{id}',
                method: 'post',
                redirect: '/n/projects/',
                fields: {
                    id: {
                        exclude: true,
                        value: null,
                    },
                    name: {
                        value: null,
                    },
                    description: {
                        value: '',
                    },
                },
            },
            projectUpdatedByChild: null,
        };
    },

    computed: {
        project(): any {
            return this.projectUpdatedByChild || this.projectFromAPI;
        },
    },

    watch: {
        projectFromAPI: {
            /* always reset projectUpdatedByChild when projectFromAPI changes */
            handler(newResult, oldResult) {
                if (oldResult !== null) {
                    this.projectUpdatedByChild = null;
                }
            },
            immediate: false,
        },
    },

    created() {
        this.$setFormValues(this.editForm, {
            id: this.project.id || 0,
            name: this.project.name || '',
            description: this.project.description || '',
        });
        this.title =
            this.$t('Редактирование проекта') + ' ' + (this.project.name || '');
    },

    methods: {
        async remove() {
            const that = this;
            this.$confirmation({
                text: that.$t(
                    'Вы уверены что хотите удалить проект? Это действие необратимо!'
                ),
                size: 'small',
                okColor: 'danger',
            }).then(async (status: boolean) => {
                if (!status) {
                    return;
                }

                if (that.load) return;

                that.load = true;

                await this.$api.post(
                    routes.projects.a_projects_new_set_remove,
                    {
                        id: this.project.id,
                    },
                    {
                        success: this.$t('Проект удалён'),
                        redirect: '/n/projects/',
                    }
                );
            });
        },
        handleSaveObject(objectToSave: any) {
            this.projectUpdatedByChild = deepCopyObject(this.project);
            const index = this.projectUpdatedByChild.objects.findIndex(
                (obj: any) => obj.name === objectToSave.name
            );
            if (index !== -1) {
                this.projectUpdatedByChild.objects[index] = Object.assign(
                    this.projectUpdatedByChild.objects[index],
                    objectToSave
                );
            }
        },
    },
});
</script>

<style>
.panel-default > .panel-heading .badge {
    background-color: #659be0 !important;
    padding: 3px 6px 3px 5px !important;
    min-width: 20px !important;
    min-height: 20px !important;
    line-height: 14px !important;
}
</style>
