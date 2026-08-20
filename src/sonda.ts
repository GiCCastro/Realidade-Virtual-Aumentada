import {
  grausDeLiberdade,
  classificarAparelho,
  type GrausDeLiberdade,
  type ClasseDeAparelho,
} from './devices/grau';

import {
  RECURSOS_CONSULTADOS,
  estadoDoRecurso,
  type EstadoDeRecurso,
} from './devices/recursos';

export interface ResultadoRecurso {
  readonly nome: string;
  readonly paraQueServe: string;
  readonly estado: EstadoDeRecurso;
}

export interface CapacidadesXR {
  readonly temApiXr: boolean;
  readonly modosSuportados: readonly string[];
  readonly recursos: readonly ResultadoRecurso[];
  readonly grausDeLiberdade: GrausDeLiberdade;
  readonly classe: ClasseDeAparelho;
  readonly espacosConcedidos: readonly string[];
  readonly mensagem: string;
}


export async function sondarCapacidades(): Promise<CapacidadesXR> {
  const xr = navigator.xr;

  if (!xr) {
    return {
      temApiXr: false,
      modosSuportados: [],
      recursos: RECURSOS_CONSULTADOS.map((recurso) => ({
        nome: recurso.nome,
        paraQueServe: recurso.paraQueServe,
        estado: 'indeterminado',
      })),
      grausDeLiberdade: 'indeterminado',
      classe: classificarAparelho([], 'indeterminado', false),
      espacosConcedidos: [],
      mensagem: 'A API WebXR não está disponível neste navegador.',
    };
  }

  const modos: string[] = [];

  if (await xr.isSessionSupported('immersive-vr')) {
    modos.push('immersive-vr');
  }

  if (await xr.isSessionSupported('immersive-ar')) {
    modos.push('immersive-ar');
  }

  if (modos.length === 0) {
    return {
      temApiXr: true,
      modosSuportados: modos,
      recursos: RECURSOS_CONSULTADOS.map((recurso) => ({
        nome: recurso.nome,
        paraQueServe: recurso.paraQueServe,
        estado: 'indeterminado',
      })),
      grausDeLiberdade: 'indeterminado',
      classe: classificarAparelho(modos, 'indeterminado', true),
      espacosConcedidos: [],
      mensagem: 'A API WebXR existe, mas nenhuma sessão imersiva é suportada.',
    };
  }

  const modo = modos.includes('immersive-ar')
    ? 'immersive-ar'
    : 'immersive-vr';

  let session: XRSession | null = null;

  try {
    session = await xr.requestSession(modo as XRSessionMode, {
      requiredFeatures: [],
      optionalFeatures: RECURSOS_CONSULTADOS.map(
        (recurso) => recurso.nome,
      ),
    });
  } catch (erro) {
    return {
      temApiXr: true,
      modosSuportados: modos,
      recursos: RECURSOS_CONSULTADOS.map((recurso) => ({
        nome: recurso.nome,
        paraQueServe: recurso.paraQueServe,
        estado: 'indeterminado',
      })),
      grausDeLiberdade: 'indeterminado',
      classe: classificarAparelho(modos, 'indeterminado', true),
      espacosConcedidos: [],
      mensagem:
        'O aparelho suporta WebXR, mas a sessão de sondagem não pôde ser aberta.',
    };
  }

  try {
    const enabledFeatures = session.enabledFeatures;

    const recursos: ResultadoRecurso[] = RECURSOS_CONSULTADOS.map(
      (recurso) => ({
        nome: recurso.nome,
        paraQueServe: recurso.paraQueServe,
        estado: estadoDoRecurso(recurso.nome, enabledFeatures),
      }),
    );

    const espacosTestados = [
      'viewer',
      'local',
      'local-floor',
      'bounded-floor',
      'unbounded',
    ] as const;

    const espacosConcedidos: string[] = [];

    for (const tipo of espacosTestados) {
      try {
        await session.requestReferenceSpace(tipo);
        espacosConcedidos.push(tipo);
      } catch {
        // nada aind
      }
    }

    const leitura = {
      concedidos: espacosConcedidos,
      modo,
      comPoseDePunho: enabledFeatures?.includes('hand-tracking') ?? false,
    };

    const graus = grausDeLiberdade(leitura);

    const classe = classificarAparelho(
      modos,
      graus,
      true,
    );

    return {
      temApiXr: true,
      modosSuportados: modos,
      recursos,
      grausDeLiberdade: graus,
      classe,
      espacosConcedidos,
      mensagem: 'Sondagem concluída com sucesso.',
    };
  } finally {
    // encerra
    await session.end();
  }
}