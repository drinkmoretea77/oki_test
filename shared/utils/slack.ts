import { Context } from '@nuxt/types';

async function sendError(context: Context, params: any): Promise<any> {
    const defaultData = {
        type: 'vue_error',
        error: 'Необработанная ошибка запроса на сервер',
        page: context.route.path,
        user_agent: process.server ? context.req.headers['user-agent'] : navigator.userAgent,
        ...params
    }

    const { data } = await context.$axios.post('/api/error', defaultData);

    return data;

}

export {
    sendError
}
