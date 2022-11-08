<template>
	<div class="note note-info">
		<h4>
			{{ label }}
			<span class="badge badge-info pull-right">{{ $t('Премиум функция') }}</span>
			<span class="margin-left-5">
                <input
	                ref="input"
	                type="checkbox"
	                :name="name"
	                class="switch skip_uniform"
	                autocomplete="off"
	                v-model="localValue"
	                v-bind="$attrs"
                >
            </span>
		</h4>
		<template v-if="help">
			<span class="help-block" v-html="help"></span>
		</template>
		<transition name="fade">
			<div v-if="localValue">
				<slot></slot>
			</div>
		</transition>
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
				type: Boolean,
				default: false
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
				$(this.$refs.input).bootstrapSwitch().on('switchChange.bootstrapSwitch', (event, data) => {
					this.localValue = data;
					this.$emit('input', this.localValue);
				});
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
	.fade-enter-active, .fade-leave-active
		transition: opacity .3s

	.fade-enter, .fade-leave-to
		opacity: 0
</style>
