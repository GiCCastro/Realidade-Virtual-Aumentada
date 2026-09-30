import * as THREE from 'three';

// -------------------------------------------------------------
// 1. Sintetizador de Áudio (Web Audio API)
// -------------------------------------------------------------
class CymbalAudio {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  play(): void {
    const ctx = this.getContext();
    const bufferSize = ctx.sampleRate * 1.2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1; // Ruído branco
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 5500;

    const gainNode = ctx.createGain();
    const now = ctx.currentTime;
    gainNode.gain.setValueAtTime(0.8, now);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

    noise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    noise.start(now);
  }
}

// -------------------------------------------------------------
// 2. Classe Principal do Prato de Bateria
// -------------------------------------------------------------
export class PratoBateria {
  readonly group = new THREE.Group();
  readonly mesh: THREE.Mesh;

  private pivo: THREE.Group;
  private materialBronze: THREE.MeshStandardMaterial;
  private audio = new CymbalAudio();

  private oscilacao = {
    angulo: 0,
    velocidade: 0,
    rigidez: 120.0,
    amortecimento: 4.5,
    impulsoInicial: 3.5,
  };

  constructor(position = new THREE.Vector3(0, 0, 0)) {
    this.group.position.copy(position);

    // Haste metálica vertical (estante)
    const hasteGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.1, 16);
    const metalCromado = new THREE.MeshStandardMaterial({
      color: 0xcccccc,
      metalness: 0.9,
      roughness: 0.2,
    });
    const hasteMesh = new THREE.Mesh(hasteGeo, metalCromado);
    hasteMesh.position.y = 0.55;
    this.group.add(hasteMesh);

    // Pivô de rotação (onde o prato oscila)
    this.pivo = new THREE.Group();
    this.pivo.position.set(0, 1.1, 0);
    this.group.add(this.pivo);

    // Geometria do prato (Cone/cilindro achatado)
    const pratoGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.003, 32);
    this.materialBronze = new THREE.MeshStandardMaterial({
      color: 0xcd7f32,
      metalness: 0.85,
      roughness: 0.25,
    });

    this.mesh = new THREE.Mesh(pratoGeo, this.materialBronze);
    this.mesh.name = 'prato_crash';
    this.mesh.castShadow = true;
    this.mesh.userData.prato = this;
    this.pivo.add(this.mesh);
  }

  aplicarGolpe(): void {
    this.oscilacao.velocidade = (Math.random() > 0.5 ? 1 : -1) * this.oscilacao.impulsoInicial;
    this.audio.play();

    // Feedback visual (brilho emissivo temporário)
    this.materialBronze.emissive.setHex(0x553311);
    setTimeout(() => this.materialBronze.emissive.setHex(0x000000), 70);
  }

  update(delta: number): void {
    // Equação da mola amortecida: a = -k*x - c*v
    const forcaMola = -this.oscilacao.rigidez * this.oscilacao.angulo;
    const forcaAmortecimento = -this.oscilacao.amortecimento * this.oscilacao.velocidade;
    const aceleracao = forcaMola + forcaAmortecimento;

    this.oscilacao.velocidade += aceleracao * delta;
    this.oscilacao.angulo += this.oscilacao.velocidade * delta;

    this.pivo.rotation.x = this.oscilacao.angulo;
    this.pivo.rotation.z = this.oscilacao.angulo * 0.4;
  }
}
