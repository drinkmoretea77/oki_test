<template>
    <transition
        name="modal-sync"
        @before-enter="beforeEnter"
        @after-leave="afterLeave"
    >
        <div v-if="value" class="modal-sync" @click.self="close">
            <div
                class="modal-sync__dialog modal-dialog"
                :class="[`modal-${size}`]"
            >
                <div class="modal-sync__content modal-content">
                    <v-content-spinner :space="false" :load="load" />
                    <div v-if="header" class="modal-sync__header modal-header">
                        <button
                            v-if="!freeze && closeButton"
                            @click="close"
                            type="button"
                            class="close"
                            aria-hidden="true"
                        >
                            &times;
                        </button>
                        <slot name="header" v-bind="{ close }" />
                    </div>
                    <div v-if="body" class="modal-sync__body modal-body">
                        <slot name="body" v-bind="{ close }" />
                    </div>
                    <div v-if="footer" class="modal-sync__footer modal-footer">
                        <button
                            v-if="!freeze && closeButtonFooter"
                            type="button"
                            @click="close"
                            class="btn"
                        >
                            {{ $t('Закрыть') }}
                        </button>
                        <slot name="footer" v-bind="{ close }" />
                    </div>
                </div>
            </div>
        </div>
    </transition>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    props: {
        // Размеры окна: xl, lg, md, sm, xs
        size: {
            type: String,
            default: 'lg',
        },

        // Булево значение, определяющие открыто ли модальное окно
        value: {
            type: Boolean,
            default: false,
        },

        // Отключить возможность закрыть модальное окно
        freeze: {
            type: Boolean,
            default: false,
        },

        // Статус загрузки
        load: {
            type: Boolean,
            default: false,
        },

        // Отображение шапки
        header: {
            type: Boolean,
            default: true,
        },

        // Отображение контента
        body: {
            type: Boolean,
            default: true,
        },

        // Отображение подвала
        footer: {
            type: Boolean,
            default: true,
        },

        // Отображение кнопки закрыть в шапке
        closeButton: {
            type: Boolean,
            default: true,
        },

        // Отображение кнопки закрыть в подвале
        closeButtonFooter: {
            type: Boolean,
            default: true,
        },

        // Режим формы, шапка и подвал скрываются
        isForm: {
            type: Boolean,
            default: false,
        },
    },

    methods: {
        beforeEnter(): void {
            const pageHeader = document.getElementById('page-header');
            document.body.classList.add('modal-sync-overflow');
            document.body.style.setProperty(
                'padding-right',
                this.getScrollbarWidth() + 'px',
                'important'
            );
            if (pageHeader) {
                pageHeader.style.setProperty(
                    'padding-right',
                    this.getScrollbarWidth() + 'px',
                    'important'
                );
            }
        },

        afterLeave(): void {
            const pageHeader = document.getElementById('page-header');
            document.body.classList.remove('modal-sync-overflow');
            document.body.style.setProperty(
                'padding-right',
                '0px',
                'important'
            );
            if (pageHeader) {
                pageHeader.style.setProperty(
                    'padding-right',
                    '0px',
                    'important'
                );
            }
        },

        close(event: any): void {
            if (this.freeze) return;

            this.$emit('input', false);
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
.modal-sync-overflow
    overflow: hidden!important

.modal-sync-enter-active, .modal-sync-leave-active
    transition: opacity .15s

.modal-sync-enter, .modal-sync-leave-to
    opacity: 0

@keyframes modal-sync-content
    0%
        transform: translateY(-100%)
    100%
        transform: translateY(0%)

.modal-sync
    position: fixed
    top: 0
    left: 0
    width: 100%
    height: 100%
    overflow: auto
    z-index: 10000
    background-color: rgba(#333, 0.2)

    &__footer
        border-top: 1px solid #EFEFEF!important

    &__dialog
        overflow: visible!important
        z-index: 2

    &__content
        animation: modal-sync-content .3s ease-out
        box-shadow: 0 8px 18px rgba(#000, .18), 0 6px 6px rgba(#000, .23)!important

    .tabbable-custom > .tab-content
        padding: 15px 10px
</style>
