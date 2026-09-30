import * as THREE from 'three';
import { drumAudio } from './audio';
import { PratoBateria } from './prato';

export interface PecaBateriaData {
  nome: string;
  group: THREE.Group;
  meshInterativa: THREE.Mesh;
  posicaoInicial: THREE.Vector3;
  posicaoTarget: THREE.Vector3;
  encaixado: boolean;
  tocarSom: () => void;
  pratoInstancia?: PratoBateria;
  ehObjetoErrado?: boolean;
}

export class GerenciadorPecas {
  readonly group = new THREE.Group();
  readonly pecas: PecaBateriaData[] = [];
  readonly objetosInterativos: THREE.Object3D[] = [];
  readonly marcadoresAlvo: THREE.Group = new THREE.Group();

  errosCometidos = 0;
  readonly maxErros = 5;
  pecasEncaixadasCount = 0;
  totalPecas = 7;

  // Callback de atualização de estado da interface / status
  onStatusChange?: (msg: string, erros: number, concluido: boolean) => void;

  constructor() {
    this.group.add(this.marcadoresAlvo);
    this.addPecaBumbo();
    this.addPecaCaixa();
    this.addPecaChimbal();
    this.addPecaPratoRide();
    this.addPecaTom();
    this.addPecaSurdo();
    this.addPecaPratoCrash();

    // Adiciona objetos de cenário / errados para o desafio de montagem
    this.addObjetosCenarioErrados();
  }

  // 1. Bumbo
  private addPecaBumbo(): void {
    const group = new THREE.Group();
    const posInicial = new THREE.Vector3(-1.3, 0, 0.2);
    const posTarget = new THREE.Vector3(0, 0, -0.7);
    group.position.copy(posInicial);

    const corpoGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.45, 32);
    const corpoMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.7 });
    const corpo = new THREE.Mesh(corpoGeo, corpoMat);
    corpo.rotation.x = Math.PI / 2;
    corpo.position.y = 0.32;
    corpo.castShadow = true;
    group.add(corpo);

    const peleGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.46, 32);
    const peleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
    const pele = new THREE.Mesh(peleGeo, peleMat);
    pele.rotation.x = Math.PI / 2;
    pele.position.y = 0.32;
    group.add(pele);

    this.registrarPeca({
      nome: 'Bumbo',
      group,
      meshInterativa: corpo,
      posicaoInicial: posInicial,
      posicaoTarget: posTarget,
      encaixado: false,
      tocarSom: () => drumAudio.playBumbo(),
    });
  }

  // 2. Caixa
  private addPecaCaixa(): void {
    const group = new THREE.Group();
    const posInicial = new THREE.Vector3(1.3, 0, 0.3);
    const posTarget = new THREE.Vector3(-0.4, 0, -0.45);
    group.position.copy(posInicial);

    const hasteGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.65, 16);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const haste = new THREE.Mesh(hasteGeo, metalMat);
    haste.position.y = 0.325;
    group.add(haste);

    const caixaGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 32);
    const caixaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
    const caixa = new THREE.Mesh(caixaGeo, caixaMat);
    caixa.position.y = 0.68;
    caixa.castShadow = true;
    group.add(caixa);

    this.registrarPeca({
      nome: 'Caixa',
      group,
      meshInterativa: caixa,
      posicaoInicial: posInicial,
      posicaoTarget: posTarget,
      encaixado: false,
      tocarSom: () => drumAudio.playCaixa(),
    });
  }

  // 3. Chimbal
  private addPecaChimbal(): void {
    const group = new THREE.Group();
    const posInicial = new THREE.Vector3(-1.4, 0, -0.4);
    const posTarget = new THREE.Vector3(-0.65, 0, -0.5);
    group.position.copy(posInicial);

    const hasteGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.0, 16);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const haste = new THREE.Mesh(hasteGeo, metalMat);
    haste.position.y = 0.5;
    group.add(haste);

    const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const pratoSupGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.003, 32);
    const pratoSup = new THREE.Mesh(pratoSupGeo, bronzeMat);
    pratoSup.position.y = 0.92;
    group.add(pratoSup);

    this.registrarPeca({
      nome: 'Chimbal',
      group,
      meshInterativa: pratoSup,
      posicaoInicial: posInicial,
      posicaoTarget: posTarget,
      encaixado: false,
      tocarSom: () => drumAudio.playChimbal(),
    });
  }

  // 4. Prato de Condução (Ride)
  private addPecaPratoRide(): void {
    const group = new THREE.Group();
    const posInicial = new THREE.Vector3(1.3, 0, -0.5);
    const posTarget = new THREE.Vector3(0.55, 0, -0.75);
    group.position.copy(posInicial);

    const hasteGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.25, 16);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const haste = new THREE.Mesh(hasteGeo, metalMat);
    haste.position.y = 0.625;
    group.add(haste);

    const rideGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.004, 32);
    const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const ride = new THREE.Mesh(rideGeo, bronzeMat);
    ride.position.y = 1.22;
    ride.rotation.z = -0.15;
    group.add(ride);

    this.registrarPeca({
      nome: 'Prato de Condução',
      group,
      meshInterativa: ride,
      posicaoInicial: posInicial,
      posicaoTarget: posTarget,
      encaixado: false,
      tocarSom: () => drumAudio.playRide(),
    });
  }

  // 5. Tom
  private addPecaTom(): void {
    const group = new THREE.Group();
    const posInicial = new THREE.Vector3(0.8, 0, 0.5);
    const posTarget = new THREE.Vector3(-0.15, 0, -0.7);
    group.position.copy(posInicial);

    const tomGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.18, 32);
    const tomMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const tom = new THREE.Mesh(tomGeo, tomMat);
    tom.position.y = 0.72;
    tom.rotation.z = -0.2;
    group.add(tom);

    this.registrarPeca({
      nome: 'Tom',
      group,
      meshInterativa: tom,
      posicaoInicial: posInicial,
      posicaoTarget: posTarget,
      encaixado: false,
      tocarSom: () => drumAudio.playTom(150),
    });
  }

  // 6. Surdo
  private addPecaSurdo(): void {
    const group = new THREE.Group();
    const posInicial = new THREE.Vector3(-0.9, 0, 0.6);
    const posTarget = new THREE.Vector3(0.45, 0, -0.45);
    group.position.copy(posInicial);

    const surdoGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.45, 32);
    const tomMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const surdo = new THREE.Mesh(surdoGeo, tomMat);
    surdo.position.y = 0.42;
    group.add(surdo);

    this.registrarPeca({
      nome: 'Surdo',
      group,
      meshInterativa: surdo,
      posicaoInicial: posInicial,
      posicaoTarget: posTarget,
      encaixado: false,
      tocarSom: () => drumAudio.playTom(80),
    });
  }

  // 7. Prato de Ataque (Crash) com mola amortecida
  private addPecaPratoCrash(): void {
    const posInicial = new THREE.Vector3(0.2, 0, 0.7);
    const posTarget = new THREE.Vector3(-0.35, 0, -0.8);
    const pratoCrash = new PratoBateria(posInicial);

    this.registrarPeca({
      nome: 'Prato de Ataque',
      group: pratoCrash.group,
      meshInterativa: pratoCrash.mesh,
      posicaoInicial: posInicial,
      posicaoTarget: posTarget,
      encaixado: false,
      tocarSom: () => pratoCrash.aplicarGolpe(),
      pratoInstancia: pratoCrash,
    });
  }

  // Objetos do Cenário (Errados) - Ex: Amplificador e Garrafa
  private addObjetosCenarioErrados(): void {
    // Amplificador de som (objeto de cenário não-encaixável)
    const ampGroup = new THREE.Group();
    const posAmp = new THREE.Vector3(1.5, 0, 0);
    ampGroup.position.copy(posAmp);
    const ampGeo = new THREE.BoxGeometry(0.35, 0.4, 0.25);
    const ampMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.8 });
    const ampMesh = new THREE.Mesh(ampGeo, ampMat);
    ampMesh.position.y = 0.2;
    ampGroup.add(ampMesh);

    this.registrarPeca({
      nome: 'Amplificador (Objeto de Cenário)',
      group: ampGroup,
      meshInterativa: ampMesh,
      posicaoInicial: posAmp,
      posicaoTarget: new THREE.Vector3(99, 99, 99), // Target inalcançável
      encaixado: false,
      ehObjetoErrado: true,
      tocarSom: () => drumAudio.playErro(),
    });
  }

  private registrarPeca(data: PecaBateriaData): void {
    data.meshInterativa.userData.pecaData = data;
    this.pecas.push(data);
    this.objetosInterativos.push(data.meshInterativa);
    this.group.add(data.group);

    // Cria um anel indicador/marcador no local alvo de encaixe no tapete
    if (!data.ehObjetoErrado) {
      const ringGeo = new THREE.RingGeometry(0.18, 0.2, 32);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xf59e0b,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.5,
      });
      const ring = new THREE.Mesh(ringGeo, ringMat);
      ring.rotation.x = -Math.PI / 2;
      ring.position.set(data.posicaoTarget.x, 0.008, data.posicaoTarget.z);
      this.marcadoresAlvo.add(ring);
    }
  }

  // Tentar encaixar uma peça solta pelo usuário
  tentarEncaixar(data: PecaBateriaData): boolean {
    if (data.encaixado) return true;

    const distancia = data.group.position.distanceTo(data.posicaoTarget);

    // Se estiver a menos de 0.45m da posição alvo de encaixe
    if (!data.ehObjetoErrado && distancia < 0.45) {
      // ENCAIXE COM SUCESSO!
      data.encaixado = true;
      data.group.position.copy(data.posicaoTarget);
      drumAudio.playAcerto();
      this.pecasEncaixadasCount++;

      const concluido = this.pecasEncaixadasCount === this.totalPecas;
      const msg = concluido
        ? '🎉 BATERIA COMPLETA! Você concluiu a montagem e pode tocar!'
        : `✅ ${data.nome} encaixado! (${this.pecasEncaixadasCount}/${this.totalPecas})`;

      this.onStatusChange?.(msg, this.errosCometidos, concluido);
      return true;
    } else {
      // TENTATIVA INCORRETA DE ENCAIXE
      data.group.position.copy(data.posicaoInicial); // Retorna ao chão
      drumAudio.playErro();
      this.errosCometidos++;

      const msg = `❌ Tentativa de encaixe incorreta para ${data.nome}. Erros: ${this.errosCometidos}/${this.maxErros}`;
      this.onStatusChange?.(msg, this.errosCometidos, false);
      return false;
    }
  }

  update(delta: number): void {
    // Atualiza animações físicas ativas (ex: Prato de Ataque)
    this.pecas.forEach((p) => {
      if (p.pratoInstancia) {
        p.pratoInstancia.update(delta);
      }
    });
  }
}
