import Object3D from './object';
import {TetrahedronGeometry} from 'three';
import {rand} from '$lib/game/core/utils/math';
class Gem extends Object3D {
    
    constructor(options) {
        super(options);
        this.states = [];
        return this;
    }
    
    
    
    createGeometry() {
        return new TetrahedronGeometry(this.params.radius, this.params.detail);
    }
    
};

export default Gem;

