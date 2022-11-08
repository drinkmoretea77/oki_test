<template>
    <label
        class="v-upload-inline"
        :class="{
            'v-upload-inline--hover': hover,
            'v-upload-inline--inline': inline,
            'v-upload-inline--not-empty': selected,
            'v-upload-inline--disabled': disabled,
            'v-upload-inline--drop': type === 'drop',
            'v-upload-inline--button': type === 'button',
        }"
        @dragenter="hover = true"
        @dragleave="hover = false"
        @dragend="hover = false"
        @dragdrop="hover = false"
    >
        <input
            v-if="!disabled"
            ref="input"
            type="file"
            class="v-upload-inline__input"
            :accept="accept"
            :multiple="multiple"
            @change="change"
        />
        <span
            v-if="selected"
            class="v-upload-inline__clear"
            @click.prevent="clear"
        >
            <i class="fa fa-close" />
        </span>
        <span class="v-upload-inline__drop">
            <template v-if="drag">
                <span class="v-upload-inline__label">
                    {{
                        multiple
                            ? $t('Перетащите файлы сюда')
                            : $t('Перетащите файл сюда')
                    }}&nbsp;<i class="fa fa-arrow-down" />
                </span>
            </template>
            <template v-else>
                <template v-if="selected">
                    <span class="v-upload-inline__label">{{ selected }}</span>
                </template>
                <template v-else>
                    <span class="v-upload-inline__label">
                        {{ label ? label : defaultLabel }}
                    </span>
                </template>
            </template>
        </span>
    </label>
</template>

<script>
export default {
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

        disabled: {
            type: Boolean,
            default: false,
        },

        inline: {
            type: Boolean,
            default: false,
        },

        label: {
            type: String,
            default: '',
        },

        name: {
            type: String,
            default: '',
        },

        value: {
            type: Object,
            default: null,
        },

        /**
         * Какие форматы можно передать
         * Пример: .doc,.docx,.txt
         */
        accept: {
            type: String,
            default: '',
        },

        multiple: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            drag: false,
            hover: false,
            files: [],
            timeout: 0,
            selected: '',
        };
    },

    computed: {
        defaultLabel() {
            return this.multiple
                ? this.$t('Выберите файлы')
                : this.$t('Выберите файл');
        },
    },

    watch: {
        value(files) {
            if (files === null) {
                this.selected = '';
            }
        },
    },

    mounted() {
        this.$nextTick().then(() => {
            if (this.help && this.hint_type === 'icon') {
                $(this.$refs.tooltip).tooltip();
            }
        });

        document.body.addEventListener('dragover', this.dragStart);
        document.body.addEventListener('dragleave', this.dragEnd);
        document.body.addEventListener('drop', this.dragEnd);
    },

    beforeDestroy() {
        document.body.removeEventListener('dragover', this.dragStart);
        document.body.removeEventListener('dragleave', this.dragEnd);
        document.body.removeEventListener('drop', this.dragEnd);
    },

    methods: {
        dragStart() {
            clearTimeout(this.timeout);
            this.drag = true;
        },

        dragEnd() {
            clearTimeout(this.timeout);
            this.timeout = setTimeout(() => {
                this.drag = false;
                this.hover = false;
            }, 50);
        },

        change() {
            const files = this.$refs.input.files;

            this.selected = [...files].reduce((prev, file, index, array) => {
                const postfix = index === array.length - 1 ? '' : ', ';

                return prev + file.name + postfix;
            }, '');

            this.$emit('input', files);
        },

        clear(event) {
            event.stopPropagation();
            this.$refs.input.value = null;
            this.selected = '';
            this.$emit('input', null);
        },
    },
};
</script>

<style lang="stylus">
.v-upload-inline
    position: relative
    overflow: hidden
    cursor: pointer
    user-select: none
    &--inline
        max-width: 100%
        display: inline-flex
    &--disabled
        cursor: not-allowed
    &--disabled &__drop
        opacity: 0.5

    &--button &__drop
        background-color: #337ab7
        color: #fff
        padding: 0 12px
        height: 35px
        display: flex
        align-items: center
        justify-content: center
        flex-direction: column
        border-radius: 4px
        border: 1px solid #2e6da4
        transition: background .15s ease-out
        max-width: 100%
    &--not-empty&--button &__drop
        padding-right: 24px
    &--inline&--button &__drop
        display: inline-flex

    &--drop &__drop
        padding: 12px
        cursor: pointer
        display: flex
        align-items: center
        justify-content: center
        height: 72px
        transition: all .15s ease-out
        background-color: rgba(#fff, .3)
        flex-direction: column
        max-width: 100%
        overflow: hidden
        &:before
            content: ''
            position: absolute
            z-index: 1
            top: 0
            bottom: 0
            left: 0
            right: 0
            border: 2px dashed #c2cad8
            transition: all .15s ease-out
            pointer-events: none


    &--drop&:hover &__drop, &--drop&--hover &__drop
        &:before
            border-color: #659be0

    &--button&:hover &__drop, &--button&--hover &__drop
        border-color: #204d74
        background-color: #286090

    &--drop &__label
        width: 100%
        overflow: hidden
        text-overflow: ellipsis
        transition: all .15s ease-out
        color: #777
        text-align: center
        white-space: nowrap

    &--button &__label
        max-width: 100%
        overflow: hidden
        text-overflow: ellipsis
        transition: all .15s ease-out
        color: #fff
        white-space: nowrap
        width: 100%
        text-align: center


    &--drop&:hover &__label, &--drop&--hover &__label
        color: #659be0

    &__clear
        display: flex
        align-items: center
        justify-content: center
        transition: all .15s ease-out
        width: 24px
        height: 24px
        position: absolute
        top: 0
        right: 0
        z-index: 3
        cursor: pointer
        color: #777
        &:hover
            color: #659be0

    &--button &__clear
        color: rgba(#fff, .5)
        height: 35px
        padding-bottom: 2px
        &:hover
            color #fff

    &__input
        cursor: pointer
        pointer-events: none
        opacity: 0
        top: 0
        left: 0
        width: 100%
        height: 100%
        position: absolute
</style>
