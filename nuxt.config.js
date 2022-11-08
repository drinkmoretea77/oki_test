require('dotenv').config();
const path = require('path');
const fs = require('fs');

const host = process.env.NUXT_HOST || 'localhost';
const port = process.env.NUXT_PORT || 80;
const mock = process.env.NUXT_MOCK || false;

const plugins = [
    '~/plugins/axios',
    '~/plugins/i18n',
    '~/plugins/actions',
    '~/plugins/shared',
    '~/plugins/api',
    '~/plugins/tooltip',
    '~/plugins/portal',
    '~/plugins/navigation',
    {
        src: '~/plugins/vue-editor',
        mode: 'client',
    },
];

if (mock) {
    plugins.unshift('~/plugins/mock');
}

module.exports = {
    env: {
        SESSION_DOMAIN: process.env.SESSION_DOMAIN,
        LOCAL_DEV: process.env.LOCAL_DEV,
    },

    server: {
        port: port,
        host: host,
    },

    telemetry: false,

    loading: '~/components/Loading.vue',

    router: {
        middleware: ['nuxt-pages'],
        linkActiveClass: 'active',
    },

    mode: 'universal',
    /*
     ** Headers of the page
     */
    head: {
        title: process.env.npm_package_name || '',
        meta: [
            { charset: 'utf-8' },
            {
                name: 'viewport',
                content: 'width=device-width, initial-scale=1',
            },
            {
                hid: 'description',
                name: 'description',
                content: process.env.npm_package_description || '',
            },
        ],
        link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
    /*
     ** Global CSS
     */
    css: [],
    /*
     ** Plugins to load before mounting the App
     */
    plugins,
    /*
     ** Nuxt.js dev-modules
     */
    buildModules: ['@nuxt/typescript-build'],
    /*
     ** Nuxt.js modules
     */
    modules: [
        // Doc: https://axios.nuxtjs.org/usage
        '@nuxtjs/axios',
        '@nuxtjs/proxy',
        'cookie-universal-nuxt',
    ],
    /*
     ** Axios module configuration
     ** See https://axios.nuxtjs.org/options
     */
    axios: {
        proxy: true,
    },

    proxy: {
        '/a/': {
            target: 'https://sandbox.oki-toki.net/',
        },
    },

    /*
     ** Build configuration
     */
    build: {
        cssSourceMap: false,
        extend(config) {
            config.resolve.alias['vue'] = 'vue/dist/vue.common';

            config.module.rules.push({
                test: [/\.pot?$/, /\.mo$/],
                loader: require.resolve('messageformat-po-loader'),
                options: {
                    biDiSupport: false,
                    defaultCharset: null,
                    defaultLocale: 'ru',
                    forceContext: false,
                    pluralFunction: null,
                    verbose: false,
                    outputPath: '',
                },
            });
        },
    },
};
