import Object3D from './object';
import {TetrahedronGeometry,MeshPhongMaterial, FlatShading, Color, Mesh} from 'three';
import {Body} from 'cannon-es';
class Pebble extends Object3D {
    
    constructor(options = {}) {
        super(options);
        this.states = [];
        this.show();
        this.setX(-75);
        this.setY(50);
        this.body.addEventListener('collide', e => console.log);
        return this;
    }
    
    createGeometry() {
        return new TetrahedronGeometry(this.params.radius, this.params.detail);
    }
    
    

    
    
};

export default Pebble;

