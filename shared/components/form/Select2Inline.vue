<template>
    <span class="select-inline">
       <select style="width: 100%;" :style="{ 'width': kpi ? '150px' : '100%' }" class="form-control" ref="input" :multiple="type === 'multiselect'" v-bind="$attrs"></select>
    </span>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: ''
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
                type: [String, Number, Array],
                default: ''
            },

            inline: {
                type: Boolean,
                default: false
            },

            tags: {
                type: Boolean,
                default: false
            },

            options: {
                type: Array,
                default: () => ([])
            },

            required: {
                type: Boolean,
                default: false
            },

            innerContent: {
                type: Boolean,
                default: false
            },

            hint_type: {
                type: String,
                default: 'icon'
            },

            templateResult: {
                type: Function,
                default: null
            },

            targetColor: {
                type: String,
                default: ''
            },

            disabledOptions: {
                type: Array,
                default: () => ([])
            },

            disabledSearch: {
                type: Boolean,
                default: false
            },

            kpi: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                silence: false,
                tagsList: [],
                init: false,
                example: ''
            }
        },

        mounted() {
            this.$nextTick().then(() => {
                this.updateValue();
            })
        },

        methods: {
            updateValue() {
                const $input = $(this.$refs.input);

                if (!this.init) {
                    $input.html('');
                } else {
                    this.init = true;
                    $input.off().select2('destroy').html('');
                }

                this.example = '';
                let selectedItems = [];

                if (this.tags) {
                    const items = this.value !== null ? this.value : [];

                    for (const item of items) {
                        $input.append('<option selected="selected">' + item + '</option>')
                    }
                } else {
                    const items = this.options !== null ? this.options : [];
                    selectedItems = items;

                    if (this.placeholder) {
                        $input.append($('<option></option>'));
                    }

                    for (const item of items) {
                        const text = item.text ? item.text : item.value;
                        const option = $('<option>' + text + '</option>');

                        if (item.value !== null) {
                            option.val(item.value);

                            if (this.value !== null) {
                                if (this.type === 'multiselect') {
                                    if (this.value.includes(item.value.toString())) {
                                        option.attr('selected', 'selected');
                                    }
                                } else {
                                    if (item.value.toString() === this.value.toString()) {
                                        option.attr('selected', 'selected');
                                    }
                                }
                            }

                            if (this.disabledOptions.includes(item.value)) {
                                option.attr('disabled', 'disabled');
                            }
                        }

                        $input.append(option)
                    }
                }

                const selectedItem = selectedItems.find((item) => item.value == $input.val());

                if (selectedItem) {
                    if (selectedItem.example) {
                        this.example = selectedItem.example;
                    }
                }

                setTimeout(() => {
                    const props = {};

                    if (typeof this.templateResult === 'function') {
                        props.templateResult = this.templateResult;
                    }

                    if (this.disabledSearch) {
                        props.minimumResultsForSearch = -1;
                    }

                    if (this.kpi) {
                        props.theme = 'default kpi-color-options';
                    }

                    $input
                        .select2({
                            placeholder: this.$t(this.placeholder),
                            tags: this.tags,
                            ...props
                        })
                        .off()
                        .on("change", () => {
                            this.$emit('input', $input.val());
                            this.$emit('change', $input.val());
                        });

                    if (this.kpi) {
                        this.$nextTick().then(() => {
                            $input.parent().find('.select2-selection__rendered').css('background-color', this.targetColor);

                            if (!this.targetColor) {
                                $input.parent().find('.select2-selection__rendered').addClass('select2-selection__rendered--default');
                            }
                        });
                    }
                }, 0);
            },

            compareArrays(first, second){
                return first.every((e)=> second.includes(e)) && second.every((e)=> first.includes(e));
            }
        },

        watch: {
            value(value) {
                this.updateValue();
            },

            targetColor(color) {
                console.log('color', color);
            }
        }
    }
</script>

<style>
    .form-horizontal .control-label.text-left {
        text-align: left!important;
    }

    .form-group-wrap {
        display: flex;
        align-items: center;
    }

    .select-inline {
        width: 100%;
    }
</style>
