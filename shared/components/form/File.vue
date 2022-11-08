<template>
    <div
        class="v-file"
        :class="{ 'v-file--hover': hover }"
        @dragenter="hover = true"
        @dragleave="hover = false"
        @dragend="hover = false"
        @dragdrop="hover = false"
    >
        <input
            ref="input"
            type="file"
            class="v-file__input"
            :accept="accept"
            :multiple="multiple"
            @change="change"
        >
        <div class="v-file__drop">
            <template v-if="drag">
                <div class="v-file__label">{{ multiple ? $t('Перетащите файлы сюда') : $t('Перетащите файл сюда') }}&nbsp;<i class="fa fa-arrow-down" /></div>
            </template>
            <template v-else>
                <template v-if="selected">
                    <div class="v-file__label">{{ selected }}</div>
                </template>
                <template v-else>
                    <div class="v-file__label">{{ label ? label : $t('Выберите файл') }}</div>
                    <div v-if="accept" class="v-file__accept">{{ accept }}</div>
                </template>
            </template>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'text'
            },

            label: {
                type: String,
                default: ''
            },

            help: {
                type: String,
                default: ''
            },

            placeholder: {
                type: String,
                default: ''
            },

            name: {
                type: String,
                default: ''
            },

            value: {
                validator: () => true
            },

            required: {
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

            accept: {
                type: String,
                default: ''
            },

            multiple: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                drag: false,
                hover: false,
                files: [],
                timeout: 0,
                selected: ''
            }
        },

        watch: {
            value(files) {
                if (files === null) {
                    this.selected = '';
                }
            }
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
                }, '')

                this.$emit('input', [...files]);
            }
        }
    }
</script>

<style lang="stylus">
    .v-file
        position: relative
        overflow: hidden

        &__drop
            padding: 12px
            cursor: pointer
            display: flex
            align-items: center
            justify-content: center
            height: 88px
            transition: all .15s ease-out
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
                box-shadow: inset 0 0 0 4px rgba(#fff, 1), inset 0 0 12px 0 rgba(#fff, 1)

        &:hover &__drop, &--hover &__drop
            &:before
                border-color: #659be0

        &__label
            transition: all .15s ease-out
            font-weight: 600
            color: #777

        &:hover &__label, &--hover &__label
            color: #659be0

        &__input
            cursor: pointer
            opacity: 0
            top: 0
            bottom: 0
            left: 0
            right: 0
            position: absolute
</style>
