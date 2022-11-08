const removeDuplicates = (arr: any[], key: string | number) => {
    return [...new Map(arr.map(item => [item[key], item])).values()];
}

const deepCopyObject = (inObject: any) => {
    let outObject: any, value: any, key: any;

    if (typeof inObject !== "object" || inObject === null) {
        return inObject;
    }

    outObject = Array.isArray(inObject) ? [] : {};
    for (key in inObject) {
        if (inObject.hasOwnProperty(key)) {
            value = inObject[key];
            outObject[key] = deepCopyObject(value);
        }
    }

    return outObject;
}

function createFormData(data: any) {
    const formData: any = new FormData();

    for (let key in data) {
        if (!data.hasOwnProperty(key)) {
            continue;
        }

        if (Array.isArray(data[key])) {
            for (let i in data[key]) {
                if (!data[key].hasOwnProperty(i)) {
                    continue;
                }

                formData.append(`${key}[]`, data[key][i]);
            }
            continue;
        }

        if (typeof data[key] === 'object') {
            if (!data[key]) {
                continue;
            }

            const items = Object.values(data[key]);
            if (items.length > 1) {
                for (const value of items) {
                    formData.append(`${key}[]`, value);
                }
            } else {
                for (const value of items) {
                    formData.append(`${key}`, value);
                }
            }
            continue;
        }

        if (data[key] === null) {
            data[key] = '';
        }

        formData.append(key, data[key]);
    }

    return formData
}

/**
 * Формирование параметров для запроса
 * @param values Object|Array (Значения полей формы)
  * @param show_all_boolean ?Boolean (Передавать boolean значения, если они равны 'false')
  */
const createParamsUrl = (values: any, show_all_boolean: Boolean=false) => {
    let val = deepCopyObject(values);
    let result = [];

    for(let prop in val) {
        if (val[prop] && val[prop].hasOwnProperty('value')) {
            val[prop] = val[prop].value;
        }

        if (typeof val[prop] === 'boolean') {
            if (val[prop]) {
                result.push(prop + '=1');
            }
            else if (show_all_boolean) {
                result.push(prop + '=');
            }
            continue;
        }

        if (typeof val[prop] === 'object') {
            for (let i in val[prop]) {
                result.push(prop + '[]=' + val[prop][i]);
            }
            continue;
        }

        if (val[prop] + '') {
            result.push(prop + '=' + val[prop]);
        }
    }

    return ((result.length) ? ('?' + result.join('&')) : '').replace('#', '%23');
}

/**
 * Преобразование объекта 'date_range' в параметрах
 * @param values Параметры
 */
const sanitizeDateRange = (values: any) => {
    let val = deepCopyObject(values);
    let result: any={};
    for(let prop in val) {
        if (prop === 'date_range') {
            if (val.date_range?.value !== undefined) {
                val.date_range = val.date_range.value;
            }

            result.date_range = val.date_range.date_range;

            if (val.date_range.date_range !== 'manual_input') {
                continue;
            }

            if (val.date_range.date_time_from) {
                result.date_time_from = val.date_range.date_time_from
            }
            if (val.date_range.date_time_to) {
                result.date_time_to = val.date_range.date_time_to;
            }

            continue;
        }

        result[prop] = val[prop];
    }

    return result;
}

/**
 * Исключение значений по умолчанию из параметров
 * @param values Параметры
 * @param default_values Значения по умолчанию
 */
const sanitizeDefault = (values: any, default_values: any) => {
    let val = deepCopyObject(values);
    let default_val = deepCopyObject(default_values);
    let result: any={};

    for(let prop in val) {
        if (val[prop]?.value !== undefined) {
            val[prop] = val[prop].value;
        }
        if (default_val?.[prop]?.value !== undefined) {
            default_val[prop] = default_val[prop].value;
        }

        if (isDefaultValue(val[prop], default_val?.[prop])) {
            continue;
        }

        result[prop] = val[prop];
    }

    return result;
}

/**
 * TODO: Объект route.query искажает имена полей в случае с массивами
 * Пример: имеем линк ...?dialer[]=111&dialer[]=222&queue[]=333
 * route.query = {
 *     dialer[]: [111, 222],
 *     queue: 333
 *
 * Необходимый объект должен быть = {
 *     dialer: [111, 222],
 *     queue: [333]
 *
 * @param query
 */
const makeParamsFromQuery = (query: any) => {
    let query_params = deepCopyObject(query);
    let result: any = {};
    let new_name;
    for (let name in query_params) {
        if (name.indexOf('[]') > 0) {
            new_name = name.replace('[]', '');
            if (Array.isArray(query_params[name])) {
                result[new_name] = query_params[name];
                continue;
            }

            result[new_name] = [query_params[name]];
            continue;
        }

        if (query_params[name] === null) {
            query_params[name] = '';
        }

        result[name] = query_params[name];
    }

    return result;
}

/**
 * Является ли значение параметра дефолтным
 * @param prop Object|Array (Текущее значение)
 * @param default_prop ?Object|Array (Значение по умолчанию.)
 */
const isDefaultValue = (prop: any, default_prop: any) => {
    if (default_prop === undefined) {
        return false;
    }

    if (Array.isArray(prop) && Array.isArray(default_prop)) {
        if(prop.length != default_prop.length) {
            return false;
        }

        for(let i = 0; i < prop.length; i++) {
            if(prop[i] != default_prop[i]) {
                return false;
            }
        }

        return true;
    }

    return (prop == default_prop);
}

export {
    deepCopyObject,
    removeDuplicates,
    sanitizeDateRange,
    sanitizeDefault,
    createParamsUrl,
    createFormData,
    makeParamsFromQuery
}
