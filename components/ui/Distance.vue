<template>
    <display label="Distance">
        <template #view>
            <div class="mx-auto self-center text-white" v-html="distance"></div>
        </template>
    </display>
</template>
<script>
    import Display from './Display';
    export default {
        props: {
            options: {
                type: Object,
                default() {
                    return {};
                }
            },
        },
        components: {Display},
        computed: {
            distance() {
                const num = parseInt(this.$store.state.distance);

                if (isNaN(num)) {
                    return 0;
                }

                if (num < 1000) {
                    return Math.sign(num) * Math.abs(num);
                }

                return Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'km';
            }
        }
    }
</script>