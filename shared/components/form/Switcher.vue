<template>
    <div class="form-group" :data-field-name="name" :data-field-tab="tabName">
        <div class="control-label col-md-3">
            {{ label }}
            <span v-if="required" class="required" aria-required="true">
                *
            </span>
        </div>
        <div class="col-md-9">
            <input
                ref="input"
                type="checkbox"
                :name="name"
                class="switch skip_uniform"
                data-size="mini"
                :data-on-text="$t('Да')"
                :data-off-text="$t('Нет')"
                data-handle-width="25"
                data-label-width="25"
                autocomplete="off"
                v-model="localValue"
                v-bind="$attrs"
            />
            <template v-if="help">
                <span
                    v-if="hint_type === 'block'"
                    class="help-block"
                    v-html="help"
                ></span>
                <i
                    v-else
                    ref="help"
                    class="fa fa-question-circle help-icon"
                    v-tooltip="help"
                />
            </template>
        </div>
    </div>
</template>

<script>
export default {
    inject: {
        tabsItem: {
            default: null,
        },
    },

    props: {
        type: {
            type: String,
            default: 'text',
        },

        label: {
            type: String,
            default: '',
        },

        help: {
            type: String,
            default: '',
        },

        placeholder: {
            type: String,
            default: '',
        },

        name: {
            type: String,
            default: '',
        },

        value: {
            type: Boolean,
            default: false,
        },

        required: {
            type: Boolean,
            default: false,
        },

        hint_type: {
            type: String,
            default: 'icon',
        },
    },

    data() {
        return {
            localValue: null,
            tabName: '',
        };
    },

    created() {
        if (this.tabsItem) {
            this.tabName = this.tabsItem.name;
        }
    },

    mounted() {
        this.localValue = this.value;
        this.$nextTick().then(() => {
            new Switchery(this.$refs.input, {
                size: 'small',
                color: '#1BBC9B',
                disabledOpacity: 0.3,
            });
        });
    },

    watch: {
        value() {
            this.localValue = this.value;
        },

        localValue() {
            this.$emit('input', this.localValue);
        },
    },
};
</script>

<style lang="stylus" scoped>
.control-label
    padding-top: 0

.form-group > div > .fa-question-circle
    top: -4px
    left: -15px
    width: 30px
    height: 30px
    display: flex
    align-items: center
    justify-content: center
</style>
