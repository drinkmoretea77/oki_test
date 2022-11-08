<template>
    <div class="v-list-item">
        <div class="v-list-item__wrapper" :class="{ 'v-list-item__wrapper--no-controls': !controls }">
            <slot />
        </div>
        <div v-if="index + 1 > 0" class="v-list-item__index">{{ index + 1 }}</div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            index: {
                type: Number,
                default: -1
            },
            controls: {
                type: Boolean,
                default: true
            }
        },

        data() {
            return {

            }
        }
    })
</script>

<style lang="stylus">
    .v-list-item
        position: relative
        border-radius: 4px
        background-color: rgba(#fff, .5)
        overflow-wrap: anywhere
        box-shadow: 0 1px 3px rgba(0,0,0,.1), 0 1px 2px rgba(0,0,0,.18)
        transition: all .15s ease-out
        -webkit-backface-visibility: hidden
        overflow: hidden

        .v-chips
            margin-bottom: 8px
            &:last-child
                margin-bottom: 0

        &:hover
            z-index: 3
            background-color: #fff
            .v-list-control, .v-list-control-custom
                opacity: 1
                transform: translate(0%, 0%)
                &--disabled
                    opacity: .5
        &:active
            background-color: rgba(#fff, .5)
        &__index
            position: absolute
            z-index: 1
            left: 100px
            bottom: -12px
            opacity: 0.05
            color: #333
            font-size: 89px
            line-height: 1

        &__wrapper
            display: grid
            height: 100%
            grid-template-columns: 1fr 32px
            column-gap: 16px
            padding: 16px
            z-index: 2
            position: relative
            &--no-controls
                grid-template-columns: 1fr
</style>
