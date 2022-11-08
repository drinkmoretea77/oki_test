<template>
	<div class="form-group form-group-select" :class="[ { 'has-error': errors.length }]">
		<div v-if="!skip_label" class="control-label" :class="[ innerContent ? 'col-md-6' : 'col-md-3', innerContent ? 'text-left' : '' ]">
			{{ label }}
			<span v-if="required" class="required" aria-required="true"> * </span>
		</div>
		<div :class="[ skip_label ? 'col-md-12' : innerContent ? 'col-md-6' : 'col-md-9' ]">
			<div class="form-group-wrap">
				<slot></slot>
				<select style="width: 100%;" class="form-control" ref="input" :multiple="type === 'multiselect'" v-bind="$attrs"></select>
			</div>
            <div v-for="error in errors" class="help-block validator-message">{{ error }}</div>
            <div v-if="example" class="hint-block validator-message">{{ example }}</div>
			<template v-if="help">
				<span v-if="hint_type === 'block'" class="help-block" v-html="help" />
				<i v-else class="fa fa-question-circle help-icon" v-tooltip="help" />
			</template>
		</div>
	</div>
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

			disabledOptions: {
				type: Array,
				default: () => ([])
			},

            templateResult: {
			    type: Function,
                default: null
            },

            errors: {
                type: Array,
                default: () => ([])
            },

            skip_label: {
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
			});
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
					let items = this.value !== null ? (Array.isArray(this.value) ? this.value : [this.value]) : [];

					for (const item of items) {
						$input.append('<option selected="selected">' + item + '</option>')
					}
				} else {
					const items = this.options !== null ? this.options : [];
                    selectedItems = items;

					for (const item of items) {
						let text = item.text ? item.text : item.value;
                        text = new Option(text).innerHTML;
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

    .hint-block {
        display: block;
        margin-top: 5px;
        margin-bottom: 10px;
        color: #737373;
    }

	.form-group-select select {
        display: none;
    }
</style>
