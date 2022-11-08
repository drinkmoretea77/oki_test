<template>
	<div class="form-group">
		<div class="control-label col-md-3">
			{{ label }}
			<span v-if="required" class="required" aria-required="true"> * </span>
		</div>
		<div class="col-md-9">
			<v-editor-inline @input="$emit('input', $event)" :placeholder="placeholder" :value="value" />
			<template v-if="help">
				<span v-if="hint_type === 'block'" class="help-block" v-html="help"></span>
				<i v-else class="fa fa-question-circle help-icon" :title="help" data-html="true"> </i>
			</template>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
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
             * Placeholder - может быть HTML
             */
			placeholder: {
				type: String,
				default: ''
			},

            /**
             * Значение
             */
			value: {
				type: String,
				default: ''
			},

            /**
             * Обязательное поле
             */
			required: {
				type: Boolean,
				default: false
			},

            /**
             * Вид подсказки: icon, block
             */
			hint_type: {
				type: String,
				default: 'icon'
			}
		},
	}
</script>