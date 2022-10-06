import Model from '$lib/game/core/3d/models/model';
import {Vector3, Mesh, CylinderGeometry, Matrix4, MeshPhongMaterial} from 'three';
import {Cylinder, Body, Quaternion, Vec3} from 'cannon-es';
import {rand} from '$lib/game/core/utils/math';
class Sea extends Model {
    constructor(options) {
        super(options);
        this.rotateX(-Math.PI/2);
        this.setY(-this.options.models.sea.radius);
        //this.$waves = [];
        this.speedLevel = 1;
        this.$listen({
            speed: ['increase']
        });
        
        this.vertex = new Vector3();
        return this;
    }
    
    createWaves(geometry) {
        this.$waves = [];
        const pos = geometry.getAttribute( 'position' );
        const vertex = new Vector3();
        const {waves} = this;
        for ( let i = 0; i < pos.count; i ++ ) {
            vertex.fromBufferAttribute( pos, i );
            
            this.$waves.push({
                x: vertex.x,
                y: vertex.y,
                z: vertex.z,
                ang: Math.random() * Math.PI*2,
                amp: waves.amp.min + Math.random()*(waves.amp.max-waves.amp.min),
                speed: waves.speed.min + Math.random()*(waves.speed.max-waves.speed.min)
            });
        }
    }
    
    
    createModel() {
        const geometry = new CylinderGeometry(
                this.radius_top,
                this.radius_bottom,
                this.height,
                this.radius_segments,
                this.vertical_segments
        );

        this.createWaves(geometry);
        
        const material = new MeshPhongMaterial({
            color: this.settings.colors.blue,
            flatShading: true,
            transparent: true,
            opacity: this.opacity || 0.6
        });
        
        return new Mesh(geometry, material);
    }
    
    createBody() {
        const shape = new Cylinder(
                this.radius_top,
                this.radius_bottom,
                this.height*2,
                this.radius_segments
        );
 
        return new Body({
            mass: 0,
            shape,
            material: this.createBodyMaterial(),
            position: this.getPosition()
        });
    }
    
    speed_increase() {
        this.speedLevel ++;
    }
    
    animate(delta) {
        this.rotationY(-0.005);
        const len = this.$waves.length;
        //console.log(this.$waves.length);
        let x = 0, y = 0;
        const pos = this.model.geometry.attributes.position;
        for (let i = 0; i < len; i++) {
            
            const vprops = this.$waves[i];
            
            if (i < len) {
                x = vprops.x + Math.cos(vprops.ang)*vprops.amp;
                y = vprops.y + Math.sin(vprops.ang)*vprops.amp;
            } else {
                x = this.$waves[0].x;
                y = this.$waves[0].y;
//                x = pos.getX(0);
//                y = pos.getY(0);
            }
            
            pos.setXY(i, x, y);

            vprops.ang += vprops.speed*delta;
//            this.model.geometry.normalsNeedUpdate  =true;
//            this.model.geometry.verticesNeedUpdate =true;
        }
        //this.model.geometry.normalsNeedUpdate  =true;
        
//        const { vertices } = this.model.geometry;
//        
//        for (let i = 0; i < vertices.length; i++) {
//            const v = vertices[i];
//            const wave = this.$waves[i];
//            
//            v.x = v.x =  wave.x + Math.cos(wave.ang)*wave.amp;
//            v.y = wave.y + Math.sin(wave.ang)*wave.amp;
//            wave.ang += wave.speed*delta;
//            this.model.geometry.verticesNeedUpdate = true;
//        }
    }

}

export default Sea;

