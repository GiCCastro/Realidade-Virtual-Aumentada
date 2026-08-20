
import { RECURSOS_CONSULTADOS, estadoDoRecurso, type EstadoDeRecurso } from "./recursos";   

export type RegimeId = 'inline' | 'immersive-vr' | 'immersive-va';


export type ClasseDeAparelho = 
| 'sem-api'
| 'somente-janela'
| 'visor-sem-posicao'
| 'visor-com-posicao'
| 'aparelho-de-mao-com-camera'


export interface SondaSemSessao {
    readonly temApiXr: boolean;
    readonly contextoSeguro: boolean;
    readonly regimes: readonly string[];
    readonly modosSuportados: readonly string[];
}

export interface ResultadoDaSonda {
    readonly semSessao: SondaSemSessao;
    readonly motivoSemSessao: string | undefined;
    readonly classe: ClasseDeAparelho
}