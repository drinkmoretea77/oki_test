import * as types from './types';

export const state = () => ({
	interviews: [],
	interview: {
		id: null,
		name: null,
		deleted: null,
		int_count: null,
		params2contact: null,
		links: null,
		permissions: null,
		questions: null,
	},
	queues: [],
	dialers: [],
	users: [],
	static_data: null,


	staticData: {
		queues: null,
		dialers: null,
		users: null,
		callType: {
			ALL: 'Все(входящие и исходящие)',
			IN: 'Входящий',
			OUT: 'Исходящий',
			PD: 'Автообзвон',
		}
	},
	staticDataOptions: {
		queues: [],
		dialers: [],
		users: [],
		callType: [
			{
				text: 'Все(входящие и исходящие)',
				value: 'ALL'
			},
			{
				text: 'Входящий',
				value: 'IN'
			},
			{
				text: 'Исходящий',
				value: 'OUT'
			},
			{
				text: 'Автообзвон',
				value: 'PD'
			},
		]
	}
});

export const actions = {
	async update({ commit }, params) {
		const response = await this.$axios.get('crm/' + params.id);

		if (response.data) {
			const data = response.data;


			if (data.static_data) {
				const static_data = data.static_data;

				for (const [key, value] of Object.entries(static_data)) {
					commit('updateStaticData', [key, value]);
				}
			}


			if (data.interview) {
				commit('updateInterview', data.interview);
			}
		}
	},

	set({ commit }, data) {
		if (data.interview) {
			commit('updateInterview', data.interview);
		}
	},

	setInterviewParams({ commit }, data) {
		for (const [key, value] of Object.entries(data)) {
			commit('updateInterviewParam', [key, value]);
		}
	}
};

export const mutations = {
	updateInterviewParam (state, [key, value]) {
		if (Array.isArray(state.interview[key])) {
			state.interview[key].splice(0, state.interview[key].length);
			state.interview[key].push(...value);
		} else {
			state.interview[key] = value;
		}
	},

	updateInterview (state, data) {
		state.interview = data;
	},

	updateStaticData (state, [name, params]) {
		state.staticData[name] = params;

		if (Array.isArray(state.staticDataOptions[name])) {
			state.staticDataOptions[name].splice(0, state.staticDataOptions[name].length);
		} else {
			state.staticDataOptions[name] = [];
		}


		for (const [key, value] of Object.entries(params)) {
			if (params.hasOwnProperty(key)) {
				state.staticDataOptions[name].push({
					text: value,
					value: key
				});
			}
		}
	}
};
