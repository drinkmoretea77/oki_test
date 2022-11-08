<template>
    <div class="server-error">
        <div class="server-error__content">
            <div class="alert alert-warning alert-report">
                <i class="fa fa-info-circle"></i>
                <div>
                    <h2>{{ $t('Ой! Что-то пошло не так...') }}</h2>
                    <h4>{{ $t('Отчёт об ошибке отправлен') }}</h4>
                </div>
            </div>
            <a href="/" class="btn btn-primary">На главную</a>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        layout: 'server-error',
        head() {
            return {
                title: this.$t('Серверная ошибка'),
            }
        },
    })
</script>

<style lang="stylus">
    body, html
        background-image: url(/img/pattern4_2_1.jpg) !important
        background-attachment: fixed !important
        background-size: 100% 100%

    .server-error
        height: 100vh
        width: 100vw
        display: flex
        justify-content: center
        align-items: center
        &__content
            display: flex
            flex-direction: column
            align-items: flex-end

            .alert.alert-warning.alert-report
                width: 100%
                margin: 0 0 20px 0
                display: flex!important
                align-items: center
                h4
                    margin: 5px 0 0 2px
</style>
