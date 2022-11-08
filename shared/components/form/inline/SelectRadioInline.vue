<template>
    <div class="v-select-radio btn-group btn-group-circle" :class="{ 'v-select-radio--disabled': disabled}">
        <button
                v-for="option in options"
                :key="option.value"
                type="button"
                class="btn btn-default btn-circle btn-xs"
                :class="{ 'active': String(value) === String(option.value), 'disabled': disabledOptions.includes(value) }"
                :disabled="disabledOptions.includes(value)"
                @click="selectValue(option.value)"
        >
            {{ option.text || option.value }}
        </button>
    </div>
</template>

<script lang="ts">
    import Vue, { PropType } from 'vue';
    import { SelectOption } from '~/types';

    type SelectValue = string | number | any[];

    export default Vue.extend({
        props: {
            value: {
                type: [String, Number, Array, Boolean] as PropType<SelectValue>,
                default: ''
            },

            disabled: {
                type: Boolean,
                default: false
            },

            disabledOptions: {
                type: Array,
                default: () => ([])
            },

            options: {
                type: Array as PropType<SelectOption[]>,
                default: () => ([])
            },
        },

        methods: {
            selectValue(value: any) {
                if (this.disabledOptions.includes(value)) return;

                this.$emit('input', value);
            },
        }
    })
</script>


<style lang="stylus">
    .v-select-radio
        position: relative
        display: inline-flex
        .btn
            border-radius: 0!important
            &.active
                background: #337ab7 !important
                color: #fff !important
                border-color: #337ab7 !important
            &:first-child
                border-radius: 25px 0 0 25px!important
            &:last-child
                border-radius: 0 25px 25px 0!important
</style>
