<template>
	<div class="form-group-checkbox" :class="[ inline ? 'form-group-inline' : 'form-group', { 'has-error': errors.length }]">
		<template v-if="inline">
			<v-checkbox-inline
				:type="type"
				:disabled="disabled"
				:label="label"
				:checked="localValue"
				@toggle="localValue = !localValue"
			/>
			<template v-if="help">
				<span v-if="hint_type === 'block'" class="help-block" v-html="help"></span>
				<i v-else class="fa fa-question-circle help-icon check-icon" :title="help" data-html="true"> </i>
			</template>
            <slot name="after"/>
		</template>
		<template v-else>
			<div class="col-md-3 text-align-right">
                <template v-if="type === 'bool'">
                    <span v-html="label"></span>
                </template>
			</div>
			<div class="col-md-9 checkbox-list">
				<label>
					<v-checkbox-inline
						:type="type"
						:disabled="disabled"
						:label="type === 'bool' ? '' : label"
						:checked="localValue"
						@toggle="localValue = !localValue"
					/>
                    <span v-for="error in [...errors]" class="help-block validator-message">{{ error }}</span>
                </label>
				<template v-if="help">
					<span v-if="hint_type === 'block'" class="help-block" v-html="help"></span>
					<i v-else class="fa fa-question-circle help-icon check-icon" v-tooltip="help" />
				</template>
                <slot name="after"/>
			</div>
		</template>
	</div>
</template>

<script>
	export default {
		props: {
            /**
             * Тип поля
             */
			type: {
				type: String,
				default: 'check'
			},

            /**
             * Статус disabled
             */
			disabled: {
				type: Boolean,
				default: false
			},

            /**
             * Название
             */
			label: {
				type: String,
				default: ''
			},

            /**
             * Подсказка
             */
			help: {
				type: String,
				default: ''
			},

            /**
             * Плейсхолдер
             */
			placeholder: {
				type: String,
				default: ''
			},

            /**
             * Название поля ввода
             */
			name: {
				type: String,
				default: ''
			},

            /**
             * Значение
             */
			value: {
				type: [Boolean, String, Number],
				default: false
			},

            /**
             * Статус checked, для типа checkbox
             */
			checked: {
				type: Boolean,
				default: false
			},

            /**
             * Вид для вывода подсказки: block, icon
             */
			hint_type: {
				type: String,
				default: 'icon'
			},

            /**
             * Выводить без колонок
             */
			inline: {
				type: Boolean,
				default: false
			},

            /**
             * Список ошибок
             */
            errors: {
                type: Array,
                default: () => ([])
            },
		},

		data() {
			return {
				localValue: null
			}
		},

		created() {
			this.localValue = this.value;
		},

		watch: {
			value() {
				this.localValue = this.value;
			},

			localValue() {
				this.$emit('input', this.localValue);
				this.$emit('change', this.localValue);
			}
		}
	}
</script>

<style lang="stylus">
	.form-group-checkbox .fa-question-circle.check-icon
		top: 4px!important

	.form-group-checkbox .checker
		vertical-align: top
</style>
