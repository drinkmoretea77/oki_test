<template>
    <div class="v-popup">
        <div ref="toggle" class="v-popup__toggle" @click.stop.prevent="toggle">
            <slot name="toggle" v-bind="{ disabled }" />
        </div>
        <portal to="popups" :order="order" slim>
            <transition name="modal-sync">
                <div
                    v-if="open"
                    class="v-popup-block"
                    ref="block"
                    :style="{ top: `${top}px`, left: `${left}px` }"
                >
                    <div class="v-popup-block__wrap">
                        <div
                            class="v-popup-block__header"
                            @mousedown="startDrag"
                        >
                            <div class="v-popup-block__title">
                                {{ title }}
                            </div>
                            <div class="v-popup-block__close" @click="close">
                                <i class="fa fa-close"></i>
                            </div>
                        </div>
                        <div
                            class="v-popup-block__content"
                            :class="{ 'v-popup-block__content--mask': mask }"
                        >
                            <div class="v-popup-block__content-wrap">
                                <div v-show="is_start_drag" class="v-popup-block__content-wrap-drag"></div>
                                <slot name="content" />
                            </div>
                        </div>
                    </div>
                    <div class="v-popup-block__resize">
                        <div
                            class="v-popup-block__resize-left"
                            @mousedown="startDragResize($event, 'left')"
                        ></div>
                        <div
                            class="v-popup-block__resize-bottom"
                            @mousedown="startDragResize($event, 'bottom')"
                        ></div>
                        <div
                            class="v-popup-block__resize-right"
                            @mousedown="startDragResize($event, 'right')"
                        ></div>
                        <div
                            class="v-popup-block__resize-left-bottom"
                            @mousedown="startDragResize($event, 'left-bottom')"
                        ></div>
                        <div
                            class="v-popup-block__resize-right-bottom"
                            @mousedown="startDragResize($event, 'right-bottom')"
                        ></div>
                    </div>
                </div>
            </transition>
        </portal>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Portal } from 'portal-vue';

export default Vue.extend({
    components: {
        Portal,
    },

    props: {
        /**
         * Заголовок
         */
        title: {
            type: String,
            default: '',
        },
        /**
         * Порядок вывода
         */
        order: {
            type: Number,
            default: 0,
        },
        /**
         * Направление up, down, left, right
         */
        direction: {
            type: String,
            default: 'down',
        },
        /**
         * Выключить переключение
         */
        disabled: {
            type: Boolean,
            default: false,
        },
        /**
         * Изменять размер iframe в контенте
         */
        is_iframe_resize: {
            type: Boolean,
            default: false,
        },
    },

    data(): any {
        return {
            mask: false,
            top: 0,
            left: 0,
            open: false,
            shiftX: 0,
            shiftY: 0,
            windowWidth: 0,
            windowHeight: 0,
            maxWidth: 0,
            maxHeight: 0,
            resizeOffsetX: 0,
            resizeOffsetY: 0,
            resizeDirection: '',
            is_start_drag: false,
        };
    },

    watch: {
        open(status) {
            if (status) {
                this.updatePosition();
            }
        },
    },

    mounted() {
        document.addEventListener('mouseup', () => {
            this.stopDragResize();
            this.stopDrag();
        });
    },

    methods: {
        toggle(event: any) {
            this.open = !this.open;
        },

        close() {
            this.open = false;
        },

        async updatePosition() {
            await this.$nextTick();

            const block = this.$refs.block;
            const toggle = this.$refs.toggle;
            if (!block || !toggle) return;

            const togglePosition = toggle.getBoundingClientRect();
            const contentPosition = block.getBoundingClientRect();

            this.windowWidth = window.innerWidth - this.getScrollbarWidth();
            this.windowHeight = window.innerHeight;
            this.maxWidth = contentPosition.width;
            this.maxHeight = contentPosition.height;

            let x =
                togglePosition.left +
                togglePosition.width / 2 -
                contentPosition.width / 2;
            let y = togglePosition.top + togglePosition.height + 12;

            this.moveTo(x, y);
        },

        moveTo(x: number | null, y: number | null) {
            if (x !== null) {
                let left = x - this.shiftX;

                if (left < 0) {
                    left = 0;
                }

                if (left > this.windowWidth - this.maxWidth) {
                    left = this.windowWidth - this.maxWidth;
                }

                this.left = left;
            }

            if (y != null) {
                let top = y - this.shiftY;
                if (top < 0) {
                    top = 0;
                }

                if (top > this.windowHeight - this.maxHeight) {
                    top = this.windowHeight - this.maxHeight;
                }

                this.top = top;
            }
        },

        dragMove(event: any) {
            this.moveTo(event.clientX, event.clientY);
        },

        stopDrag() {
            this.is_start_drag = false;
            document.removeEventListener('mousemove', this.dragMove);
        },

        startDrag(event: any) {
            this.is_start_drag = true;
            const block = this.$refs.block;
            if (!block) return;

            const position = block.getBoundingClientRect();

            this.windowWidth = window.innerWidth - this.getScrollbarWidth();
            this.windowHeight = window.innerHeight;
            this.maxWidth = position.width;
            this.maxHeight = position.height;
            this.shiftX = event.clientX - position.left;
            this.shiftY = event.clientY - position.top;

            document.addEventListener('mousemove', this.dragMove);
        },

        stopDragResize() {
            this.mask = false;
            document.removeEventListener('mousemove', this.dragMoveResize);
        },

        moveToResize(x: number | null, y: number | null) {
            const block = this.$refs.block;
            const position = block.getBoundingClientRect();

            if (x !== null) {
                let left = x - this.shiftX;

                if (left < 0) {
                    left = 0;
                }

                if (left > this.windowWidth - position.width) {
                    left = this.windowWidth - position.width;
                }

                this.left = left;
            }

            if (y != null) {
                let top = y - this.shiftY;
                if (top < 0) {
                    top = 0;
                }

                if (top > this.windowHeight - this.maxHeight) {
                    top = this.windowHeight - this.maxHeight;
                }
                this.top = top;
            }
        },

        dragMoveResize(event: any) {
            const block = this.$refs.block;
            const position = block.getBoundingClientRect();
            const maxWidth = this.maxWidth;
            const maxHeight = this.maxHeight;
            const offsetX = this.resizeOffsetX;
            const offsetY = this.resizeOffsetY;
            const x = event.clientX;
            const y = event.clientY;

            let newWidth = 0;
            let newHeight = 0;

            switch (this.resizeDirection) {
                case 'left':
                    newWidth = maxWidth + (offsetX - x);

                    if (newWidth < 320) {
                        newWidth = 320;
                    } else {
                        this.moveToResize(event.clientX, null);
                    }

                    block.style.width = `${newWidth}px`;
                    break;
                case 'right':
                    newWidth = maxWidth - (offsetX - x);

                    if (position.left + newWidth < this.windowWidth) {
                        block.style.width = `${newWidth}px`;
                    }
                    break;
                case 'bottom':
                    newHeight = maxHeight + (offsetY - event.clientY) * -1;

                    if (newHeight >= 45) {
                        block.style.height = `${newHeight}px`;
                    }
                    break;
                case 'left-bottom':
                    newWidth = maxWidth + (offsetX - x);
                    newHeight = maxHeight + (offsetY - event.clientY) * -1;

                    if (newWidth < 320) {
                        newWidth = 320;
                    } else {
                        this.moveToResize(event.clientX, null);
                    }

                    block.style.width = `${newWidth}px`;

                    if (newHeight >= 45) {
                        block.style.height = `${newHeight}px`;
                    }
                    break;
                case 'right-bottom':
                    newWidth = maxWidth - (offsetX - x);
                    newHeight = maxHeight + (offsetY - event.clientY) * -1;

                    if (position.left + newWidth < this.windowWidth) {
                        block.style.width = `${newWidth}px`;
                    }

                    if (newHeight >= 45) {
                        block.style.height = `${newHeight}px`;
                    }
                    break;
            }

            if (!this.is_iframe_resize) {
                return;
            }

            const iframe = block.querySelector('iframe');
            if (!iframe) {
                return;
            }
            iframe.setAttribute('width', parseInt(block.style.width, 10) - 27);
        },

        startDragResize(event: any, direction: string) {
            const block = this.$refs.block;
            if (!block) return;

            const position = block.getBoundingClientRect();

            this.mask = true;
            this.windowWidth = window.innerWidth - this.getScrollbarWidth();
            this.windowHeight = window.innerHeight;
            this.maxWidth = position.width;
            this.maxHeight = position.height;
            this.shiftX = event.clientX - position.left;
            this.shiftY = event.clientY - position.top;

            this.resizeOffsetX = event.clientX;
            this.resizeOffsetY = event.clientY;
            this.resizeDirection = direction;

            document.addEventListener('mousemove', this.dragMoveResize);
        },

        getScrollbarWidth(): number {
            let outer: any = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.width = '100px';
            outer.style.msOverflowStyle = 'scrollbar';

            document.body.appendChild(outer);

            let widthNoScroll = outer.offsetWidth;
            outer.style.overflow = 'scroll';

            let inner = document.createElement('div');
            inner.style.width = '100%';
            outer.appendChild(inner);

            let widthWithScroll = inner.offsetWidth;

            outer.parentNode.removeChild(outer);

            return widthNoScroll - widthWithScroll;
        },
    },
});
</script>

<style lang="stylus">
.v-popup-block
    position: fixed
    top: 0
    left: 0
    z-index: 99999
    max-height: 100vh
    max-width: 100vw
    min-width: 320px

    &__resize
        user-select: none

        &-left-bottom
            position: absolute
            z-index 5
            bottom: 0
            left: 0
            width 12px
            height 12px
            cursor: nesw-resize

        &-right-bottom
            position: absolute
            z-index 5
            bottom: 0
            right: 0
            width 12px
            height 12px
            cursor: nwse-resize

        &-left
            position: absolute
            z-index 4
            top: 0
            left: 0
            width: 12px
            height: 100%
            cursor: e-resize

        &-right
            position: absolute
            z-index 4
            top: 0
            right: 0
            width: 12px
            height: 100%
            cursor: e-resize

        &-bottom
            position: absolute
            z-index 4
            bottom: 0
            left: 0
            height: 12px
            width: 100%
            cursor: n-resize

    &__wrap
        max-height: 100vh
        overflow: auto
        height: 100%
        background-color: #fff
        border-radius: 4px
        box-shadow: -2px 2px 8px 0 rgba(#000, .1)
        &::-webkit-scrollbar
            width: 4px
            height: 4px

        &::-webkit-scrollbar-track
            background-color: #e0e0e0

        &::-webkit-scrollbar-thumb
            background-color: #bdbdbd

    &__close
        color: #999
        cursor: pointer

    &__title
        margin-right: 8px
        font-weight: bold
        font-size: 14px

    &__content
        display: flex
        padding: 0 12px 12px 12px
        position: relative
        &:after
            content: ''
            position: absolute
            top: 0
            left: 0
            width: 100%
            height: 100%
            z-index: 3
            display: none

        &--mask
            &:after
                display: block
        &-wrap
            width: 100%
            overflow: hidden
        &-wrap-drag
            position: absolute
            width: calc(100% - 24px)
            height: calc(100% - 12px)
    &__header
        position: relative
        z-index: 10
        user-select: none
        padding-top: 12px
        cursor: move
        display: flex
        justify-content: space-between
        padding: 12px

.v-popup
    &__toggle
        cursor: pointer
</style>
