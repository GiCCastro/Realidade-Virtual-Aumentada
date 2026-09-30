import * as THREE from 'three';

/**
 * Cria o cenário do Estúdio de Música com paleta de cores personalizada:
 * - Piso em madeira de carvalho quente
 * - Paredes azul grafite elegante (Slate Navy)
 * - Painéis/Janelas acústicas em Azul Royal metálico (Royal Studio Blue)
 * - Tapete de montagem aveludado bordô
 */
export class EstudioMusica {
  readonly group = new THREE.Group();
  readonly areaMontagem: THREE.Mesh;

  constructor() {
    const largura = 4.0;
    const profundidade = 3.0;
    const altura = 2.8;

    // 1. Piso de madeira (Carvalho Quente)
    const pisoGeo = new THREE.PlaneGeometry(largura, profundidade);
    const pisoMat = new THREE.MeshStandardMaterial({
      color: 0x4a3222,
      roughness: 0.45,
      metalness: 0.1,
    });
    const piso = new THREE.Mesh(pisoGeo, pisoMat);
    piso.rotation.x = -Math.PI / 2;
    piso.receiveShadow = true;
    this.group.add(piso);

    // 2. Tapete de montagem no centro (Vinho / Bordô aveludado)
    const tapeteGeo = new THREE.PlaneGeometry(2.0, 1.4);
    const tapeteMat = new THREE.MeshStandardMaterial({
      color: 0x801515,
      roughness: 0.9,
      metalness: 0.0,
    });
    this.areaMontagem = new THREE.Mesh(tapeteGeo, tapeteMat);
    this.areaMontagem.rotation.x = -Math.PI / 2;
    this.areaMontagem.position.set(0, 0.005, -0.6);
    this.areaMontagem.receiveShadow = true;
    this.group.add(this.areaMontagem);

    // Borda iluminada/demarcação do tapete
    const bordaGeo = new THREE.RingGeometry(0.85, 0.88, 32);
    const bordaMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.7,
    });
    const bordaTapete = new THREE.Mesh(bordaGeo, bordaMat);
    bordaTapete.rotation.x = -Math.PI / 2;
    bordaTapete.position.set(0, 0.006, -0.6);
    this.group.add(bordaTapete);

    // 3. Paredes do Estúdio (Cinza Grafite / Slate Navy Elegante)
    const paredeMat = new THREE.MeshStandardMaterial({
      color: 0x242b35,
      roughness: 0.8,
    });

    // Parede do fundo
    const paredeFundo = new THREE.Mesh(new THREE.PlaneGeometry(largura, altura), paredeMat);
    paredeFundo.position.set(0, altura / 2, -profundidade / 2);
    this.group.add(paredeFundo);

    // Paredes laterais
    const paredeEsq = new THREE.Mesh(new THREE.PlaneGeometry(profundidade, altura), paredeMat);
    paredeEsq.position.set(-largura / 2, altura / 2, 0);
    paredeEsq.rotation.y = Math.PI / 2;
    this.group.add(paredeEsq);

    const paredeDir = new THREE.Mesh(new THREE.PlaneGeometry(profundidade, altura), paredeMat);
    paredeDir.position.set(largura / 2, altura / 2, 0);
    paredeDir.rotation.y = -Math.PI / 2;
    this.group.add(paredeDir);

    // 4. Painéis / Janelas Acústicas na parede do fundo (Azul Royal Studio com detalhes metálicos)
    this.addPaineisAcusticos(largura, altura, -profundidade / 2);

    // 5. Banco do Baterista
    this.addBancoBaterista(new THREE.Vector3(0, 0, -0.3));
  }

  private addPaineisAcusticos(_largura: number, _altura: number, zPos: number): void {
    // Molduras / Painéis acústicos em Azul Royal acetinado
    const painelGeo = new THREE.BoxGeometry(0.65, 1.3, 0.04);
    const painelMat = new THREE.MeshStandardMaterial({
      color: 0x1e3a8a, // Azul Royal vibrante de estúdio
      roughness: 0.4,
      metalness: 0.3,
    });

    // Moldura externa contrastante dos painéis (Azul Celeste)
    const molduraMat = new THREE.MeshStandardMaterial({
      color: 0x3b82f6,
      roughness: 0.3,
      metalness: 0.6,
    });

    const posicoesX = [-1.35, 1.35];
    posicoesX.forEach((x) => {
      const painelGroup = new THREE.Group();
      painelGroup.position.set(x, 1.5, zPos + 0.02);

      const painel = new THREE.Mesh(painelGeo, painelMat);
      painelGroup.add(painel);

      // Borda/Moldura externa do painel
      const molduraBorda = new THREE.Mesh(new THREE.BoxGeometry(0.69, 1.34, 0.03), molduraMat);
      molduraBorda.position.z = -0.01;
      painelGroup.add(molduraBorda);

      this.group.add(painelGroup);
    });
  }

  private addBancoBaterista(pos: THREE.Vector3): void {
    const bancoGroup = new THREE.Group();
    bancoGroup.position.copy(pos);

    const assentoGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.08, 24);
    const assentoMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });
    const assento = new THREE.Mesh(assentoGeo, assentoMat);
    assento.position.y = 0.5;
    bancoGroup.add(assento);

    const hasteGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.5, 16);
    const hasteMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const haste = new THREE.Mesh(hasteGeo, hasteMat);
    haste.position.y = 0.25;
    bancoGroup.add(haste);

    for (let i = 0; i < 3; i++) {
      const ang = (i * Math.PI * 2) / 3;
      const peGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.35, 12);
      const pe = new THREE.Mesh(peGeo, hasteMat);
      pe.position.set(Math.sin(ang) * 0.12, 0.12, Math.cos(ang) * 0.12);
      pe.rotation.z = Math.sin(ang) * 0.35;
      pe.rotation.x = Math.cos(ang) * 0.35;
      bancoGroup.add(pe);
    }

    this.group.add(bancoGroup);
  }
}
