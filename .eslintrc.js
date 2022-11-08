module.exports = {
    root: true,
    env: {
        browser: true,
        node: true
    },
    extends: [
        '@nuxtjs/eslint-config-typescript',
        'plugin:nuxt/recommended',
        'prettier'
    ],
    rules: {
        'nuxt/no-cjs-in-config': 'off',
        'vue/script-indent': [
            'error',
            2,
            {
                'baseIndent': 1
            }
        ]
    }
}
