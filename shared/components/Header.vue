<template>
    <div id="page-header" class="fix-cookie-mt page-header navbar navbar-fixed-top fix-height-res">
        <messages />
        <div class="page-header-inner">
            <div class="page-logo">
                <nuxt-link :to="logo.url">
                    <img :src="currentLogo" alt="logo" class="logo-default">
                </nuxt-link>
                <i class="fa fa-unlink socket_indicator hidden" id="socket_connection_indicator" />
                <i class="fa fa-download socket_indicator hidden" id="socket_message_indicator" />
                <div class="menu-toggler sidebar-toggler"><span /></div>
            </div>
            <a href="javascript:" class="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"><span></span></a>
            <current-time />
            <header-slot />
            <div class="top-menu">
                <ul class="nav navbar-nav pull-right">
                    <news-notify />
                    <history />
                    <li v-if="user" class="dropdown dropdown-user dropdown-dark">
                        <a href="javascript:" class="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                <span class="username username-hide-on-mobile">
                                    {{ user.email }}
                                </span>
                            <i class="fa fa-angle-down"></i>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-default">
                            <li><n-link :to="'/n/users/' + user.id + '/edit'"> <i class="icon-user"></i>{{ $t('Профиль') }}</n-link></li>
                            <li><a href="/logout"> <i class="icon-key"></i>{{ $t('Выход') }}</a></li>
                        </ul>
                    </li>
                    <li>
                        <profile />
                    </li>
                    <li v-if="currentCompany" class="dropdown dropdown-quick-sidebar-toggler dropdown-user dropdown-dark">
                        <a class="dropdown-toggle" href="javascript:">
                            <span id="active_company_name" class="username username-hide-on-mobile">
                                {{ currentCompany.name }}
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import { loadImage } from '~/shared/utils/images';

    import Navigation from '~/components/navigation/Navigation.vue';
    import NewsNotify from '~/components/header/NewsNotify.vue';
    import CurrentTime from '~/components/header/CurrentTime.vue';
    import HeaderSlot from '~/components/header/HeaderSlot.vue';
    import Profile from '~/components/header/Profile.vue';
    import Messages from "~/components/messages/Messages";
    import History from "~/components/header/History";

    export default {
        components: {
            Messages,
            Profile,
            Navigation,
            NewsNotify,
            CurrentTime,
            History,
            HeaderSlot,
        },

        computed: {
            ...mapState({
                user: ({ user }) => user,
                currentCompany: ({ currentCompany }) => currentCompany,
                logo: ({ logo }) => logo ? logo : {
                    image: '/img/logo.png',
                    url: '/home'
                },
            })
        },

        data() {
            return {
                currentLogo: null
            }
        },

        created() {
            this.currentLogo = this.logo?.image;
        },

        mounted() {
            const src = this.currentCompany?.logo
            if (src) {
                this.setLogoImage(src)
            }
        },

        methods: {
            async setLogoImage(src) {
                try {
                    const image = await loadImage(src);

                    this.currentLogo = image.src;
                } catch (error) {
                    console.log('Загружен битый логотип компании')
                }
            }
        }
    }
</script>
