<template>
    <div class="v-list-date">
        <span class="v-list-date__wrap" v-tooltip="tooltip">
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
    .v-list-date
        padding-top: 8px
        margin-bottom: -8px
        font-size: 12px
        margin-top: auto
        color: #959595
</style>
