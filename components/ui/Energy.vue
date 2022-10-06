<template>
    <display label="Energy">
        <template #view>
            <bar-progress :value="level.energy"
                          :bar="{ height: 10, color: level.color }">
                <template #animate>
                    <animate
                        v-if="level.danger"
                        attributeName="fill"
                        :values="`${level.color};transparent`"
                        begin="0s"
                        dur="1s"
                        calcMode="discrete"
                        repeatCount="indefinite"
                        />
                </template>
            </bar-progress>
        </template>
    </display>
</template>
<script>
    import Display from './Display';
    import BarProgress from '$lib/game/core/components/progress/Bar';
    import settings from '$v/game/aviator/config/settings.json';
    import {percents} from '$v/game/core/utils/math';

    export default {
            data() {
                return {
                    tooLow: false
                };
            },
        components: {Display,BarProgress},
        watch: {
            energy(e) {
            }
        },
        props: {
            options: {
                type: Object,
                default() {
                    return {};
                }
            },
            width: {
                type: Number,
                default: 100
            },
            size: {
                type: Number,
                default: 45
            }
        },
        methods: {
            getColor(color = null) {
                if (settings.colors[color]) {
                    return settings.colors[color]
                }

                return settings.colors.blue;
            }
        },
        computed: {
            level() {
                const energy = this.$store.state.energy;



                if (!energy) {
                    return {
                        color: this.getColor('blue'),
                        energy: 100
                    };
                }

                const value = percents(energy.max, energy.current);
                let level = {};
                let last = 100;
                for (let l in energy.levels) {
                    if (value >= energy.levels[l].value && (last >= value)) {
                        level = {
                            color: this.getColor(energy.levels[l].color),
                            energy: value,
                            danger: 'low' === l
                        };
                        
                        

                    }
                    last = energy.levels[l].value;

                }

                return level;
            },
            energy() {

                if (this.$store.state.energy) {
                    return this.$store.state.energy.current;
                }

                return 0;
            },
            defaultColor() {

            }
        }
    }
</script>