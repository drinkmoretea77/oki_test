<template>
    <div>
        <h1>
            <a @click="updateData" href="javascript:" class="fa fa-refresh"></a>
            {{ $t('Список активных сессий') }}
        </h1>
        <v-permissions />

        <div class="note note-info">
            <p>{{ $t('Это инструмент для мониторинга сессий пользователей в оперместе и админпанели.  Здесь вы можете узнать откуда зашел пользователь, как давно, на какой странице он находится.')}}</p>
        </div>

        <template>
            <div class="tabs-tables row">
                <div class="col-md-12 col-sm-12 col-xs-12">
                    <ul class="nav nav-tabs tabs-left">
                        <li v-for="(tab, key) in data_tabs" :class="(key === 0) ? 'active' : ''">
                            <a :href="'#tab_' + tab.name" data-toggle="tab">
                                <span class="caption-subject font-green-sharp bold uppercase" v-text="tab.title"></span>
                            </a>
                        </li>
                    </ul>
                </div>

                <div class="col-md-12 col-sm-12 col-xs-12">
                    <div class="tab-content">
                        <div v-for="(tab, key) in data_tabs"
                             :id="'tab_' + tab.name"
                             :class="'tab-pane fade ' + ((key === 0) ? 'active in' : '')"
                        >
                            <div class="row">
                                <div class="col-md-12 tabs-tables-table-wrapper">
                                    <content-spinner :load="is_load" />
                                    <table-standard :data_table="tab.data" :fields_table="tab.fields" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';

    import ContentSpinner from '~/shared/components/form/ContentSpinner.vue';
    import TableStandard from '~/components/log/components/tables/TableStandard.vue';

    export default Vue.extend({

        data: () => ({
            data_tabs: {},
            is_load: false
        }),

        computed: {
            ...mapState({
                data_admin: ({ log_sessions }: any) => log_sessions.data.admin,
                data_operators: ({ log_sessions }: any) => log_sessions.data.operators,
            })
        },

        components: {
            ContentSpinner,
            TableStandard,
        },

        created: function() {
            this.data_tabs = [
                {
                    name : 'admin',
                    title: this.$t('Административный интерфейс'),
                    fields: [
                        {
                            name: 'user_name',
                            title: this.$t('Пользователь'),
                            link: 'user_link'
                        },
                        {
                            name: 'roles',
                            title: this.$t('Роль'),
                            links_list: true
                        },
                        {
                            name: 'time',
                            title: this.$t('Время'),
                            data_title: 'Длительность нахождения пользователя на последней полученной странице'
                        },
                        {
                            name: 'url_title',
                            title: this.$t('Последний URL'),
                            badge: {
                                type_name: 'badge_icon_link',
                                field_link: 'log_actions_link',
                                icon_class: 'fa fa-external-link'
                            }
                        },
                        {
                            name: 'ip_address',
                            title: this.$t('IP')
                        }
                    ],
                    data: this.data_admin,
                },
                {
                    name: 'operators',
                    title: this.$t('Операторское место'),
                    fields: [
                        {
                            name: 'user_name',
                            title: this.$t('Оператор'),
                            link: 'row_link',
                            badge: {
                                type_name: 'badge_standard',
                                field_key: 'status_node',
                                title_field_key: 'ip'
                            },
                            is_add_after: false
                        },
                        {
                            name: 'user_status_desc',
                            title: this.$t('Статус'),
                            badge: {
                                type_name: 'user_status',
                                field_key: 'user_status'
                            },
                        },
                        {
                            name: 'real_time',
                            title: this.$t('Время начала'),
                            classes: 'text-center'
                        },
                        {
                            name: 'time',
                            title: this.$t('Длительность'),
                            classes: 'text-center'
                        },
                        {
                            name: 'queue',
                            title: this.$t('Очередь')
                        },
                        {
                            name: 'session_id',
                            title: this.$t('ID звонка')
                        },
                        {
                            name: 'mm_pid',
                            title: this.$t('Номер процесса'),
                            data_title: 'Номер подключения опер места к серверу'
                        },
                        {
                            name: 'status_comment',
                            title: this.$t('Комментарий')
                        },
                        {
                            name: 'browser',
                            title: this.$t('Браузер'),
                        }
                    ],
                    data: this.data_operators
                }
            ];
        },

        methods: {
            async updateData() {
                this.is_load = true;
                await this.$store.dispatch('log_sessions/update');
                this.is_load = false;
            }
        }
    })
</script>

<style scoped>
.tabs-tables .nav-tabs>li {
    float: left;
    margin-bottom: -1px;
}

.tabs-tables .tabs-left.nav-tabs {
    border-right: none;
}

.tabs-tables .nav-tabs {
    border-bottom: 1px solid #ddd;
}

.tabs-tables-table-wrapper {
    overflow-y: hidden;
}
</style>
