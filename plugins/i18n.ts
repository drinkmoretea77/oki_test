import { Plugin, Context } from '@nuxt/types';

const localizations: any = {
    en: null,
    ua: null,
};

const options = {
    locale: 'ru',
    localeDefault: 'ru',
};

async function loadLocale(lang: string) {
    const langs = ['en', 'ua'];
    if (!langs.includes(lang)) return;

    try {
        localizations[lang] = await import(`../../lang/translations/nuxt/${lang}.json`);
    } catch (error) {
        console.error(error);
        localizations[lang] = null;
    }
}

function t(query: string, ...props: any): string {
    if (
        options.locale === options.localeDefault ||
        localizations[options.locale] === null
    ) {
        return replacePlaceholders(query, [...props]);
    } else {
        if (!localizations[options.locale] || !localizations[options.locale][query]) {
            return replacePlaceholders(query, [...props]);
        } else {
            return localizations[options.locale][query];
        }
    }
}

function replacePlaceholders(query: string, props: any[]): string {
    if (props.length === 0) {
        return query;
    }

    let output = query;

    for (let i = 0; i < props.length; i++) {
        output = output.replace('%' + (i + 1), props[i]);
    }

    return output;
}

function i18nForceLocale(locale: string): void {
    options.locale = locale || 'ru';
}

function getLang() {
    return options.locale;
}

declare module 'vue/types/vue' {
    interface Vue {
        $t(query: string, ...props: any): string;
        $i18nForceLocale(locale: string): void;
        $getLang(): string;
    }
}

declare module '@nuxt/types' {
    interface Context {
        $t(query: string, ...props: any): string;
        $i18nForceLocale(locale: string): void;
        $getLang(): string;
    }
}

const i18nPlugin: Plugin = async (context: Context, inject: any) => {
    const lang = context.app.$cookies.get('lang');
    await loadLocale(lang);
    i18nForceLocale(lang);

    inject('t', t);
    inject('i18nForceLocale', i18nForceLocale);
    inject('getLang', getLang);
};

export default i18nPlugin;

export { t };
