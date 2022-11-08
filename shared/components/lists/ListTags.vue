<template>
    <div class="v-list-tags">
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
    .v-list-tags
        margin-top: auto
        display: flex
        flex-wrap: wrap
    .v-list-tags + .v-list-date
        margin-top: 0
</style>
