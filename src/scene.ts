import * as THREE from 'three';
import { EstudioMusica } from './estudio';
import { GerenciadorPecas } from './pecas';
import { Painel3DDesempenho } from './painel3d';

/**
 * Gerencia a cena do Estúdio de Música, a bateria para montagem e
 * o Painel 3D de Custo do Quadro fixado discretamente na parede lateral.
 */
export class XRScene {
  readonly scene = new THREE.Scene();
  readonly camera: THREE.PerspectiveCamera;
  readonly interactive: THREE.Object3D[] = [];

  readonly estudio: EstudioMusica;
  readonly gerenciadorPecas: GerenciadorPecas;
  readonly painel3D: Painel3DDesempenho;

  constructor() {
    this.scene.background = new THREE.Color(0x14161d);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.01,
      100,
    );
    this.camera.position.set(0, 1.5, 1.4);

    this.addLights();

    // 1. Estúdio de Música
    this.estudio = new EstudioMusica();
    this.scene.add(this.estudio.group);

    // 2. Gerenciador das Peças da Bateria
    this.gerenciadorPecas = new GerenciadorPecas();
    this.scene.add(this.gerenciadorPecas.group);
    this.interactive.push(...this.gerenciadorPecas.objetosInterativos);

    // 3. Painel 3D de Custo do Quadro (Fixado na parede do fundo, centralizado atrás/acima da bateria)
    this.painel3D = new Painel3DDesempenho();
    this.scene.add(this.painel3D.mesh);
  }

  private addLights(): void {
    const hemi = new THREE.HemisphereLight(0xffedd5, 0x1e293b, 1.2);
    hemi.position.set(0, 2.5, 0);
    this.scene.add(hemi);

    const spotLuz = new THREE.SpotLight(0xfff7ed, 3.5, 8, Math.PI / 4, 0.4);
    spotLuz.position.set(0, 2.7, 0.5);
    spotLuz.target.position.set(0, 0.5, -0.8);
    spotLuz.castShadow = true;
    this.scene.add(spotLuz);
    this.scene.add(spotLuz.target);
  }

  update(delta: number, renderer: THREE.WebGLRenderer, workTimeMs: number): void {
    this.gerenciadorPecas.update(delta);
    this.painel3D.update(renderer, workTimeMs);
  }
}