import * as THREE from "three";
import { OrbitControls } from "jsm/controls/OrbitControls.js";
import spline from "./spline.js";

const w = window.innerWidth;
const h = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, w / h, 0.1, 100);
camera.position.z = 22;
const scene = new THREE.Scene();
// newly added - fog
scene.fog = new THREE.FogExp2(0x000000, 0.3);
const renderer = new THREE.WebGLRenderer(scene, camera);
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

// -------------------------------------------------
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.SRGBColorSpace;
// -------------------------------------------------

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

// creating a line geometry for the spline ---------------------------------------
const points = spline.getPoints(100);
const geo = new THREE.BufferGeometry().setFromPoints(points);
const mat = new THREE.LineBasicMaterial({ color: 0xff0000 });
const line = new THREE.Line(geo, mat);
// ------------------------------------------------------------------------------

// creating tube geometry ---------------------------------------
const num_div_len = 222;
const radius = 0.65;
const num_div_rad = 16;
const closed = true;
const tube_geo = new THREE.TubeGeometry(spline, num_div_len, radius, num_div_rad, closed);
const tube_mat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  side: THREE.DoubleSide,
  wireframe: true,
});
const tube_mesh = new THREE.Mesh(tube_geo, tube_mat);
// scene.add(tube_mesh);
// ------------------------------------------------------------------------------

// creating the edge geometry ---------------------------------------
const edges = new THREE.EdgesGeometry(tube_geo, 0.2);
const line_mat = new THREE.LineBasicMaterial({color: 0xffffff});
const tube_lines = new THREE.LineSegments(edges, line_mat);
scene.add(tube_lines);
// ------------------------------------------------------------------------------

const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444);
scene.add(hemiLight);

// camera pan - fly through
function updateCamera(t) {
  const time = t * 0.2;
  const looptime = 20 * 1000;

  const p = (time % looptime) / looptime; // point - [0, 1]
  const pos = tube_geo.parameters.path.getPointAt(p);
  const lookAt = tube_geo.parameters.path.getPointAt((p + 0.03) % 1);

  camera.position.copy(pos);
  camera.lookAt(lookAt);
}

function animate_(t = 0) {
  requestAnimationFrame(animate_);
  updateCamera(t);
  renderer.render(scene, camera);
  controls.update();
}
animate_();

function handleWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener("resize", handleWindowResize, false);
