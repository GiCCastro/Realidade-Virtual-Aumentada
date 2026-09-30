import * as THREE from 'three';

/**
 * Painel 3D de Custo do Quadro fixado em evidência na parede do fundo do estúdio,
 * posicionado diretamente à frente dos painéis acústicos para evitar sobreposição/clipping.
 */
export class Painel3DDesempenho {
  readonly mesh: THREE.Mesh;
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private texture: THREE.CanvasTexture;

  private frameTimes: number[] = [];
  private workCosts: number[] = [];
  private maxWindow = 120;
  private lastTime = performance.now();
  private frameCounter = 0;

  constructor() {
    // Canvas 2D de alta definição (800x520px)
    this.canvas = document.createElement('canvas');
    this.canvas.width = 800;
    this.canvas.height = 520;
    this.ctx = this.canvas.getContext('2d')!;

    this.texture = new THREE.CanvasTexture(this.canvas);
    this.texture.minFilter = THREE.LinearFilter;

    // Placa 3D nítida e bem visível (0.8m x 0.52m)
    const geo = new THREE.PlaneGeometry(0.8, 0.52);
    const mat = new THREE.MeshBasicMaterial({
      map: this.texture,
      side: THREE.DoubleSide,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(geo, mat);

    // Posiciona em z = -1.38 para ficar à frente da parede (z = -1.5) e painéis acústicos (z = -1.46)
    this.mesh.position.set(0, 1.7, -1.38);
    this.mesh.rotation.y = 0;

    // Moldura estilo monitor digital de estúdio
    const molduraGeo = new THREE.BoxGeometry(0.82, 0.54, 0.015);
    const molduraMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.7,
      metalness: 0.3,
    });
    const moldura = new THREE.Mesh(molduraGeo, molduraMat);
    moldura.position.z = -0.008;
    this.mesh.add(moldura);

    // Suporte de fixação de parede (suporte metálico traseiro)
    const suporteGeo = new THREE.BoxGeometry(0.2, 0.2, 0.06);
    const suporteMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.8 });
    const suporte = new THREE.Mesh(suporteGeo, suporteMat);
    suporte.position.set(0, 0, -0.04);
    this.mesh.add(suporte);
  }

  /**
   * Coleta métricas reais e atualiza a exibição no painel 3D
   */
  update(renderer: THREE.WebGLRenderer, realWorkCostMs: number): void {
    const now = performance.now();
    const deltaMs = now - this.lastTime;
    this.lastTime = now;

    if (deltaMs > 0 && deltaMs < 500) {
      this.frameTimes.push(deltaMs);
      this.workCosts.push(realWorkCostMs);

      if (this.frameTimes.length > this.maxWindow) {
        this.frameTimes.shift();
        this.workCosts.shift();
      }
    }

    this.frameCounter++;

    // Atualiza a textura a cada 10 quadros para manter ótima performance
    if (this.frameCounter % 10 === 0 && this.frameTimes.length > 0) {
      this.drawRealMetrics(renderer);
      this.texture.needsUpdate = true;
    }
  }

  private drawRealMetrics(renderer: THREE.WebGLRenderer): void {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;

    // Dados REAIS do WebXR e WebGL
    const xrSession = renderer.xr.getSession();
    const isPresenting = renderer.xr.isPresenting;
    const targetFps = xrSession?.frameRate || 60;
    const targetMs = 1000 / targetFps;

    const avgInterval = this.frameTimes.reduce((a, b) => a + b, 0) / this.frameTimes.length;
    const worstInterval = Math.max(...this.frameTimes);
    const avgWorkCost = this.workCosts.reduce((a, b) => a + b, 0) / this.workCosts.length;

    const aboveTargetCount = this.frameTimes.filter((t) => t > targetMs + 0.5).length;
    const percentAbove = Math.round((aboveTargetCount / this.frameTimes.length) * 100);

    const drawCalls = renderer.info.render.calls;
    const triangles = renderer.info.render.triangles;

    // 1. Fundo elegante estilo Slate Dark Blue
    ctx.fillStyle = '#1e2330';
    ctx.beginPath();
    ctx.roundRect(0, 0, w, h, 20);
    ctx.fill();

    ctx.strokeStyle = '#334155';
    ctx.lineWidth = 6;
    ctx.stroke();

    // 2. Cabeçalho
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px system-ui, -apple-system, sans-serif';
    ctx.fillText('Custo do quadro', 45, 75);

    const regimeTexto = isPresenting
      ? `WebXR (${xrSession?.environmentBlendMode === 'additive' ? 'AR' : 'VR'})`
      : 'Desktop 3D';
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 26px system-ui, -apple-system, sans-serif';
    ctx.fillText(regimeTexto, w - 210, 73);

    // Divisória
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(45, 105);
    ctx.lineTo(w - 45, 105);
    ctx.stroke();

    // 3. Métricas Reais
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '32px system-ui, -apple-system, sans-serif';
    const step = 56;
    let y = 165;

    ctx.fillText(`Teto do quadro: ${targetMs.toFixed(1)} ms (${targetFps} Hz)`, 45, y);
    y += step;

    ctx.fillText(
      `Intervalo médio: ${avgInterval.toFixed(1)} ms  ·  pior: ${worstInterval.toFixed(1)} ms`,
      45,
      y,
    );
    y += step;

    ctx.fillText(`Custo do nosso trabalho: ${avgWorkCost.toFixed(2)} ms`, 45, y);
    y += step;

    const corAlerta = percentAbove > 10 ? '#f59e0b' : '#34d399';
    ctx.fillStyle = corAlerta;
    ctx.fillText(
      `Acima do teto: ${percentAbove}% dos ${this.frameTimes.length} quadros observados`,
      45,
      y,
    );
    ctx.fillStyle = '#e2e8f0';
    y += step;

    ctx.fillText(`Chamadas de desenho: ${drawCalls}  ·  triângulos: ${triangles}`, 45, y);
  }
}
