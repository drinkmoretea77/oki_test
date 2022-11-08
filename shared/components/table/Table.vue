<template>
    <div class="v-table" :class="[ `v-table--cols-${cols}` ]">
        <div class="v-table__container">
            <div class="v-table__wrapper">
                <div class="v-table__content">
                    <slot />
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface VList {
    view: ''
}

export default Vue.extend({
    props: {
        cols: {
            type: Number,
            default: 1
        },

        colsWidth: {
            type: Array,
            default: () => ([])
        }
    },

    data() {
        return {

        }
    },

})
</script>

<style lang="stylus">
.v-table
    &__container
        max-width: 1024px
        margin: 0 auto

    &__wrapper
        position: relative

    &__content
        min-width: 1024px
        box-shadow: 0 8px 16px 0px rgba(#000, 0.1)

    .v-table-flex
        display: flex

    .v-table-clip-text
        display: block
        max-width: 100%
        text-overflow: ellipsis
        overflow: hidden
        white-space: nowrap

    .v-list-date
        margin: 0!important
        padding: 0!important

    .v-chips
        padding: 0px 12px 16px 12px
        .v-chip
            margin-bottom: 4px
            margin-right: 4px
        .v-chip__text
            padding: 2px 8px 2px 8px
    a
        text-decoration: none!important

</style>
