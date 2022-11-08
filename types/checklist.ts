export type CheckListDataDTO = {
    queue_id: number,
    phone: string,
    session_id: number,
    contact_id: number,
    call_type: string,
    bp_id: number,
    dialer_id: number,
    task_id: number,
    details: []
}

export type Checklist = {
    id: number,
    interview_id: number,
    contact_id: number,
    state: number,
    callData: CheckListDataDTO,
    comp_id: number,
    phone_tz: string,
    phone_tz_desc: string,
    questions: [],
    snap: string
}
