<template>
    <div class="v-page-header">
        <div class="v-page-header__row">
            <div class="v-page-header__left">
                <h1 class="margin-right-10">
                    <nuxt-link v-if="back" :to="back" class="fa fa-reply" />
                    {{ title }}
                </h1>
                <slot name="default" />
            </div>
            <div class="v-page-header__right">
                <slot name="right" />
            </div>
        </div>
        <slot name="after" />
        <v-permissions v-if="showPermissions" />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue'

    export default Vue.extend({
        props: {
            title: {
                type: String,
                default: ''
            },

            back: {
                type: String,
                default: ''
            },

            showPermissions: {
                type: Boolean,
                default: true
            }
        }
    })
</script>

<style lang="stylus">
    .v-page-header
        h1
            margin-top: 0
            margin-bottom: 0

        &__row
            display: flex
            flex-wrap: wrap
            align-content: flex-end
            justify-content: space-between
            padding-top: 20px
            padding-bottom: 10px

        &__left
            display: flex
            align-items: flex-end
            flex-wrap: wrap

        &__right
            display: flex
            align-items: flex-end
            flex-wrap: wrap
</style>
