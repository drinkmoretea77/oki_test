<template>
    <div style="margin-top:2px; cursor:pointer;" @click="goTo">
        <v-user-avatar
            v-if="user"
            :user-name="user.name"
            :group-name="user.group.name"
            :group-color="user.group.color"
        />
    </div>
</template>

<script>
import {mapState} from 'vuex';

export default {
    computed: {
        ...mapState({
            user: ({user}) => user,
        }),
    },

    methods: {
        goTo() {
            if (this.user) {
                this.$router.push({
                    path: '/n/users/' + this.user.id + '/edit'
                });
            }
        }
    }
}
</script>

