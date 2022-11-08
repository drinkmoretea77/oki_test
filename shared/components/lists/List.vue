<template>
    <div class="v-list" :class="[ 'v-list--content-' + view, { 'v-list--draggable': draggable } ]">
        <header class="v-list__header">
            <div class="v-list__header-left">
                <slot name="header" />
            </div>
            <div class="v-list__header-right">
                <slot name="right" />
                <v-dropdown class="v-list__settings" width="220" :hide-close="true">
                    <template #toggle>
                        <div class="v-list__settings-toggle">
                            <i class="fa fa-cog"></i>
                        </div>
                    </template>
                    <div class="v-list__settings-title">{{ $t('Настройки списка') }}</div>
                    <v-select-inline :placeholder="$t('Число колонок')" :options="optionsCount" @input="selectView($event)" />
                </v-dropdown>
            </div>
        </header>
        <div class="v-list__content"  :class="[ 'v-list__content--' + view, { 'v-list__content--ready': ready } ]">
            <slot />
        </div>
        <slot name="another" />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    interface VList {
        view: ''
    }

    export default Vue.extend({
        props: {
            draggable: {
                type: Boolean,
                default: false
            },

            defaultView: {
                type: Number,
                default: 1
            },

            name: {
                type: String,
                default: 'all'
            },

            views: {
                type: Array,
                default: () => ([1, 2, 3])
            },

            showView: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                view: 3,
                ready: false,
                optionsCount: [
                    {
                        value: 1,
                        text: '1'
                    },
                    {
                        value: 2,
                        text: '2'
                    },
                    {
                        value: 3,
                        text: '3'
                    },
                    {
                        value: 4,
                        text: '4'
                    },
                ]
            }
        },

        created() {
            this.selectView(this.defaultView, false);
        },

        mounted() {
            const selected = window.localStorage.getItem('v-list-' + this.name);

            if (selected) {
                this.selectView(parseInt(selected));
            } else {
                this.selectView(this.defaultView);
            }

            this.ready = true;
        },

        methods: {
            selectView(num: number, save = true) {
                this.view = num;

                if (save) {
                    localStorage.setItem('v-list-' + this.name, num.toString());
                }
            }
        }
    })
</script>

<style lang="stylus">
    .v-list
        margin-bottom: 40px

        &__settings
            z-index: 10
            &-title
                font-size: 16px
                margin-top: -4px
                margin-bottom: 8px
            &-toggle
                background-color: rgba(#fff, .5)
                border-radius: 4px
                height: 34px
                width: 34px
                color: #fff
                display: flex
                align-items: center
                justify-content: center
                font-size: 18px
                cursor: pointer
                user-select: none
                transition: all .15s ease-out
                &:hover
                    color: #959595
                    background-color: rgba(#fff, 1)

        &__header
            margin-bottom: 16px
            display: flex
            justify-content: space-between

            &-left
                display: flex

            &-right
                padding-left: 15px
                display: flex
                justify-content: flex-end
                .btn-group
                    display: flex

        &__content, &__draggable
            transition: opacity .15s ease-out
            display: grid
            column-gap: 16px
            row-gap: 16px
            opacity: 0

            &--ready
                opacity: 1

        for num in (1..12)
            &--content-{num} &__content, &--content-{num} &__draggable
                grid-template-columns: repeat(num, 1fr)
                @media (max-width: 767px)
                    grid-template-columns: repeat(1, 1fr)

        &__draggable
            opacity: 1

        &--draggable &__content
            display: block
            column-gap: initial
            row-gap: initial
            grid-template-columns: initial

        &__view
            padding: 8px 4px!important
            width: 34px
            height: 34px
            display: grid!important
            column-gap: 2px
            row-gap: 4px

            for num in (1..12)
                &--{num}
                    grid-template-columns: repeat(num, 1fr)

            span
                transition: all .15s ease-out
                height: 3px
                background-color: rgba(#fff, .3)

            &.green
                position: relative
                z-index: 2
                span
                    background-color: rgba(#fff, 1)

        &__views
            display: flex
</style>
