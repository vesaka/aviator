<template>
    <div class="w-full h-32 absolute bottom-0 left-0">
        <button :class="btnUp"
                @touchstart="move('up')"
                @touchend="release('up')"
                @mousedown="move('up')"
                @click="release('up')">
            <ArrowCircleUpIcon class="select-none"/>
        </button>
        <button :class="btnDown"
                @touchstart="move('down')"
                @touchend="release('down')"
                @mousedown="move('down')"
                @click="release('down')">
            <ArrowCircleDownIcon class="select-none"/>
        </button>
    </div>
</template>
<script>
    import { ArrowCircleDownIcon, ArrowCircleUpIcon } from '@heroicons/vue/outline';
    export default {
        components: {ArrowCircleDownIcon, ArrowCircleUpIcon},
        methods: {
            move(dir) {
                this.$emit('move', dir);
                //this.$emit('move')
            },
            release(dir) {
                this.$emit('release', dir);
            }
        },
        computed: {
            btnClass() {
                return {
                    'h-full w-32 bg-dark text-white rounded-full': true,
                    
                };
            },
            btnUp() {
                const cls = this.btnClass;
                return cls;
            },
            btnDown() {
                const cls = this.btnClass;
                cls['absolute right-0'] = true;
                return cls;
            }
        }
    }
</script>
