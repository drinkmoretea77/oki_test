<template>
	<div
		ref="spinner"
		:class="[
		    { 'spinner--hide': hide },
		    { 'spinner--invisible': invisible },
		    { 'spinner--no-space': !space },
		    { 'spinner--full-screen': full_screen }
        ]"
		class="spinner"
	>
		<div class="loading-message">
			<v-load />
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			load: {
				type: Boolean,
				default: false
			},

            space: {
                type: Boolean,
                default: true
            },

            full_screen: {
                type: Boolean,
                default: false
            }
		},
		data: () => ({
			// Задержка для выключения загрузки
			timeout: 0,

			// Стаус отображения спинера
			hide: true,

			// Статус для анимации исчезнования
			invisible: false
		}),

		created() {
			this.$nextTick(() => {
				this.update(this.load);
			})
		},

		methods: {
			/**
			 * Обновления отображения спинера
			 * @param {Boolean} status
			 * @return {void}
			 */
			update(status) {
				if (status) {
					clearTimeout(this.timeout);
					this.hide = false;
					this.$nextTick().then(() => {
						setTimeout(() => {
							this.invisible = false;
						}, 0)
					});
				} else {
					clearTimeout(this.timeout);
					setTimeout(() => {
						this.invisible = true;

						this.timeout = setTimeout(() => {
							this.hide = true;
						}, 300);
					}, 0);
				}
			}
		},
		watch: {
			/**
			 * Подписка на изменение состояния згразуки страницы
			 * @param {Boolean} status
			 * @return {void}
			 */
			load(status) {
				this.update(status)
			}
		}
	}
</script>

<style lang="stylus">
    .modal-dialog
        overflow: hidden

    .page-content, .modal-body
        position: relative

    .spinner--no-space
        top: 0 !important
        bottom: 0 !important

    .spinner--full-screen
        position: fixed !important
        left: 0 !important
        top: 0 !important
        right:0 !important
        bottom:0 !important

    .spinner
        position: absolute
        top: -24px
        bottom: -24px
        left: 0
        right: 0
        background-color: rgba(#fff, .5)
        z-index: 101
        display: flex
        align-items: center
        justify-content: center
        transition: all 0.15s ease-out

        &--hide
            display: none

        &--invisible
            opacity: 0


</style>
