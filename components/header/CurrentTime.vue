<template>
    <div class="current-comp-time">
        <a v-if="company" :href="'/n/company/' + company.id + '/edit'">{{ displayTime }} <span class="margin-left-5">{{ company.timezone }}</span></a>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        data() {
            return {
                time: null,
                displayTime: ""
            }
        },

        computed: {
            ...mapState({
                company: ({ currentCompany }) => currentCompany,
            })
        },

        mounted() {
            if (this.company) {
                this.time = moment(this.company?.current_time);
                this.displayTime = this.time.format("HH:mm");

                setInterval(() => {
                    this.time.add(10, "s");
                    this.displayTime = this.time.format("HH:mm");
                }, 10000);
            }
        }
    }
</script>

<style lang="stylus">
    .current-comp-time
        display: inline-block
        height: 46px
        padding-top: 16.5px
        float: left
        color: #98a6ba

        a
            color: rgb(152, 166, 186)
</style>
