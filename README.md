# client

> nuxt app

## Build Setup

```bash
# install dependencies
$ yarn install

# serve with hot reload at localhost:80
$ yarn dev

# build for production and launch server
$ yarn build
$ yarn start

# generate static project
$ yarn generate
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

#Общие договорённости по разработке

* Если ссылки статические, то запрашивать через api их не надо.
* Если для ссылки нужны параметры, то запрашиваем только объект с параметрами.
