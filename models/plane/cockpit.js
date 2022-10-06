import Component from './component';
import {CylinderGeometry, FlatShading} from 'three';
import {Cylinder} from 'cannon-es';


class Cockpit extends Component {
    constructor(options) {
        super(options);
        this.setRotation(Math.PI/4 ,0, -Math.PI/2);
        //this.setGuiRotation();
        
        return this;
    }
    
    createGeometry() {
        const {params, color, model} = this;

        const geometry = new CylinderGeometry(
                params.sideLeft,
                params.sideRight,
                params.height,
                params.sides || 4,
                1,
                false
                );

        return geometry;
    }
};

export default Cockpit;