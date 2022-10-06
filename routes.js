/* global require */

const requireScreens = require.context('./pages', false, /[a-z]\w+(.vue)$/);

const PATHNAME = `/game/aviator/`;

const routes = [];
    requireScreens.keys().forEach(name => {
        
        const screen = requireScreens(name);
        const screenName = name.toLowerCase().substring(2, name.indexOf('.vue'));
        routes.push({
            path: `${PATHNAME}${(screen.default.path || screenName)}`,
            name: screenName,
            component: screen.default
        });
    });
    
    
export default routes;