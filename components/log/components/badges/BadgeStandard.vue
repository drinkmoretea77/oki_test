<template>
    <div class="badge-standard">
        <span :class="'badge badge-' + color_class" v-tooltip="title" v-text="text"></span>
    </div>
</template>

<script>
    export default {
        props: {
            color_class: {
                type: String,
                default: null
            },
            text: {
                type: String,
                default: null
            },
            title: {
                type: String,
                default: null
            }
        },
    }
</script>

<style scoped>
    .badge-standard {
        display: inline;
        cursor: pointer;
    }
</style>
