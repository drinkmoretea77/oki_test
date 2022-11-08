import { numberFilter, positiveNumbersFilter } from '~/shared/utils/input-filters';

function createEvent (name: string) {
    const event = document.createEvent('Event');
    event.initEvent(name, true, true);
    return event;
}

const filters: any = {
    numeric: numberFilter,
    positive: positiveNumbersFilter
}

function onInput(this: any, el: HTMLElement, event: any) {
    const input = el as HTMLInputElement;
    const context = this;
    if (!event.isTrusted) return;
    if (!context.filters) return;

    context.filters.forEach((filter: any) => {
        const currentFilter = filters[filter];

        if (currentFilter) {
            input.value = currentFilter(input.value);
        }
    });

    input.dispatchEvent(createEvent('input'));
}

export default {
    inserted(el: HTMLElement, binding: any) {
        const context = {
            filters: binding.value.split('|')
        };

        el.addEventListener('input', onInput.bind(context, el));
    },

    unbind(el: HTMLElement, binding: any) {
        const context = {
            filters: binding.value.split('|')
        };

        el.removeEventListener('input', onInput.bind(context, el));
    }
};

