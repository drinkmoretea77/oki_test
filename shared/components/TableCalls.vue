<template>
    <div class="v-table-calls">
        <div class="v-table-calls__wrapper">
            <div ref="wrapper" class="v-table-calls__content">
                <vue-scroll ref="vs" :ops="scrollOptions" @handle-scroll="handleScroll">
                    <div ref="content" class="v-table-calls__content-wrap">
                        <div class="v-table-calls__line" :class="{ 'v-table-calls__line--show': leftOffset > 0 }" :style="{ 'left': leftOffset + 'px' }"></div>

                        <div class="v-table-calls__row v-table-calls__row--head" :class="{ 'v-table-calls__row--has-fixed': fixed !== '' }">
                            <div
                                v-for="(value, key) in params"
                                class="v-table-calls__col"
                                :class="{ 'v-table-calls__col--ghost': fixed === key }"
                                :style="{ 'left': fixed === key ? leftOffset + 'px' : 'auto' }"
                            >
                                <template v-if="Array.isArray(value)">
                                    <div v-for="subitem in value">{{ subitem }}</div>
                                </template>
                                <template v-else>
                                    {{ value }}
                                </template>
                            </div>
                        </div>
                        <div v-for="item in items" class="v-table-calls__row" :class="{ 'v-table-calls__row--has-fixed': fixed !== '' }">
                            <div
                                v-for="(value, key) in params"
                                class="v-table-calls__col"
                                :class="{ 'v-table-calls__col--ghost': fixed === key }"
                                :style="{ 'left': fixed === key ? leftOffset + 'px' : 'auto' }"
                            >
                                <template v-if="Array.isArray(item[key])">
                                    <template v-if="tags.includes(key)">
                                        <span v-for="tag in item[key]" class="badge badge-primary margin-right-5 margin-bottom-5">{{ tag }}</span>
                                    </template>
                                    <template v-else>
                                        <div v-for="subitem in item[key]">{{ subitem }}</div>
                                    </template>
                                </template>
                                <template v-else>
                                    {{ item[key] }}
                                </template>
                            </div>
                        </div>
                    </div>
                </vue-scroll>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import vuescroll from 'vuescroll';

    export default Vue.extend({
        components: {
            'vue-scroll': vuescroll
        },
        props: {
            fixed: {
                type: String,
                default: ''
            },

            params: {
                type: Object,
                default: () => ({})
            },

            items: {
                type: Array,
                default: () => ([])
            },

            rows: {
                type: Array,
                default: () => ([])
            },

            tags: {
                type: Array,
                default: () => ([])
            },
        },
        data() {
            return {
                leftOffset: 0,
                scrollOptions: {
                    bar: {
                        background: '#659be0'
                    },
                    vuescroll: {
                        mode: 'native',
                        wheelDirectionReverse: true
                    },
                    scrollPanel: {
                        scrollingY: false,
                    }
                }
            }
        },

        watch: {
            items: {
                deep: true,
                handler() {
                    this.updateHeight();
                }
            }
        },

        mounted() {
            this.updateHeight();

            window.addEventListener('resize', this.updateHeight);
        },

        beforeDestroy() {
            window.removeEventListener('resize', this.updateHeight);
        },

        methods: {
            handleScroll(vertical: any, horizontal: any, nativeEvent: any) {
                this.leftOffset = horizontal.scrollLeft;
            },

            updateHeight() {
                const element: any = this.$refs['vs'];
                element.triggerRefreshOrLoad("refresh");

                this.$nextTick().then(() => {
                    const wrapper: any = this.$refs.wrapper;
                    const content: any = this.$refs.content;

                    wrapper.style.height = (content.offsetHeight + 2) + 'px';
                });
            }
        }

    });
</script>

<style lang="stylus">
    .v-table-calls

        &__content
            border: 1px solid #c2cad8

            .__rail-is-horizontal
                z-index: 10!important

            &:hover
                .__bar-is-horizontal
                    opacity: .8!important

        &__row
            position: relative
            display: inline-flex
            transition: all .15s ease-out
            border-bottom: 1px solid #c2cad8

            &:last-child
                border-bottom: none

            &:hover
                background-color: #f1f1f1

            &--head
                font-weight: bold
                color: #555
                background-color: #f9f9f9!important

            &--has-fixed
                padding-left: 200px

        &__line
            position: absolute
            top: 0
            left: 0
            height: 100%
            width: 200px
            z-index: 1
            transition: opacity .15s ease-out
            box-shadow: 0 0 24px 0 rgba(0,0,0,0.4)
            opacity: 0
            &--show
                opacity: 1

        &__col
            padding: 15px 20px
            flex-basis: 205px
            max-width: 205px
            min-width: 205px
            border-right: 1px solid #c2cad8
            background-color: #fff

            &--ghost
                position: absolute
                top: 0
                left: 0
                z-index: 3
                height: 100%


            &:last-child
                border-right: none


    /*&__content*/
        /*    display: flex*/

        /*&__col*/
        /*    flex-grow: 1*/
        /*    display: flex*/
        /*    flex-direction: column*/

        /*&__item, &__title*/
        /*    border: 1px solid #dcdcdc*/
</style>
