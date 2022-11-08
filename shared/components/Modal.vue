<template>
	<div ref="modal" class="modal fade" @click.self="close()">
		<div class="modal-dialog" :class="[ small ? 'modal-small' : '', xs ? 'modal-sm' : '', !small && !xs ? 'modal-lg' : '' ]">
			<div class="modal-content">
				<v-content-spinner :space="false" :load="load" />
				<div class="modal-header">
					<button v-if="!freeze" @click="close()" type="button" class="close" aria-hidden="true">&times;</button>
					<slot name="header"></slot>
				</div>
				<div class="modal-body">
					<slot name="body"></slot>
				</div>
				<div v-if="footer" class="modal-footer" :class="{ 'modal-footer--no-border': !footerBorder }">
					<slot name="footer"></slot>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		props: {
			open: {
				type: Boolean,
				default: false
			},

			load: {
				type: Boolean,
				default: false
			},

			small: {
				type: Boolean,
				default: false
			},

			footerBorder: {
				type: Boolean,
				default: true
			},

			xs: {
				type: Boolean,
				default: false
			},

            freeze: {
			    type: Boolean,
                default: false
            },

            footer: {
                type: Boolean,
                default: true
            },
		},

		mounted() {
			$(this.$refs.modal).on('show.bs.modal', () => {
				this.$nextTick().then(() => {
					this.$emit('show');
				});
			});

			$(this.$refs.modal).on('hide.bs.modal', () => {
				this.$nextTick().then(() => {
					this.$emit('close');
				});
			});

			$(this.$refs.modal).on('hidden.bs.modal', () => {
				this.$nextTick().then(() => {
					this.$emit('close');
				});
			});

			$(document).keyup(event => {
				if (event.key === "Escape") {

					this.$nextTick().then(() => {
						if (this.open) {
							this.$emit('close');
						}
					});
				}
			});

			if (this.open || this.freeze) {
                $(this.$refs.modal).modal('show');
                this.$emit('show');
            }
		},

		methods: {
			show() {
				$(this.$refs.modal).modal('show');
				this.$emit('show');
			},

			close() {
			    if (this.freeze) return;

				$(this.$refs.modal).modal('hide');
				this.$emit('close');
			},

			getScrollbarWidth() {
				let outer = document.createElement("div");
				outer.style.visibility = "hidden";
				outer.style.width = "100px";
				outer.style.msOverflowStyle = "scrollbar"; // needed for WinJS apps

				document.body.appendChild(outer);

				let widthNoScroll = outer.offsetWidth;
				outer.style.overflow = "scroll";

				let inner = document.createElement("div");
				inner.style.width = "100%";
				outer.appendChild(inner);

				let widthWithScroll = inner.offsetWidth;

				outer.parentNode.removeChild(outer);

				return widthNoScroll - widthWithScroll;
			}
		},

		watch: {
			open() {
				if (this.open) {
					this.show();
					document.body.style.setProperty("padding-right", this.getScrollbarWidth() + 'px', "important");
				} else {
					this.close();
					setTimeout(() => {
						document.body.style.setProperty("padding-right", '0px', "important");
					}, 450)
				}
			}
		}
	}
</script>

<style lang="stylus">
	.modal .modal-footer
		border-top: 1px solid #EFEFEF!important

	.modal .modal-footer.modal-footer--no-border
		border-top: none!important
		padding-top: 0!important
		margin-top: -15px

	.modal .tabbable-custom > .tab-content
		padding: 15px 10px

	.modal .modal-dialog
		overflow: visible!important

	.modal .modal-body
		overflow: visible!important

	body.modal-open
		overflow-y: hidden!important

	body .modal-overflow.modal.fade.in
		top: 0%!important
</style>
