<template>
    <div class="table-standard">
        <table v-if="data_table && data_table.length && fields_table && fields_table.length"
            class="table table-striped table-hover table-advance big-headers"
        >
            <thead>
                <tr>
                    <th v-for="field in fields_table" v-text="field.title"></th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="data in data_table">
                    <td v-for="field in fields_table">
                        <div :title="field.data_title" :class="field.classes">
                            <template v-if="field.name==='browser'">
                                <div
                                    v-if="data.browser"
                                    style="display: flex"
                                >
                                    {{ data.browser.name }}
                                    <badge-standard :color_class="'info'"
                                                    :text="data.browser.small_version"
                                                    :title="data.browser.version"
                                    />
                                </div>
                            </template>
                            <template
                                v-else-if="field.hasOwnProperty('link') ||
                                  field.hasOwnProperty('links_list') ||
                                  field.hasOwnProperty('badge')">

                                <template v-if="field.hasOwnProperty('link')">
                                    <a class="inline-block"
                                       :href="data[field.link]"
                                       v-text="data[field.name]"
                                    >
                                    </a>
                                </template>

                                <template v-if="field.hasOwnProperty('links_list')">
                                    <a v-for="(link, key) in data[field.name]"
                                       class="inline-block"
                                       :href="link.url"
                                       v-text="((key > 0) ? ', ' : '') + link.title"
                                    >
                                    </a>
                                </template>

                                <template v-if="field.hasOwnProperty('badge')">
                                    <template v-if="field.is_add_after && !field.hasOwnProperty('link')">
                                        <span>{{ data[field.name] }}</span>
                                    </template>

                                    <template v-if="field.badge.type_name === 'user_status'">
                                        <user-status :status="data[field.badge.field_key]" :text="data[field.name]"/>
                                    </template>
                                    <template v-if="field.badge.type_name === 'badge_standard'">
                                        <badge-standard :color_class="'info'"
                                                        :text="data[field.badge.field_key]"
                                                        :title="data[field.badge.title_field_key]"
                                        />
                                    </template>
                                    <template v-if="field.badge.type_name === 'badge_icon_link'">
                                        {{ data[field.name] }} &nbsp;
                                        <a class="inline-block"
                                           :href="data[field.badge.field_link]"
                                           target="_blank"
                                        >
                                            <i :class="field.badge.icon_class"></i>
                                        </a>
                                    </template>
                                </template>

                            </template>
                            <template v-else>
                                {{ data[field.name] }}
                            </template>
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
        <v-empty v-else />
    </div>
</template>

<script>
    import UserStatus from '~/components/log/components/badges/UserStatus.vue';
    import BadgeStandard from '~/components/log/components/badges/BadgeStandard.vue';

    export default {
        props: {
            data_table: {
                type: Array,
                default: null
            },
            fields_table: {
                type: Array,
                default: null
            }
        },

        components: {
            UserStatus,
            BadgeStandard
        },
    }
</script>
