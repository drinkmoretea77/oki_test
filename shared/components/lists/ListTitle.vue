<template>
    <div class="v-list-title">
        <slot />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        data() {
            return {

            }
        }
    })
</script>

<style lang="stylus">
    .v-list-title
        margin-bottom: 8px
        font-size: 22px
        font-weight: 300
        line-height: 1.4
        .badge-count
            box-shadow: none!important
            padding: 3px 6px 2px!important
            margin-top: -5px
            margin-left: 5px

        .v-list-title-disabled
            font-size: 22px
            font-weight: 300
            line-height: 1.4
        a
            text-decoration: none!important
        &:last-child
            margin-bottom: 0

</style>
