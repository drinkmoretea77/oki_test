<template>
    <div class="v-editor">
        <div class="v-editor__wrapper" ref="wrapper">
            <client-only>
                <vue-editor ref="editor" :editor-options="editorOptions" :value="value" @input="input" />
                <div v-show="iframeTooltip.show" @blur="tooltipBlur" class="v-editor__tooltip" :style="{ 'left': `${iframeTooltip.left}px`, 'top': `${iframeTooltip.top}px` }">
                    <div class="v-editor__tooltip-row">
                        <div class="v-editor__tooltip-col">
                            <input
                                ref="iframeUrl"
                                class="v-editor__tooltip-input v-editor__tooltip-input--big"
                                type="text"
                                :placeholder="$t('Ссылка')"
                                v-model="iframeTooltip.urlValue"
                            >
                        </div>
                        <div class="v-editor__tooltip-col">
                            <input class="v-editor__tooltip-input" type="text" :placeholder="$t('Ширина')" v-model="iframeTooltip.widthValue">
                        </div>
                        <div class="v-editor__tooltip-col">
                            <input class="v-editor__tooltip-input" type="text" :placeholder="$t('Высота')" v-model="iframeTooltip.heightValue">
                        </div>
                        <div class="v-editor__tooltip-col">
                            <div v-if="is_only_one_iframe && is_exists_iframe" class="v-editor__tooltip-save" @click="tooltipEdit">{{ $t('Изменить') }}</div>
                            <div v-else class="v-editor__tooltip-save" @click="tooltipSave">{{ $t('Добавить') }}</div>
                        </div>
                        <div class="v-editor__tooltip-col">
                            <div class="v-editor__tooltip-save" @click="tooltipBlur">{{ $t('Отмена') }}</div>
                        </div>
                    </div>
                </div>
            </client-only>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            help: {
                type: String,
                default: ''
            },

            placeholder: {
                type: String,
                default: ''
            },

            value: {
                type: String,
                default: ''
            },

            height: {
                type: Number,
                default: 500
            },

            disabled: {
                type: Boolean,
                default: false
            },

            is_iframe: {
                type: Boolean,
                default: true
            },

            is_only_one_iframe: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                ready: false,
                editorOptions: {
                    modules: {
                        toolbar: {
                            container: [
                                [
                                    {
                                        header: [false, 1, 2, 3, 4, 5, 6]
                                    }
                                ],
                                ["bold", "italic", "underline", "strike", "clean"],
                                [
                                    {
                                        align: ""
                                    },
                                    {
                                        align: "center"
                                    },
                                    {
                                        align: "right"
                                    },
                                    {
                                        align: "justify"
                                    }
                                ],
                                ["blockquote"],
                                [
                                    {
                                        list: "ordered"
                                    },
                                    {
                                        list: "bullet"
                                    },
                                    {
                                        list: "check"
                                    }
                                ],
                                [
                                    {
                                        indent: "-1"
                                    },
                                    {
                                        indent: "+1"
                                    }
                                ],
                                [
                                    {
                                        color: []
                                    },
                                    {
                                        background: []
                                    }
                                ],
                                ["link", "image", "video"],
                                this.getAddedButtons()
                            ],

                            handlers: {
                                'insert-iframe': this.iframe,
                                'clear-all': this.clearAll,
                            }
                        }
                    }
                },
                client: false,
                editor: null,
                focus: false,
                timer: 0,
                elementPlaceholder: null,
                is_exists_iframe: false,
                iframeTooltip: {
                    show: false,
                    urlValue: '',
                    heightValue: '',
                    widthValue: '',
                    cursor: 0,
                    top: 0,
                    left: 0
                },
                emptyTags: ['<div><br></div>', '<div></div>']
            }
        },

        watch: {
            value() {
                this.updateIFrame();
                this.updatePlaceholder();
            }
        },

        mounted() {
            this.$nextTick().then(() => {
               setTimeout(() => {
                   this.updateToolbar();
                   this.initPlaceholder();
               }, 100);
            });
        },

        methods: {
            getAddedButtons() {
                let result = [
                    {
                        "clear-all": this.$t('Очистить всё')
                    }
                ];

                if (this.is_iframe) {
                    result.unshift({
                         "insert-iframe": '&lt;iframe&gt;'
                     });
                }

                return result;
            },

            initPlaceholder() {
                const editor = this.$refs?.editor;

                if (editor.quill) {
                    const wrapper = editor.$el.querySelector('.ql-container');
                    const placeholder = document.createElement('div');
                    placeholder.classList.add('v-editor__placeholder');
                    placeholder.innerHTML = this.placeholder;
                    wrapper.appendChild(placeholder);
                    this.elementPlaceholder = placeholder;
                }

                this.updatePlaceholder();
            },

            updatePlaceholder() {
                if (!this.elementPlaceholder) return

                let tmp = this.value;

                if (this.emptyTags.includes(tmp) || this.value === null) {
                    tmp = '';
                }

                if (tmp === '') {
                    this.elementPlaceholder.style.display = 'block';
                } else {
                    this.elementPlaceholder.style.display = 'none';
                }
            },

            updateIFrame() {
                if (!this.is_only_one_iframe) {
                    return;
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(this.value, "text/html");
                const iframe = doc.querySelector('iframe');

                if (!iframe) {
                    this.iframeTooltip.urlValue = '';
                    this.iframeTooltip.heightValue = '';
                    this.iframeTooltip.widthValue = '';

                    return;
                }

                this.iframeTooltip.urlValue = iframe.getAttribute('src');
                this.iframeTooltip.heightValue = iframe.getAttribute('height');
                this.iframeTooltip.widthValue = iframe.getAttribute('width');
            },

            input(value) {
                let tmp = value;

                if (this.emptyTags.includes(tmp) || this.value === null) {
                    tmp = '';
                }

                this.$emit('input', tmp);
                this.updateToolbar();
            },

            async updateToolbar() {
                await this.$nextTick()
                const wrapper = this.$refs?.wrapper;
                if (wrapper) {
                    const buttons = wrapper.querySelectorAll('button.ql-clear-all');
                    buttons.forEach((button) => {
                        if (this.value === '') {
                            button.innerHTML = '';
                        } else {
                            button.innerHTML = button.value;
                        }
                    });

                    const insertButtons = wrapper.querySelectorAll('button.ql-insert-iframe');
                    insertButtons.forEach((button) => {
                        button.innerHTML = button.value;
                    });
                }
            },

            async iframe() {
                if (this.iframeTooltip.show) {
                    this.iframeTooltip.show = false;
                    return;
                }

                const editor = this.$refs?.editor?.quill;
                if (editor) {
                    const toolbar = this.$el.querySelector('.ql-toolbar');
                    const range = editor.getSelection();
                    const position = editor.getBounds(range.index);
                    const offsetHeight = 15 + 38

                    this.iframeTooltip.top = toolbar.offsetHeight + position.top + offsetHeight;
                    this.iframeTooltip.left = position.left;
                    this.is_exists_iframe = this.hasIframe();
                    this.iframeTooltip.show = true;
                    this.iframeTooltip.cursor = range.index;

                    await this.$nextTick();
                    this.$refs.iframeUrl.focus();
                }
            },

            hasIframe() {
                const parser = new DOMParser();
                const doc = parser.parseFromString(this.value, "text/html");
                const iframe = doc.querySelector('iframe');

                return !!iframe;
            },

            tooltipSave() {
                const editor = this.$refs?.editor?.quill;
                if (editor) {
                    editor.insertEmbed(this.iframeTooltip.cursor, 'ins-iframe', {
                        url: this.iframeTooltip.urlValue,
                        width: this.iframeTooltip.widthValue,
                        height: this.iframeTooltip.heightValue
                    });

                    this.iframeTooltip.show = false;
                    this.iframeTooltip.urlValue = '';
                    this.iframeTooltip.heightValue = '';
                    this.iframeTooltip.widthValue = '';
                }
            },

            tooltipEdit() {
                const editor = this.$refs?.editor?.quill;
                if (!editor) {
                    return;
                }

                const parser = new DOMParser();
                const doc = parser.parseFromString(this.value, "text/html");
                const iframe = doc.querySelector('iframe');

                if (!iframe) {
                    return;
                }

                iframe.setAttribute('src', this.iframeTooltip.urlValue);
                iframe.setAttribute('height', this.iframeTooltip.heightValue)
                iframe.setAttribute('width', this.iframeTooltip.widthValue)

                editor.root.innerHTML = doc.body.innerHTML;
                this.$nextTick().then(() => {
                    this.input(doc.body.innerHTML);
                    this.iframeTooltip.show = false;
                });
            },

            tooltipBlur() {
                this.iframeTooltip.show = false;
            },

            clearAll() {
                const editor = this.$refs?.editor?.quill;
                if (editor) {
                    editor.root.innerHTML = '';

                    this.$nextTick().then(() => {
                        this.input('');
                    });
                }
            }
        },
    }
</script>

<style lang="stylus">
    .v-editor
        &__tooltip
            position: absolute
            transform: translate(-50%, 100%)
            top: 0
            left: 0
            background-color: #fff;
            border: 1px solid #ccc;
            box-shadow: 0 0 5px #ddd;
            color: #444;
            padding: 5px 6px;
            white-space: nowrap;
            &-row
                display: flex
                margin: 0 -3px
            &-col
                padding: 0 3px
            &-save
                padding: 0 6px
                color: #06c
                cursor pointer
                height: 26px
                display: flex
                align-items: center
                justify-content: center
            &-input
                border: 1px solid #ccc;
                font-size: 13px;
                height: 26px;
                margin: 0;
                width: 80px
                padding: 3px 5px;
                &--big
                    width: 170px

        &__placeholder
            pointer-events: none
            user-select: none
            display: none
            padding: 12px 15px
            position: absolute
            top: 0
            left: 0
            max-height: 200px
            overflow: hidden
            font-size: 16px
            opacity: .5

        &__wrapper
            background-color: #fff
    .ql-container
        position: relative

    .ql-clear-all, .ql-insert-iframe
        padding-top: 5px!important
        font-weight: bold
        width: auto!important
</style>
