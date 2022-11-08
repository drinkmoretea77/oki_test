<template>
    <div
            class="v-list-control-custom"
            :class="{
            'v-list-control-custom--disabled': disabled,
        }"
            v-tooltip="tooltip"
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
        }
    })
</script>

<style lang="stylus">
    .v-list-control-custom
        cursor: pointer;
        margin-bottom: 8px
        transition: all 0.15s ease-out
        transform: translate(30%, 0%)
        opacity: 0
        -webkit-backface-visibility: hidden

        &:hover
            transform: translate(0%, 0%)
            opacity: 1

        &:active
            transform: translate(0%, 0%)
            opacity: 1

        &--disabled
            cursor: default
            &:hover, &:active
                opacity: .5!important

</style>
