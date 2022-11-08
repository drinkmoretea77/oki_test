<template>
    <ul class="page-sidebar-menu page-header-fixed position-relative " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed="200">
        <li v-for="item in items" class="nav-item" :data-name="item.name" :class="{ 'active': item.active, 'open': item.active }">
            <template v-if="item.url">
                   <nuxt-link :to="item.url">
                       <i v-if="item.icon" class="fa" :class="[ item.icon ? 'fa-' + item.icon : '' ]" aria-hidden="true"></i>
                       <span class="title uppercase">
                           {{ item.title }}
                           <template v-if="item.badges">
                               <span
                                   v-for="badge in item.badges"
                                   class="badge badge-danger"
                                   :class="{
                                       'badge-danger': badge.color === 'danger',
                                   }"
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
                    <span class="title uppercase">{{ item.title }}
                        <template v-if="item.badges">
                               <span
                                   v-for="badge in item.badges"
                                   class="badge badge-danger"
                                   :class="{
                                       'badge-danger': badge.color === 'danger',
                                   }"
                                   v-tooltip="badge.text"
                               >
                                   {{ badge.label }}
                               </span>
                           </template>
                    </span>
                    <span class="arrow" :class="{ 'open': item.active }"></span>
                </a>
                <navigation-sub-list v-if="item.items" :items="item.items" />
            </template>
        </li>
    </ul>
</template>

<script>
    import NavigationSubList from "./NavigationSubList";

    export default {
        name: 'navigation-list',

        components: {
            NavigationSubList
        },

        props: {
            items: {
                type: Array,
                default: () => ([])
            },
        },
    }
</script>
