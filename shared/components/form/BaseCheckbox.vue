<template>
	<div class="form-group-checkbox form-group-inline">
        <label>
            <input
                ref="input"
                type="checkbox"
                autocomplete="off"
                v-model="localValue"
                v-bind="$attrs"
            >
            {{ label }}
        </label>
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
				type: [Boolean, String, Number, Array],
				default: false
			},

			checked: {
				type: Boolean,
				default: false
			},

			hint_type: {
				type: String,
				default: 'icon'
			},

			inline: {
				type: Boolean,
				default: false
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
				$(this.$refs.input).uniform();
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

<style lang="stylus">
	.form-group-checkbox .fa-question-circle
		top: 2px!important

	.form-group-checkbox .checker
		vertical-align: top
</style>
