export enum QuestHtmlTypeEnum {
    HTML_TYPE_CHECK  = 'check',
    HTML_TYPE_SELECT = 'select'
}

export enum AnswerDialerPhoneTypeEnum {
    DIALER_PHONE_TYPE_ALL  = 'all',
    DIALER_PHONE_TYPE_LIST = 'list',
    DIALER_PHONE_TYPE_MOB  = 'MOB',
    DIALER_PHONE_TYPE_WORK = 'WORK',
    DIALER_PHONE_TYPE_HOME = 'HOME',
    DIALER_PHONE_TYPE_CURR = 'CURR',
}

export enum AnswerTypeEnum {
    ANSWER_TYPE_SIMPLE = 'simple',
    ANSWER_TYPE_TEXT   = 'text',
    ANSWER_TYPE_SELECT = 'select',
}

export type AnswerNotification = {
    answer_id: number,
    template_id: number,
    enabled: boolean,
    emails: [],
    id: number
}

export type Answer = {
    id: number,
    answer: string,
    quest_id: number,
    answer_num: number,
    url: string,
    hint: string,
    required: boolean,
    enabled: boolean,
    data_type: string,
    list_id: number,
    help: string,
    end_int: boolean,
    points: number,
    start_bp: [],
    delay_int: boolean,
    delay_till: string,
    report: boolean,
    change_owner: number,
    call_manage: string,
    call_manage_params: string,
    answer_tmpl: string,
    open_shop: boolean,
    open_link: boolean,
    disable_phone: boolean,
    set_status: number,
    call_tags: [],
    tags: [],
    change_queue: number,
    end_dialer: number,
    start_dialer: number,
    dialer_phone_type: AnswerDialerPhoneTypeEnum.DIALER_PHONE_TYPE_ALL,
    reset_task: boolean,
    answer_type: AnswerTypeEnum.ANSWER_TYPE_SIMPLE,
    callback_user: number,
    notifications: AnswerNotification[]
}

export type Question = {
    id: number
    quest: string,
    interview_id: number,
    html_type: QuestHtmlTypeEnum.HTML_TYPE_SELECT,
    quest_num: number,
    start_priority: number,
    enabled: boolean,
    hide_quest: boolean,
    use_post: boolean,
    open_link: boolean,
    hint: string,
    help: string,
    quest_tmpl: string,
    url: string,
    roles: [],
    set_status: number,
    answers: Answer[];
}
