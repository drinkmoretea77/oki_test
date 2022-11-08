<template>
    <div class="v-confirmation">
        <v-modal :load="modal.load" :open="open" :small="size === 'small'" :xs="size === 'xs'" @close="close">
            <template slot="header">
                <h4 class="modal-title">
                    <span v-html="title" />
                </h4>
            </template>
            <template v-if="text" slot="body">
                <span v-html="text" />
            </template>
            <template slot="footer">
                <button type="button" @click="close" class="btn"><span v-html="cancel" /></button>
                <button type="button" class="submit btn" :class="[ `btn-${okColor}` ]" @click="submitOk"><span v-html="ok" /></button>
            </template>
        </v-modal>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';

    export default Vue.extend({
        data(): any {
            return {
                modal: {
                    load: false,
                }
            }
        },

        computed: {
            ...mapState({
                title(this: any, { confirmation }: any): any {
                    return confirmation.title || this.$t('Подтверждение действия');
                },
                text(this: any, { confirmation }: any): any {
                    return confirmation.text || '';
                },
                ok(this: any, { confirmation }: any): any {
                    return confirmation.ok || this.$t('Подтвердить');
                },
                cancel(this: any, { confirmation }: any): any {
                    return confirmation.cancel || this.$t('Отмена');
                },
                open(this: any, { confirmation }: any): any {
                    return confirmation.open;
                },
                size(this: any, { confirmation }: any): any {
                    return confirmation.size;
                },
                okColor(this: any, { confirmation }: any): any {
                    return confirmation.okColor || 'primary';
                },
            })
        },

        methods: {
            close(): any {
                this.submitCancel();
            },

            submitCancel(): any {
                this.$store.dispatch('confirmation/confirmationStatus', false);
            },

            submitOk(): any {
                this.$store.dispatch('confirmation/confirmationStatus', true);
            }
        }
    })
</script>