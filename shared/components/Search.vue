<template>
	<div>
		<div class="search-input" :class="[{ 'not-empty': !empty }]">
			<input
				ref="input"
				v-model="value"
				@keyup.enter.exact="submit(true)"
				@keyup.esc.exact="clear()"
				type="text"
				class="form-control input-medium"
				:placeholder="placeholder"
			>
			<i class="clear fa fa-times" @click="clear()"></i>
			<i class="search fa fa-search"></i>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			// Placeholder для поля
			placeholder: {
				type: String,
				default: ''
			}
		},

		data() {
			return {
				// Значение поля
				value: '',

				// Пустое ли поле
				empty: true,

				// setTimeout отправки запроса
				timeout: 0
			}
		},

		mounted() {
			this.$nextTick(() => {
				this.$refs.input.focus();
			})
		},

		methods: {
			/**
			 * Отправка запроса
			 * @param {Boolean} force
			 * @param {Event} event
			 * @return {void}
			 */
			submit(force = false) {
				clearTimeout(this.timeout);
				const request = this.value.trim();

				if (request !== '') {
					this.empty = false;

					// Если отправка после нажатия Enter'a, то отправляем без задержки
					if (force) {
						this.$emit('submit', request.toLocaleLowerCase());
					} else {
						this.timeout = setTimeout(() => {
							this.$emit('submit', request.toLocaleLowerCase());
						}, 400)
					}

				} else {
					this.empty = true;
					this.$emit('submit', '');
				}
			},

			/**
			 * Очистка запроса
			 * @return {void}
			 */
			clear() {
				this.value = '';
			}
		},

		watch: {
			/**
			 * Подписка на изменение значения
			 * @return {void}
			 */
			value() {
				this.submit();
			}
		}
	}
</script>

<style lang="stylus" scoped>
	.search-input
		display: inline-block
		position: relative

		.clear
			cursor: pointer
			position: absolute
			right: 12px
			top: 50%
			color: #abb6c4
			font-size: 18px
			transition: opacity .15s ease-out, transform .15s ease-out
			opacity: 0
			transform: scale(0) translateY(-50%)
			transform-origin: center top

		.search
			position: absolute
			right: 12px
			top: 50%
			transform translateY(-50%)
			color: #abb6c4
			transition: opacity .15s ease-out, transform .15s ease-out
			transform-origin: center top
			pointer-events: none

		&.not-empty
			.clear
				opacity: 1
				transform: scale(1) translateY(-50%)

			.search
				opacity: 0
				transform: scale(0) translateY(-50%)
</style>
