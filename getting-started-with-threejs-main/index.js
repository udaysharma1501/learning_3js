import * as THREE from "three";
import {OrbitControls} from "jsm/controls/OrbitControls.js";
 
// initialising the renderer and setting its size
const w = window.innerWidth;
const h = window.innerHeight;

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(w, h);

// setting the rendered as child of document
document.body.appendChild(renderer.domElement);

// initialising camera and its attributes
const fov = 75; // deg
const aspect = w / h;
const near = 0.1; // rendering begins at 0.1 units
const far = 10; // rendering stops at 10 units

const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

// pulling the camera back a little bit
camera.position.z = 2;

// initialising scene
const scene = new THREE.Scene();

// ------------------------------------- boilerplate code ends 

// adding controls as a last step
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// adding builtin primitive -------------------------------------
const geo = new THREE.IcosahedronGeometry(1.0, 2); // size, detail
// basic mat - doesnt interact with light
// const mat = new THREE.MeshBasicMaterial({color: 0xccff}); 

// standard mat - interacts with light
const mat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    flatShading: true
});
const mesh = new THREE.Mesh(geo, mat); // mesh contains both geometry and material
scene.add(mesh);

// adding wiremesh
const wireMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    wireframe: true
});
const wireMesh = new THREE.Mesh(geo, wireMat); // using the same geometry but newly created material
wireMesh.scale.setScalar(1.001); // to make it less flickery
mesh.add(wireMesh); // instead of making the wireframe a child of the whole scene - we make it a child of the mesh 

// adding lights -------------------------------------
const hemLight = new THREE.HemisphereLight(0xaa5500, 0x0099ff);
scene.add(hemLight);

// adding the scene and camera to the renderer - always done at EOF -------------------------------------
// renderer.render(scene, camera);
// putting the renderer calling inside a function call which calls itself repeatedly so that we can see the animation happening live
function animate_(t=0){
    requestAnimationFrame(animate_);
    
    // animation to change scale of object using increasing time value 
    // mesh.scale.setScalar(Math.cos(t * 0.001) + 1.0);
    
    // adding rotation functionality to the original mesh
    mesh.rotation.y = t*0.0001;

    renderer.render(scene, camera);
    controls.update();
}
animate_();