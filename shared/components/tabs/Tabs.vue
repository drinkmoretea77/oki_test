<template>
    <div class="v-tabs" :class="{ 'v-tabs--vertical': vertical }">
        <div class="v-tabs__row tabbable-custom">
            <slot />
        </div>
    </div>
</template>

<script>
export default {
    inject: {
        formState: {
            default: null,
        },
    },

    provide() {
        return {
            tabsState: this.state,
        };
    },

    props: {
        /**
         * Вертикальный вывод
         */
        vertical: {
            type: Boolean,
            default: false,
        },

        /**
         * Выбранный таб
         */
        value: {
            type: [Number, String],
            default: 0,
        },
    },

    data() {
        return {
            state: {
                isForm: false,
                items: [],
                controls: [],
                disabled: {},
                value: 0,
                errors: {},
            },
        };
    },

    created() {
        this.state.value = this.value;

        if (this.formState) {
            this.isForm = true;
        }
    },

    watch: {
        formState: {
            deep: true,
            handler(state) {
                if (state && state.tab && state.tab.name) {
                    this.$emit('input', state.tab.name);
                }
            },
        },

        value() {
            this.state.value = this.value;
        },

        state: {
            deep: true,
            handler() {
                this.$emit('input', this.state.value);
            },
        },
    },
};
</script>

<style lang="stylus">
.v-tabs
    width: 100%

    &__row
        overflow: visible!important

    &--vertical &__row
        display: flex
        margin-left: -15px
        margin-right: -15px

        .tab-content
            background: none!important
            border: none!important

        .v-tabs-control
            font-weight: 700!important
            text-transform: uppercase
            margin-top: 0!important
            border-top: 2px solid transparent!important
            a
                font-weight: 700!important
                color: #259ca7!important
            &.active
                a
                    border-top: 1px solid #ddd!important

        .v-tabs-controls
            display: flex
            flex-direction: column
            max-width: 25%
            flex-basis: 25%
            min-width: 25%
            border-bottom: none!important
            padding: 0 15px
            //border-right: 1px solid #ddd
            position: relative
            &:after
                content: ''
                position: absolute
                right: 16px
                top: 0
                height: 100%
                width: 1px
                background-color: #ddd

        .v-tabs-items
            max-width: 75%
            flex-basis: 75%
            min-width: 75%
            padding: 0 15px
</style>
