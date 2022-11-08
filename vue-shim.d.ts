import { ComponentOptions } from 'vue'
import { MetaInfo } from 'vue-meta'

declare module 'vue/types/options' {
    interface ComponentOptions<V extends Vue> {
        navigation?: string
    }
} 

declare module "*.vue" {
	import Vue from 'vue'
	export default Vue
}

declare global {
    interface Window { checklistEvents: any; }
}