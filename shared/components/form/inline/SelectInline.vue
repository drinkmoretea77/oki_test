<template>
    <div
        class="v-select"
        @keyup.esc="close"
        @keydown.down="arrow('down', $event)"
        @keydown.up="arrow('up', $event)"
        :class="{
            'v-select--show': show && !disabled,
            'v-select--full': full,
            'v-select--disabled': disabled,
            'v-select--inline': inline,
        }"
    >
        <select
            v-show="native"
            :value="value"
            class="v-select__input"
            v-on="listeners"
            :disabled="disabled"
        >
            <option value="" disabled>{{ placeholder }}</option>
            <option v-for="option in localOptions" :value="option.value">
                {{ option.text || option.value }}
            </option>
        </select>
        <slot
            v-if="$scopedSlots.select"
            name="select"
            v-bind="{
                show,
                option: getSelectedOption,
                multiple,
                selected: getValue || placeholder,
                placeholder,
                toggle,
            }"
        />
        <div
            v-else-if="!native"
            class="v-select__selected"
            :class="{ 'v-select__selected--multiple': multiple }"
            @click="toggle"
        >
            <template v-if="multiple">
                <div
                    v-if="!show && Array.isArray(value) && !value.length"
                    class="v-select__label v-select__label--placeholder"
                >
                    {{ placeholder }}
                </div>
                <div
                    v-for="(item, index) in localValues"
                    :key="item"
                    class="v-select__multiple-item"
                >
                    <div
                        class="v-select__multiple-remove"
                        @click="removeValue(index)"
                    >
                        ×
                    </div>
                    <div class="v-select__multiple-value">
                        {{ getMultipleValue(item) }}
                    </div>
                </div>
                <template v-if="customValues && show">
                    <input
                        ref="input"
                        v-model="custom"
                        @keyup.enter="addCustom"
                        class="v-select__multiple-enter"
                        type="text"
                    />
                </template>
            </template>
            <template v-else>
                <template v-if="customValues">
                    <div
                        v-if="!show"
                        class="v-select__label"
                        :class="{ 'v-select__label--placeholder': !getValue }"
                    >
                        {{ getValue || placeholder }}
                    </div>
                    <input
                        v-else
                        ref="input"
                        v-model="custom"
                        @keyup.enter="addCustom"
                        class="v-select__multiple-enter"
                        type="text"
                    />
                </template>
                <template v-else>
                    <div
                        class="v-select__label"
                        :class="{ 'v-select__label--placeholder': !getValue }"
                    >
                        <slot
                            v-if="$scopedSlots.selected"
                            name="selected"
                            v-bind="{ option: getSelectedOption }"
                        />
                        <span v-else>{{ getValue || placeholder }}</span>
                    </div>
                </template>
            </template>
            <div class="v-select__arrow" />
        </div>
        <div v-if="show" class="v-select__dropdown">
            <div class="v-select__content">
                <div v-if="custom" class="v-select__list">
                    <div
                        class="v-select__list-item v-select__list-item--add"
                        @click="addCustom"
                    >
                        {{ $t('Добавить') }}: {{ custom }}
                    </div>
                </div>
                <template v-if="localOptions.length">
                    <div
                        v-if="!custom && options.length > 10"
                        class="v-select__search"
                    >
                        <input
                            class="v-select__search-input"
                            type="text"
                            ref="search"
                            :placeholder="$t('Поиск')"
                            v-model="search"
                        />
                    </div>
                    <div
                        v-if="$scopedSlots.title"
                        class="v-select__title" >
                        <slot name="title"
                              v-bind="{
                                  options: filterOptions,
                              }"
                        />
                    </div>
                    <div
                        v-if="filterOptions.length"
                        class="v-select__list"
                        ref="list"
                    >
                        <div
                            v-for="(option, index) in filterOptions"
                            :key="option.value"
                            class="v-select__list-item"
                            :tabindex="
                                disabledOptions.includes(option.value) ? -1 : 0
                            "
                            :class="{
                                'v-select__list-item--active':
                                    isActiveOption(option),
                                'v-select__list-item--disabled':
                                    isDisabledOption(option),
                            }"
                            @click="selectValue(option.value)"
                            @keyup.enter="selectValue(option.value)"
                        >
                            <slot
                                v-if="$scopedSlots.options"
                                name="options"
                                v-bind="{
                                    option,
                                    active: isActiveOption(option),
                                    disabled: isDisabledOption(option),
                                }"
                            />
                            <template v-else>{{
                                option.text || option.value
                            }}</template>
                        </div>
                    </div>
                    <div v-else-if="!custom" class="v-select__empty">
                        {{ $t('Ничего не найдено') }}
                    </div>
                </template>
                <div v-else class="v-select__empty">
                    {{ $t('Нет значений для выбора') }}
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue, {PropType} from 'vue';
import {SelectOption} from '~/types';

type SelectValue = string | number | any[];

export default Vue.extend({
    props: {
        typeValue: {
            type: String,
            default: '',
        },

        value: {
            type: [String, Number, Array] as PropType<SelectValue>,
            default: '',
        },

        placeholder: {
            type: String,
            default: 'Выберите значение',
        },

        full: {
            type: Boolean,
            default: false,
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        inline: {
            type: Boolean,
            default: false,
        },

        disabledOptions: {
            type: Array,
            default: () => [],
        },

        options: {
            type: Array as PropType<SelectOption[]>,
            default: () => [],
        },

        native: {
            type: Boolean,
            default: false,
        },

        multiple: {
            type: Boolean,
            default: false,
        },

        customValues: {
            type: Boolean,
            default: false,
        },
    },

    data(): any {
        return {
            show: false,
            search: '',
            custom: '',
            activeIndexes: [],
            customOptions: [],
            focusIndex: -1,
        };
    },

    created() {
        if (this.multiple && !Array.isArray(this.value)) {
            console.error(
                'v-select',
                'В режиме multiple значение должно быть массивом'
            );
        }

        if (this.native) {
            if (this.multiple) {
                console.error(
                    'v-select',
                    'Нативный режим и multiple несовместимы'
                );
            }
        }

        this.updateCustomOptions();

        this.$nextTick().then(() => {
            if (this.multiple && Array.isArray(this.value)) {
                const clearValue = this.getValues(this.value);
                this.$emit('input', clearValue);
                this.$emit('change', clearValue);
            }
        });
    },

    mounted() {
        document.addEventListener('click', this.clickOutside);
        document.addEventListener('touchstart', this.clickOutside);
    },

    beforeDestroy() {
        document.removeEventListener('click', this.clickOutside);
        document.removeEventListener('touchstart', this.clickOutside);
    },

    computed: {
        localOptions(): SelectOption[] {
            let localOptions = [...this.customOptions, ...this.options];

            for (let row in localOptions) {
                localOptions[row].value = String(localOptions[row].value);
            }

            return localOptions;
        },

        localValues(): SelectOption[] {
            if (!this.multiple || !Array.isArray(this.value)) {
                return [];
            }

            if (this.customValues) {
                return this.value;
            }

            const optionsValues = this.localOptions.map(
                (option: SelectOption) => option.value
            );
            return this.value.map(String).filter((value: any) => {
                return optionsValues.includes(value);
            });
        },

        getValue(): string {
            const value: any = this.value;
            const option: any = this.localOptions.find(
                (option: SelectOption) => String(option.value) === String(value)
            );

            if (option) {
                return option.text || option.value;
            } else {
                return '';
            }
        },

        getSelectedOption(): any {
            const value: any = this.value;
            const option: any = this.localOptions.find(
                (option: SelectOption) => String(option.value) === String(value)
            );

            if (option) {
                return option;
            } else {
                return null;
            }
        },

        listeners(): any {
            return {
                ...this.$listeners,
            };
        },

        filterOptions(): SelectOption[] {
            const request: any = this.search.toLocaleLowerCase().trim();

            if (request === '') {
                return this.localOptions;
            } else {
                return this.localOptions.filter((option: SelectOption) =>
                    option.text.toLocaleLowerCase().includes(request)
                );
            }
        },
    },

    watch: {
        show(status) {
            this.$nextTick().then(() => {
                if (status) {
                    const active = this.$el.querySelector(
                        '.v-select__list-item--active, .active'
                    );
                    if (active) {
                        active.scrollIntoView({block: 'nearest'});
                    }
                }
            });
        },

        localOptions() {
            this.clearFocusIndex();
        },

        custom() {
            this.$nextTick().then(() => {
                this.search = this.custom;
            });
        },
    },

    methods: {
        isActiveOption(option: SelectOption) {
            return (
                (this.multiple && this.localValues.includes(option.value)) ||
                option.value === this.value
            );
        },

        isDisabledOption(option: SelectOption) {
            return this.disabledOptions.includes(option.value);
        },

        clearFocusIndex() {
            this.focusIndex = -1;
        },

        arrow(direction: string, event: any) {
            event.stopPropagation();
            event.preventDefault();
            const list = this.$refs.list;
            if (!list || !this.localOptions.length) return;

            const disabledOptions = this.disabledOptions;
            const localOptions = this.localOptions;

            if (direction === 'up') {
                this.focusIndex -= 1;

                if (this.focusIndex < 0) {
                    this.focusIndex = 0;
                }

                while (
                    disabledOptions.includes(
                        localOptions[this.focusIndex].value
                    ) &&
                    this.focusIndex !== 0
                ) {
                    this.focusIndex -= 1;
                }
            } else if (direction === 'down') {
                this.focusIndex += 1;

                if (this.focusIndex > this.localOptions.length - 1) {
                    this.focusIndex = this.localOptions.length - 1;
                }

                while (
                    disabledOptions.includes(
                        localOptions[this.focusIndex].value
                    ) &&
                    this.focusIndex !== this.localOptions.length - 1
                ) {
                    this.focusIndex += 1;
                }
            }

            const item = list.querySelectorAll('.v-select__list-item')[
                this.focusIndex
            ];

            if (item) {
                item.focus();
            }
        },
        updateCustomOptions() {
            if (Array.isArray(this.value) && this.customValues) {
                this.value.forEach((item: string) => {
                    const index = this.options.findIndex(
                        (option: any) => String(option.value) === String(item)
                    );
                    if (index === -1) {
                        this.customOptions.push({
                            value: item,
                            text: item,
                        });
                    }
                });
            }
        },

        open() {
            this.show = true;
            if (this.customValues) {
                this.$nextTick().then(() => {
                    if (this.$refs.input) {
                        this.$refs.input.focus();
                    }
                });
            } else {
                this.$nextTick().then(() => {
                    if (this.$refs.search) {
                        this.$refs.search.focus();
                    }
                });
            }
        },

        close() {
            this.show = false;
            this.search = '';
            this.custom = '';
            this.clearFocusIndex();
        },

        toggle() {
            if (this.disabled) return;

            if (this.show) {
                if (this.custom) return;
                this.close();
            } else {
                this.open();
            }
        },

        getMultipleValue(value: any) {
            const option: any = this.localOptions.find(
                (option: SelectOption) => String(option.value) === String(value)
            );

            if (option) {
                return option.text || option.value;
            } else {
                return value || '';
            }
        },

        emitValue(value: any) {
            if (this.typeValue) {
                if (this.typeValue === 'number') {
                    if (Array.isArray(value)) {
                        const newValue = value.map((val: any) => Number(val));
                        this.$emit('input', newValue);
                        this.$emit('change', newValue);
                    } else {
                        this.$emit('input', Number(value));
                        this.$emit('change', Number(value));
                    }
                } else {
                    this.$emit('input', value);
                    this.$emit('change', value);
                }
            } else {
                this.$emit('input', value);
                this.$emit('change', value);
            }
        },

        removeValue(index: number) {
            if (this.disabled) return;
            const newValue = [...this.value];
            newValue.splice(index, 1);

            this.emitValue(newValue);
        },

        addCustom() {
            const value = this.custom.trim();
            if (value === '') return;

            const newOption = {
                value: value,
                text: value,
            };

            const index = this.localOptions.findIndex(
                (option: SelectOption) => String(option.value) === String(value)
            );

            if (index === -1) {
                this.customOptions.push(newOption);
                this.selectValue(value);
            }
        },

        selectValue(value: any) {
            if (this.disabledOptions.includes(value)) return;

            if (this.multiple) {
                const newValue = [...this.value];
                const index = newValue.findIndex(
                    (oldValue: any) => String(oldValue) === String(value)
                );

                if (index !== -1) {
                    newValue.splice(index, 1);
                    const clearValue = this.getValues(newValue);
                    this.emitValue(clearValue);
                } else {
                    newValue.push(value);
                    const clearValue = this.getValues(newValue);
                    this.emitValue(clearValue);
                }
            } else {
                this.emitValue(value);
                this.close();
            }
        },

        getValues(values: any): any {
            if (this.customValues) {
                return values;
            }

            const optionValues = this.localOptions.map(
                (option: SelectOption) => option.value
            );

            if (!Array.isArray(values)) {
                return optionValues.includes(values) ? values : '';
            }

            return values
                .map(String)
                .filter((value: any) => optionValues.includes(value));
        },

        clickOutside(event: any) {
            event.stopPropagation();

            if (
                this.$el !== event.target &&
                !this.$el.contains(event.target) &&
                !this.clickOutsideDisable
            ) {
                this.close();
            }
        },
    },
});
</script>

<style lang="stylus">
.v-select
    position: relative
    z-index: 3
    &--inline
        display: inline-flex

    &--full
        width: 100%

    &--show
        z-index: 10
    &__arrow
        position: absolute
        top: 50%
        right: 12px
        z-index: 2
        transform: translateY(-50%)
        border-left: 4px solid transparent
        border-right: 4px solid transparent
        border-top: 4px solid #777

    &--show &__arrow
        transform: translateY(-50%) scaleY(-1)

    &__multiple-enter
        margin-top: 6px
        margin-left: 6px
        background: none
        border: none!important
        box-shadow: none
        outline: none
        width: 150px

    &__multiple-item
        margin-top: 6px
        margin-left: 6px
        display: flex
        align-items: center
        white-space: nowrap
        padding: 0 6px
        background-color: #eee
        color: #555
        border-radius: 4px
        min-height: 21px
        line-height: 21px
        max-width: 100%
        text-overflow: ellipsis
        overflow: hidden

    &__multiple-remove
        padding-right: 6px
        color: #999
        cursor: pointer
        transition: color .15s ease-out
        &:hover
            color: #333

    &__multiple-value
        cursor: default
        white-space: nowrap
        text-overflow: ellipsis
        overflow: hidden

    &__empty
        padding: 4px

    &__dropdown
        overflow: hidden
        position: absolute
        top: 100%
        left: 0
        right: 0
        z-index: 2
        min-width: 175px
        border: 1px solid #93a1bb
        border-radius: 0 0 4px 4px
        border-top: none
        background-color: rgba(#fff, .9)
        box-shadow: 0 6px 12px 0 rgba(#000, 0.15)

    &__search
        background-color: #fff
        padding: 4px
        &-input
            padding: 4px
            height: 29px
            width: 100%
            outline: none
            border: 1px solid #c2cad8
            border-radius: 4px
            color: #555

    &__title
        background-color: #fff
        padding: 4px

    &__list
        user-select: none
        max-height: 200px
        overflow: auto
        &-item
            cursor: pointer
            padding: 6px
            outline: none
            overflow-wrap: anywhere
            overflow: hidden
            max-width: 100%

            &--add
                color: #fff
                background-color: #337ab7
            &--active
                color: #262626
                background-color: #e1e5ec
            &--disabled
                opacity: .5
                pointer-events: none
                cursor: not-allowed
            &:hover
                color: #fff
                background-color: #337ab7
            &:focus
                color: #fff
                background-color: #337ab7

    &__label
        pointer-events: none
        margin-top: 6px
        margin-left: 6px
        line-height: 19px
        min-height: 19px
        flex-grow: 1
        white-space: nowrap
        max-width: 100%
        overflow: hidden

        &--placeholder
            pointer-events: none
            opacity: 0.7


    &__selected, &__input
        outline: none
        width: 100%
        transition: all .15s ease-out
        border-radius: 4px
        border: 1px solid #c2cad8
        cursor: pointer
        background-color: rgba(255,255,255, 0.3)
        padding: 6px 24px 6px 12px

    &__selected
        overflow: hidden
        position: relative
        min-height: 35px
        display: flex
        flex-wrap: wrap
        padding-top: 0
        padding-left: 6px
    &--disabled
        cursor: not-allowed
        select
            cursor: not-allowed

    &--disabled &__selected
        pointer-events: none

    &--show &__selected
        border-color: #93a1bb
        border-radius: 4px 4px 0 0
        border-bottom: none

    &__input
        &:focus, &:active
            border-color: #93a1bb
</style>
