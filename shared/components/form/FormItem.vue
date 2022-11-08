<template>
	<v-validate :rules="rules" :dirty="dirty" v-slot="{ v}">
        <div class="form-group" :class="[ { 'has-error': v.errors.length || errors.length }]">
            <div class="control-label" :class="[ fullLabel ? 'col-md-6' : 'col-md-3', fullLabel ? 'text-left' : '']">
                <span v-html="label"></span>
                <span v-if="required" class="required" aria-required="true"> * </span>
            </div>
            <div :class="[ fullLabel ? 'col-md-6' : 'col-md-9']">
                <div :class="{ 'form-group-slot': fullLabel }">
                    <slot></slot>
                    <div v-for="error in [...v.errors, ...errors]" class="help-block validator-message">{{ error }}</div>
                </div>
                <template v-if="help">
                    <span v-if="hint_type === 'block'" class="help-block" v-html="help"></span>
                    <i v-else class="fa fa-question-circle help-icon" v-tooltip="help" />
                </template>
            </div>
        </div>
	</v-validate>
</template>

<script>
	export default {
		props: {
			label: {
				type: String,
				default: ''
			},

			help: {
				type: String,
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
			},

            dirty: {
                type: Boolean,
                default: false
            },

            rules: {
			    type: String,
                default: ''
            },

            errors: {
			    type: Array,
                default: () => ([])
            },
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
