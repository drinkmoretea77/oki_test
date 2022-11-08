<template>
    <li
        class="v-tabs-control"
        :class="{
            active: selectedName === tabsState.value,
            disabled: disabled,
        }"
    >
        <a
            class="v-tabs-control__link"
            ref="link"
            href="javascript:"
            @click="select"
        >
            <slot />
        </a>
    </li>
</template>

<script>
export default {
    inject: {
        tabsState: {
            default: null,
        },
    },

    props: {
        name: {
            type: String,
            default: '',
        },

        disabled: {
            type: Boolean,
            default: false,
        },
    },

    created() {
        if (this.tabsState) {
            const index = this.tabsState.controls.length;
            this.index = index;
            this.selectedName = this.name || index;
            this.tabsState.controls.push(this.selectedName);
        }
    },

    data() {
        return {
            index: 0,
            selectedName: '',
        };
    },

    methods: {
        select() {
            if (this.disabled) return;

            this.tabsState.value = this.selectedName;
        },
    },

    watch: {
        tabsState: {
            deep: true,
            handler(state) {
                if (state && state.value === this.selectedName) {
                    this.$refs.link.focus();
                }
            },
        },
    },
};
</script>
<style>
.v-tabs-control {
    user-select: none;
}
</style>
