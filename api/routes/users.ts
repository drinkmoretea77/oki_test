const users = {
    get_list: 'a/users/list/{mode}',

    get_edit: 'a/users/{id}/edit',
    update: 'a/users/{id}/update',
    get_create: 'a/users/create',
    store: 'a/users/store',
    archive: 'a/users/{id}/archive',
    restore: 'a/users/{id}/restore',

    social_attach: 'a/users/{id}/social-attach',
    social_detach: 'a/users/{id}/social-detach',

    show_api_token: '/users/{id}/show_api_token',
    delete_api_token: '/users/{id}/delete_api_token',
    generate_api_token: '/users/{id}/generate_api_token',

    reset_password: 'a/users/reset_password',
}

export default users;
