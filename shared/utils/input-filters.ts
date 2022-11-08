export const numberFilter = (value: any) => {
    return value.replace(/(?!-)[^0-9.]/g, '');
}

export const positiveNumbersFilter = (value: any) => {
    return value.replace(/-/g, '');
}

