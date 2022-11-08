<template>
    <div class="layout-messages">
        <expired-objects v-if="!storageProblem && showExpiredObjects"
                         :expired-objects-data="expiredObjectsData"
                         :comp_id="company.id"
                         @resolved="showExpiredObjects = false"
        />

        <v-modal v-if="storageProblem" :freeze="true">
            <template v-slot:header>
                <h4 class="modal-title">{{ $t("Проблема с внешним хранилищем") }}</h4>
            </template>
            <template v-slot:body>
                <div class="row">
                    <div class="col-sm-2">
                        <i class="fa fa-warning font-red-intense" style="font-size: 70px; line-height: 1;"></i>
                    </div>
                    <div class="col-sm-10 padding-left-0">
                        {{ $t("Ваше внешнее хранилище для записей разговоров не работает правильно, заполнено или отключено.") }}
                        <br>
                        {{ $t("Записи будут удаляться. Исправьте ошибку или увеличьте хранилище в Оки-Токи.") }}
                    </div>
                </div>
            </template>
            <template v-slot:footer>
                <hr class=" margin-top-0">
                <nuxt-link class="btn btn-primary" to="/integration_externals">{{ $t("Исправить") }}</nuxt-link>
            </template>
        </v-modal>

        <message-bar v-if="isCompanyBlocked" @update="updateFixHeight">
            <template v-if="companyBlockedMessage">
                {{ companyBlockedMessage }}
                <nuxt-link to="/services">{{ $t("здесь") }}</nuxt-link>.
            </template>
            <template v-else>
                {{ $t("Ой, на вашем счету нет средств. Пожалуйста пополните счет или воспользуйтесь кредитованием") }}
                <nuxt-link to="/services">{{ $t("здесь") }}</nuxt-link>.
            </template>
        </message-bar>

        <message-bar v-if="nonameDomain" @update="updateFixHeight">
            <template v-if="company.domain">
                {{ $t("Вы используете домен") }} <em>noname</em>. {{ $t("Настройте домен для своей компании") }} <nuxt-link :to="'/n/company/' + company.comp_id + '/edit'">{{ $t("здесь") }}</nuxt-link> {{ $t("для ускорения загрузки и удобства работы.") }}
            </template>
            <template v-else>
                {{ $t("Вы используете домен") }} <em>noname</em>. {{ $t("Но у вас есть домен:") }} <a :href="'//' + company.domain + '.oki-toki.net'">{{ company.domain }}.oki-toki.net</a> {{ $t("Используйте его чтобы страницы грузились быстрее и надежнее..") }}
            </template>
        </message-bar>

        <message-bar v-if="balanceDaysLeft" @update="updateFixHeight">
            <slot>
                {{ balanceDaysLeft }}
            </slot>
            <template v-slot:actions="{ close }">
                <button type="button" class="mt-cookie-consent-btn btn btn-circle btn-primary" @click="submitBalanceDaysLeft('/financial', close)">{{ $t("Пополнить сейчас") }}</button>&nbsp;
                <button type="button" class="mt-cookie-consent-btn btn btn-circle btn-success" @click="submitBalanceDaysLeft(null, close)">{{ $t("Отложить") }}</button>
            </template>
        </message-bar>

        <message-bar v-if="trialUrlForm" @update="updateFixHeight">
            <slot>
                <a :href="trialUrlForm" target="_blank">
                    <span>{{ $t("Чтобы перевести на Оки-Токи первый проект, заполните нашу Анкету") }}</span>
                </a>
            </slot>
            <template v-slot:actions="{ close }">
                <button id="trial-form-complete" type="button" class="mt-cookie-consent-btn btn btn-circle btn-primary" @click="trialAction('complete', close)">{{ $t("Уже заполнил") }}</button>&nbsp;
                <button id="trial-close-panel" type="button" class="mt-cookie-consent-btn btn btn-circle btn-success" @click="trialAction('close', close)">{{ $t("Закрыть") }}</button>
            </template>
        </message-bar>

    </div>
</template>

<script>
    import { mapState } from 'vuex';
    import MessageBar from './components/MessageBar.vue';
    import ExpiredObjects from './components/ExpiredObjects.vue';

    export default {
        components: {
            MessageBar,
            ExpiredObjects
        },

        data() {
            return {
                showExpiredObjects: false
            }
        },
        computed: {
            ...mapState({
                company: ({ currentCompany }) => currentCompany,
                isCompanyBlocked: ({ messages }) => messages?.is_company_blocked || '',
                companyBlockedMessage: ({ messages }) => messages?.company_blocked_message || '',
                balanceDaysLeft: ({ messages }) => messages?.balance_days_left || '',
                trialUrlForm: ({ messages }) => messages?.trial_url_form || '',
                nonameDomain: ({ messages }) => messages?.is_noname_domain || '',
                storageProblem: ({ messages }) => messages?.is_storage_problem || '',
                expiredObjectsData: ({ messages }) => messages?.expired_objects || null,
            })
        },

        mounted() {
            this.updateFixHeight();
            this.showExpiredObjects = !!this.expiredObjectsData;
        },

        methods: {
            async updateFixHeight() {
                await this.$nextTick();

                if (App) {
                    App.runResizeHandlers();
                }

                setTimeout(() => {
                    const fixHeight = $('.fix-height-res').height();
                    $('.page-container').css('margin-top', fixHeight + 'px');
                }, 0);
            },

            async submitBalanceDaysLeft(url, callback = () => {}) {
                await this.$action({
                    url: '/ajax/balance/hide-notify',
                    redirect: url || null,
                    errorRedirect: url || null,
                    silent: true
                });

                callback();
            },

            async trialAction(action, callback = () => {}) {
                let url = '/ajax/trial/close_panel';

                if (action === 'complete') {
                    url = '/ajax/trial/form_complete';
                }

                const { data } = await this.$action({
                    url: url,
                    silent: true
                });

                if (data.status) {
                    callback();
                }
            },
        }
    }
</script>
