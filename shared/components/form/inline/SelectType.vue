<template>
    <v-select-inline class="v-select-type" v-model="localValue" :inline="true" :options="options" @change="$emit('input', $event)">
        <template v-slot:select="{ selected, show, toggle, option }">
            <button class="btn btn-circle dropdown-toggle" :class="[ option.color || 'default' ]" @click="toggle">
                {{ selected }}
                <i v-if="show" class="fa fa-angle-up"></i>
                <i v-else class="fa fa-angle-down"></i>
            </button>
        </template>
    </v-select-inline>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        value: {
            type: [String, Number],
            default: 0,
        },

        options: {
            type: Array,
            default: () => ([])
        }
    },


    data() {
        return {
            localValue: 0,
        }
    }
})
</script>

<style lang="stylus">
    .v-select-type
        .v-select__dropdown
            border-radius: 4px!important
            border: 1px solid #93a1bb!important
</style>