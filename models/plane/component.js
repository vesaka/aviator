import {BoxGeometry, Mesh, MeshPhongMaterial, BufferAttribute} from 'three';
import {Cylinder, Body, Vec3, Box} from 'cannon-es';
import Model from '$lib/game/core/3d/models/model';


class Component extends Model {
    constructor(options) {
        super(options);
        return this;
    }

    createGeometry() {
        const {params, color, model} = this;
        const geometry = new BoxGeometry(
                params.width,
                params.height,
                params.depth,
                params.widthSegments || 1,
                params.heightSegments || 1,
                params.depthSegments || 1
        );

        if (this.vertices) {
            const vertices = geometry.attributes.position;
            geometry.verticesNeedUpdate = true;
            for (let i in this.vertices) {
                for (let j in this.vertices[i]) {
                    const getMethod = `get${j.toUpperCase()}`;
                    const setMethod = `set${j.toUpperCase()}`;
                    vertices[setMethod](parseInt(i), vertices[getMethod](parseInt(i)) + this.vertices[i][j]*2);
                }
            }

        }

        return geometry;
    }

    createMaterial() {
        return new MeshPhongMaterial({
            color: this.settings.colors[this.color] || this.settings.colors.red,
            flatShading: true,
            transparent: this.transparent,
            opacity: this.opacity
        });
    }

    createModel() {
        const {params, color, three, position} = this;
        const geometry = this.createGeometry();
        const material = this.createMaterial();

        const mesh = new Mesh(geometry, material);

        for (let prop in three) {
            mesh[prop] = three[prop];
        }

        mesh.position.set(
                position.x,
                position.y,
                position.z
        );

        return mesh;
    }
    
    createBody() {
        const body = new Body({
            mass: 0,
            position: this.getPosition(),
            type: Body.STATIC,
            static: true
        });
        
        return body;
    }
    
    crreateShape() {
        
    }

}
;

const PROPS_INDEXES = {
    x: 0,
    y: 1,
    z: 2
}


export default Component;