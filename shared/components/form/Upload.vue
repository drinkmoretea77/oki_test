<template>
    <div class="form-group">
        <div class="col-md-3 control-label">
            {{ label }}
        </div>
        <div ref="list" class="col-md-9">
            <v-upload-inline
                @input="input"
                :type="type"
                :multiple="multiple"
                :accept="accept"
                :inline="inline"
                :label="placeholder"
                :value="value"
            />
            <template v-if="help">
                <span
                    v-if="hint_type === 'block'"
                    class="help-block"
                    v-html="help"
                ></span>
                <i
                    v-else
                    class="fa fa-question-circle help-icon"
                    v-tooltip="help"
                />
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        /**
         * Стили отображения
         * drop - большая зона куда можно перетащить файлы
         * button - кнопка выбора файлов
         */
        type: {
            type: String,
            default: 'button',
        },

        /**
         * Какие форматы можно передать
         * Пример: .doc,.docx,.txt
         */
        accept: {
            type: String,
            default: '',
        },

        inline: {
            type: Boolean,
            default: false,
        },

        multiple: {
            type: Boolean,
            default: false,
        },

        disabled: {
            type: Boolean,
            default: false,
        },

        cols: {
            type: Boolean,
            default: false,
        },

        value: {
            type: Array,
            default: () => [],
        },

        options: {
            type: Array,
            default: () => [],
        },

        help: {
            type: String,
            default: '',
        },

        label: {
            type: String,
            default: '',
        },

        hint_type: {
            type: String,
            default: 'icon',
        },

        placeholder: {
            type: String,
            default: '',
        },
    },

    methods: {
        input(files: any) {
            if (this.disabled) return;
            this.$emit('input', files);
        },
    },
});
</script>

<style lang="stylus">
.v-upload
    &__content
        padding-top: 6px
    &__item
        margin-right: 15px
</style>
