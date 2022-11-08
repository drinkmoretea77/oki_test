<template>
    <div class="initials header-avatar" :style="{ 'background-color': getColor }">
        {{ getLetter }}
        <i v-if="groupName"
           class="fa fa-circle icon_opacity icon_sign_group"
           :style="{ 'color': groupColor }"
           v-tooltip="$t('Группа:') + ' ' + groupName"></i>
        <i v-else
           class="fa fa-circle icon_opacity icon_sign_group font-grey-gallery"
           v-tooltip="$t('Группа не указана')"></i>
    </div>
</template>

<script>
    export default {
        props: {
            userName: {
                type: String,
                default: '',
            },

            groupName: {
                type: String,
                default: '',
            },

            groupColor: {
                type: String,
                default: '',
            },
        },

        computed: {
            getLetter() {
                return this.userName ? this.userName[0] : 'A';
            },

            getColor() {
                if (this.color) {
                    return this.color;
                }

                const userName = this.userName;
                let color = [0, 0, 0];

                for (let i = 0; i < userName.length; i++) {
                    color[i % 3] += userName.charCodeAt(i);
                }

                for (let i = 0; i < color.length; i++) {
                    color[i] = color[i] % 150;
                }

                return 'rgb(' + color[0] + ',' + color[1] + ',' + color[2] + ')';
            },
        },
    }
</script>
