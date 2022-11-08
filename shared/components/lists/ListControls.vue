<template>
    <div class="v-list-controls">
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
    .v-list-controls
        margin-bottom: -8px

</style>
