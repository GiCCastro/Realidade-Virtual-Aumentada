import * as THREE from 'three';

// -------------------------------------------------------------
// Componentes 3D da Bateria (Bumbo, Caixa, Chimbal, Tons, Surdo, Ride)
// -------------------------------------------------------------

export class ComponentesBateria {
  readonly group = new THREE.Group();
  readonly objetosInterativos: THREE.Object3D[] = [];

  constructor() {
    this.addBumbo(new THREE.Vector3(0, 0, -0.9));
    this.addCaixa(new THREE.Vector3(-0.4, 0, -0.65));
    this.addChimbal(new THREE.Vector3(-0.65, 0, -0.7));
    this.addTonsESurdo();
    this.addPratoConducao(new THREE.Vector3(0.55, 0, -0.95));
  }

  // 1. Bumbo (16" de diâmetro, profundo)
  private addBumbo(pos: THREE.Vector3): void {
    const bumboGroup = new THREE.Group();
    bumboGroup.position.copy(pos);

    // Corpo do bumbo (Cilindro deitado)
    const corpoGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.45, 32);
    const corpoMat = new THREE.MeshStandardMaterial({
      color: 0x1e293b, // Azul marinho metálico escuro
      roughness: 0.3,
      metalness: 0.7,
    });
    const corpo = new THREE.Mesh(corpoGeo, corpoMat);
    corpo.rotation.x = Math.PI / 2;
    corpo.position.y = 0.32;
    corpo.castShadow = true;
    corpo.userData.nome = 'Bumbo';
    bumboGroup.add(corpo);
    this.objetosInterativos.push(corpo);

    // Pele frontal e traseira
    const peleGeo = new THREE.CylinderGeometry(0.31, 0.31, 0.46, 32);
    const peleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.8 });
    const pele = new THREE.Mesh(peleGeo, peleMat);
    pele.rotation.x = Math.PI / 2;
    pele.position.y = 0.32;
    bumboGroup.add(pele);

    // Aros de sustentação metálicos
    const aroMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    for (const offsetZ of [-0.22, 0.22]) {
      const aroGeo = new THREE.TorusGeometry(0.325, 0.012, 16, 32);
      const aro = new THREE.Mesh(aroGeo, aroMat);
      aro.position.set(0, 0.32, offsetZ);
      bumboGroup.add(aro);
    }

    this.group.add(bumboGroup);
  }

  // 2. Caixa (13" diâmetro sobre suporte)
  private addCaixa(pos: THREE.Vector3): void {
    const caixaGroup = new THREE.Group();
    caixaGroup.position.copy(pos);

    // Suporte vertical
    const hasteGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.65, 16);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const haste = new THREE.Mesh(hasteGeo, metalMat);
    haste.position.y = 0.325;
    caixaGroup.add(haste);

    // Corpo da Caixa
    const caixaGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.12, 32);
    const caixaMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.3 });
    const caixa = new THREE.Mesh(caixaGeo, caixaMat);
    caixa.position.y = 0.68;
    caixa.castShadow = true;
    caixa.userData.nome = 'Caixa';
    caixaGroup.add(caixa);
    this.objetosInterativos.push(caixa);

    // Pele superior
    const peleGeo = new THREE.CylinderGeometry(0.19, 0.19, 0.125, 32);
    const peleMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.7 });
    const pele = new THREE.Mesh(peleGeo, peleMat);
    pele.position.y = 0.68;
    caixaGroup.add(pele);

    this.group.add(caixaGroup);
  }

  // 3. Chimbal (Hi-Hat)
  private addChimbal(pos: THREE.Vector3): void {
    const chimbalGroup = new THREE.Group();
    chimbalGroup.position.copy(pos);

    // Suporte vertical
    const hasteGeo = new THREE.CylinderGeometry(0.012, 0.012, 1.0, 16);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const haste = new THREE.Mesh(hasteGeo, metalMat);
    haste.position.y = 0.5;
    chimbalGroup.add(haste);

    // Pratos duplos do chimbal
    const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });

    const pratoSupGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.003, 32);
    const pratoSup = new THREE.Mesh(pratoSupGeo, bronzeMat);
    pratoSup.position.y = 0.92;
    pratoSup.userData.nome = 'Chimbal';
    chimbalGroup.add(pratoSup);
    this.objetosInterativos.push(pratoSup);

    const pratoInf = new THREE.Mesh(pratoSupGeo, bronzeMat);
    pratoInf.position.y = 0.905;
    chimbalGroup.add(pratoInf);

    // Pedal no chão
    const pedalGeo = new THREE.BoxGeometry(0.1, 0.02, 0.22);
    const pedalMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const pedal = new THREE.Mesh(pedalGeo, pedalMat);
    pedal.position.set(0, 0.01, 0.08);
    chimbalGroup.add(pedal);

    this.group.add(chimbalGroup);
  }

  // 4. Tons (10") sobre o Bumbo e Surdo (14") de chão
  private addTonsESurdo(): void {
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });

    // Tom 1
    const tomGroup = new THREE.Group();
    tomGroup.position.set(-0.15, 0.72, -0.9);
    const tomGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.18, 32);
    const tomMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.7, roughness: 0.3 });
    const tom = new THREE.Mesh(tomGeo, tomMat);
    tom.rotation.z = -0.2;
    tom.castShadow = true;
    tom.userData.nome = 'Tom';
    tomGroup.add(tom);
    this.objetosInterativos.push(tom);
    this.group.add(tomGroup);

    // Surdo de chão (Floor Tom)
    const surdoGroup = new THREE.Group();
    surdoGroup.position.set(0.45, 0, -0.65);
    const surdoGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.45, 32);
    const surdo = new THREE.Mesh(surdoGeo, tomMat);
    surdo.position.y = 0.42;
    surdo.castShadow = true;
    surdo.userData.nome = 'Surdo';
    surdoGroup.add(surdo);
    this.objetosInterativos.push(surdo);

    // Pés do Surdo
    for (let i = 0; i < 3; i++) {
      const ang = (i * Math.PI * 2) / 3;
      const peGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.35, 12);
      const pe = new THREE.Mesh(peGeo, metalMat);
      pe.position.set(Math.sin(ang) * 0.2, 0.18, Math.cos(ang) * 0.2);
      surdoGroup.add(pe);
    }
    this.group.add(surdoGroup);
  }

  // 5. Prato de Condução (Ride Cymbal ~20")
  private addPratoConducao(pos: THREE.Vector3): void {
    const rideGroup = new THREE.Group();
    rideGroup.position.copy(pos);

    const hasteGeo = new THREE.CylinderGeometry(0.015, 0.015, 1.25, 16);
    const metalMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
    const haste = new THREE.Mesh(hasteGeo, metalMat);
    haste.position.y = 0.625;
    rideGroup.add(haste);

    const rideGeo = new THREE.CylinderGeometry(0.28, 0.28, 0.004, 32);
    const bronzeMat = new THREE.MeshStandardMaterial({ color: 0xd97706, metalness: 0.85, roughness: 0.25 });
    const ride = new THREE.Mesh(rideGeo, bronzeMat);
    ride.position.y = 1.22;
    ride.rotation.z = -0.15;
    ride.castShadow = true;
    ride.userData.nome = 'Prato de Condução';
    rideGroup.add(ride);
    this.objetosInterativos.push(ride);

    this.group.add(rideGroup);
  }
}
