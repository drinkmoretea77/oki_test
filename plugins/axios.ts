import { Context } from '@nuxt/types';
import { sendError } from '~/shared/utils/slack';
import { AxiosResponse } from 'axios';

let debug = false;

function errorRedirect(error: any, context: any, redirect: any) {
    const message = error.message ? error.message : 'Неизвестная ошибка';
    const info =
        error.response && error.response.data ? error.response.data : {};
    const url = error.config.url ? error.config.url : 'unknown url';

    if (info.trace) {
        delete info.trace;
    }

    if (url !== '/api/error') {
        sendError(context, {
            error: message,
            info: JSON.stringify(info),
            url: url,
        })
            .then(() => {
                redirect('/n/server-error');
            })
            .catch((error) => {
                console.error('Отправка отчёта об ошибки не удалась', error);
                redirect('/n/server-error');
            });
    }
}

export default function (context: Context) {
    const {
        $axios,
        redirect,
        route,
        error: nuxtError,
        req,
        app,
        store,
    } = context;

    $axios.onRequest((config) => {
        console.log('Making request to ' + config.url);
        config.withCredentials = true;
        if (process.server) {
            /*
            let url: string = config.url ? config.url : '/';

            if (url[0] !== '/') {
                url = '/' + url;
            }

            config.url = 'https://' + req.headers.host + url;
            config.headers.common['host'] = req.headers.host;*/
        }

        return config;
    });

    $axios.onResponse((response: AxiosResponse) => {
        const { data } = response;

        if (data) {
            if (data.page_access) {
                store.dispatch('changePermissions', data.page_access);
            }

            if (data.side_content) {
                store.dispatch('changeSideContent', data.side_content);
            }
        }
    });

    if (app.router) {
        let firstRender = true;

        app.router.beforeEach((to, from, next) => {
            if (firstRender) {
                firstRender = false;
                next();
            } else {
                store.dispatch('clearHistory');
                store.dispatch('clearPermissions');
                next();
            }
        });
    }

    $axios.onError((error: any) => {
        const code = parseInt(error.response && error.response.status);
        const authCodes: any = [401, 419];

        console.log('error', error);

        if (authCodes.includes(code)) {
            const path =
                '/login?redirect=' + encodeURIComponent(route.fullPath);

            if (process.client) {
                //window.location.replace(path);
            } else {
                //redirect(path);
            }
        } else {
            if (debug) {
                errorRedirect(error, context, redirect);
            }

            if (error?.config?.method.toLowerCase() !== 'get') {
                console.log(error);
            } else {
                // Если передать null/false/undefined, то Nuxt подставит свой текст
                let message = '0';

                if (error.response?.data?.error) {
                    message = error.response.data.error;
                }

                if (error?.config?.catchErrors !== false) {
                    return nuxtError({ statusCode: code, message });
                }
            }
        }
    });
}
