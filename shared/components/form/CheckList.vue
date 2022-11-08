<template>
	<div class="form-group">
		<div class="col-md-3 control-label">
			{{ label }}
		</div>
		<div ref="list" class="col-md-9 checkbox-list" :class="{ 'checkbox-list--cols': cols }">
			<label v-for="option in options" class="checkbox-list-option" :key="option.value">
				<input
					type="checkbox"
					:name="name"
					autocomplete="off"
					:value="option.value"
					v-model="localValue"
					v-bind="$attrs"
				>
				{{ option.text }}
			</label>
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

			label: {
				type: String,
				default: ''
			},

			cols: {
				type: Boolean,
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
				type: Array,
				default: () => ([])
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

		created() {
			this.localValue = this.value;
			this.$nextTick().then(() => {
				$(this.$refs.list).find('[type="checkbox"]').uniform();
			})
		},

		watch: {
			value() {
				this.localValue = this.value;
			},

			localValue() {
				this.$emit('input', this.localValue);
			}
		}
	}
</script>

<style>
	.checkbox-list--cols {
		display: flex;
		flex-wrap: wrap;
		max-width: 475px;
		padding-top: 8px;
	}

	.checkbox-list--cols .checkbox-list-option {
		padding-right: 20px;
		flex-basis: 50%;
		max-width: 50%;
		margin-right: 0!important;
	}
</style>
