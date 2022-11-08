<template>
    <div class="v-table-row">
        <div class="v-table-row__wrap">
            <slot />
        </div>
        <slot name="footer" />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

interface VList {
    view: ''
}

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
.v-table-row
    position relative
    transition: all .15s ease-out
    border-bottom: 1px solid #dcdcdc
    background-color: #fff
    &__wrap
        display: flex
    &:last-child
        border-bottom: none

    &:hover
        background-color: #f8f8f8

</style>
