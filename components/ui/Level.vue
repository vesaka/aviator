<template>
    <display label="Level">
        <template #view>
            <ring-progress :options="options" :size="100" :value="$store.state.levelDistance" :text="$store.state.level"/>
        </template>
    </display>
</template>
<script>
    import Display from './Display';
    import RingProgress from '$lib/game/core/components/progress/Ring'
    export default {
        components: {Display, RingProgress},
        props: {
            options: {
                type: Object,
                default() {
                    return {};
                }
            },
            size: {
                type: Number,
                default: 100
            },

        }
    }
</script>