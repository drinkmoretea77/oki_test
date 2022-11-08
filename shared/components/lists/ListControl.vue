<template>
    <div
            class="v-list-control"
            :class="{
            'v-list-control--disabled': disabled,
            'v-list-control--color-danger': color === 'danger',
        }"
            v-tooltip="tooltip"
            v-on="listeners"
    >
        <slot />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            tooltip: {
                type: String,
                default: ''
            },

            disabled: {
                type: Boolean,
                default: false
            },

            color: {
                type: String,
                default: 'default'
            },

            to: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                listeners: {}
            }
        },

        created() {
            if (this.to) {
                this.listeners = {
                    ...this.$listeners,
                    click: this.goTo
                };
            } else {
                this.listeners = this.$listeners;
            }
        },

        methods: {
            goTo() {
                if (this.disabled) return;
                if (this.to.includes('/n/')) {
                    this.$router.push(this.to)
                } else {
                    window.location = this.to as any;
                }
            }
        }
    })
</script>

<style lang="stylus">
    .v-list-control
        border: 1px solid #dcdcdc
        border-radius: 4px
        width: 32px;
        height: 32px;
        cursor: pointer;
        display: flex
        align-items: center
        justify-content: center
        margin-bottom: 8px
        color: #b5b5b5
        transition: all 0.15s ease-out
        transform: translate(30%, 0%)
        opacity: 0
        -webkit-backface-visibility: hidden

        &:hover
            transform: translate(0%, 0%)
            opacity: 1
            border-color: #659be0
            background-color: #659be0
            color: #fff

        &:active
            transform: translate(0%, 0%)
            opacity: 1
            border-color: #2f78d5
            background-color: #2f78d5
            color: #fff
        &--color
            &-success
                &:hover
                    border-color: #36c6d3
                    background-color: #36c6d3
                &:active
                    border-color: #36c6d3
                    background-color: #36c6d3

            &-info
                &:hover
                    border-color: #659be0
                    background-color: #659be0
                &:active
                    border-color: #659be0
                    background-color: #659be0

            &-warning
                &:hover
                    border-color: #F1C40F
                    background-color: #F1C40F
                &:active
                    border-color: #F1C40F
                    background-color: #F1C40F

            &-primary
                &:hover
                    border-color: #337ab7
                    background-color: #337ab7
                &:active
                    border-color: #337ab7
                    background-color: #337ab7

            &-danger
                &:hover
                    border-color: #ed6b75
                    background-color: #ed6b75
                &:active
                    border-color: #ed6b75
                    background-color: #ed6b75

        &--disabled
            cursor: default
            color: #b5b5b5!important
            border: 1px solid #dcdcdc!important
            background: #fff!important
            &:hover, &:active
                opacity: .5!important

</style>
