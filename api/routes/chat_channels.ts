const chat_channels = {
    get_list: 'a/chat_channels/list/{mode}',

    get_create: 'a/chat_channels/{source_name}/create',
    store: 'a/chat_channels/{source_name}/store',
    check: 'a/chat_channels/{source_name}/check',
    get_edit: 'a/chat_channels/{id}/edit',
    update: 'a/chat_channels/{id}/update',
    archive: 'a/chat_channels/{id}/archive',
    restore: 'a/chat_channels/{id}/restore',

    fb_get_pages_list: 'a/chat_channels/facebook/pages-list',
    fb_get_posts_list: 'a/chat_channels/facebook/posts-list',
    fb_get_page_igid: 'a/chat_channels/facebook/page-igid',

    whatsapp_okitoki_auth: 'a/chat_channels/whatsapp/okitoki/auth',
    whatsapp_okitoki_auth_check: 'a/chat_channels/whatsapp/okitoki/auth-check',
}

export default chat_channels;
