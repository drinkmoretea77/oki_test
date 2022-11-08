<script>
export default {
    props: {
        content: {
            type: [String, Object, Array],
            default: ''
        }
    },

    mounted() {
        console.log('cont', this.content)
    },

    render(h) {
        return h('div', this.content.elm)
    }
}
</script>