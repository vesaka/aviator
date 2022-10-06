<template>
    <div class="flex flex-col text-white mx-4 h-20">
        <label v-html="label"></label>
        <div class="flex flex-grow align-items-center justify-content-center"><slot name="view"><span v-html="value"></span></slot></div>
    </div>
</template>
<script>
    export default {
        props: {
            label: {
                type: String,
                default: ''
            },
            value: {
                type: [String, Number],
                default: ''
            }
        }
    }
</script>
