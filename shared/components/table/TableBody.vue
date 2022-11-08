<template>
    <div class="v-table-body">
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
.v-table-body
    display: block
</style>