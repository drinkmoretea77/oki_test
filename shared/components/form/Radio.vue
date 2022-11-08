<template>
	<div class="form-group">
		<label v-if="label" class="col-md-3 control-label" :class="{ 'control-label--inline': inline }">{{ label }}</label>
		<div ref="list" class="radio-toggle"
             :class="{
		    'col-md-9': (!fullSize),
		    'col-md-offset-3': (!label && !fullSize),
		}">
			<div class="radio-list" :class="{ 'radio-list--inline': inline, 'radio-list--cols': cols }">
				<label v-for="option in options" class="radio-list-option" :key="option.value">
					<input
						type="radio"
						:name="name"
						autocomplete="off"
						:value="option.value"
                        :disabled="option.disabled"
						v-model="localValue"
						v-bind="$attrs"
					>
					<span class="radio-list-text">
						{{ option.text }}
					</span>
					<div v-if="option.help" class="radio-help" v-html="option.help" />
				</label>
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
			type: {
				type: String,
				default: ''
			},

            inline: {
                type: Boolean,
                default: false
            },

			cols: {
				type: Boolean,
				default: false
			},

			label: {
				type: String,
				default: ''
			},

            fullSize: {
                type: Boolean,
                default: false
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
				type: [String, Number],
				default: ''
			},

			options: {
				type: Array,
				default: () => ([])
			},
			required: {
				type: Boolean,
				default: false
			},

			hint_type: {
				type: String,
				default: 'icon'
			}
		},

		data() {
			return {
				localValue: null
			}
		},

		mounted() {
			this.localValue = this.value;
			this.$nextTick(() => {
				setTimeout(() => {
                    $(this.$refs.list).find('input[type="radio"]').uniform();
                }, 30);
			});
		},

		watch: {
			value() {
				this.localValue = this.value;
				this.$nextTick(() => {
					$(this.$refs.list).find('input[type="radio"]').uniform();
				});
			},

			localValue() {
				this.$emit('input', this.localValue);
			}
		}
	}
</script>

<style>
	.radio-help {
		font-size: 12px;
		color: #555;
		padding-left: 27px;
		max-width: 475px;
		margin-bottom: 8px;
	}
	.radio-list-option {
		cursor: pointer;
	}
	.radio-list-help {
		display: inline-flex;
		vertical-align: middle;
		margin-left: 4px;
		width: 20px;
		height: 20px;
		background-color: #659be0;
		color: #fff;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
	}

	.radio-list {
		cursor: pointer;
	}

	.radio-list div.radio span.checked {
		background-position: -72px -280px!important;
	}

    .radio-list-option {
		padding-top: 7px;
    }

    .radio-list--inline {
        display: flex;
        flex-wrap: wrap;
    }

	.radio-list--cols {
		margin-top: 7px;
		display: flex;
		flex-wrap: wrap;
		margin-left: -10px;
		margin-right: -10px;
		max-width: 475px;
	}

	.radio-list--cols .radio-list-option {
		padding: 0 10px;
		flex-basis: 50%;
		max-width: 50%;
		margin-right: 0!important;
	}

    .radio-list>label {
        margin-right: 20px;
    }
</style>
