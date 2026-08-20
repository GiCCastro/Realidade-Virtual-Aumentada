import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { ARButton } from 'three/addons/webxr/ARButton.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { XRScene } from './scene';
import { setupControllers } from './controllers';
import { setupARHitTest } from './ar';
import { sondarCapacidades } from './sonda';
import { Diario, explicarFalha } from './diario';
import { montarSonda } from './relatorio';

// --- Renderer ---
const container = document.getElementById('app') as HTMLDivElement;

const painelSonda = document.createElement('div');
const painelDiario = document.createElement('div');

painelDiario.style.position = 'fixed';
painelDiario.style.bottom = '10px';
painelDiario.style.left = '10px';
painelDiario.style.zIndex = '9999';
painelDiario.style.maxWidth = '500px';
painelDiario.style.maxHeight = '200px';
painelDiario.style.overflowY = 'auto';
painelDiario.style.padding = '10px';
painelDiario.style.background = 'rgba(0, 0, 0, 0.75)';
painelDiario.style.color = 'white';
painelDiario.style.fontFamily = 'monospace';

document.body.appendChild(painelDiario);

const diario = new Diario();
diario.fixarDestino(painelDiario);
painelSonda.style.position = 'fixed';
painelSonda.style.top = '10px';
painelSonda.style.left = '10px';
painelSonda.style.zIndex = '9999';
painelSonda.style.maxWidth = '500px';
painelSonda.style.maxHeight = '90vh';
painelSonda.style.overflowY = 'auto';
painelSonda.style.padding = '15px';
painelSonda.style.background = 'rgba(0, 0, 0, 0.75)';
painelSonda.style.color = 'white';
painelSonda.style.fontFamily = 'monospace';

document.body.appendChild(painelSonda);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true; // habilita o loop WebXR
container.appendChild(renderer.domElement);

// --- Cena ---
const xr = new XRScene();

// Órbita com o mouse no desktop (fora do modo imersivo)
const orbit = new OrbitControls(xr.camera, renderer.domElement);
orbit.target.set(0, 1.2, -1);
orbit.update();

// --- Controllers XR ---
const controllers = setupControllers(renderer, xr.scene, xr.interactive);

// --- AR hit-test ---
const arHitTest = setupARHitTest(renderer, xr.scene);

// --- Botões VR e AR ---
document.body.appendChild(VRButton.createButton(renderer));
document.body.appendChild(
  ARButton.createButton(renderer, {
    // Nada em requiredFeatures: uma feature exigida que o aparelho não tem
    // desabilita o botão inteiro, e o aluno vê um botão morto sem saber por quê.
    // Como opcional, a sessão sobe e a ausência fica observável.
    requiredFeatures: [],
    optionalFeatures: ['hit-test', 'local-floor', 'bounded-floor', 'dom-overlay'],
    domOverlay: { root: document.body },
  }),
);

// --- Loop de animação (use setAnimationLoop, NÃO requestAnimationFrame) ---
const clock = new THREE.Clock();

renderer.setAnimationLoop((_timestamp, frame) => {
  const delta = clock.getDelta();
  xr.update(delta);
  controllers.update();
  if (frame) arHitTest.update(frame);
  renderer.render(xr.scene, xr.camera);
});

// --- Responsividade ---
window.addEventListener('resize', () => {
  xr.camera.aspect = window.innerWidth / window.innerHeight;
  xr.camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

diario.nota('Iniciando sondagem de capacidades do aparelho.');

sondarCapacidades()
  .then((capacidades) => {
    diario.nota(capacidades.mensagem);

    console.log('Resultado da sondagem:', capacidades);

    montarSonda(painelSonda, capacidades);

    diario.nota(
      `API XR: ${
        capacidades.temApiXr
          ? 'disponível'
          : 'não disponível'
      }`,
    );

    diario.nota(
      `Modos suportados: ${
        capacidades.modosSuportados.length > 0
          ? capacidades.modosSuportados.join(', ')
          : 'nenhum'
      }`,
    );

    diario.nota(
      `Graus de liberdade: ${capacidades.grausDeLiberdade}`,
    );

    diario.nota(
      `Classe: ${capacidades.classe}`,
    );

    diario.nota(
      `Espaços concedidos: ${
        capacidades.espacosConcedidos.length > 0
          ? capacidades.espacosConcedidos.join(', ')
          : 'nenhum'
      }`,
    );

    for (const recurso of capacidades.recursos) {
      diario.nota(
        `${recurso.nome}: ${recurso.estado}`,
      );
    }
  })
  .catch((erro: unknown) => {
    diario.falha(explicarFalha(erro));
  });