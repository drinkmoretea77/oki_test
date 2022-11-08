<template>
    <div class="badge-user-status">
        <span v-if="getColor()" :class="'badge badge-roundless badge-' + getColor()" v-text="text"></span>
        <span v-else class="badge-user-status-not-color" v-text="text"></span>
    </div>
</template>

<script>
    export default {
        props: {
            status: {
                type: String,
                default: null
            },
            text: {
                type: String,
                default: null
            }
        },

        data: () => ({
            colors: {
                online: "custom-success",
                away: "info",
                busy: "danger",
                pcp: "warning",
                wait: "danger",
                preview: "warning"
            }
        }),

        methods: {
            getColor: function() {
                return this.colors.hasOwnProperty(this.status) ? this.colors[this.status] : false;
            }
        }
    }
</script>

<style scoped>
    .badge-user-status .badge-user-status-not-color {
        white-space: nowrap;
    }

    .badge-user-status {
        display: inline;
    }
</style>
