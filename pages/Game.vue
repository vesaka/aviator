<template>
    <div>
        <elements class="relative top w-full"></elements>
        <canvas ref="canvas" class="bg-light flex fixed inset-0 -z-20"></canvas>
        <controls class="absolute bottom" v-if="isMobile"
                  @move="dir => {game.$emit('direction_change', dir)}"
                  @release="dir => {game.$emit('direction_release', dir)}"/>
    </div>
</template>
<script>
    import AviatorGame from '../aviator-game';
    import ResizeMixin from '$lib/game/core/3d/mixins/resize-mixin';
    import OrbitControlsMixin from '$lib/game/core/3d/mixins/orbit-controls-mixin';
    import StoreMixin from '$lib/game/core/mixins/store-mixin';
    import PauseMixin from '$lib/game/core/mixins/pause-mixin';
    import options from '../config/options.json';
    import settings from '../config/settings.json';
    import assets from '../config/assets.json';
    import {isPortable} from '$lib/game/core/utils/agent';

    import Elements from '$lib/game/aviator/components/ui/Elements';
    import Controls from '$lib/game/aviator/components/ui/Controls';
    export default {
        components: {Elements, Controls},
        mounted() {
            const {$store} = this;
            this.game = new AviatorGame({
                canvas: this.$refs.canvas,
                options: $store.state.options,
                settings: $store.state.settings,
                assets,
                $store,
                mixins: [ResizeMixin, StoreMixin, PauseMixin]
            });
            this.game.load();
        },
        beforeUnmount() {
            //this.container.removeChild(this.container.querySelector('canvas'));
            this.game.destroy();
            this.game = null;
        },
        computed: {
            isMobile() {
                //return false;
                return true === isPortable();
            }
        }
    }
</script>
<style>
    nav {position: fixed}
</style>
