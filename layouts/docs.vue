<template>
    <div class="docs-layout">
        <div class="docs-layout__wrapper">
            <div class="docs-layout__sidebar">
                <div class="docs-layout__sidebar-wrap">
                    <div class="docs-layout__sidebar-header">
                        <a href="/" class="docs-layout__logo">
                            <img src="/img/logo.png" alt="oki-toki" />
                        </a>
                    </div>
                    <div class="docs-navigation">
                        <div
                            v-for="item in navigationSort"
                            :key="item.url"
                            v-if="!item.hide"
                            class="docs-navigation__item"
                        >
                            <n-link
                                class="docs-navigation__link"
                                :class="{
                                    'docs-navigation__link--active':
                                        item.url === $route.path,
                                }"
                                :to="item.url"
                            >
                                <span class="docs-navigation__title">{{
                                    item.title
                                }}</span>
                                <span
                                    v-if="item.description"
                                    class="docs-navigation__description"
                                    >{{ item.description }}</span
                                >
                            </n-link>
                        </div>
                    </div>
                </div>
            </div>
            <div class="docs-layout__content">
                <nuxt />
                <div class="docs-container">
                    <div class="docs-pagination">
                        <div class="docs-pagination__left">
                            <n-link
                                v-if="!prev.first"
                                :to="prev.url"
                                class="docs-pagination__control docs-pagination__prev"
                            >
                                <div class="docs-pagination__icon">
                                    <i class="fa fa-arrow-left"></i>
                                </div>
                                <div class="docs-pagination__title">
                                    {{ prev.description || prev.title }}
                                </div>
                            </n-link>
                        </div>
                        <div class="docs-pagination__right">
                            <n-link
                                v-if="!next.last"
                                :to="next.url"
                                class="docs-pagination__control docs-pagination__next"
                            >
                                <div class="docs-pagination__title">
                                    {{ next.description || next.title }}
                                </div>
                                <div class="docs-pagination__icon">
                                    <i class="fa fa-arrow-right"></i>
                                </div>
                            </n-link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <confirmation-modal />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import 'vue-code-highlight/themes/prism.css';
import ConfirmationModal from '../components/ConfirmationModal.vue';

export default Vue.extend({
    components: {
        ConfirmationModal,
    },
    data(): any {
        const prefix = '/n/docs';
        return {
            navigation: [
                {
                    title: this.$t('Введение'),
                    url: `${prefix}`,
                    first: true,
                },
                {
                    title: this.$t('List'),
                    url: `${prefix}/list`,
                    description: this.$t('Вывод элементов списка'),
                },
                {
                    title: this.$t('Form'),
                    url: `${prefix}/form`,
                    description: this.$t('Типовая форма проекта'),
                },
                {
                    title: this.$t('Input'),
                    url: `${prefix}/input`,
                    description: this.$t('Поле ввода'),
                },
                {
                    title: this.$t('Textarea'),
                    url: `${prefix}/textarea`,
                    description: this.$t('Поле ввода текста'),
                    hide: true,
                },
                {
                    title: this.$t('Editor'),
                    url: `${prefix}/editor`,
                    description: this.$t('Продвинутый редактор текста'),
                },
                {
                    title: this.$t('Checkbox'),
                    url: `${prefix}/checkbox`,
                    description: this.$t('Radio, Switch, Bool'),
                },
                {
                    title: this.$t('Select'),
                    url: `${prefix}/select`,
                    description: this.$t('Типовой и кастомный select'),
                },
                {
                    title: this.$t('Modal (deprecated)'),
                    url: `${prefix}/modal`,
                    description: this.$t('Типовое модальное окно'),
                },
                {
                    title: this.$t('Tabs'),
                    url: `${prefix}/tabs`,
                    description: this.$t('Типовые табы'),
                },
                {
                    title: this.$t('Drop'),
                    url: `${prefix}/drop`,
                    description: this.$t('Выпадающий контент'),
                },
                {
                    title: this.$t('Chips'),
                    url: `${prefix}/chips`,
                    description: this.$t('Список чипов для списка'),
                },
                {
                    title: this.$t('Tooltip'),
                    url: `${prefix}/tooltip`,
                    description: this.$t('Директива для тултипов'),
                    hide: true,
                },
                // {
                //     title: this.$t('Utils'),
                //     url: `${prefix}/utils`,
                //     description: this.$t('Чистые функции')
                // },
                {
                    title: this.$t('$confirmation'),
                    url: `${prefix}/confirm`,
                    description: this.$t('Подтверждение действия'),
                },
                {
                    title: this.$t('$api'),
                    url: `${prefix}/api`,
                    description: this.$t('Отправка http-запросов'),
                },
                {
                    title: this.$t('$t'),
                    url: `${prefix}/t`,
                    description: this.$t('Локализация текста'),
                },
                {
                    title: this.$t('$setFormValues'),
                    url: `${prefix}/set-form-values`,
                    description: this.$t('Установка значений формы'),
                },
                {
                    title: this.$t('$url'),
                    url: `${prefix}/url`,
                    description: this.$t('Интерполяция ссылки'),
                },

                {
                    title: this.$t('Modal-sync'),
                    url: `${prefix}/modal-sync`,
                    description: this.$t('Типовое модальное окно'),
                },
            ],
        };
    },

    computed: {
        navigationSort(): any {
            return this.navigation.sort((a: any, b: any) => {
                if (a.first) {
                    return -1;
                }

                if (b.first) {
                    return 1;
                }

                return a.title.localeCompare(b.title);
            });
        },

        prev(): any {
            const url = this.$route.path;
            const index = this.navigationSort.findIndex(
                (item: any) => item.url === url
            );
            const first = index === 0;

            if (first) {
                return {
                    title: '',
                    url: '',
                    first: true,
                };
            } else {
                return {
                    title: this.navigationSort[index - 1].title || '',
                    url: this.navigationSort[index - 1].url || '',
                    description:
                        this.navigationSort[index - 1].description || '',
                };
            }
        },

        next(): any {
            const url = this.$route.path;
            const index = this.navigationSort.findIndex(
                (item: any) => item.url === url
            );
            const last = this.navigationSort.length - 1 === index;

            if (last) {
                return {
                    title: '',
                    url: '',
                    last: true,
                };
            } else {
                if (this.navigationSort[index + 1].hide) {
                    return {
                        title: '',
                        url: '',
                        last: true,
                    };
                }
                return {
                    title: this.navigationSort[index + 1].title || '',
                    url: this.navigationSort[index + 1].url || '',
                    description:
                        this.navigationSort[index + 1].description || '',
                };
            }
        },
    },
});
</script>

<style lang="stylus">
@import "~/assets/tooltip.css"

.docs-controls
    display: flex
    justify-content: flex-end
    margin-top: 16px

.docs-table
    width: 100%
    background-color: #fff
    border: 1px solid #f1f1f1
    tr
        border-bottom: 1px solid #f1f1f1
        transition: all .15s ease-out
        &:hover
            background-color: #f2f2f2
        th
            text-align: left
    th
        padding: 12px
        white-space: nowrap

    td
        padding: 12px

.docs-pagination
    margin-top: 20px
    display: flex
    flex-wrap: wrap
    &__left, &__right
        flex-basis: 50%
        max-width: 50%
    &__right
        display: flex
        justify-content: flex-end
    &__control
        padding: 12px 0
        display: inline-flex
        align-items: center
        text-decoration: none!important
        color: #777
        transition: all .15s ease-out
        font-weight: 600
        &:hover
            color: #659be0
    &__icon
        margin: 0 8px

.docs-text
    line-height: 1.6
    font-size: 16px
.docs-container
    margin: 0 auto
    max-width: 768px
.docs-code.markup pre
    padding-top: 0!important

.docs-code pre
    background: #ffffff!important
    border: 1px solid #f1f1f1!important

.docs-navigation
    &__description
        font-size: 12px
        color: #999
        overflow: hidden
        height: 0
        display: flex
        transition: all .15s ease-out
        opacity: 0

    &__item:hover &__description
        height: 17px
        opacity: 1

    &__link
        cursor: pointer
        text-decoration: none!important
        user-select: none
        outline: none
        padding: 0 24px
        height: 44px
        color: #777
        font-weight: 600
        display: flex
        font-size: 14px
        justify-content: center
        flex-direction: column
        transition: all .15s ease-out
        &:hover
            background-color: #f2f2f2
            color: #659be0
        &--active
            background-color: #fff!important
            cursor: default
            color: #659be0!important

.docs-layout
    overflow: hidden
    &__wrapper
        min-height: 100vh
        background-color: #f9f9f9
        //background-image: url(/img/pattern4_2_1.jpg)
        background-size: cover
        background-position: center center
        display: flex
        padding-left: 256px

    &__sidebar
        position: fixed
        top: 0
        left: 0
        width: 256px
        background-color: #fff
        border-right: 1px solid #f1f1f1
        height: 100vh
        max-height: 100vh
        overflow: auto

        &::-webkit-scrollbar
            width: 4px
            position: relative

        &::-webkit-scrollbar-track
            background-color: #dcdcdc

        &::-webkit-scrollbar-thumb
            background-color: #659be0

        &-header
            background-color: #659be0
            display: flex
    &__logo
        padding: 16px 24px
        display: flex
        align-items: center
        text-decoration: none
        flex-grow: 1

    &__content
        flex-grow: 1
        padding: 24px
</style>
