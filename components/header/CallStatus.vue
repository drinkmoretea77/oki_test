<template>
    <div class="call-status">
        <div class="call-status__data">
            <span class="font-yellow-crusta">{{ statuses[status] }}:</span> {{ timer }}
        </div>
        <button type="button" class="btn btn-sm btn-primary" @click="call">{{ $t('Позвонить') }}</button>
    </div>
</template>

<script>
    import { mapState } from 'vuex';

    export default {
        computed: {
            ...mapState({
                user_data: ({ checklist }) => checklist.user_data,
            }),
        },

        data() {
            return {
                timer: ' 00:00:00',
                status: 0,
                statuses: [
                    'Offline',
                    'Online',
                    'Away',
                    'Busy',
                    'PCP',
                    'Wait',
                    'Preview',
                ],
                interval: 0
            }
        },

        mounted() {
            console.log('checklist call', this.checklist)

            this.init()
        },

        beforeDestroy() {
            clearInterval(this.interval);
        },

        methods: {
            init() {
                let count = 0;
                let status = 0;

                if (this.user_data) {
                    count = this.user_data.status_time;
                    status = this.user_data.status_id;
                }

                this.count = count;
                this.status = status;

                this.interval = setInterval(() => {
                    this.updateTimer()
                }, 1000);

                window.interviewEvents = new BroadcastChannel('interview')
                window.interviewEvents.onmessage = (event) => {
                    const { data } = event;
                    if (data?.event === 'status' && data?.payload) {
                        const payload = data.payload;
                        if (payload.status_id !== undefined && payload.status_id !== null) {
                            this.status = payload.status_id;
                        }

                        if (payload.status_time) {
                            this.count = payload.status_time;
                        } else {
                            this.count = 0;
                        }
                    }

                }
            },

            updateTimer() {
                this.count++;
                const date = new Date(0);
                date.setSeconds(this.count);

                this.timer = date.toISOString().substr(11, 8);
            },
            call() {
                const button = document.getElementById('call-button');

                if (button) {
                    const event = new Event('click');
                    button.dispatchEvent(event);
                }
            }
        }
    }
</script>

<style lang="stylus">
    .call-status
        height: 50px
        display: flex
        align-items: center
        color: #98a6ba
        &__data
            margin-right: 15px
</style>
