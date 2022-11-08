<template>
    <div class="form-horizontal">
        <ValidationObserver v-slot="{ valid, validate }">
            <v-content-spinner :load="load" :space="space" />
            <slot
                v-bind="{
                    inputs,
                    values,
                    valid,
                    submit,
                    errors: localErrors,
                    error,
                    tried,
                    valid,
                    validate,
                    submitValidate,
                }"
            />
        </ValidationObserver>
    </div>
</template>

<script>
import { ValidationObserver } from 'vee-validate';
import interpolate from '../../utils/interpolate';
import {
    createFormData,
} from '~/shared/utils';

export default {
    provide() {
        return {
            formState: {
                tab: this.tab,
            },
        };
    },

    props: {
        /**
         * Значения полей
         */
        fields: {
            type: Object,
            default: () => ({}),
        },

        /**
         * Удалять boolean поля со значением === false
         */
        excludeFalseValues: {
            type: Boolean,
            default: true,
        },

        /**
         * URL на который будет отправлен запрос
         * Может содержать переменные, которые будут заменены на значения полей
         * Пример: /api/items/{id}/edit
         */
        action: {
            type: String,
            default: `/`,
        },

        /**
         * Имя роута из ~/api/routes.ts
         * При указании значение method будет взято из роута
         */
        routeName: {
            type: String,
            default: '',
        },

        /**
         * Метод get/post и т.д.
         */
        method: {
            type: String,
            default: 'get',
        },

        /**
         * Асинхронная функция в которую передается объект с данными перед отправкой
         */
        middleware: {
            type: Function,
            default: null,
        },

        /**
         * Функция в которую передается объект с данными перед отправкой
         */
        requestMiddleware: {
            type: Function,
            default: null,
        },

        /**
         * Редирект на указанный URL, если приходит success: true
         */
        redirect: {
            type: String,
            default: null,
        },

        /**
         * Будет ли использоваться "tostr" при действиях
         */
        silent: {
            type: Boolean,
            default: false,
        },

        /**
         * Наличие файлов в запросе
         */
        files: {
            type: Boolean,
            default: false,
        },

        /**
         * Лоудер будет занимать больше места
         */
        space: {
            type: Boolean,
            default: true,
        },

        /**
         * Список ошибок по умолчанию
         */
        errors: {
            type: Object,
            default: () => ({}),
        },
    },

    components: {
        ValidationObserver,
    },

    data() {
        return {
            tab: {
                name: '',
            },

            // Кэш значений, для определения изменений
            cachedValues: {},

            // Параметры полей
            inputs: {},

            // Сахар для сокращеного использования v-model в слотах
            values: {},

            // Загружается ли форма в данный момент
            load: false,

            // Полученные ошибки после запроса
            error: null,

            localPropError: {},

            // Объект ошибок, пример: { count: ['Минимальное значение 10'] }
            localErrors: {},

            // Флаг для показа ошибок полей
            tried: false,
        };
    },

    watch: {
        errors: {
            handler(errors) {
                this.localPropError = errors;
                this.updateErrors();
            },

            deep: true,
        },

        fields: {
            handler(items) {
                this.updateInputs(items);
            },

            deep: true,
        },

        inputs: {
            handler(items) {
                this.$emit('change-fields', this.getChangedFields(items));
                this.$emit('change', items);
            },

            deep: true,
        },

        values: {
            handler(values) {
                for (const [key, value] of Object.entries(values)) {
                    this.inputs[key].value = value;
                }
            },

            deep: true,
        },

        load(status) {
            this.$emit('load', status);
        },
    },

    created() {
        this.localPropError = this.errors;
        this.localErrors = this.errors;
        this.updateInputs(this.fields, true);
    },

    methods: {
        updateErrors() {
            for (const [key, value] of Object.entries(this.localPropError)) {
                if (this.inputs.hasOwnProperty(key)) {
                    this.inputs[key].errors = value;
                }
            }
        },

        clearErrors() {
            for (const [key, value] of Object.entries(this.inputs)) {
                if (this.inputs.hasOwnProperty(key)) {
                    this.inputs[key].errors = [];
                }
            }
        },

        getChangedFields(items) {
            const fields = this.fields;
            for (const [key, params] of Object.entries(items)) {
                fields[key].value = items[key].value;
            }

            return fields;
        },

        getValues(fields, excludes = true) {
            const values = {};
            for (const [key, params] of Object.entries(fields)) {
                if (fields.hasOwnProperty(key)) {
                    if (
                        excludes &&
                        typeof params.exclude === 'boolean' &&
                        params.exclude
                    ) {
                        continue;
                    }

                    if (
                        typeof params.value === 'boolean' &&
                        !params.value &&
                        this.excludeFalseValues
                    ) {
                        continue;
                    }

                    values[key] = params.value;
                }
            }

            return values;
        },

        updateInputs(items, init = false) {
            for (const [key, params] of Object.entries(items)) {
                if (items.hasOwnProperty(key)) {
                    const object = { ...params };
                    const value =
                        object.value === undefined ? null : object.value;

                    object.dirty = false;
                    object.valid = true;
                    object.errors = this.localErrors[key] || [];

                    if (this.cachedValues[key] !== value) {
                        object.errors = [];

                        if (!init && this.localPropError.hasOwnProperty(key)) {
                            delete this.localPropError[key];
                        }

                        this.$emit(`watch:${key}`, value);
                    }

                    this.cachedValues[key] = value;

                    this.$set(this.inputs, key, object);
                    this.$set(this.values, key, value);
                }
            }

            this.updateErrors();
        },

        async submitValidate(validate, callback = null) {
            if (validate) {
                const valid = await validate();

                if (valid) {
                    await this.submit(callback);
                }
            } else {
                console.error('Не передана функция валидации');
            }
        },

        async submit(callbackFunction) {
            const callback =
                typeof callbackFunction === 'function'
                    ? callbackFunction
                    : () => {};

            this.load = true;
            this.error = null;
            this.localErrors = {};
            this.clearErrors();

            try {
                const method = this.method;
                const url = interpolate(
                    this.action,
                    this.getValues(this.inputs, false)
                );
                const headers = {};
                let data = this.getValues(this.inputs);

                let request = { method, url, data, headers };

                if (this.middleware !== null) {
                    request = await this.middleware({
                        method,
                        url,
                        data,
                        headers,
                    });

                    if (request.error) {
                        this.error = request.error;
                        this.$emit('error', request.error);
                        return;
                    }
                }

                if (this.requestMiddleware !== null) {
                    request = this.requestMiddleware({
                        method,
                        url,
                        data,
                        headers,
                    });
                }

                let response;

                if (this.files) {
                    response = await this.sendFormData(request);
                } else {
                    response = await this.$axios(request);
                }

                if (response.data) {
                    const { error, errors } = response.data;
                    if (error || errors) {
                        if (error) {
                            this.error = error;
                            this.$emit('error', this.error, response.data);
                        }
                        if (errors) {
                            this.$emit('error', errors, response.data);
                        }
                        this.errorsHandler({ errors });
                    } else {
                        if (!this.silent)
                            toastr['success'](this.$t('Данные сохранены'));

                        if (
                            (this.redirect && response.data.success) ||
                            (this.redirect &&
                                response.data.status === 'success')
                        ) {
                            this.$router.push({
                                path: this.redirect,
                            });
                        } else {
                            this.$emit('success', response.data);

                            if (typeof callback === 'function') {
                                callback();
                            }
                        }
                    }
                } else {
                    this.error = this.$t('Неизвестная ошибка');
                    this.$emit('error', this.$t('Неизвестная ошибка'));
                    if (!this.silent) toastr['error'](this.$t('Ошибка'));
                }
            } catch (error) {
                console.log('catch error', error);
                let error_message = this.$t('Ошибка');

                if (error.response) {
                    if (error.response.status === 422) {
                        this.errorsHandler(error.response.data);
                        error_message = this.$t(
                            'При заполнении формы допущены ошибки. Исправьте их, пожалуйста, и попробуйте повторить отправку.'
                        );
                    } else {
                        this.error = error;
                    }

                    this.$emit('error', error);
                }

                if (!this.silent) toastr['error'](error_message);
            }

            this.load = false;
        },

        errorsHandler({ errors }) {
            this.localErrors = errors || {};

            for (const [key, value] of Object.entries(this.localErrors)) {
                if (this.inputs.hasOwnProperty(key)) {
                    this.inputs[key].errors = value;
                }

                const keys = key.split('.');
                if (keys.length > 1) {
                    if (this.inputs.hasOwnProperty(keys[0])) {
                        this.inputs[keys[0]].errors = value;
                    }
                }
            }

            const keys = Object.keys(this.localErrors);

            if (keys.length > 0) {
                this.moveToError(keys[0]);
            }
        },

        async moveToError(name) {
            const input = this.$el.querySelector(`[data-field-name="${name}"]`);

            if (!input) return;

            if (input.dataset.fieldTab) {
                this.tab.name = '';
                await this.$nextTick();
                this.tab.name = input.dataset.fieldTab;
            }

            await this.$nextTick();
            input.scrollIntoView();

            if (window) {
                window.scrollTo(0, window.pageYOffset - 64);
            }
        },

        async sendFormData(request) {
            const formData = createFormData(request.data)

            return await this.$axios.post(request.url, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        },

        getErrors(data) {
            let errors = {},
                num_index;

            for (let field_name in data) {
                if (!data.hasOwnProperty(field_name)) {
                    continue;
                }
                num_index = field_name.indexOf('.');
                if (num_index > 0) {
                    errors[field_name.substr(0, num_index)] = data[field_name];
                } else {
                    errors[field_name] = data[field_name];
                }
            }

            return errors;
        },
    },
};
</script>

<style lang="stylus">
.form-horizontal
    position: relative
</style>
