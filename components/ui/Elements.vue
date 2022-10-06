<template>
    <div class="flex flex-row w-100 align-items-center">
        <level :options="styles('elements.level')"/>
        <distance/>
        <energy/>
        
    </div>
</template>
<script>
    import Distance from './Distance';
    import Energy from './Energy';
    import Level from './Level';
    import ui from "$lib/game/aviator/config/ui";
    import {raw, deepMerge, deepGet} from '$lib/game/core/utils/object';
    export default {
        components: {Distance, Energy, Level},
        methods: {
            styles(name) {
                console.log(deepGet(ui, name))
                return raw(deepMerge(Object.assign({}, ui.style), deepGet(ui, name)));
            }
        },
        created() {
            console.log(ui);
        }
    }
</script>
