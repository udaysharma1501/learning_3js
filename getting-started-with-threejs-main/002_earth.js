import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import getStarfield from "./getStarfield.js";

const w = window.innerWidth;
const h = window.innerHeight;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, w/h, 0.1, 100);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// --------------------------- creating an earthgroup and making the earthmesh its child --------------------------- 
const earthGroup = new THREE.Group();
earthGroup.rotation.z = -23.4 * (Math.PI/180);
scene.add(earthGroup);
// --------------------------- --------------------------- ---------------------------

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const loader = new THREE.TextureLoader();
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshStandardMaterial({
    map: loader.load('http://127.0.0.1:8080/earthmap1k.jpg'),
});
const earthMesh = new THREE.Mesh(geometry, material);
earthGroup.add(earthMesh);

const stars = getStarfield({numStars: 10000});
scene.add(stars);

const sunlight = new THREE.DirectionalLight(0xffffff);
sunlight.position.set(-2, 0.5, 1.5);
scene.add(sunlight);

function animate_(){
    requestAnimationFrame(animate_);
    earthMesh.rotation.y += 0.005;
    renderer.render(scene, camera);
    controls.update();
}
animate_();

function handleWindowResize () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', handleWindowResize, false);