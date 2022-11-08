<template>
    <div id="page-header" class="fix-cookie-mt page-header navbar navbar-fixed-top fix-height-res">
        <div v-if="!errors" class="page-header-inner">
            <div class="page-logo ">
                <a href="/home">
                    <img src="/img/logo.png" alt="logo" class="logo-default">
                </a>
                <i class="fa fa-unlink socket_indicator hidden" id="socket_connection_indicator" />
                <i class="fa fa-download socket_indicator hidden" id="socket_message_indicator" />
            </div>
            <call-status />
            {{ errors }}
            <div class="top-menu">
            </div>
        </div>
        <div v-if="quota && quota.message && showQuota" class="quota-block" :class="[ `quota-block--${quotaType}` ]">
            <div class="quota-block__wrapper">
                {{ quota.message }}
            </div>
            <div class="quota-block__close" @click="hideQuotaBlock">
                <i class="fa fa-close" />
            </div>
        </div>
        <template v-else>
            <portal-target class="questionnaire-header" name="questionnaire-header" />
        </template>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import CallStatus from '~/components/header/CallStatus.vue';

    export default {
        components: {
            CallStatus,
        },

        data() {
            return {
                showQuota: true
            }
        },

        computed: {
            ...mapState({
                errors: ({ checklist }) => checklist.errors,
                quota: ({ checklist }) => checklist.quota,
                quotaMessage: ({ checklist }) => checklist.message,
                quotaType() {
                    return this.quota.type || 'default';
                }
            }),
        },

        watch: {
            quotaMessage() {
                this.showQuota = true;
            },
            quotaType() {
                this.showQuota = true;
            }
        },

        methods: {
            hideQuotaBlock() {
                this.showQuota = false;
            }
        }
    }
</script>

<style lang="stylus">
    .quota-block
        position relative
        color: #fff
        text-align: center
        background-color: #F1C40F
        padding: 8px 40px

        @media (max-width: 991px)
            margin-left: -20px
            margin-right: -20px

        &--warning
            background-color: #F1C40F
        &--success
            background-color: #36c6d3
        &--danger
            background-color: #ed6b75
        &__close
            position: absolute
            right: 0
            top: 0
            cursor: pointer
            width: 35px
            height: 35px
            display: flex
            align-items: center
            justify-content: center
            font-size: 18px
        &__wrapper
            margin: 0 auto
            max-width: 1024px


</style>