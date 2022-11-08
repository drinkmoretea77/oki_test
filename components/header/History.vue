<template>
    <li
        id="header_history_icon"
        class="dropdown dropdown-dark"
        v-show="hasHistory"
    >
        <a
            href="javascript:"
            @click="historyToggle()"
            class="dropdown-toggle"
            :title="$t('Журнал изменений')"
            style="padding-right: 10px"
        >
            <i
                class="fa fa-history fa-5x"
                :class="[show ? 'font-default' : 'font-green-sharp']"
            ></i>
            <span class="badge badge-default" v-if="count_history">{{
                count_history
            }}</span>
        </a>
    </li>
</template>

<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';

export default Vue.extend({
    data(): any {
        return {
            count_history: 0,
        };
    },

    computed: {
        ...mapState({
            show: ({ showHistory }: any) => showHistory,
            hasHistory: ({ side_content }: any) => side_content,
        }),
    },

    mounted() {},

    methods: {
        getCounter: async function () {
            if (!this.hasHistory?.url) {
                return;
            }

            const { data } = await this.$api.get(this.hasHistory.url, {
                get_count: true,
            });

            this.count_history = data?.count || 0;
        },

        historyToggle() {
            this.$store.dispatch('toggleHistory');
        },
    },
});
</script>

<style scoped>
#header_history_icon {
    padding-right: 10px;
}
</style>
