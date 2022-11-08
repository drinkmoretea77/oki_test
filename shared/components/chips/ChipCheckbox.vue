<template>
    <div class="v-chip-checkbox">
        <div class="v-chip-checkbox__check" v-tooltip="label">
            <v-checkbox-inline
                :checked="checked"
                :disabled="disabled"
                :label="label"
                @toggle="toggle"
            />
        </div>
        <template v-if="controls">
            <div class="v-chip-checkbox__remove" v-tooltip="$t('Удалить')" @click="remove">
                <i class="fa fa-remove" />
            </div>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            disabled: {
                type: Boolean,
                default: false
            },

            label: {
                type: String,
                default: ''
            },

            checked: {
                type: Boolean,
                default: false
            },

            controls: {
                type: Boolean,
                default: true
            },
        },

        methods: {
            toggle() {
                if (this.disabled) return;
                this.$emit('toggle');
            },

            remove() {
                if (this.disabled) return;
                this.$emit('remove');
            }
        }
    })
</script>

<style lang="stylus">
    .v-chip-checkbox
        display: flex
        margin-right: 8px
        margin-bottom: 8px
        border-radius: 4px
        color: #777
        transition: all .15s ease-out
        background-color: #f2f2f2
        max-width: 100%

        &__check
            height: 28px
            display: flex
            align-items: center
            padding: 0 8px 0 6px
            text-transform: capitalize
            white-space: nowrap
            text-overflow: ellipsis
            overflow: hidden
            position: relative
            &:after
                content: ''
                position: absolute
                top: 0
                right: 0
                bottom: 0
                width: 8px
                background-image: linear-gradient(to left, rgba(#f2f2f2, 1), rgba(#f2f2f2, 0))

        &__remove
            color: #999
            display: flex
            align-items: center
            cursor: pointer
            transition: all .15s ease-out
            margin-right: 0
            position: relative
            text-decoration: none
            border-radius: 0 4px 4px 0
            height: 28px
            padding: 0 8px;
            &:hover
                color: #fff
                background-color: #ed6b75


</style>
