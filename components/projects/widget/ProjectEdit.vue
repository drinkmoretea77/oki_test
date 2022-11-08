<template>
    <div>
        <v-content-spinner :load="is_load" style="top: 0; bottom: 0"/>
        <div v-show="!is_load">
            <h4 class="margin-right-10 project-edit">
                <a @click="onBack" class="fa fa-reply active"></a>
                {{ $t('Редактирование проекта') }} {{ project_data.name }}
            </h4>
            <div class="note note-info">
                <p>{{ $t('Укажите пользователей и те объекты (очереди, автообзвоны и т.д.), которые должны видеть пользователи. Подробнее читайте') }}&nbsp;<a href="https://www.oki-toki.net/blog/bezopasnost_proekty_">{{ $t('тут') }}</a></p>
            </div>
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

                <v-textarea :label="$t('Описание')"
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
                <hr>
                <div class="row form-group">
                    <div class="col-md-3"></div>
                    <div class="col-md-9">
                        <button type="reset" class="btn btn-default reset-button" @click="onBack">{{ $t('Отмена') }}</button>
                        &nbsp;
                        <div class="btn-group dropup">
                            <button type="button" class="btn btn-primary" @click="submitValidate(validate); onBack();">{{ $t('Сохранить') }}</button>
                        </div>

                        <a class="btn btn-danger pull-right" @click="remove">
                            {{ $t('Удалить') }}
                        </a>
                    </div>
                </div>
            </v-form>
            <h2>Объекты проекта</h2>
            <project-objects
                :project_id="project_id"
                :objects="project_data.objects"
                @update="update"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {routes} from "~/api";
import ProjectObjects from '~/components/projects/widget/ProjectObjects.vue';

export default Vue.extend({
    components: {
        ProjectObjects
    },

    props: {
        value: {
            type: Boolean,
            default: true
        },
        project_id: {
            type: Number,
            default: null
        }
    },

    data(): any {
        return {
            editForm: {
                action: '/a/projects_new/set/{id}',
                method: 'post',
                fields: {
                    id: {
                        exclude: true,
                        value: null
                    },
                    name: {
                        value: ''
                    },
                    description: {
                        value: ''
                    }
                }
            },
            is_show: true,
            is_load: false,
            project_data: {}
        }
    },

    created() {
        if (this.project_id > 0) {
            this.loadProjectData(this.project_id);
        }
    },

    methods: {
        async loadProjectData(project_id: number) {
            this.is_load = true;
            const response = await this.$api.get(routes.projects.a_projects_new_get + '/' + project_id);
            this.is_load = false;

            if (response?.data?.project === undefined) {
                return;
            }

            this.project_data = response.data.project;

            this.editForm.fields.id.value = this.project_data.id || 0;
            this.editForm.fields.name.value = this.project_data.name || '';
            this.editForm.fields.description.value = this.project_data.description || '';
        },

        onBack() {
            this.is_show = false;
        },

        async remove() {
            const that = this;
            this.$confirmation({
                text: that.$t('Вы уверены что хотите удалить проект? Это действие необратимо!'),
                size: 'small',
                okColor: 'danger'
            }).then(async (status: boolean) => {
                if (!status) {
                    return;
                }

                if (that.is_load) {
                    return;
                }

                that.is_load = true;

                await this.$api.post(routes.projects.a_projects_new_set_remove, {id: this.project_id});
                this.$emit('refresh');
            })
        },

        update(data: any) {
            for (let i in this.project_data.objects) {
                if (this.project_data.objects[i].name === data.name) {
                    this.project_data.objects[i].items = data.items;
                    break;
                }
            }
        },
    },

    watch: {
        value() {
            this.is_show = this.value;
            if (this.is_show && (this.project_id > 0)) {
                this.loadProjectData(this.project_id);
            }
        },

        is_show() {
            this.$emit('input', this.is_show);
        },
    }
})
</script>

<style>
    .project-edit a {
        margin-right: 10px;
        opacity: 0.5;
        transition: opacity .3s;
        text-decoration: none;
        color: #333;
    }
    .project-edit a:hover {
        opacity: 1;
    }
</style>
