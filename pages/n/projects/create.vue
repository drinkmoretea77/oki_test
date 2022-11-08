<template>
    <div class="content-wrapper">
        <v-page-header :title="title" back="/n/projects" />
        <v-form
            v-bind="createForm"
            v-slot="{ values, error, errors, tried, valid, validate, submitValidate }"
            @success="responseCreateForm"
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
            <div class="form-group">
                <div class="col-md-3"></div>
                <div class="col-md-6">
                    <nuxt-link to="/n/projects">
                        <button type="reset" class="btn btn-default reset-button">{{ $t('Отмена') }}</button>
                    </nuxt-link>
                    &nbsp;
                    <div class="btn-group dropup">
                        <button type="button" class="btn btn-primary" @click="submitValidate(validate)">{{ $t('Создать') }}</button>
                    </div>
                </div>
            </div>
        </v-form>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    import { DefaultForm } from '~/types';

    interface CreateForm {
        title: any,
        createForm: DefaultForm
    }

    export default Vue.extend({
        navigation: 'projects',

        head() {
            return {
                title: this.title
            }
        },

        data: (): CreateForm => ({
            title: null,
            createForm: {
                action: '/a/projects_new/set/create',
                method: 'post',
                fields: {
                    name: {
                        value: null
                    },
                    description: {
                        value: ''
                    }
                }
            },
        }),

        created() {
            this.title = this.$t('Создание проекта');
        },

        methods: {
            async responseCreateForm() {
                await this.$router.push({
                    path: '/n/projects'
                })
            }
        },
    })
</script>

