<template>
    <div class="v-list-legend">
        <div class="v-list-legend__title"><slot name="title"/>
            <span class="badge badge-info"><slot name="count"/></span>
            <span class="v-list-legend__showing"><slot name="showing"/></span>
        </div>
        <div class="v-list-legend__subtitle"><slot name="subtitle"/></div>
    </div>
</template>

<style lang="stylus">
    .v-list-legend
        margin-bottom: 16px
        border-bottom: 1px solid #e5e5e5
        &__title
            font-size: 21px
            line-height: inherit
            color: #34495e
        &__subtitle
            color: #737373
            margin-top: 2px
            margin-bottom: 6px
        &__showing
            font-size: 14px
            color: #737373
</style>
