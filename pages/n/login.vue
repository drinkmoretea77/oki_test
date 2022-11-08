<template>
    <div class="content-wrapper">
        <div class="row">
            <div class="col-sm-6">
                <v-form
                    v-bind="loginForm"
                    v-slot="{ inputs, validate, submitValidate }"
                    @success="login"
                >
                    <v-input label="email" v-model="inputs['email'].value" />
                    <v-input
                        label="password"
                        v-model="inputs['password'].value"
                    />
                    <div style="text-align: right">
                        <button
                            class="btn btn-primary"
                            @click="submitValidate(validate)"
                        >
                            Login
                        </button>
                    </div>
                </v-form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            loginForm: {
                method: 'post',
                action: '/a/operator/chats/layout/login',
                fields: {
                    email: {
                        value: 'paulsmith.front@gmail.com',
                    },
                    password: {
                        value: 'z9WXVAJfya',
                    },
                },
            },
        };
    },

    methods: {
        login() {
            this.$router.push('/n/projects');
        },
    },
};
</script>
