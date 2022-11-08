<template>
    <div class="layout layout--server-error">
        <nuxt />
    </div>
</template>

<script>
    export default {
        data() {
            return {
                fullContent: true
            }
        }
    }
</script>

<style>
    .page-enter-active, .page-leave-active {
        transition: opacity .3s;
    }
    .page-enter, .page-leave-active {
        opacity: 0;
    }

    .layout .page-content-wrapper--full .page-content {
        margin-left: 0!important;
    }
</style>
