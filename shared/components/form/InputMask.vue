<template>
    <input type="text" class="form-control" :class="fullSize ? 'full-size' : ''" @input="change" :value="localValue">
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        mask: {
            type: String,
            default: ''
        },

        type: {
            type: String,
            default: 'text'
        },

        placeholder: {
            type: String,
            default: ''
        },

        name: {
            type: String,
            default: ''
        },

        fullSize: {
            type: Boolean,
            default: false
        },

        value: {
            type: [String, Number],
            default: ''
        },
    },

    data() {
        return {
            localValue: ''
        }
    },

    created() {

    },

    methods: {
        change() {

        }
    }
})
</script>