const prefix = `/a/sa`;

const sa = {
    rules: {
        get_list_active: `${prefix}/rules/list/active`,
        get_list_all: `${prefix}/rules/list/all`,
        get_list_archive: `${prefix}/rules/list/archive`,
    },
    rule: {
        get_create_form: `${prefix}/rule/create`,
        set_create_form: `${prefix}/rule/store`,

        get_edit_form: `${prefix}/rule/{id}/edit`,
        set_edit_form: `${prefix}/rule/{id}/update`,

        remove: `${prefix}/rule/{id}/delete`,
        restore: `${prefix}/rule/{id}/undelete`,
    }
}

export default sa;
