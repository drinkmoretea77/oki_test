<template>
    <v-validate :name="name" :rules="rules" :dirty="dirty" v-slot="{ v }">
        <div
            class="form-group"
            :class="[{ 'has-error': v.errors.length || errors.length }]"
        >
            <div
                class="control-label"
                :class="[
                    fullLabel ? 'col-md-6' : 'col-md-3',
                    fullLabel ? 'text-left' : '',
                ]"
            >
                <span v-html="label"></span>
                <span v-if="required" class="required" aria-required="true">
                    *
                </span>
            </div>
            <div :class="[fullLabel ? 'col-md-6' : 'col-md-9']">
                <div :class="{ 'form-group-slot': fullLabel }">
                    <v-select-inline
                        :value="value"
                        @change="$emit('change', $event)"
                        @input="change"
                        :options="options"
                        :disabledOptions="disabledOptions"
                        :native="native"
                        :disabled="disabled"
                        :multiple="multiple"
                        :type-value="typeValue"
                        :customValues="customValues"
                        :placeholder="placeholder"
                    />
                    <div
                        v-for="error in [...v.errors, ...errors]"
                        class="help-block validator-message"
                    >
                        {{ error }}
                    </div>
                </div>
                <template v-if="help">
                    <span
                        v-if="hint_type === 'block'"
                        class="help-block"
                        v-html="help"
                    ></span>
                    <i
                        v-else
                        class="fa fa-question-circle help-icon"
                        v-tooltip="help"
                    />
                </template>
                <slot name="after"/>
            </div>
        </div>
    </v-validate>
</template>

<script>
import { VueMaskDirective } from 'v-mask';
import { inputFilterDirective } from '~/shared/directives';

export default {
    props: {
        /**
         * Название
         */
        label: {
            type: String,
            default: '',
        },

        /**
         * Подсказка
         */
        help: {
            type: String,
            default: '',
        },

        /**
         * Placeholder
         */
        placeholder: {
            type: String,
            default: '',
        },

        /**
         * Имя поля
         */
        name: {
            type: String,
            default: '',
        },

        /**
         * Выводить дефолтным селектом
         */
        native: {
            type: Boolean,
            default: false,
        },

        /**
         * Массив значений
         */
        multiple: {
            type: Boolean,
            default: false,
        },

        typeValue: {
            type: String,
            default: '',
        },

        /**
         * Значение
         */
        value: {
            type: [String, Number, Array],
            default: '',
        },

        /**
         * Статус Disabled
         */
        disabled: {
            type: Boolean,
            default: false,
        },

        /**
         * Массив значений, которые нужно отключить
         */
        disabledOptions: {
            type: Array,
            default: () => [],
        },

        /**
         * Обязательное ли поле
         */
        required: {
            type: Boolean,
            default: false,
        },

        /**
         * Вывод названия на всю ширину
         */
        fullLabel: {
            type: Boolean,
            default: false,
        },

        /**
         * Вид подсказки: icon, block
         */
        hint_type: {
            type: String,
            default: 'icon',
        },

        /**
         * Изменял ли пользователь поле
         */
        dirty: {
            type: Boolean,
            default: false,
        },

        /**
         * Правила для валидатора
         */
        rules: {
            type: String,
            default: '',
        },

        /**
         * Список ошибок
         */
        errors: {
            type: Array,
            default: () => [],
        },

        /**
         * Список опций
         */
        options: {
            type: Array,
            default: () => [],
        },

        /**
         * Возможность вводить кастомные значения
         */
        customValues: {
            type: Boolean,
            default: false,
        },
    },

    directives: {
        mask: VueMaskDirective,
        inputFilter: inputFilterDirective,
    },

    data() {
        return {};
    },

    methods: {
        change(value) {
            this.$emit('input', value);
        },
    },
};
</script>

<style lang="stylus">
.form-horizontal .control-label.text-left
    text-align: left

.form-group-slot
    display: flex
    .form-control
        margin-left: 15px
</style>
