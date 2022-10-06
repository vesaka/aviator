<template>
    <div class="flex flex-col h-full">
        <div class="flex flex-row text-center z-10 bg-white bg-hero-texture hidden">
            <button v-for="route in routesLinks" :class="linkClass" @click="goTo(route.name)" v-html="i18n(route.slug)"></button>
        </div>

        <router-view class="flex flex-grow h-full"></router-view>
    </div>
</template>
<script>
    import options from './config/options.json';
    import settings from './config/settings.json';
    const PATHNAME = '/game/aviator';
    
    export default {
        methods: {
            link(path) {
                return `${PATHNAME}/${path}`;
            },
            goTo(path) {
                this.$router.push(`${PATHNAME}/${path}`);
            }
        },
        beforeCreate() {

            this.$mergeWith('options', options);
            this.$save('settings', settings);
            
            const $options = this.$loadFrom('options');
            
            this.setDefaultI18n(require(`./assets/i18n/${$options.defaultLocale}.json`));
            this.setI18n(require(`./assets/i18n/${$options.locale}.json`));
            
            
        },
        computed: {
            linkClass() {
                return {
                    'text-blue-700 border border-solid bg-grey-300 py-3 px-4': true
                };
            },
            routesLinks() {
                return [{
                        name: 'game',
                        slug: 'pages.game.title',
                        title: 'Game'
                    }, {
                        name: 'tutorial',
                        slug: 'pages.tutorial.title',
                        title: 'Tutorial'
                    }, {
                        name: 'settings',
                        slug: 'pages.settings.title',
                        title: 'Settings'
                    }];
            }
        },
    }
</script>
<style>
    @font-face {
            font-family: "LuckiestGuy";
            src: url("/assets/flappy/fonts/LuckiestGuy.ttf");
    }
    
    body {
            font-family: LuckiestGuy, sans-serif;
            height: 100vh;
    }
</style>