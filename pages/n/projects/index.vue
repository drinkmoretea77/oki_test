<template>
    <div class="content-wrapper">
        <v-page-header :title="title">
            <nuxt-link to="/n/projects/create" class="btn btn-primary">{{
                $t('Создать')
            }}</nuxt-link>
        </v-page-header>
        <div class="note note-info">
            <p>
                {{
                    $t(
                        'Инструмент «Проекты» относится к улучшенному типу безопасности, позволяющему построить отдельные, приватные бизнес - процессы, изолированные друг от друга.'
                    )
                }}
                <a
                    href="https://www.oki-toki.net/blog/bezopasnost_proekty_/"
                    target="_blank"
                    >{{ $t('Подробнее в этой статье.') }}</a
                >
            </p>
        </div>

        <v-list v-if="items.length" name="projects_list" :defaultView="3">
            <template slot="header">
                <v-search
                    :placeholder="$t('Поиск')"
                    @submit="updateSearchRequest"
                />
            </template>
            <template v-if="searchItems.length">
                <v-list-item
                    v-for="item in searchItems"
                    :key="item.id"
                    :controls="false"
                >
                    <v-list-content>
                        <v-list-title>
                            <nuxt-link :to="'/n/projects/project/' + item.id">{{
                                item.name
                            }}</nuxt-link>
                        </v-list-title>
                        <v-list-text>
                            <div v-if="item.description">
                                {{ item.description }}
                            </div>
                        </v-list-text>
                        <v-list-date v-if="item.updated">
                            {{ $t('Изменен:') }} {{ item.updated.user_name }},
                            {{ item.updated.updated_at }}
                        </v-list-date>
                    </v-list-content>
                </v-list-item>
            </template>
            <template slot="another">
                <v-empty
                    v-if="!searchItems.length"
                    :label="$t('Ничего не найдено')"
                />
            </template>
        </v-list>
        <v-empty v-else />
    </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Context } from '@nuxt/types';
import { routes } from '~/api';
import { deepCopyObject } from '~/shared/utils';

export default Vue.extend({
    navigation: 'projects',

    async asyncData({ $api }: Context): Promise<any> {
        const { data } = await $api.get(routes.projects.get_list);
        return {
            items: data?.projects ? data.projects : [],
        };
    },

    head(): any {
        return {
            title: this.title,
        };
    },

    data(): any {
        return {
            title: this.$t('Проекты'),
            searchRequest: '',
        };
    },

    computed: {
        searchItems() {
            let result: any = deepCopyObject(this.items);

            if (this.searchRequest !== '') {
                result = result.filter((item: any) =>
                    this.searchFilter(item.name)
                );
            }

            return result;
        },
    },

    methods: {
        searchFilter(value: string | number): any {
            return value
                .toString()
                .toLocaleLowerCase()
                .includes(this.searchRequest);
        },

        updateSearchRequest(request: string): any {
            this.searchRequest = request.toLocaleLowerCase();
        },
    },
});
</script>
