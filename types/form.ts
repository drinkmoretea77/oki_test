export interface Fields {
    [key: string]: unknown
}

export interface FormErrors {
    [key: string]: string[]
}

export type DefaultForm = {
    [key: string]: unknown,
    action?: string,
    method?: string,
    errors?: FormErrors,
    redirect?: string,
    errorRedirect?: string,
    fields?: Fields,
    silent?: boolean,
    requestMiddleware?: any
}
