<template>
    <div id="companies_sidebar">
        <a href="javascript:" class="page-quick-sidebar-toggler">
            <i class="icon-login"></i>
        </a>
        <client-only>
            <div class="page-quick-sidebar-wrapper">
                <div class="page-quick-sidebar">
                    <ul class="nav nav-tabs">
                        <li class="active">
                            <a href="#quick_sidebar_tab_companies" data-toggle="tab">
                                {{ $t('Компании') }}
                            </a>
                        </li>
                    </ul>
                    <div id="search-company" v-if="companies.length > 10">
                        <input type="text" class="form-control" v-model="search" :placeholder="$t('Поиск компании...')"/>
                    </div>
                    <div class="tab-content">
                        <div class="tab-pane active page-quick-sidebar-chat active" id="quick_sidebar_tab_companies">
                            <div class="page-quick-sidebar-chat-users" data-rail-color="#ddd" data-wrapper-class="page-quick-sidebar-list" data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200" >
                                <ul v-if="companiesOrder.length" class="media-list list-items">
                                    <li v-for="company in companiesOrder" class='media' :data-comp_id="company.comp_id">
                                        <div class='media-body'>
                                            <a :href="showDomainUrl ? company.domainUrl : '/company/' + company.comp_id" class="font-grey-cararra">
                                                <h4 class='media-heading'>
                                                    <i class='fa fa-sign-in'> </i> {{ company.comp_name }}
                                                    <i :class="company.status_icon" title="company.status" v-if="company.status !== undefined"> </i>
                                                </h4>
                                            </a>
                                            <div class="media-heading-sub" v-if="company.comp_state==2" >
                                                <span >{{ company.comp_state_name }}</span>
                                            </div>
                                            <div style="color:cadetblue;font-size: 12px" v-if="company.comp_state==0" >
                                                <span >{{ company.info }}</span>
                                            </div>
                                        </div>
                                    </li>
                                </ul>
                                <div class="empty-label" v-else>{{ $t('Ничего не найдено') }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </client-only>
    </div>
</template>

<script>
    import psl from 'psl';
    import { deepCopyObject } from "~/shared/utils";

    export default {
        data() {
            return {
                showDomainUrl: !process.env.LOCAL_DEV,
                sessionDomain: '',
                isDomain: RegExp('(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]'),
                search: '',
            }
        },

        computed: {
            companies() {
                const list = deepCopyObject(this.$store.state.companies) || [];

                return list.map(company => {
                    if (company.domain) {
                        if (this.isDomain.test(company.domain)) {
                            company.domainUrl = 'https://' + company.domain;
                        } else {
                            company.domainUrl = 'https://' + company.domain + '.' + this.sessionDomain;
                        }
                    }

                    return company;
                });
            },

            companiesOrder() {
                const items = this.companies;

                if (this.search !== '') {
                    return items.filter(item =>
                        this.contains(item.comp_name)
                    )
                } else {
                    return items;
                }
            }
        },

        mounted() {
            const parsed = psl.parse(window.location.host);

            this.sessionDomain = parsed.domain;
        },

        watch: {
            companiesOrder() {
                this.$nextTick().then(() => {
                    $('.page-quick-sidebar-chat-users').getNiceScroll().resize();
                })
            }
        },

        methods: {
            contains(value) {
                const request = this.search;

                return value.toString().toLocaleLowerCase().includes(request);
            }
        }
    }
</script>

<style>
    .empty-label {
        padding: 20px;
        text-align: center;
    }
    .page-content-wrapper.history-hide .page-content .col-md-9.main-right-side-content {
        width: 100%;
        -webkit-transition: width 200ms ease-in, opacity 1.5s ease-out;
        -moz-transition: width 200ms ease-in, opacity 1.5s ease-out;
        -o-transition: width 200ms ease-in, opacity 1.5s ease-out;
        transition: width 200ms ease-in, opacity 1.5s ease-out;
    }
    .page-content-wrapper.history-hide .page-content .col-md-3.right-side-content {

        right: -25%;
        display: none;
        -webkit-transition: all 1s ease-in-out;
        -moz-transition: all 1s ease-in-out;
        -o-transition: all 1s ease-in-out;
        transition: all 1s ease-in-out;
    }

    #companies_sidebar #search-company {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 260px;
    }

    #companies_sidebar #search-company input {
        background: none;
        border-color: #99a8b5;
        color: #99a8b5;
        height: 30px;
        font-size: 13px;
    }

    .popover-content {
        padding: 4px 8px;
        color: #454545;
    }

    .popover>.arrow, .popover>.arrow:after {
        display: block !important;
    }
</style>
