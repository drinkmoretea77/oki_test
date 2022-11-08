<template>
    <div class="v-chip" :class="{ 'v-chip--link': to, 'v-chip--small': small }">
        <template v-if="!noContent">
            <a v-if="to" :href="to" @click="goTo" class="v-chip__text" v-tooltip="tooltip">
                <slot />
            </a>
            <div v-else class="v-chip__text" v-tooltip="tooltip">
                <slot />
            </div>
        </template>
        <template v-if="controls">
            <template v-if="add">
                <div
                    ref="add"
                    class="v-chip__add"
                    v-on="listeners"
                    v-tooltip="$t('Добавить')"
                >
                    <i class="fa fa-plus"></i>
                </div>
            </template>
            <template v-else>
                <div
                    ref="remove"
                    v-if="deleted && !disabled"
                    class="v-chip__remove"
                    v-on="listeners"
                    v-tooltip="$t('Удалить')"
                >
                    <i class="fa fa-remove"></i>
                </div>
            </template>
        </template>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            /**
             * Выводить плюсик
             */
            add: {
                type: Boolean,
                default: false
            },

            /**
             * Выводить кнопку удаления
             */
            deleted: {
                type: Boolean,
                default: true
            },

            /**
             * Статус disabled
             */
            disabled: {
                type: Boolean,
                default: false
            },

            /**
             * Всплывающая подсказка
             */
            tooltip: {
                type: String,
                default: ''
            },

            /**
             * Ссылка для перехода при нажатии на текст
             */
            to: {
                type: String,
                default: ''
            },

            /**
             * Отображать кнопки удаления/добавления
             */
            controls: {
                type: Boolean,
                default: true
            },

            /**
             * Маленький размер
             */
            small: {
                type: Boolean,
                default: false
            },

            /**
             * Без текста
             */
            noContent: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                listeners: {}
            }
        },

        created() {
            this.listeners = this.$listeners;
        },

        methods: {
            goTo(event: any) {
                event.preventDefault();
                if (this.disabled) return;
                if (this.to.includes('/n/')) {
                    this.$router.push(this.to)
                } else {
                    window.location = this.to as any;
                }
            }
        }
    })
</script>

<style lang="stylus">
    .v-chip
        max-width: 100%
        display: flex
        margin-right: 8px
        margin-bottom: 8px
        border-radius: 4px
        justify-content: space-between
        color: #777
        transition: all .15s ease-out
        background-color: #f2f2f2

        &__text
            color: #777
            padding: 5px 8px

        &--small
            max-width calc(50% - 16px)

        &--small &__text
            padding: 3px 8px 4px 8px

        &--link &__text
            border-radius: 4px
            transition: background-color .15s ease-out, color .15s ease-out
            text-decoration: none
            cursor: pointer
            max-width: 100%
            overflow hidden
            text-overflow: ellipsis
            white-space: nowrap
            &:not(:last-child)
                border-radius: 4px 0 0 4px

            &:hover
                color: #fff
                background-color: #337ab7

        &__remove
            color: #999
            display: flex
            align-items: center
            cursor: pointer
            transition: all .15s ease-out
            margin-right: 0
            position: relative
            text-decoration: none
            border-radius: 0 4px 4px 0
            padding: 8px;
            &:hover
                color: #fff
                background-color: #ed6b75

        &__add
            cursor: pointer
            color: #777
            transition: all .15s ease-out
            border-radius: 4px
            padding: 5px 10px;

            &:hover
                color: #fff
                background-color: #337ab7


</style>
