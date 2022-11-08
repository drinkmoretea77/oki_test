<template>
    <div class="accordion-project-group">
        <v-list v-if="objects.length" name="projects_list" :defaultView="3">
            <template>
                <v-list-item v-for="item_obj in objects" :key="item_obj.name" :controls="false">
                    <v-list-content>
                        <v-list-title>
                            <a @click="change(item_obj.name)">{{ item_obj.title }}</a>
                            <span class="badge badge-info">{{ item_obj.items.length }}</span>
                        </v-list-title>
                        <v-list-text>
                            <div>
                                <template v-if="item_obj.items.length">
                                    <div v-for="item in item_obj.items" :key="item.id">
                                        <a :href="getUrl(item_obj.name, item.id)" :data-name="item.name">{{ item.name }}</a>
                                    </div>
                                </template>
                                <template v-else>
                                    <div>{{ $t('Нет выбранных значений') }}</div>
                                </template>
                            </div>
                        </v-list-text>
                    </v-list-content>
                </v-list-item>
            </template>
        </v-list>
        <v-empty v-else />

        <div v-show="is_cahged">
            <object-edit
                v-model="is_cahged"
                :project_id="project_id"
                :name="name"
                :items="items"
                :title="title"
                @update="update"
            />
        </div>
    </div>
</template>

<script>
    import ObjectEdit from '~/components/projects/widget/ObjectEdit.vue';

    export default {
        components: {
            ObjectEdit
        },

        props: {
            project_id: {
                type: [Number, String],
                default: null
            },
            objects: {
                type: Array,
                default: () => ([])
            },
        },

        data() {
            return {
                is_cahged: false,
                name: null,
                title: null,
                items: [],
            }
        },

        methods: {
            change(name) {
                this.name = name;

                this.items = [];
                for (let item in this.objects) {
                    if (this.objects[item].name === name) {
                        this.items = this.objects[item].items;
                        this.title = this.objects[item].title;
                        break;
                    }
                }

                this.is_cahged = true;
            },

            getUrl(name, id) {
                switch (name) {
                    case 'interview':
                        return '/n/crm/' + name + '/' + id;
                    case 'contact_field':
                        return '/n/crm/contact-fields';
                    case 'providers':
                    case 'post_companies':
                        return '/providers/' + id;
                    default:
                        return '/' + name + '/' + id + '/edit';
                }
            },

            update(data) {
                this.$emit('update', data);
            }
        },
    }
</script>
