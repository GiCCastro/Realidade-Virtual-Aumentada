import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRScene } from './scene';
import { setupControllers } from './controllers';
import { setupARHitTest } from './ar';
import { PecaBateriaData } from './pecas';

// --- Renderer ---
const container = document.getElementById('app') as HTMLDivElement;

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
container.appendChild(renderer.domElement);

// --- Cena ---
const xr = new XRScene();

// Órbita com o mouse no desktop (fora do modo imersivo)
const orbit = new OrbitControls(xr.camera, renderer.domElement);
orbit.target.set(0, 0.8, -0.8);
orbit.update();

// --- Controllers XR (VR/AR) ---
const controllers = setupControllers(renderer, xr.scene, xr.interactive, xr.gerenciadorPecas);

// --- AR hit-test ---
const arHitTest = setupARHitTest(renderer, xr.scene);

// --- Botões VR e AR ---
document.body.appendChild(VRButton.createButton(renderer));
document.body.appendChild(
  ARButton.createButton(renderer, {
    requiredFeatures: [],
    optionalFeatures: ['hit-test', 'local-floor', 'bounded-floor', 'dom-overlay'],
    domOverlay: { root: document.body },
  }),
);

// --- Interação Desktop (Pegar, Arrastar e Soltar / Tocar) ---
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
const dragPlane = new THREE.Plane();
const planeIntersection = new THREE.Vector3();

let objetoArrastado: THREE.Object3D | null = null;
let pecaEmArrasto: PecaBateriaData | null = null;

window.addEventListener('pointerdown', (event) => {
  if ((event.target as HTMLElement).tagName === 'BUTTON') return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, xr.camera);
  const hits = raycaster.intersectObjects(xr.interactive, true);

  if (hits.length > 0) {
    let targetObj: THREE.Object3D | null = hits[0].object;
    while (targetObj && !targetObj.userData.pecaData && targetObj.parent) {
      targetObj = targetObj.parent;
    }

    const pecaData: PecaBateriaData | undefined = targetObj?.userData?.pecaData;

    if (pecaData) {
      if (pecaData.encaixado) {
        // Se já está encaixado, toca o som da peça ao ser atingida/clicada
        pecaData.tocarSom();
      } else {
        // Inicia o arrasto da peça pelo plano horizontal
        objetoArrastado = pecaData.group;
        pecaEmArrasto = pecaData;
        orbit.enabled = false; // Pausa o controle de órbita da câmera durante o arrasto

        const posMundo = new THREE.Vector3();
        objetoArrastado.getWorldPosition(posMundo);
        dragPlane.setFromNormalAndCoplanarPoint(new THREE.Vector3(0, 1, 0), posMundo);
      }
    }
  }
});

window.addEventListener('pointermove', (event) => {
  if (!objetoArrastado || !pecaEmArrasto) return;

  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

  raycaster.setFromCamera(mouse, xr.camera);
  if (raycaster.ray.intersectPlane(dragPlane, planeIntersection)) {
    objetoArrastado.position.copy(planeIntersection);
  }
});

window.addEventListener('pointerup', () => {
  if (objetoArrastado && pecaEmArrasto) {
    xr.gerenciadorPecas.tentarEncaixar(pecaEmArrasto);
    objetoArrastado = null;
    pecaEmArrasto = null;
    orbit.enabled = true; // Reabilita o controle de órbita
  }
});

// --- Loop de Animação ---
const clock = new THREE.Clock();
let workTimeMs = 0;

renderer.setAnimationLoop((_timestamp, frame) => {
  const t0 = performance.now();
  const delta = clock.getDelta();

  xr.update(delta, renderer, workTimeMs);
  controllers.update();
  if (frame) arHitTest.update(frame);

  renderer.render(xr.scene, xr.camera);

  // Calcula o custo do trabalho do nosso código para o quadro seguinte
  workTimeMs = performance.now() - t0;
});

// --- Responsividade ---
window.addEventListener('resize', () => {
  xr.camera.aspect = window.innerWidth / window.innerHeight;
  xr.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});