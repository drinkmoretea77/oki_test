<template>
    <v-validate :rules="rules" :mask="mask" :filter="filter" :dirty="dirty" v-slot="{ v, localMask, localFilter }">
        <div class="form-group" :class="[ { 'has-error': v.errors.length || errors.length }]">
            <div class="control-label col-md-3">
                {{ label }}
                <span v-if="required" class="required" aria-required="true"> * </span>
            </div>
            <div class="col-md-9">
                <div class="v-textarea-wrapper">
                    <div class="textarea-copy-btn" @click="copyValue" v-tooltip="$t('Скопировать в буфер')">
                        <span class="fa fa-copy"></span>
                    </div>
                     <textarea
                        ref="input"
                        :placeholder="placeholder"
                        :name="name"
                        :rows="rows"
                        v-model="localValue"
                        class="form-control"
                        v-bind="$attrs"
                    ></textarea>
                </div>
               
                <div v-for="error in [...v.errors, ...errors]" class="help-block validator-message">{{ error }}</div>
                <template v-if="help">
                    <span v-if="hint_type === 'block'" class="help-block" v-html="help"></span>
                    <i v-else class="fa fa-question-circle help-icon" v-tooltip="help" />
                </template>
            </div>
        </div>
    </v-validate>
</template>

<script>
	export default {
        props: {
            type: {
                type: String,
                default: 'text'
            },

            copy: {
                type: Boolean,
                default: false
            },

            label: {
                type: String,
                default: ''
            },

            help: {
                type: String,
                default: ''
            },

            placeholder: {
                type: String,
                default: ''
            },

            name: {
                type: String,
                default: ''
            },

            value: {
                type: String,
                default: ''
            },

            required: {
                type: Boolean,
                default: false
            },

            rows: {
                type: [Number, String],
                default: 5
            },

            hint_type: {
                type: String,
                default: 'icon'
            },

            rules: {
                type: String,
                default: ''
            },

            mask: {
                type: String,
                default: ''
            },

            filter: {
                type: String,
                default: ''
            },

            dirty: {
                type: Boolean,
                default: false
            },

            errors: {
                type: Array,
                default: () => ([])
            },

        },

		data() {
			return {
				localValue: ''
			}
		},

		created() {
			this.$nextTick().then(() => {
				this.localValue = this.value;
			})
		},

		watch: {
			value() {
				this.localValue = this.value;
			},

			localValue() {
				this.$emit('input', this.localValue);
			}
		},

        methods: {
            copyValue() {
                const input = this.$refs.input;
                if (input) {
                    try {
                        input.select();
                        document.execCommand('copy');
                        input.blur();
                        toastr['success'](this.$t('Скопировано'));
                    } catch (error) {
                        console.log(error);
                        toastr['error'](this.$t('Ошибка копирования'));
                    }
                }
            },
        }
	}
</script>


<style lang="stylus" scoped>
    .v-textarea-wrapper
        position: relative
    .textarea-copy-btn
        cursor: pointer
        display: flex
        align-items: center
        position: absolute
        right: 8px
        top: 8px
        background-color: rgba(255,255,255,0.3)
        color: #3f444a
        font-size: 12px
        font-weight: 600
        border-radius: 2px
        line-height: 1.44
        user-select: none 
        padding: 8px 14px 7px
        border: 1px solid #e1e5ec
        transition: all .15s ease-out
        &:hover
            background-color: rgba(255,255,255,0.5)
        &:active
            background-color: rgba(255,255,255,0.7)
</style>
