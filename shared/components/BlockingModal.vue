<template>
    <div class="blocking-modal" v-show="show">
        <div class="modal-scrollable">
            <div class="modal fade modal-overflow in" style="display: block; margin-top: 0px;">
                <div class="modal-dialog modal-small">
                    <v-content-spinner :load="load" :space="false" />
                    <div class="modal-content">
                        <div class="modal-header">
                            <slot name="header"></slot>
                        </div>
                        <div class="modal-body">
                            <slot name="body"></slot>
                        </div>
                        <div class="modal-footer">
                            <slot name="footer"></slot>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal-backdrop fade in" style="z-index: 10050;"></div>
    </div>
</template>

<script>
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            show: {
                type: Boolean,
                default: false
            },

            load: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                closing: false
            }
        },

        watch: {
            show(status) {
                if (status) {
                    this.hideWindowScroll();
                } else {
                    this.clearWindowScroll();
                }
            }
        },

        created() {
            if (process.client && this.show) {
                this.hideWindowScroll();
            }
        },

        methods: {
            hideWindowScroll() {
                document.body.style.setProperty('overflow', 'hidden');
                document.body.style.setProperty('padding-right', this.getScrollbarWidth() + 'px', 'important');
            },

            clearWindowScroll() {
                document.body.style.setProperty('overflow', 'auto');
                document.body.style.setProperty('padding-right', '0px', 'important');
            },

            getScrollbarWidth() {
                const outer = document.createElement('div');
                outer.style.visibility = 'hidden';
                outer.style.overflow = 'scroll';
                outer.style.msOverflowStyle = 'scrollbar';
                document.body.appendChild(outer);

                const inner = document.createElement('div');
                outer.appendChild(inner);

                const scrollbarWidth = (outer.offsetWidth - inner.offsetWidth);

                outer.parentNode.removeChild(outer);

                return scrollbarWidth;
            }
        }
    });
</script>

<style lang="stylus">
    @keyframes blocking-modal
        0%
            opacity: 0
        100%
            opacity: 1
    .blocking-modal
        position: fixed
        top: 0
        left: 0
        height: 100%
        width: 100%
        z-index: 999999
        transition: all .3s ease-out
        animation: blocking-modal .3s ease-out
</style>
