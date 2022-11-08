<template>
    <div
        class="v-drop"
        :class="{
            'v-drop--direction-up': direct === 'up',
            'v-drop--inline': inline,
            'v-drop--open': open,
            'v-drop--theme-default': !clear,
        }"
        @blur="blur"
        tabindex="0"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
    >
        <div ref="toggle" class="v-drop__toggle" @click="open = !open">
            <slot name="toggle" v-bind="{ open, blur }" />
        </div>
        <transition name="v-drop" mode="out-in" @enter="updatePosition">
            <div
                v-if="open"
                ref="content"
                class="v-drop__content"
                :class="{ 'v-drop__content--direction-up': direct === 'up' }"
                :style="{ left: `${left}px`, top: `${top}px` }"
            >
                <div
                    class="v-drop__content-wrap"
                    :style="{ transform: `translateX(${offset}px)` }"
                >
                    <slot v-bind="{ open, blur }" />
                </div>
            </div>
        </transition>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        /**
         * Направление up, down, left, right
         */
        direction: {
            type: String,
            default: 'down',
        },

        /**
         * Выключить стили по умолчанию
         */
        clear: {
            type: Boolean,
            default: false,
        },

        /**
         * Открытие при наведении
         */
        hover: {
            type: Boolean,
            default: false,
        },

        /**
         * Слот toggle будет выводиться display: inline-flex
         */
        inline: {
            type: Boolean,
            default: false,
        },
    },

    data(): any {
        return {
            direct: 'down',
            open: false,
            top: 0,
            left: 0,
            offset: 0,
            hoverTimer: 0,
        };
    },

    watch: {
        open() {
            this.update();
        },
    },

    mounted() {
        this.update();
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.updatePosition);
        window.removeEventListener('scroll', this.updatePosition);
    },

    methods: {
        mouseenter() {
            if (!this.hover) return;
            clearTimeout(this.hoverTimer);
            this.open = true;
            const el: any = this.$el;
            el.focus();
        },

        mouseleave() {
            if (!this.hover) return;
            clearTimeout(this.hoverTimer);
            this.hoverTimer = setTimeout(() => {
                this.open = false;
                const el: any = this.$el;
                el.blur();
            }, 150);
        },

        blur() {
            this.open = false;
        },

        update() {
            if (this.open) {
                window.addEventListener('resize', this.updatePosition);
                window.addEventListener('scroll', this.updatePosition);
                this.$nextTick(() => {
                    this.updatePosition();
                });
            } else {
                window.removeEventListener('resize', this.updatePosition);
                window.removeEventListener('scroll', this.updatePosition);
            }
        },

        updatePosition() {
            const content = this.$refs.content as HTMLElement;
            const toggle = this.$refs.toggle as HTMLElement;
            const position = toggle.getBoundingClientRect();
            const contentPosition = content.getBoundingClientRect();
            const contentWidth = content.offsetWidth / 2 + 12;

            this.left = position.left + position.width / 2;
            this.top = position.bottom;
            this.direct = 'down';

            if (this.direction === 'up') {
                if (contentPosition.height + 16 <= position.top) {
                    this.top = position.top;
                    this.direct = 'up';
                }
            } else {
                if (
                    contentPosition.height + position.top + 180 >=
                    window.outerHeight
                ) {
                    this.top = position.top;
                    this.direct = 'up';
                }
            }

            if (this.left < contentWidth) {
                this.offset = contentWidth - this.left;
            }

            if (this.left + contentWidth > window.innerWidth) {
                this.offset =
                    (this.left + contentWidth - window.innerWidth) * -1;
            }
        },
    },
});
</script>

<style lang="stylus">
.v-drop-enter-active, .v-drop-leave-active
    transition: opacity .15s ease-out, margin .15s ease-out

.v-drop-enter, .v-drop-leave-to
    opacity: 0
    margin-top: 32px!important
    &.v-drop__content--direction-up
        margin-top: -32px!important

.v-drop
    outline: none
    position: relative
    z-index: 3

    &--open
        z-index: 9000

    &--inline
        display: inline-flex

    &--inline &__toggle
        display: inline-flex

    &__toggle
        cursor: pointer
        user-select: none

    &__content
        z-index: 99999
        position: fixed
        transform: translate(-50%, 0)
        margin-top: 16px


    &--theme-default &__content
        &:after
            content: ''
            position: absolute
            left: 50%
            top: 0
            transform: translate(-50%, -50%) rotate(45deg)
            width: 16px
            height: 16px
            background-color: #fff

        &-wrap
            background-color: #fff
            border-radius: 4px
            padding: 12px
            box-shadow: -2px 2px 8px 0 rgba(#000, .1)

    &--direction-up &__content
        transform: translate(-50%, -100%)
        margin-top: -16px
        &:after
            top: 100%
</style>
