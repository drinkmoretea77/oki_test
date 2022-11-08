<template>
    <div class="form-group form-group-relative">
        <v-content-spinner :load="load" :space="false"/>

        <div class="control-label" :class="[ fullLabel ? 'col-md-6' : 'col-md-3', fullLabel ? 'text-left' : '']">
            <span v-html="label"></span>
            <span v-if="required" class="required" aria-required="true"> * </span>
        </div>

        <div :class="[ fullLabel ? 'col-md-6' : 'col-md-9']">
            <div :class="{ 'form-group-slot': fullLabel }">
                <slot></slot>
            </div>
            <template v-if="help">
                <span v-if="hint_type === 'block'" class="help-block" v-html="help"></span>
                <i v-else class="fa fa-question-circle help-icon" v-tooltip="help" />
            </template>
        </div>
    </div>
</template>

<script>

export default {
    props: {
        label: {
            type: String,
            default: ''
        },

        help: {
            type: String,
            default: ''
        },

        required: {
            type: Boolean,
            default: false
        },

        load: {
            type: Boolean,
            default: false
        },

        fullLabel: {
            type: Boolean,
            default: false
        },

        hint_type: {
            type: String,
            default: 'icon'
        },
    },
}
</script>

<style lang="stylus">
.form-horizontal .control-label.text-left
    text-align: left
.form-group-relative
    position: relative
.form-group-slot
    display: flex
    .form-control
        margin-left: 15px
</style>
