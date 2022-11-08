export const isNotEmpty = (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value) && value.length) return true;

    const type = typeof value;
    switch (type) {
        case 'number':
            return !isNaN(value);
        case 'string':
            return value.trim().length > 0;
        case 'object':
            return Object.keys(value).length > 0;
    }

    return false;
};

export const isNumeric = (value: any): boolean => {
    return !isNaN(Number(value));
}

export const isInteger = (value: any): boolean => {
    return Number.isInteger(Number(value));
}

export const isFloat = (value: any): boolean => {
    return Number(value) === value && value % 1 !== 0;
}

export const min = (value: any, { min }: { min: number | string }): boolean => {
    const stringValue = value + '';
    return stringValue.trim().length >= Number(min);
}

export const minNumeric = (value: any, { min }: { min: number | string }): boolean => {
    return Number(value) >= Number(min);
}

export const max = (value: any, { max }: { max: number | string }): boolean => {
    const stringValue = value + '';
    return stringValue.trim().length <= Number(max);
}

export const maxNumeric = (value: any, { max }: { max: number | string }): boolean => {
    return Number(value) <= Number(max);
}

function check(value: number | string | any[], target: any) {
    let parsedValue = value;

    if (typeof parsedValue === 'number') {
        parsedValue = String(parsedValue);
    }

    return parsedValue.includes(target);
}

export const contains = (value: any, search: any): boolean => {
    const typeValue = typeof value;
    const parsedValue = (Array.isArray(value) ? value : (typeValue !== 'string' ? String(value) : value));

    if (Array.isArray(search)) {
        return search.some((target: any) => check(parsedValue, target));
    }

    return check(parsedValue, search);
}

export const isEmail = (value: any): boolean => {
    const reg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return reg.test(String(value).toLowerCase());
}

export const isPhone = (value: any): boolean => {
    const reg = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    return reg.test(String(value).toLowerCase());
}
