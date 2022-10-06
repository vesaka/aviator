import GameBase3D from '$lib/game/core/3d/game-base';
import World from './models/world';
import { PerspectiveCamera, AmbientLight, HemisphereLight, DirectionalLight, AxesHelper, Fog, Vector3, GridHelper, Clock, Color} from 'three';
import Sea from './models/sea';
import Sky from './models/sky';
import AirPlane from './models/plane/air-plane';
import FlyingObjects from './models/objects/flying-objects';
import * as dat from 'dat.gui';
import StatesMixin from '$lib/game/core/mixins/states-mixin';
import Pebble from './models/objects/pebble';


class AviatorGame extends GameBase3D {

    constructor(options = {}) {

        super(options);
        this.$listen({
            font: ['loaded'],
            bunny: ['loaded'],
            airplane: ['damaged']
        });

        this.world = new World(this.options.models.world);
        this.createLights();
        this.$set('__game', options.game);
//        const axesHelper = new AxesHelper(100);
//        this.scene.add(axesHelper);

        //this.$set('gui', new dat.GUI());
//        const gridHelper = new GridHelper(1000, 20);
//        this.scene.add(gridHelper);
        this.scene.fog = new Fog(0xf7d9aa, this.options.fog.near, this.options.fog.far);

    }

    async build() {
        const {world, scene, camera, canvas, plane, width, height, renderer, options, controls, ambientLight} = this;
        const game = options.game;
        const sea = new Sea(options.models.sea);
        const sky = new Sky(options.models.sky);
        const airPlane = new AirPlane(Object.assign({mixins: [StatesMixin]}, options.models.air_plane));
        const flyingObjects = new FlyingObjects(options.models.objects);
        const clock = new Clock();
        const timeStep = 1 / 32;
        //const pebble = new Pebble(options.models.pebble)
        flyingObjects.each(item => {
            this.add(item);
        });

        this.add(sea, airPlane);
        this.scene.add(sky.mesh);
        this.$emit('game_ready');
        const startTime = new Date().getTime();
        this.$save('level', game.level.current);
        window.log = true;

        setTimeout(() => {
            log = false;
        }, 2000);
        let newTime = new Date().getTime(),
                oldTime = new Date().getTime(),
                delta = 0;
        
        const levelDistanceDivider = Math.floor(game.distance.tillLevelUpdate / 100);
//        setInterval(() => {
//            console.clear();
//        }, 1500);
        const animate = () => {
            //if (!this.pause) {

                newTime = new Date().getTime();
                delta = newTime - oldTime;
                oldTime = newTime;
                ambientLight.intensity += (0.5 - ambientLight.intensity)*delta*0.005;
                airPlane.animate(delta);
                sea.animate(delta);
                sky.animate(delta);
                flyingObjects.animate(delta);

                const dist = Math.floor(game.distance.current);
                if (0 === (dist % game.distance.tillSpeedUpdate) && (dist > game.speed.lastUpdate)) {
                    game.speed.lastUpdate = dist;
                    game.speed.target += game.speed.increaseByTime * delta;
                }

                if (0 === (dist % game.distance.tillLevelUpdate) && (dist > game.level.lastUpdate)) {
                    game.level.lastUpdate = dist;
                    game.level.current++;
                    game.speed.target = game.speed.init + game.speed.increaseByLevel * game.level.current;
                    this.$save('level', game.level.current);
                }

                /* Update Distamce */
                if (airPlane.isFlying()) {
                    game.distance.current += game.speed.current * delta * game.speed.ratioDistance;
                    const distance = Math.max(0, dist);
                    this.$emit('distance_updated');
                    this.$store.commit('model', {key: 'distance', value: distance});
                    this.$store.commit('model', {
                        key: 'levelDistance',
                        value: (game.distance.tillLevelUpdate * ((game.distance.current % game.distance.tillLevelUpdate) /game.distance.tillLevelUpdate)) / levelDistanceDivider
                    });

                }
                
                if (log) {
                    //console.log(game.speed.current);
                }


                game.speed.base += (game.speed.target - game.speed.base) * delta * 0.02;
                game.speed.current = game.speed.base * airPlane.speed.current;
                world.step(timeStep, clock.getDelta());
            //}
            
            
            renderer.render(scene, camera);
            if (controls) {
                controls.update();
            }
            
            
            requestAnimationFrame(animate);


        };

        animate();

    }

    renderer_created(renderer) {
        const camera = this.options.camera;
        this.$set('camera', new PerspectiveCamera(camera.fov, this.width / this.height, camera.near, camera.far));

        renderer.clearColor(0, 88, 122);

        this.$emit('camera_created');
        this.camera.position.set(
                camera.position.x,
                camera.position.y,
                camera.position.z,
                );

       // this.controls.target.set(0, 75, 0);
//        this.controls.update();
//        this.controls.reset();
        renderer.shadowMap.enabled = true;
    }

    window_resize() {

    }

    createLights() {
        const {shadow, hemisphere, ambient} = this.options.lights;
        const props = ['camera', 'mapSize'];

        const hemisphereLight = new HemisphereLight(
                0xAAAAAA,
                0x000000,
                hemisphere.intesity
                );

        const shadowLight = new DirectionalLight(0xffffff, shadow.intensity);

        shadowLight.position.set(
                shadow.position.x,
                shadow.position.y,
                shadow.position.z
                );

        for (let i in props) {
            for (let key in shadow[props[i]]) {
                shadowLight.shadow[props[i]][key] = shadow[props[i]][key];
            }
        }

        shadowLight.castShadow = shadow.castShadow;
        
        this.ambientLight = new AmbientLight(0xdc8874, ambient.intensity);

        this.scene.add(hemisphereLight);
        this.scene.add(shadowLight);
        this.scene.add(this.ambientLight);
    }

    updateDistance(delta) {
        const {game} = this;

    }
    
    airplane_damaged(airplane) {
        this.ambientLight.intensity = 2;
    }
    
    game_reset() {
        console.log('dsadfs');
        //this.game = Object.assign({}, this.__game);
    }

}
;

export default AviatorGame;


