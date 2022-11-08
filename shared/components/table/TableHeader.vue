<template>
    <div class="v-table-header">
        <slot />
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
.v-table-header
    background-color: #659be0
    display: block
    position: sticky
    top: 50px
    color: #fff
    white-space: nowrap
    z-index: 3
</style>