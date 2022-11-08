<template>
    <div class="alert alert-warning alert-report">
        <i class="fa" :class="[ icon ]"></i>
        <div>
            <template v-if="!disableLabel">
                <h2 v-if="label">{{ label }}</h2>
                <h2 v-else>{{ $t('Нет данных для отображения.') }}</h2>
            </template>
            <slot />
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            icon: {
                type: String,
                default: 'fa-filter'
            },

            label: {
                type: String,
                default: ''
            },

            disableLabel: {
                type: Boolean,
                default: false
            }
        },

        methods: {
            show() {
                $(this.$refs.modal).modal('show');
                this.$emit('show');
            },

            close() {
                $(this.$refs.modal).modal('hide');
                this.$emit('close');
            }
        },

        watch: {
            open() {
                if (this.open) {
                    this.show();
                } else {
                    this.close();
                }
            }
        }
    }
</script>
