<template>
    <div class="v-code-params">
        <h2>Параметры</h2>
        <table class="docs-table">
            <thead>
            <tr>
                <th>Ключ</th>
                <th>По умолчанию</th>
                <th>Описание</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="param in params" :key="param.name">
                <td>
                    {{ param.name }}
                    <template v-if="param.params.type">
                        <br>
                        <span class="docs-type" :class="[ `docs-type-${getTypeClass(param.params.type)}` ]" v-html="param.params.type" />
                    </template>
                </td>
                <td><span v-if="param.params.default" v-html="param.params.default" /></td>
                <td>{{ param.comment }}</td>
            </tr>
            </tbody>
        </table>
    </div>
</template>

<script>
export default {
    props: {
        component: {
            type: String,
            required: true
        }
    },

    data() {
        return {
            url: `/n/api/docs/${this.component}`,
            params: []
        }
    },

    mounted() {
        this.init();
    },

    methods: {
        async init() {
            const { data } = await this.$api.get(this.url);

            if (data.params) {
                this.params.push(...data.params);
            }

            console.log('data', data)
        },

        getTypeClass(type) {
            return type.toLocaleLowerCase() || 'any';
        }
    }
}
</script>

<style lang="stylus">
.docs-type
    white-space: nowrap
    font-size: 12px
    font-weight: 600

    &-boolean
        color: #42a5f5
    &-string
        color: #fb8c00
    &-array
        color: #66bb6a
    &-object
        color: #26c6da
</style>