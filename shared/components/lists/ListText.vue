<template>
    <div class="v-list-text">
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
    .v-list-text
        font-size: 14px
        line-height: 1.6
        margin-bottom: 16px
        &:last-child
            margin-bottom: 0
        &:nth-last-child(2)
            margin-bottom: 0

</style>
