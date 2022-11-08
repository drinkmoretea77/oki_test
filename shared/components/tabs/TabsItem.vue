<template>
    <div
        class="v-tabs-item tab-pane fade"
        :class="{
            active: show,
            in: show,
        }"
        v-if="show || keep"
    >
        <template v-show="show">
            <slot />
        </template>
    </div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
    inject: {
        tabsState: {
            default: null,
        },

        formState: {
            default: null,
        },
    },

    props: {
        name: {
            type: String,
            default: '',
        },

        keepAlive: {
            type: Boolean,
            default: false,
        },
    },

    provide(): any {
        return {
            tabsItem: this.state,
        };
    },

    data(): any {
        return {
            index: 0,
            selectedName: '',
            keep: false,
            state: {
                name: '',
            },
        };
    },

    computed: {
        show(): boolean {
            const status: boolean =
                String(this.selectedName) === String(this.tabsState.value);

            if (status && this.keepAlive) {
                this.keep = true;
            }

            return status;
        },
    },

    created() {
        if (this.formState) {
            this.keep = true;
        }

        const index: any = this.tabsState.items.length;
        this.index = index;
        this.selectedName = this.name || String(index);
        this.state.name = this.selectedName;
        this.tabsState.items.push(this.selectedName);
    },
});
</script>

<style>
@keyframes v-tabs-item {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}
.v-tabs-item {
    animation: v-tabs-item 0.3s ease-out;
}
</style>
