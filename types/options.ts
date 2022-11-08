export interface SelectOption {
    [key: string]: any;
    value: any,
    text: string
}

export interface SelectOptions {
    [key: string]: SelectOption[]
}

