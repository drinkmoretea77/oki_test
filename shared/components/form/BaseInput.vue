<template>
	<span class="form-group">
        <input
            :type="type"
            :placeholder="placeholder"
            :name="name"
            :value="value"
            @input="$emit('input', $event.target.value)"
            class="form-control"
            v-bind="$attrs"
        >
	</span>
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
				type: [String, Number],
				default: ''
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
			}
		},

		data() {
			return {

			}
		},

		created() {

		},

		mounted() {

		},
	}
</script>

<style lang="stylus">
	.form-horizontal .control-label.text-left
		text-align: left

	.form-group-slot
		display: flex
		.form-control
			margin-left: 15px
</style>
