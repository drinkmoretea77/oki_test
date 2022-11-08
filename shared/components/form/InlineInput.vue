<template>
    <div class="inline-input" :class="{ 'inline-input--focus': focus }">
        <div v-if="label" @click="$refs.input.focus()" class="inline-input__label">{{ label }}: </div>
        <div class="inline-input__wrapper">
            <div ref="input" class="inline-input__input" @focus="focus = true" contenteditable="true"></div>
            <div class="inline-input__save" @click="save">
                <i class="fa fa-check"></i>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            label: {
                type: String,
                default: ''
            },

            value: {
                type: String,
                default: ''
            }
        },

        data() {
            return {
                focus: false,
            }
        },

        watch: {
            value() {
                const input: any = this.$refs.input;

                console.log('update value', this.value)

                if(input) {
                    input.innerText = this.value;
                }
            },
        },

        mounted() {
            console.log('mounted')
            this.$nextTick().then(() => {
                const input: any = this.$refs.input;
                input.innerText = this.value;
            });

            document.body.addEventListener('click', this.blur);
        },

        beforeDestroy() {
            document.body.removeEventListener('click', this.blur);
        },

        methods: {
            save() {

                const input: any = this.$refs.input;
                console.log('input.innerText', input.innerText);
                this.$emit('input', input.innerText);
                this.focus = false;
            },

            blur(event: any) {
                if (!(this.$el == event.target || this.$el.contains(event.target))) {
                    this.focus = false;
                    const input: any = this.$refs.input;

                    if(input) {
                        input.innerText = this.value;
                    }
                }
            }
        }
    });
</script>

<style lang="stylus">
    .inline-input
        position: relative
        margin-right: 10px
        display: inline-flex
        align-items: flex-start
        font-size: 14px
        line-height: 1.8

        &__label
            margin-top: 1px
            margin-right: 4px
            font-weight: bold

        &__wrapper
            display: inline-flex
            transition: all 0.15s ease-out
            border: 1px solid rgba(#0a6aa1, 0)
            border-radius: 3px

        &__input
            transition: all 0.15s ease-out
            padding: 0 6px
            outline: none

        &:hover &__wrapper
            border: 1px solid rgba(#0a6aa1, 1)

        &--focus &__wrapper
            border: 1px solid rgba(#0a6aa1, 1)

        &__cancel, &__save
            position: absolute
            right: 0
            top: 0
            height: 100%
            display: flex
            align-items: center
            justify-content: center
            width: 0px
            overflow hidden
            cursor: pointer
            color: #fff
            background-color: #337ab7
            transition: all 0.15s ease-out
            border-radius: 0 3px 3px 0
            z-index: 10
            &:hover
                background-color: #286090

        &--focus &__save
            right: -26px
            width: 28px
</style>
