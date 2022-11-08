<template>
    <ValidationProvider
        tag="div"
        :rules="localRules(rules)"
        :data-field-name="name"
        :data-field-tab="tabName"
        v-slot="v"
    >
        <slot v-bind="{ v, localMask: mask, localFilter }" />
    </ValidationProvider>
</template>

<script>
import { ValidationProvider, extend } from 'vee-validate';
import { t } from '~/plugins/i18n';
import {
    isNotEmpty,
    isNumeric,
    isInteger,
    isFloat,
    min,
    minNumeric,
    max,
    maxNumeric,
    contains,
    isEmail,
    isPhone,
} from '~/shared/utils/validators';

extend('required', {
    validate: isNotEmpty,
    computesRequired: true,
    message: t('Это обязательное поле'),
});

extend('numeric', {
    validate(value) {
        return isNumeric(value);
    },
    message: t('Значение должно быть числом'),
});

extend('integer', {
    validate(value) {
        return isInteger(value);
    },
    message: t('Значение должно быть целочисленным'),
});

extend('float', {
    validate: isFloat,
    message: t('Значение должно быть дробным'),
});

extend('min', {
    validate(value, args) {
        return min(value, { min: args.min });
    },
    params: ['min'],
    message: t('Минимальная длина {min}'),
});

extend('min-numeric', {
    validate(value, args) {
        return minNumeric(value, { min: args.min });
    },
    params: ['min'],
    message: t('Минимальное значение {min}'),
});

extend('max', {
    validate(value, args) {
        return max(value, { max: args.max });
    },
    params: ['max'],
    message: t('Максимальная длина {max}'),
});

extend('max-numeric', {
    validate(value, args) {
        return maxNumeric(value, { max: args.max });
    },
    params: ['max'],
    message: t('Максимальное значение {max}'),
});

extend('contains', (value, search) => {
    return contains(value, search);
});

extend('email', {
    validate: isEmail,
    message: t('Введите валидный Email адрес'),
});

extend('phone', {
    validate: isPhone,
    message: t('Введите валидный телефон'),
});

export default {
    components: {
        ValidationProvider,
    },

    inject: {
        tabsItem: {
            default: null,
        },
    },

    props: {
        name: {
            type: String,
            default: '',
        },

        rules: {
            type: String,
            default: '',
        },

        errors: {
            type: Array,
            default: () => [],
        },

        mask: {
            type: String,
            default: '',
        },

        filter: {
            type: String,
            default: '',
        },

        dirty: {
            type: Boolean,
            default: false,
        },
    },

    data() {
        return {
            tabName: '',
            localMask: null,
            localFilter: '',
        };
    },

    created() {
        this.updateFilter();

        if (this.tabsItem) {
            this.tabName = this.tabsItem.name;
        }
    },

    methods: {
        updateFilter() {
            if (!this.filter) {
                const rules = this.localRules(this.rules);

                if (rules.includes('numeric')) {
                    this.localFilter = 'numeric';
                }
            } else {
                this.localFilter = this.filter;
            }
        },

        localRules(list) {
            let rules = list;

            if (
                rules.includes('numeric') ||
                rules.includes('integer') ||
                rules.includes('float')
            ) {
                rules = rules
                    .replace('min', 'min-numeric')
                    .replace('max', 'max-numeric');
            }

            return rules;
        },
    },
};
</script>
