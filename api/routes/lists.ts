const prefix = `/a/lists`;

const lists = {
    get_list_active: `${prefix}/list/active`,
    get_list_all: `${prefix}/list/all`,
    get_list_archive: `${prefix}/list/archive`,
    list_archive: `${prefix}/{id}/archive`,
    list_restore: `${prefix}/{id}/restore`,
}

export default lists;
