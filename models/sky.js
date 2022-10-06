import Container from '$lib/game/core/container';
import {Object3D, BoxGeometry, MeshPhongMaterial, Mesh} from 'three';
import Cloud from './cloud';
class Sky extends Container {
    constructor(options) {
        super(options);
        
        this.$clouds = [];
        this.mesh = new Object3D();
        this.mesh.position.y = -this.options.models.sea.radius;
        this.createClouds();
        return this;
    }
    
    createClouds() {
        const {clouds, mesh} = this;
        const stepAngle = Math.PI*2 / clouds.count;
        for(let i = 0; i < clouds.count; i++) {
            const cloud = new Cloud({size: clouds.size});
            
            const angle = stepAngle * i;
            const h = 750 + Math.random()*200;
            
            cloud.mesh.position.y = Math.sin(angle)*h;
            cloud.mesh.position.x = Math.cos(angle)*h;
            cloud.mesh.rotation.z = angle + Math.PI/2;
            cloud.mesh.position.z = -400-Math.random()*400;
            
            const scale = 1+Math.random()*2;
            cloud.mesh.scale.set(scale, scale, scale);
            mesh.add(cloud.mesh);
        }
    }
    
    animate() {
        this.mesh.rotation.z += 0.01;
    }
}

export default Sky;


