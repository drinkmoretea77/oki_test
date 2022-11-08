<template>
    <client-only>
        <div>
            <vue-code-highlight class="docs-code" :language="lang">
                <pre>{{ example }}</pre>
            </vue-code-highlight>
            <runtime-template-compiler v-if="lang === 'markup'" :template="`<div>${example}</div>`" :parent="parent" />
        </div>
    </client-only>
</template>

<script>
import { component as VueCodeHighlight } from 'vue-code-highlight';
import VCodeRender from './VCodeRender.vue';
import { RuntimeTemplateCompiler } from 'vue-runtime-template-compiler'

export default {
    props: {
        code: {
            type: String,
            default: ''
        },

        lang: {
            type: String,
            default: 'javascript'
        },

        parent: {
            type: Object,
            default: null
        }
    },

    components:{
        VueCodeHighlight,
        VCodeRender,
        RuntimeTemplateCompiler
    },

    data() {
        return {
            content: ''
        }
    },

    computed: {
        example() {
            if (this.code && (this.code[0] === '\n' || this.code[0] === '\r')) {
                return this.code.substring(1);
            } else {
                return this.code;
            }
        }
    },

}
</script>

