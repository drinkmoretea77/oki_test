<template>
    <div class="v-permissions">
        <div class="v-permissions__row">
            <div class="v-permissions__left">
                <v-dropdown v-if="permissions && permissions.projects && projects" class="v-permissions__roles" width="250" :on-hover="true" :hide-close="true" inline>
                    <template slot="toggle">
                        <span v-for="project in selectProjects" class="v-permissions__roles-item v-permissions__roles-item--left badge badge-default">{{ project }}</span>
                        <span v-if="Object.values(permissions.projects).length > 5" class="v-permissions__roles-item v-permissions__roles-item--left badge badge-default">
                            +{{ $t('Еще') }}: {{ Object.values(this.permissions.projects).length - 5 }}
                        </span>
                    </template>
                    <div class="v-permissions__roles-content">
                        <div class="v-permissions__roles-title">{{ $t('Проекты') }}</div>
                        <div class="v-permissions__roles-subtitle">{{ $t('Используется в проектах') }}</div>
                        <div v-for="(project, index) in projects" :key="project.id" class="v-permissions__roles-col">
                            <a :href="$url('/n/projects/project/{id}', { id: project.id })">{{ project.name }}</a><template v-if="index !== projects.length - 1">,</template>
                        </div>
                        <div class="v-permissions__roles-controls">
                            <div class="btn btn-xs btn-primary" @click="openProjectsModal">{{ $t('Установить') }}</div>
                        </div>
                    </div>
                </v-dropdown>
            </div>
            <div class="v-permissions__right">
                <v-dropdown v-if="permissions && roles" class="v-permissions__roles" width="310" :on-hover="true" :hide-close="true" inline>
                    <template slot="toggle">
                        <span v-for="role in selectRoles" class="v-permissions__roles-item badge badge-default">{{ role }}</span>
                        <span v-if="Object.values(permissions.roles).length > 5" class="v-permissions__roles-item badge badge-default">
                            +{{ $t('Еще') }}: {{ Object.values(this.permissions.roles).length - 5 }}
                        </span>
                    </template>
                    <div class="v-permissions__roles-content">
                        <div class="v-permissions__roles-title">{{ $t('Управление доступом') }}</div>
                        <div class="v-permissions__roles-subtitle">{{ $t('Роли, у которых есть доступ к этой странице') }}</div>
                        <div v-for="(role, index) in roles" :key="role.id" class="v-permissions__roles-col">
                            <a :href="$url('/n/roles/{id}/edit', { id: role.id })">{{ role.name }}</a><template v-if="index !== roles.length - 1">,</template>
                        </div>
                        <div class="v-permissions__roles-controls">
                            <div class="btn btn-xs btn-primary" @click="openRolesModal">{{ $t('Установить') }}</div>
                        </div>
                    </div>
                </v-dropdown>
            </div>
        </div>
        <v-modal v-if="permissions" :load="rolesModal.load" :open="rolesModal.open" :small="true" @close="rolesModal.open = false">
            <template v-if="rolesModal.open">
                <template slot="header">
                    <h4 class="modal-title">{{ $t('Управление доступом к странице') }}</h4>
                    <h6 v-if="permissions && permissions.permission">
                        {{ $t('Определяется правом:') }}
                        <span class="badge badge-default badge-custom-mini-circle">{{ permissions.permission.display_name || '' }}</span>
                    </h6>
                </template>
                <template slot="body">
                    <div v-if="rolesModal.ready" class="form-horizontal">
                        <div v-if="staticData.disabled_alert" class="alert alert-warning">{{ staticData.disabled_alert }}</div>
                        <v-checkbox-list v-if="staticData.roles"
                                         :label="$t('Роли')"
                                         v-model="current_roles"
                                         type="switch"
                                         :options="staticData.roles" />
                        <v-checkbox-list v-if="staticData.disabled_roles.length"
                                         :label="$t('По умолчанию')"
                                         v-model="current_roles"
                                         type="switch"
                                         :options="staticData.disabled_roles"
                                         disabled />
                        <div class="row">
                            <div class="col-md-12">
                                <div v-if="rolesModal.error" class="alert alert-danger margin-botom-0">
                                    <strong>{{ $t('Ошибка!') }}</strong> {{ rolesModal.error }}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template slot="footer">
                    <button type="button" @click="rolesModal.open = false" class="btn">{{ $t('Отмена') }}</button>
                    <button type="button" class="submit btn btn-primary" @click="submitRoles">{{ $t('Сохранить') }}</button>
                </template>
            </template>
        </v-modal>

        <v-modal v-if="projects" :load="projectsModal.load" :open="projectsModal.open" :small="true" @close="projectsModal.open = false">
            <template v-if="projectsModal.open">
                <template slot="header">
                    <h4 class="modal-title">{{ $t('Управление проектами') }}</h4>
                    <h6 v-if="permissions && permissions.permission">
                        {{ $t('Определяется правом:') }}
                        <span class="badge badge-default badge-custom-mini-circle">{{ permissions.permission.display_name || '' }}</span>
                    </h6>
                </template>
                <template slot="body">
                    <div v-if="projectsModal.ready" class="form-horizontal">
                        <v-checkbox-list
                            :label="$t('Проекты')"
                            v-model="current_projects"
                            type="switch"
                            :options="projectsModal.options"
                        />
                        <div class="row">
                            <div class="col-md-12">
                                <div v-if="projectsModal.error" class="alert alert-danger margin-botom-0">
                                    <strong>{{ $t('Ошибка!') }}</strong> {{ projectsModal.error }}
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
                <template slot="footer">
                    <button type="button" @click="projectsModal.open = false" class="btn">{{ $t('Отмена') }}</button>
                    <button type="button" class="submit btn btn-primary" @click="submitProjects">{{ $t('Сохранить') }}</button>
                </template>
            </template>
        </v-modal>
    </div>
</template>

<script lang="ts">
    import Vue from 'vue';
    import { mapState } from 'vuex';
    import { routes } from '~/api';

    interface PagePermission {
        display_name: string,
        system_name: string,
    }

    interface PagePermissions {
        can_edit_page_access: boolean,
        is_normal_security: boolean,
        key: number,
        permission: PagePermission,
        roles: any
    }

    interface RoleOption {
        value: number,
        text: string
    }

    interface PermissionsRolesResponse {
        current_roles: number[],
        disabled_alert: string,
        disabled_roles: RoleOption[],
        roles: RoleOption[]
    }

    export default Vue.extend({
        data(): any {
            return {
                current_projects: [],
                current_roles: [],
                rolesModal: {
                    open: false,
                    load: false,
                    ready: false,
                    error: '',
                    options: [],
                },
                projectsModal: {
                    open: false,
                    load: false,
                    ready: false,
                    error: '',
                },
                staticData: {
                    current_roles: [],
                    disabled_alert: '',
                    disabled_roles: [],
                    roles: [],
                    projects: []
                }
            }
        },

        computed: {
            ...mapState({
                permissions: ({ permissions }: any): PagePermissions | null => permissions,
            }),

            roles(): any {
                const value: any = [];
                if (!this.permissions?.roles) return value;

                for (const [id, name] of Object.entries(this.permissions.roles)) {
                    value.push({
                        id,
                        name
                    });
                }

                return value;
            },

            selectRoles(): any {
                const value: any = [];
                if (!this.permissions?.roles) return value;

                const max = 5;
                const tmp: any = Object.values(this.permissions.roles).slice(0, max);

                for (const role of tmp) {
                    value.push(role[0]);
                }

                return value;
            },

            projects(): any {
                const value: any = [];
                if (!this.permissions?.projects) return value;

                for (const [id, name] of Object.entries(this.permissions.projects)) {
                    if (!id || !name) continue
                    value.push({
                        id,
                        name
                    });
                }

                return value;
            },

            selectProjects(): any {
                const value: any = [];
                if (!this.permissions?.projects) return value;

                const max = 5;
                const tmp: any = Object.values(this.permissions.projects).slice(0, max);

                for (const project of tmp) {
                    value.push(project[0]);
                }

                if (value.length === 0) {
                    value.push(this.$t('Нет проектов'));
                }

                return value;
            }
        },

        methods: {
            async openRolesModal() {
                this.rolesModal.error = '';
                this.rolesModal.load = true;
                this.rolesModal.open = true;
                const { data } = await this.$api.get(routes.permissions.get_list_roles, {
                    permission: this.permissions.permission.system_name
                });

                if (data) {
                    const permissions = data as PermissionsRolesResponse;
                    this.current_roles.splice(0, this.current_roles.length);
                    this.current_roles.push(...permissions.current_roles);
                    this.staticData = permissions;

                    await this.$nextTick();
                    this.rolesModal.ready = true;
                }

                this.rolesModal.load = false;
            },

            async submitRoles() {
                this.rolesModal.load = true;

                const { data, error } = await this.$api.post(routes.permissions.set_list_roles, {
                    roles: this.current_roles,
                    permission: this.permissions.permission.system_name
                });

                if (data) {
                    this.rolesModal.open = false;
                }

                if (error) {
                    this.rolesModal.error = error;
                }

                this.rolesModal.load = false;
            },

            async openProjectsModal() {
                this.projectsModal.error = '';
                this.projectsModal.load = true;
                this.projectsModal.open = true;
                const { data } = await this.$api.get(routes.permissions.get_list_projects, {
                    id: this.permissions?.object?.id,
                    type: this.permissions?.object?.type,
                });

                if (data?.projects) {
                    this.current_projects.splice(0, this.current_projects.length);
                    this.current_projects.push(...data.projects.current_projects);
                    this.projectsModal.options = data?.projects?.projects;
                    await this.$nextTick();
                    this.projectsModal.ready = true;
                }

                this.projectsModal.load = false;
            },

            async submitProjects() {
                this.projectsModal.load = true;

                const { data, error } = await this.$api.post(routes.permissions.set_list_projects, {
                    projects: this.current_projects,
                    id: this.permissions?.object?.id,
                    type: this.permissions?.object?.type,
                    permission: this.permissions.permission.system_name,
                });

                if (data) {
                    this.projectsModal.open = false;
                }

                if (error) {
                    this.projectsModal.error = error;
                }

                this.projectsModal.load = false;
            }
        }
    })
</script>

<style lang="stylus">
    .border-spacer
        width: 100%
        background-color: #777
        height: 1px
        margin-top: 20px
        margin-bottom: 20px

    .v-permissions
        &__row
            height: 40px
            position: relative
            display: flex
            justify-content: space-between
            align-items: center
            &:before
                content: ''
                position: absolute
                left: 0
                right: 0
                top: 50%
                height: 1px
                background-color: #fff
        &__roles
            display: flex
            align-items: center

            &-item
                text-transform: uppercase
                padding: 0 5px 1px 5px
                height: 19px
                min-width: 19px
                display: inline-flex
                align-items: center
                text-align: center
                justify-content: center
                margin-left: 4px
                &--left
                    margin-left: 0
                    margin-right: 4px

            &-title
                margin-top: -8px
                font-weight: 600
            &-subtitle
                font-size: 12px
                color: #999

            &-controls
                margin-bottom: -4px
                margin-top: 12px

            &-col
                display: inline-block
                margin-right: 6px

            &-content
                a
                    transition: all .15s ease-out
                    color: #777
                    text-decoration: underline
                    &:hover
                        color: #659be0

        &__left, &__right
            display: flex
            position: relative
</style>
