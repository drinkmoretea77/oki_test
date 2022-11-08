<template>
    <div>
        <div v-if="error.statusCode === 404" class="alert alert-danger">
            <p><strong>404</strong></p>
            {{ errorMessage || error.message !== '0' ? error.message : $t('Страница не найдена.') }}
        </div>
        <v-content-spinner v-else-if="error.statusCode === 401" :load="true" />
        <div v-else-if="error.statusCode === 403" class="page-error">
            <div class="page-error__wrapper">
                <div class="alert alert-warning alert-report">
                    <i class="fa fa-times-circle-o"></i>
                    <div>
                        <h2>{{ $t('Ошибка 403: Нет доступа') }}</h2>
                        <h4>{{ $t('Ой, у вас нет доступа к этому разделу. Обратитесь к администратору для предоставления доступа.') }} </h4>
                    </div>
                </div>
            </div>
        </div>
        <div v-else class="alert alert-danger">
            <p><strong>{{ error.statusCode }}</strong></p>
            {{ errorMessage || error.message !== '0' ? error.message : $t('Ой! Произошла ошибка. Мы не смогли ее предупредить, но уже залогировали и занялись устранением причины.') }}
        </div>
    </div>
</template>

<script>
    export default {
        props: ['error'],

        data() {
            return {
                errorMessage: null
            }
        },

        created() {
            if (this.$route.query?.error) {
                this.errorMessage = this.$route.query.error;
            }
        },

        mounted() {
            console.log('error status', this.error?.statusCode)
        }
    }
</script>

<style lang="stylus">
    .page-error
        display: flex
        align-items: center
        justify-content: center
        min-height: calc(100vh - 70px)
        width: 100%

        .alert.alert-warning.alert-report
            width: 100%!important
            h2
                margin-bottom: 10px

        &__wrapper
            display: flex
            flex-direction: column
            align-items: flex-end
            max-width: 600px

        &__controls .btn
            margin-left: 10px

        &__controls
            display: flex
            justify-content: flex-end
            padding-top: 10px


</style>
