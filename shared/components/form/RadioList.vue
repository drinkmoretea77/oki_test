<template>
    <div class="v-radio-list form-group">
        <div class="col-md-3 control-label">
            {{ label }}
        </div>
        <div ref="list" class="col-md-9 v-radio-list__content">
            <div class="v-radio-list__items">
                <v-checkbox-inline 
                    class="v-radio-list__item"
                    :type="type"
                    v-for="option in options"
                    :key="option.value"
                    :label="option.text || option.value"
                />
            </div>
            <template v-if="help">
                <span v-if="hint_type === 'block'" class="help-block" v-html="help"></span>
                <i v-else class="fa fa-question-circle help-icon" v-tooltip="help" />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            type: {
                type: String,
                default: 'check'
            },

            disabled: {
                type: Boolean,
                default: false
            },

            cols: {
                type: Boolean,
                default: false
            },

            value: {
                type: Array,
                default: () => ([])
            },

            options: {
                type: Array,
                default: () => ([])
            },

            help: {
                type: String,
                default: ''
            },

            label: {
                type: String,
                default: ''
            },

            hint_type: {
                type: String,
                default: 'icon'
            }
        },

        methods: {
            toggle() {
                if (this.disabled) return;
                this.$emit('input', !this.value)
            }
        }
    })
</script>

<style lang="stylus">
    .v-radio-list
        &__content
            padding-top: 6px
        &__item
            margin-right: 15px
</style>