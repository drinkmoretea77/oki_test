<template>
    <div class="page-sidebar navbar-collapse collapse">
        <navigation-list v-if="Array.isArray(items)" :items="items" />
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    import NavigationList from "./NavigationList";

    export default {
        components: {
            NavigationList
        },

        computed: {
            ...mapState({
                items: ({ navigation }) => navigation?.items || [],
                user: ({ user }) => user,
                companies: ({ companies }) => companies,
                currentCompany: ({ currentCompany }) => currentCompany,
                messages: ({ messages }) => messages,
                logo: ({ logo }) => logo,
            })
        },

        watch: {
            '$route': {
                deep: true,
                handler(params) {
                    this.$store.dispatch('changeRoute', params.path);
                }
            }
        },
    }
</script>
