<template>
    <div class="v-list-subtitle">
        <span class="v-list-subtitle__wrap"  v-tooltip="tooltip">
            <slot />
        </span>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            tooltip: {
                type: [String, Number],
                default: ''
            }
        },

        data() {
            return {

            }
        }
    })
</script>

<style lang="stylus">
    .v-list-subtitle
        margin-top: -4px
        font-size: 12px
        margin-bottom: 16px
        &:last-child
            margin-bottom: 0
        &:nth-last-child(2)
            margin-bottom: 0

</style>
