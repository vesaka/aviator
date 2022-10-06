import Model from '$lib/game/core/3d/models/model';
import {MeshPhongMaterial, FlatShading, Color, Mesh, Box3, Face, BufferGeometry} from 'three';
import {Body, Box, Vec3, ConvexPolyhedron, Sphere} from 'cannon-es';
import StatesMixin from '$lib/game/core/mixins/states-mixin';
import {mergeVertices} from 'three/examples/jsm/utils/BufferGeometryUtils';
import Particles from './particles';
import {raw} from '$lib/game/core/utils/object';

const COLORABLES = ['color', 'specular'];

const FLYING = 'flying';
const LANDED = 'landed';
const COLLIDING = 'colliding';
const LANDING = 'landing';
const HIT = 'hit';
class Object3D extends Model {

    constructor(options) {
        options.mixins = [StatesMixin];
        super(options);
        this.states = [];
        this.$listen({
            airplane: ['hits'],
            game: ['over', 'ready']
        });
        
        this.set('index', this.index);
        this.body.score = this.score;
        
        //this.model.add(this.particles.mesh);
        return this;
    }
    
    filter_particles(particles) {
        return new Particles(particles);
    }

    filter_material(material) {
        const {settings} = this;
        this.threeGeometry = this.createGeometry();
        COLORABLES.forEach(colorable => {
            if (material[colorable]) {
                material[colorable] = new Color(settings.colors[material[colorable]] || material[colorable]);
            }
        });
        material.flatShading = true;

        return material;
    }

    createMaterial() {
        return new MeshPhongMaterial(Object.assign({}, this.material));
    }

    createModel() {
        const mesh = new Mesh(this.threeGeometry, this.createMaterial());
        mesh.castShadow = true;
        return mesh;
    }



    createBody() {
        return new Body({
            type: Body.DYNAMIC,
            position: this.getPosition(),
            mass: 0,
            shape: this.createShape()
        });
    }
    
    createShape() {
        return new Sphere(this.params.radius/2);
    }

    _createShape() {
        const geom = new BufferGeometry;
        geom.setAttribute('position', this.threeGeometry.getAttribute('position'));
        const geometry = mergeVertices(geom);
        
        const position = geometry.attributes.position.array;  
        const geomFaces = geometry.index.array;   
        
        
        const vertices = [];
        const faces = [];
        for (let i = 0; i < position.length; i+=3) {
            vertices.push(new Vec3(position[i], position[i+1], position[i+2]));
        }
        for (let j = 0; j < geomFaces.length; j+=3) {
            faces.push([geomFaces[j], geomFaces[j+1], geomFaces[j+2]]);
        }
        
        return new ConvexPolyhedron({vertices, faces});
    }

    airplane_hits(body) {
        if (body.index === this.body.index) {
            const at = {x: this.body.position.x, y: this.body.position.y};
            this.reset();
            this.addState(HIT);
            this.particles.explode(at, () => {
                this.removeState(HIT);
            });
        }
    }
    
    show(params) {
        if (this.isOnly(LANDED)) {
            this.model.visible = true;
            this.body.type = Body.KINEMATIC; 
            this.body.mass = 0;
            this.body.wakeUp();
            //this.body.static = false;
            this.body.updateMassProperties();
            this.setState(FLYING);
            this.onShow(params);
        }

    }

    hide() {
        if (this.isNot(LANDED)) {
            this.reset();
        }
    }

    destroy() {

    }

    reset() {
        this.model.visible = false;
        //this.body.static = true;
        this.body.mass = 0;
        this.body.type = Body.STATIC;
        this.body.updateMassProperties();
        this.body.sleep();
        //this.body.setVelocity(0, 0, 0);
        this.setPosition(0, 0, 0);
        this.angle = 0;
        this.distance = 0;
        this.setState(LANDED);
    }

    onShow(params) {
        this.angle = -params.i * this.angleMultiply;
        this.distance = params.d + Math.cos(params.i * 0.5) * params.amplitude;
        this.body.position.y = -params.radius + Math.sin(this.angle) * this.distance;
        this.body.position.x = Math.cos(this.angle) * this.distance;

        this.updatePosition();
    }

    wasHit() {
        
    }
    
    landed() {
        this.reset();
    }

    animate(delta) {
        const state = this.getOnlyState();
//        if (this.constructor.name === 'Gem') {
//            console.log(state);
//        }
        const method = 'on_' + state;
        if (FLYING === state) {
            this.on_flying(delta);
        } else if (LANDED === state) {
            this.on_landed(delta);
        } else if (LANDING === state) {
            this.on_landing(delta);
        } else if (COLLIDING === state) {
            this.on_colliding(delta);
        }

        //console.log(this.body.position.y === this.model.position.y);
    }

    on_flying(delta) {
        const {distance, options} = this;
        const game = options.game;

        this.angle += game.speed.current * delta * this.speed;
        if (this.angle > Math.PI * 2) {
            this.angle -= Math.PI * 2;
        }
        ;
//        
        this.body.position.x = Math.cos(this.angle) * distance;
        this.body.position.y = -options.models.sea.radius + Math.sin(this.angle) * this.distance;

        this.model.rotation.y += Math.random()*0.1;
        this.model.rotation.z += Math.random()*0.1;
        this.updatePosition();

        if (this.angle > Math.PI) {
            this.reset();
        }
    }

    on_colliding() {

    }

    on_landing() {

    }

    on_landed() {
        
    }

    isFlying() {
        return this.is(FLYING);
    }
    
    game_over() {
        this.reset();
    }

}
;

export default Object3D;

