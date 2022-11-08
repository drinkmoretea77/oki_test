<script>
	export default {
		data() {
			return {
				loading: false,
				show: false,
				timeout: 0
			}
		},

		methods: {
			start() {
				this.loading = true;
			},

			finish() {
				this.loading = false;
			}
		},

		watch: {
			loading(load) {
				clearTimeout(this.timeout);
				if (load) {
					this.timeout = setTimeout(() => {
						this.show = true;

						let check = setInterval(() => {
							if (!this.loading) {
								clearInterval(check);
								this.show = false
							}
						}, 2000)
					}, 200)
				}
			}
		}
	}
</script>

<template>
	<div class="loading" :class="[ show ? 'loading--show' : '' ]">
		<div class="loading__wrapper">
			<div class="loading__line"></div>
		</div>
	</div>
</template>

<style>
	@keyframes loading-line {
		0% {
			width: 0%;
		}
		50% {
			width: 100%;
			left: 0%;
		}
		100% {
			left: 100%;
			width: 100%;
		}
	}

	.loading {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 9999;
		pointer-events: none;
		transition: all .15s ease-out;
		display: none;
	}

	.loading--show {
		 display: block;
	}

	.loading__line {
		 border-radius: 3px;
		 position: absolute;
		 top: 0;
		 left: 0;
		 width: 0%;
		 height: 3px;
		 background-color: #659be0;
		 animation: loading-line 1s ease-in-out infinite;
	 }
</style>
