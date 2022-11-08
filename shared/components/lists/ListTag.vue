<template>
    <div class="v-list-tag" :class="{ 'v-list-tag--right': right }" v-tooltip="tooltip" data-html="true">
        <span class="badge" :class="[ 'badge-' + color ]"><slot /></span>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            color: {
                type: String,
                default: 'success'
            },

            tooltip: {
                type: String,
                default: ''
            },

            right: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {

            }
        },
    })
</script>

<style lang="stylus">
    .v-list-tag
        margin-top: 8px
        margin-right: 8px
        &--right
            margin-left: auto
            margin-right: 0

        .badge
            height: 19px;
</style>
