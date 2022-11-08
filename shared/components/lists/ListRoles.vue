<template>
    <div class="v-list-roles">
        <div class="v-list-roles__list">
            <a v-for="role in roles" :href="role.link" class="v-list-roles__role badge badge-default" v-tooltip="role.name">
                <span v-if="roles.length > 2" class="v-list-roles__letter">
                    {{ role.name && role.name[0] }}
                </span>
                <span v-else>
                    {{ role.name }}
                </span>
            </a>
        </div>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';

    export default Vue.extend({
        props: {
            roles: {
                type: Array,
                default: () => ([])
            },
        }
    })
</script>

<style lang="stylus">
    .v-list-roles
        position: absolute
        top: 0
        left: 16px
        transform translateY(-50%)

        &__letter
            text-transform: uppercase

        &__list
            display: flex
            align-items: center

        &__role
            text-transform: uppercase
            padding: 0 5px 1px 5px
            height: 19px
            min-width: 19px
            display: inline-flex
            align-items: center
            text-align: center
            justify-content: center
            margin-right: 8px


</style>
