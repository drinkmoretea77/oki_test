<template>
    <div class="page-container">
        <div id="holiday_bg"></div>
        <div class="page-sidebar-wrapper">
            <navigation />
        </div>
        <div class="page-content-wrapper">
            <div class="page-content">
                <div class="page-content-row">
                    <div class="page-content-main" :class="{ 'page-content-main--history': showHistory }">
                        <slot></slot>
                    </div>
                    <div class="page-history" :class="{ 'page-history--show': showHistory }">
                        <change-log />
                    </div>
                </div>
            </div>
        </div>
        <companies-sidebar />
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import Navigation from '~/components/navigation/Navigation.vue';
    import CompaniesSidebar from '~/components/header/CompaniesSidebar.vue';
    import ChangeLog from '~/components/header/ChangeLog.vue';
    import { mapState } from 'vuex';

    export default Vue.extend({
        props: {
            navigation: {
                type: Boolean,
                default: true
            }
        },

        components: {
            Navigation,
            CompaniesSidebar,
            ChangeLog
        },

        computed: {
            ...mapState({
                showHistory: ({ showHistory }: any) => showHistory
             })
        }
    })
</script>

<style lang="stylus">
    .page-content-row
        display: flex
        align-items: flex-start
        @media screen and (max-width: 1200px)
            flex-wrap: wrap

        .page-content-main
            transition: all .1s linear
            flex-grow: 1
            max-width: calc(100% - 0px)
            &--history
                max-width: calc(100% - 350px)


        @keyframes show-page-history {
            0% {
                flex-basis: 0;
                max-width: 0;
                opacity: 0;
                padding-left: 0;
            }
            100% {
                flex-basis: 350px
                max-width: 350px
                min-width: 350px
                padding-left: 30px
                opacity: 1
            }
        }

        .page-history
            overflow: hidden
            padding-left: 0
            flex-basis: 0%
            max-width: 0%
            opacity: 0
            transition: all .2s linear
            @media screen and (max-width: 1200px)
                transition: none

            &--show
                opacity: 1
                padding-left: 30px
                flex-basis: 350px
                max-width: 350px
                min-width: 350px
                animation: show-page-history .2s ease-out
                @media screen and (max-width: 1200px)
                    animation: none
                    flex-basis: 100%
                    max-width: 100%
                    min-width: 100%
                    padding-left: 0

</style>
