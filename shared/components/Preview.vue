<template>
    <div class="preview" @click="stopEvents">
        <div class="preview__wrapper" @click="toggle">
            <slot />
        </div>
        <div ref="box" class="preview__box" @click="toggle">
            <div v-if="title" class="preview__title">{{ title }}</div>
            <div class="preview__close">
                <i class="fa fa-remove"></i>
            </div>
            <div ref="image" class="preview__box-wrap">
                <img v-if="url" :src="url">
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import anime from 'animejs';

    export default Vue.extend({
        props: {
            url: {
                type: String,
                default: ''
            },

            title: {
                type: String,
                default: ''
            },

            value: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
            }
        },

        watch: {
            value(status) {
                if (status) {
                    this.show()
                } else {
                    this.close()
                }
            }
        },

        methods: {
            stopEvents(event: any) {
                event.stopPropagation();
                event.preventDefault();
            },

            toggle() {
                if (this.value) {
                    this.$emit('input', false);
                } else {
                    this.$emit('input', true);
                }
            },

            show() {
                const box: any = this.$refs.box;
                box.style.display = 'block';
                const image: any = this.$refs.image;

                this.$nextTick().then(() => {
                    anime({
                        targets: box,
                        opacity: [0, 1],
                        easing: 'linear',
                        duration: 150,
                    });

                    anime({
                        targets: image,
                        scale: [0.7, 1],
                        duration: 150,
                        easing: 'cubicBezier(0.175, 0.885, 0.32, 1.275)'
                    });
                })
            },

            close() {
                const box: any = this.$refs.box;
                const image: any = this.$refs.image;

                this.$nextTick().then(() => {
                    anime({
                        targets: image,
                        scale: [1, 0.7],
                        easing: 'linear',
                        duration: 150,
                    });

                    anime({
                        targets: box,
                        opacity: [1, 0],
                        easing: 'linear',
                        duration: 150,
                        changeComplete: () => {
                            box.style.display = 'none';
                        }
                    });
                })
            }
        }
    })
</script>

<style lang="stylus">
    .preview
        &__title
            position: absolute
            bottom: 0
            left: 0
            right: 0
            padding: 10px
            background-color: rgba(#000, .4)
            color: #fff
            text-align: center

        &__close
            position: absolute
            right: 15px
            top: 15px
            font-size: 18px
            color: #fff
            line-height: 1
            cursor: pointer

        &__box
            position: fixed
            top: 0
            bottom: 0
            left: 0
            right: 0
            z-index: 9999
            display: none
            background-color: rgba(#000, .3)

            &-wrap
                position: absolute
                top: 0
                bottom: 0
                left: 0
                right: 0
                padding: 30px
                overflow: hidden
                text-align: center
                white-space: nowrap

                &:before
                    content: ''
                    height: 100%
                    display: inline-block
                    vertical-align: middle
                    width: 1px

                img
                    display: inline-block
                    vertical-align: middle
                    border-radius: 4px
                    box-shadow: -2px 2px 16px 0 rgba(#000, .1)
                    border: 2px solid #fff
                    max-width: 100%
                    width: auto
                    height: auto
                    max-height: 100%

        &__wrapper
            cursor: pointer
</style>
