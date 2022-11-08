export const state = () => ({
	title: '',
	text: '',
	ok: '',
	cancel: '',
	resolve: null,
	open: false,
	size: 'xs',
	okColor: 'primary'
});

export const actions = {
	confirmation({ commit }, data) {
		commit('updateData', data || {});

		return new Promise((resolve, reject) => {
			commit('updateResolve', resolve);
		});
	},

	confirmationStatus({ commit, state }, status) {
		if (status) {
			commit('resolveOk');
		} else {
			commit('resolveCancel');
		}
	}
};

export const mutations = {
	updateData (state, data) {
		state.title = data.title || '';
		state.text = data.text || '';
		state.ok = data.ok || '';
		state.cancel = data.cancel || '';
		state.size = data.size || 'xs';
		state.okColor = data.okColor || 'primary';
		state.open = true;
	},

	updateResolve (state, data) {
		state.resolve = data;
	},

	resolveOk(state) {
		state.resolve(true);
		state.open = false;
	},

	resolveCancel(state) {
		state.resolve(false);
		state.open = false;
	}
};
