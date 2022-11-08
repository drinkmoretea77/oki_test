import { Plugin } from '@nuxt/types';
import { ActionParams } from './actions';

async function get(this: any, route: string, data: any, params: ActionParams = {}): Promise<any> {
    if (route) {
        const request: ActionParams = {
            silent: true,
            ...params,
            url: route,
            method: 'get',
        };

        request.params = data;

        return await this.$action(request);
    } else {
        console.error('Роут не передан:', name);
        return null;
    }
}

async function post(this: any, route: string, data: any, params: ActionParams = {}): Promise<any> {
    if (route) {
        const request: ActionParams = {
            ...params,
            url: route
        };

        request.dataParams = data;

        return await this.$action(request);
    } else {
        console.error('Роут не передан:', name);
        return null;
    }
}

interface ApiInterface {
    get: (route: string, data: any, params: ActionParams) => Promise<any>,
    post: (route: string, data: any, params: ActionParams) => Promise<any>,
}

declare module 'vue/types/vue' {
    interface Vue {
        $api: any
    }
}

declare module '@nuxt/types' {
    interface Context {
        $api: any
    }
}

const apiPlugin: Plugin = (context, inject) => {
    const api: ApiInterface = {
        get: get.bind(context),
        post: post.bind(context)
    };

    inject('api', api);
};

export default apiPlugin;
