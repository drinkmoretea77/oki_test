<template>
    <div class="accordion-project-objects">
        <div class="panel panel-default"
             v-for="(group, group_name) in groups"
        >
            <div class="panel-heading">
                <h4 class="panel-title">
                    <a class="accordion-project-objects-title" @click="onChangeShow(group_name)">
                        {{ group.title }}
                        <i v-if="group.collapsed" class="fa fa-angle-left pull-right"></i>
                        <i v-else class="fa fa-angle-down pull-right"></i>
                    </a>
                </h4>
            </div>

            <div class="panel-collapse collapse"
                 aria-expanded="true"
                 :ref="group_name"
            >
                <div class="panel-body">
                    <project-group
                        :project_id="project_id"
                        :objects="getObjects(group_name)"
                        @update="update"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import ProjectGroup from '~/components/projects/widget/ProjectGroup.vue';
    export default {
        components: {
            ProjectGroup
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
                groups: {
                    connection: {
                        title: this.$t('Связь'),
                        collapsed: true,
                        object_names: ['queues', 'dialers', 'post_companies']
                    },
                    users: {
                        title: this.$t('Пользователи'),
                        collapsed: true,
                        object_names: ['users']
                    },
                    other_resources: {
                        title: this.$t('Другие ресурсы'),
                        collapsed: true,
                        object_names: ['schedules', 'lists', 'interview', 'contact_field', 'call_scripts', 'notify_templates']
                    },
                },
            }
        },

        methods: {
            getObjects(group_name) {
                let result = [];
                let object_name;
                for (let i_object in this.groups[group_name].object_names) {
                    object_name = this.groups[group_name].object_names[i_object];
                    for (let i in this.objects) {
                        if (this.objects[i].name === object_name) {
                            result.push(this.objects[i]);
                            break;
                        }
                    }
                }
                return result;
            },

            onChangeShow(group_name) {
                let param;
                for (let name in this.groups) {
                    if (name === group_name) {
                        param = this.groups[group_name].collapsed ? 'show' : 'hide';
                        $(this.$refs[group_name]).collapse(param);
                        this.groups[group_name].collapsed = !this.groups[group_name].collapsed;
                        continue;
                    }

                    if (this.groups[name].collapsed) {
                        continue;
                    }

                    $(this.$refs[name]).collapse('hide');
                    this.groups[name].collapsed = true;
                }
            },

            update(data) {
                this.$emit('update', data);
            }
        },
    }
</script>

<style>
    .accordion-project-objects-title {
        display: block;
    }
    .accordion-project-objects .panel {
        margin-bottom: 10px;
    }
</style>
