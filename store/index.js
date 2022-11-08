import { deepCopyObject } from '~/shared/utils/helpers';

export const state = () => ({
    logo: null,
    user: null,
    navigation: null,
    companies: null,
    currentCompany: null,
    messages: null,
    side_content: null,
    showHistory: false,
    permissions: null,
    activeNavigation: 'test',
});

function checkActive(list, path, activeNavigation) {
    let active = false;
    path = path.replace(/^https?:\/\/.*?(?=\/|$)/, '');
    const items = list.map((item) => {
        item.active = false;

        if (item.items) {
            const { items, active: hasActive } = checkActive(
                item.items,
                path,
                activeNavigation
            );
            item.items = items;

            if (hasActive) {
                item.active = true;
                active = hasActive;
            }
        }

        if (item.url) {
            if (item.name) {
                if (item.name === activeNavigation) {
                    item.active = true;
                    active = true;
                }
            } else {
                const itemUrl = item.url.replace(/^https?:\/\/.*?(?=\/|$)/, '');
                if (path === itemUrl) {
                    item.active = true;
                    active = true;
                }
            }
        }

        return item;
    });
    return {
        items,
        active,
    };
}

export const actions = {
    async nuxtServerInit(
        { commit, state },
        { req, route, error, redirect, $api }
    ) {
        if (route.path === '/n/test-login') return;

        try {
            const { data, error } = await $api.get('/a/layout/default');

            if (data) {
                if (data.user) {
                    commit('setUser', data.user);
                }

                if (data.logo) {
                    commit('setLogo', data.logo);
                }

                if (data.navigation) {
                    const path = route.path;

                    const { items } = checkActive(
                        data.navigation.items,
                        path,
                        state.activeNavigation
                    );

                    commit('setNavigation', {
                        items,
                    });
                }

                if (data.companies) {
                    commit('setCompanies', data.companies);
                }

                if (data.current_company) {
                    commit('setCurrentCompany', data.current_company);
                }

                if (data.messages) {
                    commit('setMessages', data.messages);
                }
            } else {
                return error({ ...response });
            }
        } catch (requestError) {
            if (requestError.code === 403 && requestError.data.redirect_url) {
                redirect(requestError.data.redirect_url);
            } else {
                // Если передать null/false/undefined, то Nuxt подставит свой текст
                let message = 'Неизвестная ошибка';
                return error({ statusCode: 500, message });
            }
        }
    },

    changePermissions({ commit }, data) {
        commit('setPermissions', data);
    },

    changeSideContent({ commit }, data) {
        commit('setSideContent', data);
    },

    changeActiveNavigation({ commit }, data) {
        commit('setActiveNavigation', data);
    },

    changeRoute({ state, commit }, path) {
        if (state.navigation) {
            const { items } = checkActive(
                deepCopyObject(state.navigation.items),
                path,
                state.activeNavigation
            );

            commit('setNavigation', {
                items,
            });
        }
    },

    clearHistory({ commit }, data) {
        commit('clearSideContent');
        commit('setHideHistory');
    },

    clearPermissions({ commit }, data) {
        commit('setPermissions', null);
    },

    toggleHistory({ state, commit }) {
        if (state.showHistory) {
            commit('setHideHistory');
        } else {
            commit('setShowHistory');
        }
    },
};

export const mutations = {
    setActiveNavigation(state, data) {
        state.activeNavigation = data;
    },

    setShowHistory(state) {
        state.showHistory = true;
    },

    setHideHistory(state) {
        state.showHistory = false;
    },

    setSideContent(state, data) {
        state.side_content = data;
    },

    clearSideContent(state) {
        state.side_content = null;
    },

    setPermissions(state, data) {
        state.permissions = data;
    },

    setUser(state, data) {
        state.user = data;
    },

    setNavigation(state, data) {
        state.navigation = data;
    },

    setCompanies(state, data) {
        state.companies = data;
    },

    setMessages(state, data) {
        state.messages = data;
    },

    setLogo(state, data) {
        state.logo = data;
    },

    setCurrentCompany(state, data) {
        state.currentCompany = data;
    },
};
