<template>
    <ul class="sub-menu">
        <template v-for="item in items">
            <template>
                <li :data-name="item.name" :class="[ item.items ? 'nav-item' : '', item.active ? 'active': '' ]">
                    <template v-if="item.url">
                        <nuxt-link :to="item.url">
                            <i v-if="item.icon" class="fa" :class="[ item.icon ? 'fa-' + item.icon : '' ]" aria-hidden="true"></i>
                            <span class="title">
                                <template v-if="item.is_bold">
                                    <strong>{{ item.title }}</strong>
                                </template>
                                <template v-else>
                                    {{ item.title }}
                                </template>
                                <template v-if="item.badges">
                                    <span v-for="badge in item.badges"
                                          class="badge badge-danger"
                                          :class="{'badge-danger': badge.color === 'danger',}"
                                          v-tooltip="badge.text"
                                    >
                                        {{ badge.label }}
                                    </span>
                                </template>
                            </span>
                        </nuxt-link>
                    </template>
                    <template v-else>
                        <a class="nav-link nav-toggle" href="javascript:">
                            <i v-if="item.icon" class="fa" :class="[ item.icon ? 'fa-' + item.icon : '' ]" aria-hidden="true"></i>
                            <span class="title">
                                <template v-if="item.is_bold">
                                    <strong>{{ item.title }}</strong>
                                </template>
                                <template v-else>
                                    {{ item.title }}
                                </template>
                            </span>
                            <span class="arrow" :class="{ 'open': item.active }"></span>
                        </a>
                        <navigation-sub-list v-if="item.items" :items="item.items" />
                    </template>
                </li>
            </template>
            <template v-if="item.items && item.url">
                <li :data-name="item.name" class="active open">
                    <navigation-sub-list v-if="item.items" :items="item.items" />
                </li>
            </template>
        </template>
    </ul>
</template>

<script>
    export default {
        name: 'navigation-sub-list',

        props: {
            items: {
                type: Array,
                default: () => ([])
            }
        }
    }
</script>
