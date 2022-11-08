<template>
    <div ref="modal" class="modal fade form-modal" @click.self="close()">
        <div
            class="modal-dialog"
            :class="[
                small ? 'modal-small' : '',
                xs ? 'modal-sm' : '',
                !small && !xs ? 'modal-lg' : '',
            ]"
        >
            <div class="modal-content">
                <v-content-spinner :space="false" :load="load" />
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        open: {
            type: Boolean,
            default: false,
        },

        load: {
            type: Boolean,
            default: false,
        },

        small: {
            type: Boolean,
            default: false,
        },

        xs: {
            type: Boolean,
            default: false,
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

        $(document).keyup((event) => {
            if (event.key === 'Escape') {
                this.$nextTick().then(() => {
                    if (this.open) {
                        this.$emit('close');
                    }
                });
            }
        });
    },

    methods: {
        show() {
            $(this.$refs.modal).modal('show');
            this.$emit('show');
        },

        close() {
            $(this.$refs.modal).modal('hide');
            this.$emit('close');
        },

        getScrollbarWidth() {
            let outer = document.createElement('div');
            outer.style.visibility = 'hidden';
            outer.style.width = '100px';
            outer.style.msOverflowStyle = 'scrollbar'; // needed for WinJS apps

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

    watch: {
        open() {
            if (this.open) {
                this.show();
                document.body.style.setProperty(
                    'padding-right',
                    this.getScrollbarWidth() + 'px',
                    'important'
                );
            } else {
                this.close();
                setTimeout(() => {
                    document.body.style.setProperty(
                        'padding-right',
                        '0px',
                        'important'
                    );
                }, 450);
            }
        },
    },
};
</script>

<style lang="stylus">
.modal .modal-footer
	border-top: 1px solid #EFEFEF!important
.form-modal .modal-dialog
	overflow: visible!important
.form-modal .modal-body
	overflow: visible!important
body.modal-open
	overflow-y: hidden!important

body .modal-overflow.modal.fade.in
	top: 0%!important
</style>
