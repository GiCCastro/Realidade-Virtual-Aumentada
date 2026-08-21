import { EstadoDeRecurso } from "./recursos";

export type ModoSondavel = 'immersive-vr' | 'immersive-ar';

export type ClasseDeAparelho = 
| 'sem-api'
| 'somente-janela'
| 'visor-sem-posicao'
| 'visor-com-posicao'
| 'aparelho-de-mao-com-camera'

export type GrausDeLiberdade =
    | 'tres'
    | 'seis'
    | 'indeterminado'
    

export interface RecursoSondado {
    readonly nome: string;
    readonly funcionalidade: string;
    readonly estado: EstadoDeRecurso;

}

export interface FonteDeEntradaSondada {
    readonly lado: string;
    readonly mira: string;
    readonly temPoseDePunho: boolean;
    readonly temMao: boolean;
    readonly perfis: readonly string[];
}

export interface SondaSemSessao {
    readonly temApiXr: boolean;
    readonly contextoSeguro: boolean;
    readonly regimes: readonly string[];
    readonly modosSuportados: readonly string[];
}

export interface SondaEmSessao {
    readonly modo: ModoSondavel;
    readonly recursos: readonly RecursoSondado[];
    readonly espacosConcedidos: readonly string[];
    readonly fonteDeEntrada: readonly FonteDeEntradaSondada[];
    readonly graus: GrausDeLiberdade;
}

export interface ResultadoDaSonda {
    readonly semSessao: SondaSemSessao;
    readonly emSessao: SondaEmSessao;
    readonly motivoSemSessao: string | undefined;
    readonly classe: ClasseDeAparelho
}

function contextoSeguro(): boolean {
    return window.isSecureContext;
}

export type Suporte = 'sim' | 'nao' | 'desconhecido';

async function consultarSuporte(modo: XRSessionMode): Promise<Suporte> {
  if (navigator.xr === undefined) {
    return 'desconhecido';
  }

  try {
    const suportado = await navigator.xr.isSessionSupported(modo);

    return suportado ? 'sim' : 'nao';
  } catch {
    return 'desconhecido';
  }
}