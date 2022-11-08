export const state = () => ({
    project: null,
});

export const actions = {
    async get({ commit }, params) {
        const response = await this.$axios.get('/a/projects_new/get/' + params.id);

        if (response.data) {
            const data = response.data;

            if (data.project) {
                commit('updateProject', data.project);
            }
        }
    },

    set({ commit }, data) {
        if (data.project) {
            commit('updateProject', data.project);
        }
    },

    updateItems({ commit }, data) {
        if (data.name && data.items) {
            const items = [];

            for (const obj of data.items) {
                obj.selected = true;
                items.push(obj);
            }

            commit('setObject', {
                name: data.name,
                items
            });
        }
    }
};

export const mutations = {
    updateProject (state, data) {
        state.project = data;
    },

    setObject(state, data) {
        const object = state.project.objects.find(item => item.name === data.name);

        if (object) {
            object.items.splice(0, object.items.length);
            object.items.push(...data.items);
        }
    }
};
