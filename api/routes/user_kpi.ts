const prefix = `/a/user_kpi`;

const user_kpi = {
    get_list_active: `${prefix}/list/active`,
    get_list_all: `${prefix}/list/all`,
    get_list_archive: `${prefix}/list/archive`,

    get_create_form: `${prefix}/create`,
    set_create_form: `${prefix}/store`,

    get_edit_form: `${prefix}/{id}/edit`,
    set_edit_form: `${prefix}/{id}/update`,

    remove: `${prefix}/{id}/delete`,
    restore: `${prefix}/{id}/undelete`,
    rollback_params: `${prefix}/{id}/rollback-params`,

    get_balance_list: `${prefix}/balance/list`,
    get_transaction_create_form: `${prefix}/transaction/create`,
    set_transaction_create_form: `${prefix}/transaction/store`,
    get_transaction_import: `${prefix}/transaction/import`,
    set_transaction_import: `${prefix}/transaction/import`,

    get_log: `${prefix}/reports/log`,
    get_log_result: `${prefix}/reports/log-result`,
}

export default user_kpi;
