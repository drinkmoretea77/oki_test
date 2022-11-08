<template>
    <v-validate
        :name="name"
        :rules="rules"
        :mask="mask"
        :filter="filter"
        :dirty="dirty"
        v-slot="{ v, localMask, localFilter }"
    >
        <div
            class="form-group"
            :class="[{ 'has-error': v.errors.length || errors.length }]"
        >
            <div
                class="control-label"
                :class="[
                    fullSize
                        ? 'full-size'
                        : fullLabel
                        ? 'col-md-6'
                        : 'col-md-3',
                    fullLabel ? 'text-left' : '',
                ]"
            >
                <span v-html="label"></span>
                <span v-if="required" class="required" aria-required="true">
                    *
                </span>
            </div>
            <div :class="[fullSize ? '' : fullLabel ? 'col-md-6' : 'col-md-9']">
                <div :class="{ 'form-group-slot': fullLabel }">
                    <slot></slot>
                    <input
                        ref="input"
                        :type="type"
                        :placeholder="placeholder"
                        :name="name"
                        :value="value"
                        @input="change"
                        class="form-control"
                        :class="fullSize ? 'full-size' : ''"
                        v-mask="localMask"
                        v-input-filter="localFilter"
                        v-bind="$attrs"
                        autocomplete="off"
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
         * Тип поля
         */
        type: {
            type: String,
            default: 'text',
        },

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
         * Значение
         */
        value: {
            type: [String, Number],
            default: '',
        },

        /**
         * Обязательное ли поле
         */
        required: {
            type: Boolean,
            default: false,
        },

        /**
         * Название занимают всю ширину
         */
        fullLabel: {
            type: Boolean,
            default: false,
        },

        /**
         * Поле ввода занимают всю ширину
         */
        fullSize: {
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
         * Название занимают всю ширину
         */
        rules: {
            type: String,
            default: '',
        },

        /**
         * Тип поля - Дата и время
         */
        date: {
            type: Boolean,
            default: false,
        },

        /**
         * Маска для ввода
         */
        mask: {
            type: String,
            default: '',
        },

        /**
         * Фильтр значений
         */
        filter: {
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
         * Формат даты при date: true
         */
        dateFormat: {
            type: String,
            default: 'dd.mm.yyyy hh:mm',
        },
    },

    directives: {
        mask: VueMaskDirective,
        inputFilter: inputFilterDirective,
    },

    data() {
        return {};
    },

    mounted() {
        this.$nextTick().then(() => {
            if (this.date) {
                this.$nextTick().then(() => {
                    $(this.$refs.input)
                        .datepicker({
                            autoclose: true,
                            format: this.dateFormat,
                            orientation: 'auto bottom',
                        })
                        .on('changeDate', (event) => {
                            this.$emit('input', event.target.value);
                        });
                });
            }
        });
    },

    methods: {
        change(event) {
            let value = event.target.value;

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

.form-group-slot.form-control.full-size
		margin-left: 0

.form-horizontal .control-label.full-size
	margin-top: 0
	padding-top: 0
</style>
