export type SmsGate = {
    id: number,
    gate_name: string,
    enabled: boolean,
    gate_type: number,
    price: number,
    gate_login: string,
    gate_password: string,
    has_sms: number,
    sent_sms: number,
    signation: string,
    gsm_id: number,
    alert_limit: number,
    prefix: string,
    api_key: string
}
