<template>
    <div class="v-list-content">
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
    .v-list-content
        display: flex
        flex-direction: column
        -webkit-backface-visibility: hidden
        backface-visibility: hidden
        overflow: hidden
        margin-bottom: -8px
        padding-bottom: 8px
</style>
