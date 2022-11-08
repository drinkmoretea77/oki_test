const express = require('express');
const consola = require('consola');
const { Nuxt, Builder } = require('nuxt');
const Docs = require('./docs');
const docs = new Docs();
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;
const app = express();
const axios = require('axios');
const config = require('../nuxt.config.js');
const { createProxyMiddleware } = require('http-proxy-middleware');
config.dev = process.env.NODE_ENV !== 'production';

process.on('unhandledRejection', (reason) => {
    console.log('reason', reason.stack);
    if (config.dev) {
        return;
    }

    const url =
        'https://hooks.slack.com/services/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';
    const json = JSON.stringify({
        channel: '#nuxt_exceptions',
        blocks: [
            {
                type: 'header',
                text: {
                    type: 'plain_text',
                    text: 'Необработанное исключение - unhandledRejection',
                },
            },
            {
                type: 'section',
                text: {
                    type: 'plain_text',
                    text: reason.message,
                },
            },
            {
                type: 'section',
                text: {
                    type: 'plain_text',
                    text: reason.stack,
                },
            },
        ],
    });

    try {
        axios.post(url, json, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.log(error);
    }
});

async function start() {
    const nuxt = new Nuxt(config);
    const { host, port } = nuxt.options.server;
    await nuxt.ready();

    if (config.dev) {
        const builder = new Builder(nuxt);
        await builder.build();
    }

    const middleware = createProxyMiddleware({
        target: 'https://home.oki-toki.net/',
        changeOrigin: true,
        cookieDomainRewrite: 'localhost',
        onProxyReq(proxyReq) {
            proxyReq.setHeader('User-Agent', 'Oki-Toki API 1.0');
        },
    });

    app.use('/a', middleware);

    app.use('/logger', (req, res) => {
        res.j;
    });

    app.use('/n/api/docs/:name', (req, res) => {
        res.json(docs.get(req.params.name));
    });

    app.use(nuxt.render);
    app.listen(port, host);

    consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true,
    });
}

start();
