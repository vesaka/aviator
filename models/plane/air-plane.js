import Model from '$lib/game/core/3d/models/model';
import {Mesh, MeshPhongMaterial, Object3D, FlatShading,
        BoxGeometry, LatheGeometry,
        CylinderGeometry, Box3 } from 'three';
import {Vec3, Box, Cylinder, Body} from 'cannon-es';
import {deepMerge, raw} from '$lib/game/core/utils/object';
import {rand, normalize} from '$lib/game/core/utils/math';
import Container from '$lib/game/core/container';
import Component from './component';
import Cockpit from './cockpit';

import {getKeyCode} from '$lib/game/core/utils/events';


let mousePos = {x: 0, y: 0};
const FLYING = 'flying';
const FALLING = 'falling';
const RISING = 'rising';
const DESCENDING = 'descending';

class AirPlane extends Model {
    constructor(options) {

        super(options);
        this.states = [];
        this.$listen({
            game: ['ready', 'over'],
            direction: ['change', 'release']
        });

        this.__energy = Object.assign({}, this.energy);
        this.setState(FLYING);

        this.calculateShape();
        this.body.addEventListener('collide', e => {
            this.addEnergy(e.body.score);
            this.$emit('airplane_hits', e.body);
            if (e.body.score < 0) {
                this.displace();
                this.$emit('airplane_damaged', this);
            }
        });
        //this.addEnergy();
        return this;
    }

    filter_components(components) {
        return raw(components);
    }

    filter_parts() {
        const parts = {};
        this.eachComponent((component, name) => {
            const componentClass = COMPONENTS[name] || COMPONENTS.component;
            parts[name] = new componentClass(component);
        });

        return parts;
    }

    calculateShape() {
        const box = new Box3().setFromObject(this.model);
        const [width, height, depth] = [
            (box.max.x - box.min.x) / 4,
            (box.max.z - box.min.z) / 4,
            (box.max.y - box.min.y) / 4
        ];

        const halfExtends = new Vec3(width, height, depth);

        const shape = new Box(halfExtends);
        //this.body.shape = shape;
        this.body.addShape(shape);
    }

    createModel() {

        const model = new Object3D;
        const {parts} = this;

        for (name in parts) {

            const parent = parts[parts[name].parent] ? parts[parts[name].parent].model : model;
            parent.add(parts[name].model);
        }

        model.scale.set(this.scale, this.scale, this.scale);
        return model;
    }

    createBody() {
        const {parts} = this;
        const body = new Body({
            mass: 0,
            position: this.getPosition(),
            type: Body.DYNAMIC,

        });

        let mass = 0;
//        this.eachComponent((component, name) => {
//            const halfExtends = new Vec3(
//                component.params.width*2,
//                component.params.height*2,
//                component.params.depth*2
//            );
//    
//            const position = new Vec3(
//                component.position.x,
//                component.position.y,
//                component.position.z
//            );
//            const shape = new Box(halfExtends, position);
//            body.addShape(shape);
//            mass += component.mass;
//            
////            if (component.parent && parts[component.parent]) {
////                parts[component.parent].body.addShape(body);
////            } else {
//                body.addShape(shape);
//            //}
//            
//            if (!parts[name]) {
//                parts[name] = {};
//            }
//            parts[name].body = body;
//        });
//        body.mass = mass;

        return body;
    }

    reset() {
        this.disance = 0;
        this.speed.current = 0;
    }

    eachComponent(fn) {
        const {components} = this;
        for (let name in components.bodies) {
            const options = deepMerge(Object.assign({}, components.default), components.bodies[name]);
            if (options.render) {
                fn(options, name);
            }
        }
    }

    createCockpit() {

    }

    createEngine() {

    }

    createTailPlane() {

    }

    direction_change(direction) {
        if (direction === 'up') {
            this.removeState(DESCENDING);
            this.addState(RISING);
        } else if (direction === 'down') {
            this.removeState(RISING);
            this.addState(DESCENDING);
        }

    }

    direction_release(direction) {
        if (direction === 'up') {
            this.removeState(RISING, DESCENDING);
        } else if (direction === 'down') {
            this.removeState(DESCENDING, RISING);
        }
    }

    game_ready() {
        window.addEventListener('mousemove', this.onMouseMove.bind(this), false);
        window.addEventListener('keydown', this.onKeyDown.bind(this), false);
        window.addEventListener('keyup', this.onKeyUp.bind(this), false);
    }

    onMouseMove(ev) {
        const tx = -1 + (ev.clientX / window.innerWidth) * 2;
        const ty = 1 - (ev.clientY / window.innerHeight) * 2;
        mousePos = {x: tx, y: ty};
    }

    onKeyDown(ev) {
        const name = getKeyCode(ev);
        console.log(name);
        if ([38, 87].indexOf(name) > -1) {
            this.direction_change('up');
        } else if ([40, 83].indexOf(name) > -1) {
            this.direction_change('down');
        }
    }

    onKeyUp(ev) {
        const name = getKeyCode(ev);

        if ([38, 87].indexOf(name) > -1) {
            this.direction_release('up');
        } else if ([40, 83].indexOf(name) > -1) {
            this.direction_release('down');
        }
    }

    animate(delta) {
        const {body, position, amplitude, speed, sensitivity, energy, camera} = this;
        const {game} = this.options;
        if (this.is(FLYING)) {
            if (this.is(RISING)) {
                mousePos.y += speed.vertical;
            } else if (this.is(DESCENDING)) {
                mousePos.y -= speed.vertical;
            }

            this.parts.blade.model.rotation.x += (0.2);
            this.addEnergy(-game.speed.current * delta * energy.cost);
            var targetX = normalize(mousePos.x, -1, 1, -amplitude.width * 0.7, -amplitude.width);
            var targetY = normalize(mousePos.y, -0.75, 0.75, 100 - amplitude.height, 100 + amplitude.height);

            this.setXY(
                    body.position.x + (targetX - body.position.x) * delta * sensitivity.move,
                    body.position.y + (targetY - body.position.y) * delta * sensitivity.move
                    );
            this.rotateXZ(
                    (body.position.y - targetY) * delta * sensitivity.rotateZ,
                    (targetY - body.position.y) * delta * sensitivity.rotateX

            );
            speed.current = normalize(mousePos.x, -0.5, 0.5, speed.min, speed.max);
            
            camera.fov = normalize(mousePos.x,-1,1,40, 80);
            camera.updateProjectionMatrix ();
            camera.position.y += (body.position.y - camera.position.y)*delta*game.cameraSensitivity;
        } else if (this.is(FALLING)) {
            this.parts.blade.model.rotation.x += (0.1);
            speed.current *= 0.99;

            speed.falling *= 1.05;

            body.position.x += 0.0003 * delta;
            body.position.y -= speed.falling * delta;
            body.position.z += (-Math.PI / 2 - this.model.rotation.z * 0.0002 * delta)
            this.updatePosition();
            //this.body.updateMassProperties();
        }




        //this.setX(targetX);

        //this.update();

    }

    updateCamera() {

    }

    displace() {

    }

    addEnergy(quantity = 0) {
        const {energy} = this;
        energy.current = Math.max(Math.min(energy.max, energy.current + quantity), energy.min);

        this.$store.commit('model', {
            key: 'energy',
            value: energy
        });

        if (energy.current <= 0) {
            this.setState(FALLING);
            this.$emit('game_over');

    }
    }

    isFlying() {
        return this.is(FLYING);
    }

    game_over() {

    }

    game_reset() {
        this.energy = Object.assign({}, this.__energy);
    }
}

const COMPONENTS = {
    component: Component,
    cockpit: Cockpit
};


export default AirPlane;