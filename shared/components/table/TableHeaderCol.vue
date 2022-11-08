<template>
    <div class="v-table-header-col">
        <div class="v-table-header-col__wrap">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {

    },

    data() {
        return {

        }
    },

})
</script>

<style lang="stylus">
.v-table-header-col
    padding: 16px 12px
    background-color: #659be0
    flex-basis: 18.75%
    max-width: 18.75%
    min-width: 18.75%

    &:first-child
        flex-basis: 25%
        max-width: 25%
        min-width: 25%

    &__wrap
        display: flex
        flex-direction: column
        align-items: center
        justify-content: center
        text-align: center
    &:first-child &__wrap
        text-align: left
        align-items: flex-start
</style>
