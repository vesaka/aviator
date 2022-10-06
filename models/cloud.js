import Container from '$lib/game/core/container';
import {Object3D, BoxGeometry, MeshPhongMaterial, Mesh} from 'three';

class Cloud extends Container {
    constructor(options) {
        super(options);
        this.mesh = new Object3D();
        this.createShape();
        return this;
    }

    createShape() {
        const {size, mesh} = this;
        const box = new BoxGeometry(size, size, size);
        const material = new MeshPhongMaterial({
            color: this.settings.colors.white
        });

        const nBlocks = 3 + Math.floor(Math.random() * 3);

        for (var i = 0; i < nBlocks; i++) {
            const m = new Mesh(box, material);

            m.position.x = i * 15;
            m.position.y = Math.random() * 10;
            m.position.z = Math.random() * 10;
            m.rotation.z = Math.random() * Math.PI * 2;
            m.rotation.y = Math.random() * Math.PI * 2;

            var s = 0.1 + Math.random() * 0.9;
            m.scale.set(s, s, s);
            m.castShadow = true;
            m.receiveShadow = true;

            mesh.add(m);
        }
    }
}
;

export default Cloud;

