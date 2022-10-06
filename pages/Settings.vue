<template>
    <div >
        <tabs refs="tabs" class="flex w-full text-blue-600">
            <tab title="System" :class="tabClass">
                System settings
            </tab>
            <tab title="Screen" :class="tabClass">
                Screen Settings
            </tab>
            <tab :title="i18n('pages.settings.tabs.models.title')" :class="tabClass">
                Objects Settings
            </tab>
        </tabs>
    </div>
</template>
<script>
    import {Tabs, Tab} from '$lib/game/core/components/common/tabs/NavTabs';
    export default {
            data() {
                return {
                    on: false
                };
            },
        components: {Tab, Tabs},
        computed: {
            tabOptons() {
                return { useUrlFragment: false };
            },
            tabClass() {
                return {
                    'text-red-600': true,
                    'w-5/6': true
                };
            },
            linksClass() {
                return {
                    
                };
            }
        }
    }
</script>
<style>
        .tabs-component-tabs {width: 15%;}
</style>

