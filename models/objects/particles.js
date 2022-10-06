import Container from '$lib/game/core/container';
import {Color, Mesh, TetrahedronGeometry, MeshPhongMaterial, FlatShading, Object3D} from 'three';
import gsap, {Power2} from 'gsap';

const COLORABLES = ['color', 'specular'];
const EXPLODING = 'exploding';
const IDLE = 'idle';

class Particles extends Container {
    constructor(options) {
        super(options);
        this.state = IDLE;
        this.mesh = new Object3D;
        this.particles = [];
        this.createPool();
        return this;
    }

    createPool() {
        const {material, settings} = this;
        COLORABLES.forEach(colorable => {
            if (material[colorable]) {
                material[colorable] = new Color(settings.colors[material[colorable]] || material[colorable]);
            }
        });
        material.flatShading = true;
        const mesh = new Mesh(
                new TetrahedronGeometry(this.radius, this.detail),
                new MeshPhongMaterial(material)
                );

        mesh.visible = false;

        for (let i = 0; i < this.density; i++) {
            const particle = mesh.clone();
            this.mesh.add(particle);
            this.particles.push(particle);
        }
        this.scene.add(this.mesh);

    }

    spawn(at) {

    }

    explode(at, onFinish) {
        const {scale, color, rate, particles, mesh: parent} = this;
        parent.visible = true;
        let state = this.state;
        state = EXPLODING;
        
        //const at = pos.clone();
        

        particles.forEach(mesh => {
            mesh.visible = true;
            //mesh.material.color = new Color(color);
            //mesh.material.needsUpdate = true;
            mesh.scale.set(scale, scale, scale);
            mesh.position.x = at.x;
            mesh.position.y = at.y;
            const targetX = at.x + (-1 + Math.random() * 2) * rate.position;
            const targetY = at.y + (-1 + Math.random() * 2) * rate.position;
            const speed = this.baseSpeed + Math.random() * rate.speed;
            gsap.to(mesh.rotation, {duration: speed, x:Math.random()*rate.rotation, y:Math.random()*rate.rotation});
            gsap.to(mesh.scale, {duration: speed, x: rate.scale, y:rate.scale, z: rate.scale})
            gsap.to(mesh.position, {
                duration: speed,
                x: targetX,
                y: targetY,
                delay:Math.random() *0.1,
                ease: Power2.easeOut,
                onComplete() {
                    
                    mesh.visible = false;
                    mesh.scale.set(1, 1, 1);
                    mesh.position.set(0,0,0);
                    
                    
                    if (IDLE === state) {
                        return;
                    }
                    let complete = true;
                    for (let i = 0; i < particles.length; i++) {
                        if (particles[i].visible) {
                            complete = false;
                            break;
                        }
                    }
                    
                    if (complete) {
                        state = IDLE;
                        parent.visible = false;
                        onFinish();
                    }
                }
            });
        });
    }

//    resetParticle(particle) {
//        particle
//    }

}

export default Particles;

