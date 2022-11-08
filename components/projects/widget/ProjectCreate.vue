<template>
    <div>
        <v-modal-sync v-model="is_show" size="md" :load="is_loaded">
            <template #header>
                <h1>{{ $t('Создание проекта') }}</h1>
            </template>
            <template #body>
                <v-form
                    v-bind="createForm"
                    v-slot="{ values, error, errors, tried, valid, validate, submitValidate }"
                    @success="success"
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
                            <button class="btn btn-default reset-button" @click="cancel">{{ $t('Отмена') }}</button>
                            <div class="btn-group dropup">
                                <button type="button" class="btn btn-primary" @click="submitValidate(validate)">{{ $t('Создать') }}</button>
                            </div>
                        </div>
                    </div>
                </v-form>
            </template>
        </v-modal-sync>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import {routes} from "~/api";

export default Vue.extend({
    props: {
        value: {
            type: Boolean,
            default: false
        },
    },

    data(): any {
        return {
            createForm: {
                action: routes.projects.a_projects_new_set_create,
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
            is_show: false,
            is_loaded: false,
        }
    },

    methods: {
        success() {
            this.is_loaded = false;
            this.is_show = false;
            this.$emit('refresh');
        },

        cancel() {
            this.is_show = false;
        }
    },

    watch: {
        is_show() {
            this.$emit('input', this.is_show);
        },
        value() {
            this.is_show = this.value;
        },
    }

})
</script>
