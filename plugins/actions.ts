import { Plugin } from '@nuxt/types';
import { DefaultForm } from '~/types';
import {
    deepCopyObject,
    interpolateQuery,
    interpolateAction,
    createFormData,
} from '~/shared/utils';

declare const toastr: any;

interface ActionParams {
    method?: string;
    url?: string;
    params?: any; // query params
    dataParams?: any; // post params
    success?: string; // Выводимый текст при успехе
    error?: string; // Выводимый текст при ошибке
    errorMessage?: boolean; // Выводить оригинальный текст ошибки
    catchErrors?: boolean; // Для GET запросов не редиректить на NuxtError
    silent?: boolean; // Не выводить ошибку
    silentErrors?: boolean; // Не выводить только ошибки
    silentSuccess?: boolean; // Не выводить только успех
    redirect?: string; // url редиректа при успехе
    errorRedirect?: string; // url редиректа при ошибке
    emptyResponseData?: boolean; // Не выводить ошибку при пустом значении data
    files?: boolean; // Перевести весь запрос в FormData
}

function replaceKeys(data: any, keys: string[]) {
    const dataCopy = {
        ...data
    };

    keys.forEach((item: string) => {
        delete dataCopy[item];
    });

    return dataCopy;
}

async function action(
    this: any,
    {
        method = 'post',
        url = '',
        params = {},
        dataParams = {},
        success,
        silentErrors = false,
        silentSuccess = false,
        error,
        errorMessage = true,
        catchErrors = true,
        silent,
        redirect,
        errorRedirect,
        emptyResponseData = false,
        files = false,
    }: ActionParams
): Promise<any> {
    let successLabel = success || this.$t('Данные сохранены');
    let errorLabel = error || this.$t('Ой, что-то пошло не так ...');

    if (this.$store) {
        await this.$store.dispatch('page/updateLoad', true);
    }

    try {
        let requestParams: any = {};

        const { path, removedParams } = interpolateAction(url, {
            ...params,
            ...dataParams,
        });

        if (method === 'get') {
            requestParams.params = replaceKeys(params, removedParams);
        } else {
            const clearParams = replaceKeys(dataParams, removedParams)

            if (files) {
                requestParams.data = createFormData(clearParams)
            } else {
                requestParams.data = replaceKeys(dataParams, removedParams);
            }
        }

        const response = await this.$axios({
            method,
            url: path,
            ...requestParams,
            catchErrors,
        });

        const data = response.data;

        if (data && data.successLabel) {
            successLabel = data.successLabel;
        }

        if (data || emptyResponseData) {
            if (data.error) {
                if (errorMessage) {
                    errorLabel = data.error || errorLabel;
                }

                if (!silent && !silentErrors && process.client) {
                    toastr['error'](errorLabel, this.$t('Ошибка!'));
                }

                if (errorRedirect && process.client) {
                    execRedirect(this, { path: errorRedirect });
                }

                return {
                    error: data.error,
                };
            } else if (Array.isArray(data.errors) && data.errors.length > 0) {
                if (errorMessage) {
                    errorLabel = data.error || errorLabel;
                }

                if (!silent && !silentErrors && process.client) {
                    toastr['error'](data.errors[0], this.$t('Ошибка!'));
                }

                return {
                    errors: data.errors
                }
            } else {
                if (!silent && !silentSuccess && process.client)
                    toastr['success'](successLabel);

                if (redirect && process.client) {
                    execRedirect(this, { path: redirect });
                }

                return {
                    data,
                };
            }
        } else {
            if (!silent && !silentErrors && process.client)
                toastr['error'](errorLabel, this.$t('Ошибка!'));

            if (errorRedirect) {
                execRedirect(this, { path: errorRedirect });
            } else {
                return {
                    error: data,
                };
            }
        }
    } catch (error) {
        console.log(error);

        if (errorMessage) {
            errorLabel = error.response?.data?.error || errorLabel;
        }

        if (!silent && !silentErrors && process.client)
            toastr['error'](errorLabel, this.$t('Ошибка!'));

        if (errorRedirect) {
            execRedirect(this, { path: errorRedirect })
        }

        return {
            error,
        };
    }

    if (this.$store) {
        await this.$store.dispatch('page/updateLoad', false);
    }
}

function execRedirect(context: any, path: any) {
    const router = context.$router || context.app.router;
    router.push(path);
}

function confirmation(this: any, data: any): Promise<any> {
    return this.$store.dispatch('confirmation/confirmation', data);
}

function setFormValues(formObject: DefaultForm, params: object): void {
    const copyParams = deepCopyObject(params);

    for (const [key, value] of Object.entries(copyParams)) {
        if (formObject.fields && formObject.fields.hasOwnProperty(key)) {
            const field: any = formObject.fields[key];

            if (Array.isArray(value) && Array.isArray(field.value)) {
                field.value.splice(0, field.value.length);
                field.value.push(...value);
            } else {
                field.value = null;
                field.value = value;
            }
        }
    }
}

function url(route: string, params: object) {
    return interpolateQuery(route, params);
}

declare module 'vue/types/vue' {
    interface Vue {
        $confirmation(data: any): Promise<any>;
        $url(route: string, params: object): string;
        $action({ ...args }: ActionParams): Promise<any>;
        $setFormValues(formObject: DefaultForm, params: object): void;
    }
}

declare module '@nuxt/types' {
    interface Context {
        $confirmation(data: any): Promise<any>;
        $url(route: string, params: object): string;
        $action({ ...args }: ActionParams): Promise<any>;
        $setFormValues(formObject: DefaultForm, params: object): void;
    }
}

const actionPlugin: Plugin = (context, inject) => {
    inject('confirmation', confirmation);
    inject('url', url);
    inject('action', action);
    inject('setFormValues', setFormValues);
};

export default actionPlugin;

export { action, ActionParams };
