import Collection from '$lib/game/core/3d/models/collection';
import Gem from './gem';
import Rock from './rock';

import {rand, normalize} from '$lib/game/core/utils/math';
import {raw} from '$lib/game/core/utils/object';
import StatesMixin from '$lib/game/core/mixins/states-mixin';
let spawns = {}; 
class FlyingObjects extends Collection {

    constructor(options) {
        
        super(options);
        this.$listen({
            airplace: ['hits']
        });
        
        this.spawns = {};
        this.each(item => {
            item.reset();
        });
        
        return this;
    }

    getTypesMap() {
        return {
            gem: Gem,
            rock: Rock
        };
    }
    
    spawn() {
    }
    
    
    animate(delta) {
        const {options} = this;
        const {sea, air_plane} = options.models;
        const game = options.game;
        const d = sea.radius
                + air_plane.position[1]
                +  (-1 + Math.random() * 2) * (air_plane.amplitude.height-20);

        const amplitude = rand(10, 20);
        
        this.eachTypeOption((options, type) => {
            const dist = Math.floor(game.distance.current);
         if (type === 'gem') {
            //console.log((0 === (dist % options.spawn.distance)), dist, options.spawn.lastTime);
        }
            if ((0 === (dist % options.spawn.distance)) && (dist >= options.spawn.lastTime)) {
                const nObjects = rand(options.minActive, options.maxActive);
                const objects = this.items[type].slice(0, nObjects);
                options.spawn.lastTime = dist;

                objects.forEach((item, i) => {
                    item.show({d, amplitude, i, radius: sea.radius});
                });
            }
            
            this.items[type].forEach((item, i) => {
                item.animate(delta);
            });

            
            
        });

    }
    
    airplane_hits(object) {
        
    }

}
;

export default FlyingObjects;

