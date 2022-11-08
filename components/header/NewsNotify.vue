<template>
    <li class="dropdown dropdown-extended dropdown-notification" id="header_notification_bar">
        <a href="javascript:" class="dropdown-toggle" @click="getNotify()" v-if="notifyNews.all > 0" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
            <i class="icon-bell"></i>
            <span class="badge badge-default" v-text="notifyNews.all"></span>
        </a>
        <ul class="dropdown-menu"  v-if="notifyNews.all > 0">
            <li class="external">
                <h3><span class="bold" v-text="notifyNews.all"></span> {{ $t("новых сообщения") }}</h3>
            </li>
            <li>
                <ul class="dropdown-menu-list scroller" style="height: 250px;" data-handle-color="#637283">
                    <li v-if="notifyNews.urgent > 0">
                        <nuxt-link to="/home">
                            <span class="time font-red" v-text="notifyNews.urgent"></span>
                            <span class="details">
                                <span class="label label-sm label-icon label-danger" style="padding: 5px 3px 5px 5px !important;">
                                    <i class="fa fa-star"></i>
                                </span> {{ $t("Срочные новости") }}
                            </span>
                        </nuxt-link>
                    </li>
                    <li v-if="notifyNews.weekly > 0">
                        <nuxt-link to="/home">
                            <span class="time font-blue" v-text="notifyNews.weekly"></span>
                            <span class="details">
                                <span class="label label-sm label-icon label-info" style="padding: 5px 3px 5px 5px !important;">
                                    <i class="fa fa-bell"></i>
                                </span> {{ $t("Еженедельные новости") }}
                            </span>
                        </nuxt-link>
                    </li>
                </ul>
            </li>
        </ul>
    </li>
</template>

<script>
    export default {
        data() {
            return {
                notifyShow: false,
                notifyNews: {}
            }
        },

        mounted() {
            //this.getNotify();
        },

        methods: {
            async getNotify() {
                try {
                    const { data } = await this.$axios.get('/news/count_new');

                    this.notifyNews = data || {};
                } catch (error) {
                    console.log('error', error);
                }
            }
        }
    }
</script>
