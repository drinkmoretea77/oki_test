<template>
    <div ref="bar" :class="type === 'warning' ? 'mt-cookie-consent-bar' : 'mt-cookie-consent-bar-2'">
        <div class="container">
            <div class="mt-cookie-consent-bar-holder">
                <div class="mt-cookie-consent-bar-content">
                    <slot v-bind="{ close }" />
                </div>
                <div class="mt-cookie-consent-bar-action">
                    <slot name="actions" v-bind="{ close }"></slot>
                    <a v-if="!hasActions" href="javascript:" class="mt-cookie-consent-btn-2 btn btn-circle green" @click="close">{{ $t("Закрыть")}}</a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            type: {
                type: String,
                default: 'danger',
            }
        },

        computed: {
            hasActions() {
                return !!this.$slots['actions'] || !!this.$scopedSlots['actions']
            }
        },

        methods: {
            close() {
                $(this.$refs.bar).hide();
                this.$emit('update');
            },
        }
    }
</script>

<style scoped>
    .mt-cookie-consent-bar-2 a {
        color: #fff;
        text-decoration: underline;
    }

    .mt-cookie-consent-bar-2 a.mt-cookie-consent-btn {
        text-decoration: none;
    }

    .mt-cookie-consent-bar-2 a.mt-cookie-consent-btn-2 {
        text-decoration: none;
    }
</style>
