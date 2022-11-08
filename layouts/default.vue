<template>
    <div class="layout layout--default">
        <v-header />
        <div class="clearfix" />
        <v-content>
            <nuxt />
        </v-content>
        <v-footer />
        <confirmation-modal />
        <portal-target name="popups" multiple />
    </div>
</template>
 
<script>
import ConfirmationModal from '../components/ConfirmationModal.vue';
import { PortalTarget } from 'portal-vue';

export default {
    components: {
        PortalTarget,
        ConfirmationModal,
    },
}; 
</script>

<style>
@import '~/assets/tooltip.css';
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
    opacity: 0;
}

.mx-datepicker-sidebar {
    width: 140px!important;
}

.mx-datepicker-sidebar+.mx-datepicker-content {
    margin-left: 140px!important;
}

.mx-btn-shortcut:first-letter {
    text-transform: uppercase
}

.page-enter-active,
.page-leave-active {
    transition: opacity 0.3s;
}
.page-enter,
.page-leave-active {
    opacity: 0;
}

.permission-block--disabled {
    cursor: default;
    opacity: 0.5;
    pointer-events: none;
}
</style>
