import Object3D from './object';
import {TetrahedronGeometry} from 'three';
import {raw, deepMerge} from '$lib/game/core/utils/object';

class Rock extends Object3D {
    
    constructor(options) {
        //console.log(raw(options.particles));
        super(options);
        
        this.states = [];
        return this;
    }
    
    createGeometry() {
        return new TetrahedronGeometry(this.params.radius, this.params.detail);
    }
    
    

    
    
};

export default Rock;

