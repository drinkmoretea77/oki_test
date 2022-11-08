import { Context } from '@nuxt/types';
export default function ({ app, store }: Context) {
    if (app.router) {
        app.router.afterEach((to: any, from: any) => {
            store.dispatch('changeActiveNavigation', '');

            if (Array.isArray(to.matched) && to.matched.length) {
                try {
                    const navigation: any = to.matched[0].components.default.options.navigation;
                    if (navigation) {
                        store.dispatch('changeActiveNavigation', navigation);
                    }
                } catch (error) {
                    console.log('error', error);
                }
            }
        })
    }
}
