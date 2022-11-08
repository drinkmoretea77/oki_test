import OurVue, { VueConstructor } from 'vue';

function install(Vue: VueConstructor, options: any = {}) {
	if ((install as any).installed) return
	(install as any).installed = true

	if (OurVue !== Vue) {
		console.error('Multiple instances of Vue detected')
	}

	// Компоненты которые подключаются на всех страницах
    // К именам добавляется префикс, например компонент Header станет <v-header />
	const NameLayout: string = 'V';
	const requireComponent: any = require.context(
		'./components',
		true,
		/[A-Z]\w+\.(vue|js)$/
	);

	requireComponent.keys().forEach((fileName: string) => {
		const componentConfig = requireComponent(fileName);
		const path = fileName.split('/').pop();

		if (path) {
			const name = path.replace(/\.\w+$/, '');
			const componentName: any = NameLayout + name;

			Vue.component(
				componentName,
				componentConfig.default || componentConfig
			);
		}
	});
}

export default {
	install
}
