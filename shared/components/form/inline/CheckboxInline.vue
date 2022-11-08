<template>
    <div class="v-checkbox-inline"
         v-on="listeners"
         :class="{
            'v-checkbox-inline--radio': type === 'radio',
            'v-checkbox-inline--switch': type === 'switch',
            'v-checkbox-inline--bool': type === 'bool',
            'v-checkbox-inline--disabled': disabled,
            'v-checkbox-inline--checked': isChecked
        }"
    >
        <div class="v-checkbox-inline__wrapper" :class="{'v-checkbox-inline__wrapper--no-content': !displayContent}">
            <div v-if="type === 'radio'" class="v-checkbox-inline__dot"></div>
            <div v-if="type === 'check'" class="v-checkbox-inline__icon">
                <i class="fa fa-check"></i>
            </div>
            <div v-if="type === 'bool'" class="v-checkbox-inline__bool" :class="{ 'v-checkbox-inline__bool--active': isChecked }">
                <span class="v-checkbox-inline__bool-col v-checkbox-inline__bool-col--true">{{ $t('Да') }}</span>
                <span class="v-checkbox-inline__bool-col"></span>
                <span class="v-checkbox-inline__bool-col v-checkbox-inline__bool-col--false">{{ $t('Нет') }}</span>
            </div>
        </div>
        <div v-if="displayContent"
            class="v-checkbox-inline__content">
            <div v-if="label" class="v-checkbox-inline__label" v-html="label" />
            <div v-if="help" class="v-checkbox-inline__help" v-html="help" />
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            value: {
                type: Boolean,
                default: false
            },

            type: {
                type: String,
                default: 'check'
            },

            checked: {
                type: Boolean,
                default: false
            },

            disabled: {
                type: Boolean,
                default: false
            },

            label: {
                type: String,
                default: ''
            },

            help: {
                type: String,
                default: ''
            },

            displayContent: {
                type: Boolean,
                default: true
            },

        },

        data() {
            return {
                listeners: {}
            };
        },

        created() {
            this.listeners = {
                ...this.$listeners,
                click: () => {
                    this.toggle();
                    if (typeof this.$listeners.click === "function") {
                        this.$listeners.click();
                    }
                }
            };
        },

        methods: {
            toggle() {
                if (this.disabled) return;
                this.$emit('toggle');
                this.$emit('input', !this.value);
            }
        },

        computed: {
            isChecked(): boolean {
                return this.checked || this.value;
            }
        }
    })
</script>

<style lang="stylus">
    .v-checkbox-inline
        position: relative
        cursor: pointer
        display: inline-flex
        align-items: flex-start
        vertical-align: middle
        user-select: none

        &__help
            margin-top: 4px
            font-size: 12px
            color: #555
            margin-bottom: 8px

        &__wrapper
            position: relative
            margin-right: 8px
            width: 18px
            min-width: 18px
            height: 18px
            border-radius: 4px
            border: 1px solid #dcdcdc
            background-color: #fff
            transition: all .15s ease-out
            &--no-content
                margin-right: 0

        &--bool &__wrapper
            width: 70px
            height: 24px
            border: 1px solid #ccc
            margin-right: 0
            overflow: hidden

        &__bool
            display: flex
            position: absolute
            top: 0
            left: 0
            bottom: 0
            transition: all .2s ease-out
            transform: translateX(-35px)

            &--active
                transform: translateX(0)

            &-col
                padding-bottom: 1px
                background-color: #fff
                height: 100%
                min-width: 35px
                flex-basis: 35px
                max-width: 35px
                display: flex
                align-items: center
                justify-content: center
                font-size: 12px
                text-transform: uppercase
                &--false
                    background-color: #eee
                    color: #000
                &--true
                    background-color: #428bca
                    color: #fff

        &--switch &__wrapper
            border-radius: 20px
            width: 34px
            min-width: 34px
            height: 22px
            box-shadow: rgb(223 223 223) 0px 0px 0px 0px inset
            border-color: rgb(223, 223, 223)
            background-color: rgb(255, 255, 255)
            position: relative

            &:after
                content: ''
                transition: all .15s ease-out
                background: #fff
                border-radius: 100%
                box-shadow: 0 1px 3px rgb(0 0 0 / 40%)
                height: 20px
                width: 20px
                left: 0
                position: absolute
                top: 0

        &--switch&--checked &__wrapper
            background-color: rgb(27, 188, 155)
            border-color: rgb(27, 188, 155)
            box-shadow: rgb(27 188 155) 0px 0px 0px 11px inset

        &--disabled
            pointer-events: none
            cursor: default
        &--disabled &__wrapper
            opacity: .5
            border: 1px solid #dcdcdc!important

        &--radio &__wrapper
            border-radius: 9px

        &__dot
            position: absolute
            top: 50%
            left: 50%
            transform: translate(-50%, -50%) scale(0)
            transition: all .15s cubic-bezier(0.175, 0.885, 0.32, 1.275)
            width: 6px
            height: 6px
            border-radius: 50%
            background-color: #659be0

        &__icon
            position: absolute
            top: 0
            bottom: 0
            left: 0
            width: 0
            height: 18px
            overflow: hidden
            color: #659be0
            transition: all .15s ease-out
            .fa
                position: absolute
                top: 1px
                left: 0
                width: 16px
                height: 16px
                display: flex
                align-items: center
                justify-content: center
                padding-bottom: 2px

        &--checked &__icon
            width: 18px

        &--checked &__wrapper
            &:after
                left: 11px

        &--checked &__dot
            transform: translate(-50%, -50%) scale(1)

        &--disabled &__icon
            color: #d9d9d9
</style>
