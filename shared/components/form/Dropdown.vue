<template>
    <div
        class="dropdown"
        @mouseleave="leave"
        :class="{
            'dropdown--open': open,
            'dropdown--inline': inline,
            'dropdown--hide-close': hideClose,
            'dropdown--select': select,
        }"
    >
        <div
            @click="toggle"
            @mouseenter="enter"
            class="dropdown__toggle"
            ref="toggle"
            v-tooltip="tooltip"
        >
            <slot name="toggle" v-bind="{ toggle, open, tab }" />
        </div>
        <div ref="wrapper" class="dropdown__content" @click.stop="onContent">
            <div
                ref="space"
                class="dropdown__content-space"
                :class="{ 'dropdown__content-space--no-space': noSpace }"
            >
                <div
                    ref="content"
                    class="dropdown__content-wrap"
                    :class="{
                        'dropdown__content-wrap--no-space': noSpace || select,
                    }"
                >
                    <div
                        v-if="!hideClose && !select"
                        class="dropdown__content-close"
                        @click="toggle"
                    >
                        <i class="fa fa-close"></i>
                    </div>
                    <slot v-if="open" v-bind="{ toggle, open, tab }" />
                    <div
                        v-if="Array.isArray(options) && options.length"
                        class="dropdown__select"
                    >
                        <div
                            v-for="option in options"
                            class="dropdown__select-item"
                            :class="{
                                'dropdown__select-item--active':
                                    option.value.toString() ===
                                    value.toString(),
                            }"
                            @click="selectValue(option)"
                        >
                            {{ option.text || option.value }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import anime from 'animejs';

export default Vue.extend({
    props: {
        tooltip: {
            type: String,
            default: '',
        },

        direction: {
            type: String,
            default: 'bottom',
        },

        width: {
            type: String,
            default: '300',
        },

        minWidth: {
            type: String,
            default: '',
        },

        clickOutsideDisable: {
            type: Boolean,
            default: false,
        },

        inline: {
            type: Boolean,
            default: false,
        },

        onHover: {
            type: Boolean,
            default: false,
        },

        hideClose: {
            type: Boolean,
            default: false,
        },

        noSpace: {
            type: Boolean,
            default: false,
        },

        select: {
            type: Boolean,
            default: false,
        },

        value: {
            type: [String, Number],
            default: '',
        },

        options: {
            type: Array,
            default: () => [],
        },
    },
    data() {
        return {
            open: false,
            animated: false,
            tab: 1,
        };
    },

    mounted() {
        if (this.open) {
            this.updatePosition();
            window.addEventListener('resize', this.updatePosition);
        } else {
            window.removeEventListener('resize', this.updatePosition);
        }
    },

    beforeDestroy() {
        window.removeEventListener('resize', this.updatePosition);
        document.removeEventListener('click', this.clickOutside);
        document.removeEventListener('touchstart', this.clickOutside);
    },

    watch: {
        open(status) {
            if (status) {
                window.addEventListener('resize', this.updatePosition);
                window.addEventListener('scroll', this.updatePosition);
                document.addEventListener('click', this.clickOutside);
                document.addEventListener('touchstart', this.clickOutside);
            } else {
                window.removeEventListener('resize', this.updatePosition);
                window.removeEventListener('scroll', this.updatePosition);
                document.removeEventListener('click', this.clickOutside);
                document.removeEventListener('touchstart', this.clickOutside);
            }
        },
    },

    methods: {
        onContent() {},

        selectValue(option: any) {
            if (
                option.value.toString() === this.value.toString() ||
                option.disabled
            )
                return;

            this.$emit('input', option.value);
            this.toggle();
        },

        enter() {
            if (this.onHover) {
                if (!this.open) {
                    this.$nextTick().then(() => {
                        this.toggle();
                    });
                }
            }
        },

        leave() {
            if (this.onHover) {
                this.$nextTick().then(() => {
                    if (this.open) {
                        this.toggle();
                    }
                });
            }
        },

        toggle() {
            const wrapper: any = this.$refs.wrapper;
            wrapper.style.removeProperty('transform');
            wrapper.style.removeProperty('opacity');

            if (this.open) {
                this.open = false;
                this.$emit('open', false);

                let pos: any = [0, -16];

                if (this.direction === 'top') {
                    pos = ['-100%', '-105%'];
                }

                anime({
                    targets: wrapper,
                    scale: [1, 0.7],
                    opacity: [1, 0],
                    translateY: pos,
                    easing: 'cubicBezier(0.175, 0.885, 0.32, 1.275)',
                    duration: 150,
                    changeComplete: () => {
                        wrapper.style.display = 'none';
                    },
                });
            } else {
                wrapper.style.display = 'block';
                this.open = true;
                this.$emit('open', true);

                let pos: any = [-16, 0];

                if (this.direction === 'top') {
                    pos = ['-100%', '-105%'];
                }

                setTimeout(() => {
                    this.updatePosition(() => {
                        anime({
                            targets: wrapper,
                            scale: [0.7, 1],
                            opacity: [0, 1],
                            translateY: pos,
                            easing: 'cubicBezier(0.175, 0.885, 0.32, 1.275)',
                            duration: 150,
                        });
                    });
                }, 0);
            }
        },

        updatePosition(callback?: any) {
            const toggle: any = this.$refs.toggle;
            const wrapper: any = this.$refs.wrapper;
            const element: any = this.$refs.content;
            const space: any = this.$refs.space;
            const windowWidth = document.documentElement.clientWidth;

            const togglePosition = toggle.getBoundingClientRect();
            wrapper.style.top =
                togglePosition.top + togglePosition.height + 'px';
            wrapper.style.left = togglePosition.left + 'px';
            wrapper.style.width = togglePosition.width + 'px';

            if (this.direction === 'top') {
                wrapper.style.top = togglePosition.top + 'px';
            }

            element.style.opacity = '0';
            if (this.width === 'auto') {
                element.style.minWidth = '300px';
                space.style.minWidth = '300px';
                element.style.width = 'auto';
                space.style.width = 'auto';
                element.style.zIndex = '99999';

                if (this.minWidth) {
                    element.style.minWidth = `${this.minWidth}px`;
                    space.style.minWidth = `${this.minWidth}px`;
                }
            } else {
                element.style.width = this.width + 'px';
                space.style.width = this.width + 'px';
            }

            const offsetWidth = element.offsetWidth / 2;
            element.style.marginLeft = offsetWidth * -1 + 'px';

            this.$nextTick().then(() => {
                const position = element.getBoundingClientRect();
                if (position.x + position.width > windowWidth) {
                    let margin =
                        (position.x +
                            position.width +
                            offsetWidth -
                            windowWidth) *
                        -1;

                    element.style.marginLeft = margin - 10 + 'px';
                }

                if (position.x < 0) {
                    let margin = (offsetWidth - Math.abs(position.x)) * -1;
                    element.style.marginLeft = margin + 10 + 'px';
                }

                element.style.removeProperty('opacity');

                if (typeof callback === 'function') {
                    setTimeout(() => {
                        callback();
                    }, 0);
                }
            });
        },

        clickOutside(event: any) {
            event.stopPropagation();

            console.log('event.target', event.target);

            if (event.target.closest('.mx-datepicker-popup')) {
                return;
            }

            if (
                this.$el !== event.target &&
                !this.$el.contains(event.target) &&
                !this.clickOutsideDisable
            ) {
                this.toggle();
            }
        },
    },
});
</script>

<style lang="stylus">


.dropdown
    position: relative
    z-index: 2
    -webkit-backface-visibility: hidden

    &--inline
        display: inline
        &:hover
            z-index: 10

    &--inline &__toggle
        cursor: pointer
        display: inline
        user-select: none

    &--inline &__content
        &-close
            right: 17px
        &-wrap
            padding: 20px 20px 20px 20px

    &--hide-close &__content
        &-wrap
            padding: 20px 20px 20px 20px

    &--select &__toggle
        input
            cursor: pointer

    &--select &__content
        &-wrap
            padding: 0

    &__empty
        font-weight: 600
        text-align: center

    &__text
        white-space: normal
        line-height: 1.6

    &--open
        z-index: 3

    &__history
        font-size: 12px

        &-item
            transition: all .15s esae-out
            padding-left: 4px
            padding-right: 4px
            padding-top: 4px
            border-bottom: 1px solid #dcdcdc
            &:hover
                background-color: #f8f8f8

        &-time
            font-weight: 600

        &-row
            margin-bottom: 4px

        &-title
            font-weight: 600
            margin-bottom: 4px

        &-value
            color: #777

    &__controls
        display: flex
        justify-content: flex-end

    &__select-item
        user-select: none
        padding: 12px 20px
        cursor: pointer
        transition: all .15s ease-out
        border-bottom: 1px solid rgba(#c2cad8, .5)

        &:last-child
            border-bottom: none
            border-radius: 0 0 4px 4px

        &:first-child
            border-radius: 4px 4px 0 0

        &:hover
            color: #659be0

        &--active
            cursor: default
            color: #fff!important
            background-color: #659be0

        &--disabled
            cursor: default
            background-color: none
            opacity: .5

    &__tabs
        &-controls
            margin-bottom: 20px
            display: flex
            align-items: center
            justify-content: center

        &-control
            transition: all .15s ease-out
            border: 1px solid #dcdcdc
            padding: 6px 15px
            cursor: pointer
            user-select: none
            text-decoration: none
            margin-left: -1px

            &:first-child
                border-radius: 4px 0 0 4px

            &:last-child
                border-radius: 0 4px 4px 0

            &--active
                color: #fff
                border-color: #659be0
                background-color: #659be0

    &__content
        position: fixed
        z-index: 9999
        display: none
        -webkit-backface-visibility: hidden

        &-space
            position: absolute;
            left: 50%;
            top: -15px;
            width: 100%;
            height: 40px;
            transform: translateX(-50%);
            &:after
                content: ''
                position: absolute
                left: 50%
                top: 19px
                width: 16px
                height: 16px
                z-index: 10
                background-color: #fff
                transform: translate(-50%, 0%) rotate(45deg)

            &--no-space
                height: 0

        &-close
            cursor: pointer
            position: absolute
            right: 10px
            top: 10px
            color: #999
            width: 24px
            height: 24px
            display: flex
            align-items: center
            justify-content: center
            transition: all .15s ease-out
            font-size: 18px

            &:hover, &:active
                color: #659be0



        &-wrap
            user-select: initial!important
            position: absolute
            top: 25px
            left: 50%
            z-index: 2
            max-width: calc(100vw - 17px)
            background-color: #fff
            transform-origin: top center
            box-shadow: -2px 2px 8px 0 rgba(#000, .1)
            padding: 40px 20px 20px 20px
            border-radius: 4px
            &--no-space
                top: 0
                &:after
                    display: none
</style>
