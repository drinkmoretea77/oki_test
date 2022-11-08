import { deepCopyObject } from '~/shared/utils';

const regex = /{([^{]+)}/g;

function interpolate(template: string, variables: object) {
    return template.replace(regex, (match, name) => {
        return getObjPath(name, variables);
    });
}

function interpolateAction(template: string, variables: object) {
    const removedParams: string[] = [];
    const object = deepCopyObject(variables);
    const path = template.replace(regex, (match, name) => {
        if (object.hasOwnProperty(name)) {
            removedParams.push(name);
            delete object[name];
        }

        return getObjPath(name, variables);
    });

    return {
        path: `${path}`,
        removedParams,
    };
}

function interpolateQuery(template: string, variables: object) {
    const object = deepCopyObject(variables);
    const path = template.replace(regex, (match, name) => {
        if (object.hasOwnProperty(name)) {
            delete object[name];
        }

        return getObjPath(name, variables);
    });
    let query = '';

    if (Object.keys(object).length) {
        query = '?' + new URLSearchParams(object).toString();
    }

    return `${path}${query}`;
}

function getObjPath(path: string, obj: any) {
    return path.split('.').reduce((res, key) => {
        return res[key] !== undefined && res[key] !== null
            ? res[key]
            : `{${key}}`;
    }, obj);
}

export { interpolate, interpolateQuery, interpolateAction };

export default interpolate;
