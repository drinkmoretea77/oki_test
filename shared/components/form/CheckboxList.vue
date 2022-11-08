<template>
    <div
        class="v-checkbox-list form-group"
        :data-field-name="name"
        :data-field-tab="tabName"
    >
        <div class="control-label" :class="{ 'col-md-3': !fullSize }">
            {{ label }}
        </div>
        <div ref="list" class="v-checkbox-list__content" :class="{ 'col-md-9': !fullSize }">
            <v-select-radio-inline
                v-if="type === 'select-radio'"
                :value="value"
                :options="options"
                :disabled="disabled"
                :disabled-options="disabledOptions"
                @input="change"
            />
            <div v-else class="v-checkbox-list__items">
                <slot />
                <div
                    v-for="option in options"
                    :key="option.value"
                    class="v-checkbox-list__item"
                    :class="{
                        'v-checkbox-list__item--inline': inline,
                        'v-checkbox-list__item--cols': cols,
                    }"
                >
                    <v-checkbox-inline
                        :type="type"
                        :disabled="
                            disabled || disabledOptions.includes(option.value)
                        "
                        :label="option.text || option.value"
                        :help="option.help"
                        :checked="isChecked(option.value)"
                        @toggle="toggle(option.value)"
                    />
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
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    inject: {
        tabsItem: {
            default: null,
        },
    },

    props: {
        /**
         * Тип: radio, switch, bool, checked, select-radio
         */
        type: {
            type: String,
            default: 'check',
        },

        /**
         * Имя поля
         */
        name: {
            type: String,
            default: '',
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        /**
         * Выводить в 2 колонки
         */
        cols: {
            type: Boolean,
            default: false,
        },

        /**
         * Значение
         */
        value: {
            type: [String, Number, Array, Boolean],
            default: () => [],
        },

        /**
         * Список значений которые нужно отключить
         */
        disabledOptions: {
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
         * Подсказка
         */
        help: {
            type: String,
            default: '',
        },

        /**
         * Название
         */
        label: {
            type: String,
            default: '',
        },

        /**
         * Вид подсказки: icon, block
         */
        hint_type: {
            type: String,
            default: 'icon',
        },

        /**
         * Выводить блок как inline-block
         */
        inline: {
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
    },

    data(): any {
        return {
            tabName: '',
        };
    },

    created() {
        if (this.tabsItem) {
            this.tabName = this.tabsItem.name;
        }
    },

    methods: {
        change(value: any) {
            this.$emit('input', value);
        },

        toggle(value: any) {
            if (this.disabled) return;

            if (Array.isArray(this.value)) {
                const newValue = [...this.value];
                const index = newValue.indexOf(value);

                if (index !== -1) {
                    newValue.splice(index, 1);
                } else {
                    newValue.push(value);
                }

                this.$emit('input', newValue);
            } else {
                this.$emit('input', value);
            }
        },

        isChecked(value: any) {
            if (Array.isArray(this.value)) {
                return this.value.includes(value);
            } else {
                return String(value) === String(this.value);
            }
        },
    },
});
</script>

<style lang="stylus">
.v-checkbox-list
    &__items
        display: flex
        flex-wrap: wrap

    &__content
        padding-top: 8px
    &__item
        display: block
        margin-bottom: 8px
        padding-right: 15px
        flex-basis: 100%
        max-width: 100%

        &--cols
            flex-basis: 50%
            max-width: 50%
        &--inline
            flex-basis: auto
            max-width: 100%
</style>
