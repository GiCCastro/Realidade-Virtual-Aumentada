
import { conferirComposicao, sondar, type ResultadoDaSonda } from './devices/sonda';
import {
  montarAtivosECusto,
  montarConteudo,
  montarEstruturaDaCena,
  montarInteracao,
  montarManipulacaoEMontagem,
  montarRegimeEmJanela,
  montarRelatorio,
  montarSessao,
  montarImersao,
  montarLocomocao,
  montarAncoragem,
  montarMarcador,
  montarDegradacao,
  montarSonda,
  montarComposicao,
  montarPainelDiegetico,
  montarRegistroDoProjeto,
} from './relatorio/relatorio';
import { Diario, explicarFalha } from './relatorio/diario';
import { frasesSobreAOrdem, iniciarOficina, type Oficina } from './app/oficina';
import type { ModoDeSessao } from './modes/sessao';
import { CASOS } from './modes/conforto';
import type { Ensaio } from './locomotion/comparacao';
import type { ComparacaoDeFolga } from './content/pecas';
import { desenharParaImpressao, inconsistenciasDoPadrao } from './anchoring/padrao';
import type { Escolha } from './app/degradacao';

function exigirCanvas(id: string): HTMLCanvasElement {
  const elemento: HTMLElement = exigirElemento(id);
  if (!(elemento instanceof HTMLCanvasElement)) {
    throw new Error(`O elemento #${id} existe, mas não é uma superfície de desenho.`);
  }
  return elemento;
}

function exigirElemento(id: string): HTMLElement {
  const elemento: HTMLElement | null = document.getElementById(id);
  if (elemento === null) {
    throw new Error(`A página não tem o elemento #${id}.`);
  }
  return elemento;
}

const raizRelatorio: HTMLElement = exigirElemento('relatorio');
const raizSonda: HTMLElement = exigirElemento('sonda');
const raizDiario: HTMLElement = exigirElemento('diario');
const botao: HTMLElement = exigirElemento('sondar');
const raizEstrutura: HTMLElement = exigirElemento('estrutura');
const botaoPrender: HTMLElement = exigirElemento('prender');
const raizConteudo: HTMLElement = exigirElemento('conteudo');
const botaoVolumes: HTMLElement = exigirElemento('volumes');
const raizCusto: HTMLElement = exigirElemento('custo');
const raizJanela: HTMLElement = exigirElemento('janela');
const raizInteracao: HTMLElement = exigirElemento('interacao');
const raizManipulacao: HTMLElement = exigirElemento('manipulacao');
const botaoFolgas: HTMLElement = exigirElemento('folgas');
const botaoEnquadrar: HTMLElement = exigirElemento('enquadrar');
const botaoAproximar: HTMLElement = exigirElemento('aproximar');
const botaoMedir: HTMLElement = exigirElemento('medir');
const botaoEntrarVr: HTMLElement = exigirElemento('entrar-vr');
const botaoEntrarAr: HTMLElement = exigirElemento('entrar-ar');
const botaoSair: HTMLElement = exigirElemento('sair-sessao');
const raizSessao: HTMLElement = exigirElemento('sessao');

const diario: Diario = new Diario();
diario.fixarDestino(raizDiario);


void levantarRelatorio().then((linhas) => {
  montarRelatorio(raizRelatorio, BANCADA, problemas, linhas);
  diario.nota('Consulta sem sessão concluída. A sonda completa espera um toque no botão.');
});

if (!window.isSecureContext) {
  diario.alerta(
    'Esta página não está em contexto seguro. A API XR não é exposta aqui, e o botão vai responder como se o aparelho não tivesse suporte — o que seria mentira sobre o aparelho.',
  );
}

async function executarSonda(): Promise<void> {
  diario.nota('Sondando. Se um visor pedir permissão, aceite: sem ela a sessão não abre.');
  try {
    const resultado: ResultadoDaSonda = await sondar();
    const confronto: string | undefined =
      resultado.emSessao === undefined ? undefined : conferirComposicao(resultado.emSessao);
    montarSonda(raizSonda, resultado, confronto);
    diario.nota('Sondagem concluída e sessão encerrada.');
  } catch (erro: unknown) {
    diario.falha(explicarFalha(erro));
  }
}

botao.addEventListener('click', () => {
  void executarSonda();
});

const oficina: Oficina = iniciarOficina(exigirCanvas('cena'));
montarEstruturaDaCena(raizEstrutura, oficina.estrutura(), frasesSobreAOrdem());

function frasesDaFolga(): string {
  const c: ComparacaoDeFolga = oficina.folgas(0.12, 0.06);
  const adotada: string = c.capturaComAFolgaAdotada ? 'captura' : 'não captura';
  const generosa: string = c.capturaComAFolgaGenerosa ? 'captura' : 'não captura';
  return (
    `Um ponto a ${(c.distanciaDeTeste * 100).toFixed(0)} cm do centro da engrenagem grande: ` +
    `com a folga adotada de ${(c.folgaAdotada * 100).toFixed(1)} cm, o volume ${adotada}; ` +
    `com uma folga de ${(c.folgaGenerosa * 100).toFixed(1)} cm, ${generosa}. ` +
    `O segundo caso é a peça grudando em quem só passou perto.`
  );
}

montarConteudo(raizConteudo, oficina.inventario(), oficina.materiais(), oficina.volumes(), frasesDaFolga());

botaoVolumes.addEventListener('click', () => {
  const exibindo: boolean = oficina.alternarVolumes();
  botaoVolumes.textContent = exibindo ? 'Esconder os volumes de contato' : 'Mostrar os volumes de contato';
  diario.nota(
    exibindo
      ? 'Os volumes de contato estão à vista. O que decide o encaixe é a caixa, e não a silhueta.'
      : 'Volumes escondidos. A cena volta a mostrar só o que o olho veria.',
  );
});

let laudoDoAtivo: string[] = ['O ativo externo ainda não foi trazido.'];

function atualizarCusto(): void {
  montarAtivosECusto(
    raizCusto,
    laudoDoAtivo,
    oficina.repeticao(),
    oficina.niveisDeDetalhe(),
    oficina.medicao(),
  );
}

atualizarCusto();

function atualizarJanela(): void {
  montarRegimeEmJanela(raizJanela, oficina.orbita(), oficina.regimeEmJanela());
}

atualizarJanela();

function atualizarInteracao(): void {
  montarInteracao(raizInteracao, oficina.apontamento(), oficina.fronteira(), oficina.interacao());
}

atualizarInteracao();

function atualizarManipulacao(): void {
  montarManipulacaoEMontagem(
    raizManipulacao,
    oficina.manipulacao(),
    oficina.tolerancia(),
    oficina.montagem(),
  );
}

atualizarManipulacao();

oficina.aoResponder((parecer: string) => {
  diario.nota(parecer);
  atualizarManipulacao();
});

botaoFolgas.addEventListener('click', () => {
  const exibindo: boolean = oficina.alternarFolgas();
  botaoFolgas.textContent = exibindo
    ? 'Esconder a folga dos encaixes'
    : 'Mostrar a folga dos encaixes';
  diario.nota(
    exibindo
      ? 'Cada cubo verde tem exatamente o tamanho da folga linear do encaixe. Soltar a peça com o centro dela dentro do cubo manda encaixar.'
      : 'As folgas voltaram a ficar invisíveis. Elas continuam valendo: o que sumiu foi o desenho, não o número.',
  );
});

oficina.aoMudarSelecao((mudanca) => {
  if (mudanca.selecionada === undefined) {
    return;
  }
  diario.nota(
    `Peça escolhida: ${mudanca.selecionada}. O raio acertou "${mudanca.noAtingido ?? 'nada'}" e ` +
      `subiu ${mudanca.degrausDeSubida} nível(is) da árvore até chegar nela.`,
  );
  atualizarInteracao();
});

botaoEnquadrar.addEventListener('click', () => {
  oficina.enquadrarTudo();
  atualizarJanela();
  atualizarCusto();
  atualizarInteracao();
  diario.nota(
    'A cena inteira foi enquadrada. A distância ao alvo é a que faz a esfera envolvente caber no campo de visão.',
  );
});

void oficina
  .trazerAtivoExterno()
  .then((linhas: string[]) => {
    laudoDoAtivo = linhas;
    atualizarCusto();
    diario.nota(
      'A morsa chegou e foi ajustada à convenção da cena. O laudo com o que foi corrigido está na folha de ativos.',
    );
  })
  .catch((erro: unknown) => {
    diario.falha(explicarFalha(erro));
  });

function atualizarSessao(): void {
  montarSessao(raizSessao, oficina.sessao(), oficina.plataforma());
}

atualizarSessao();

oficina.aoMudarSessao(
  (aberta) => {
    atualizarSessao();
    atualizarInteracao();
    diario.nota(
      `Sessão ${aberta.modo} aberta, com espaço de referência ${aberta.espacoObtido} e ` +
        `composição ${aberta.composicao}. O controle rastreado assumiu o apontamento, e ` +
        'nenhuma linha de seleção, agarre ou encaixe mudou para isso acontecer.',
    );
  },
  () => {
    atualizarSessao();
    atualizarInteracao();
    atualizarJanela();
    diario.nota(
      'Sessão encerrada. O laço voltou à cadência da janela, o cursor voltou a ser a ' +
        'fonte de apontamento e a câmera foi devolvida ao ponto em que a órbita a deixou.',
    );
  },
);

async function entrarEm(modo: ModoDeSessao): Promise<void> {
  try {
    await oficina.entrarEmSessao(modo);
  } catch (erro: unknown) {
    diario.falha(explicarFalha(erro));
    atualizarSessao();
  }
}

botaoEntrarVr.addEventListener('click', () => {
  void entrarEm('immersive-vr');
});

botaoEntrarAr.addEventListener('click', () => {
  void entrarEm('immersive-ar');
});

botaoSair.addEventListener('click', () => {
  void oficina.sairDaSessao();
});

botaoMedir.addEventListener('click', () => {
  atualizarCusto();
  atualizarInteracao();
  atualizarManipulacao();
  atualizarSessao();
  diario.nota(
    'Medição refeita. O número vale para esta máquina e para este instante — anote os dois ao lado dele.',
  );
});

botaoAproximar.addEventListener('click', () => {
  const perto: boolean = oficina.alternarAproximacao();
  botaoAproximar.textContent = perto
    ? 'Voltar para a bancada'
    : 'Aproximar da prateleira do fundo';
  diario.nota(
    perto
      ? 'A câmera foi para junto da prateleira: o nível detalhado entrou, e a contagem de triângulos subiu.'
      : 'A câmera voltou para a bancada: a prateleira ficou longe, e o nível simplificado assumiu.',
  );
  atualizarCusto();
  atualizarJanela();
});

botaoPrender.addEventListener('click', () => {
  const antes: string = oficina.posicaoDaEngrenagem();
  const desvio: number = oficina.presa() ? oficina.soltar() : oficina.prender();
  const destino: string = oficina.presa() ? 'ao eixo' : 'ao tampo';
  diario.nota(
    `A engrenagem passou a pertencer ${destino}. Estava em ${antes}, ficou em ` +
      `${oficina.posicaoDaEngrenagem()}, e o desvio medido foi de ${desvio.toExponential(1)} m.`,
  );
  botaoPrender.textContent = oficina.presa()
    ? 'Soltar a engrenagem do eixo'
    : 'Prender a engrenagem ao eixo';
  montarEstruturaDaCena(raizEstrutura, oficina.estrutura(), frasesSobreAOrdem());
});

const raizImersao: HTMLElement = exigirElemento('imersao');
const botaoAferirCorpo: HTMLElement = exigirElemento('aferir-corpo');
const botaoAproximarPecas: HTMLElement = exigirElemento('aproximar-pecas');
const botaoCorrigir: HTMLElement = exigirElemento('corrigir-desconforto');

function atualizarImersao(): void {
  montarImersao(raizImersao, oficina.escalaCorporal(), oficina.alcance(), oficina.conforto());
}

atualizarImersao();

botaoAferirCorpo.addEventListener('click', () => {
  atualizarImersao();
  diario.nota(
    'Aferição refeita. Fora de sessão isto confere a construção da cena; dentro dela, também o ' +
      'assentamento contra a origem que o aparelho concedeu.',
  );
});

botaoAproximarPecas.addEventListener('click', () => {
  const relato: string[] = oficina.aproximarPecas();
  atualizarImersao();
  diario.nota(
    'As peças fora do braço foram trazidas para a frente do tampo. ' +
      `${relato.length} linhas de laudo abaixo, com o avanço de cada uma.`,
  );
});

for (const caso of CASOS) {
  const botao: HTMLElement = exigirElemento(`provocar-${caso.id}`);
  botao.addEventListener('click', () => {
    diario.alerta(
      `Provocação em curso: ${oficina.provocar(caso.id)} Ela se corrige sozinha em poucos ` +
        'segundos. Avise antes quem estiver com o visor no rosto.',
    );
    atualizarImersao();
  });
}

botaoCorrigir.addEventListener('click', () => {
  oficina.corrigirDesconforto();
  atualizarImersao();
  diario.nota('Provocação interrompida. O ambiente voltou ao caso bom.');
});

const raizLocomocao: HTMLElement = exigirElemento('locomocao');
const botaoAlternarDeslize: HTMLElement = exigirElemento('alternar-deslize');
const botaoAferirLocomocao: HTMLElement = exigirElemento('aferir-locomocao');
const botaoIniciarEnsaio: HTMLElement = exigirElemento('iniciar-ensaio');
const botaoRegistrarEnsaio: HTMLElement = exigirElemento('registrar-ensaio');

function atualizarLocomocao(): void {
  montarLocomocao(
    raizLocomocao,
    oficina.locomocao(),
    oficina.areaFisica(),
    oficina.comparacao(),
  );
}

atualizarLocomocao();

botaoAlternarDeslize.addEventListener('click', () => {
  const deslizando: boolean = oficina.alternarDeslize();
  botaoAlternarDeslize.textContent = deslizando
    ? 'Voltar ao salto'
    : 'Trocar o salto pelo deslize contínuo';
  diario.alerta(
    deslizando
      ? 'Deslize contínuo ligado. Ele existe para ser experimentado e medido, não para ficar ' +
          'ligado: avise quem for entrar, e mantenha o ensaio curto.'
      : 'De volta ao salto. O comando para a frente volta a abrir a mira, e o eixo horizontal ' +
          'volta a girar em passos.',
  );
  atualizarLocomocao();
});

botaoAferirLocomocao.addEventListener('click', () => {
  atualizarLocomocao();
  atualizarImersao();
  diario.nota(
    'Aferição refeita. Fora de sessão, o salto move o alvo da órbita e a borda física não existe ' +
      'para ser consultada; dentro dela, os dois passam a valer.',
  );
});

botaoIniciarEnsaio.addEventListener('click', () => {
  oficina.iniciarEnsaio();
  diario.nota(
    'Ensaio começado. A partir de agora contam-se o tempo, os metros percorridos e os engasgos, ' +
      'e no fim resta perguntar a quem experimentou o que só ele responde.',
  );
});

botaoRegistrarEnsaio.addEventListener('click', () => {
  const observador: string | null = window.prompt(
    'Quem experimentou? Nunca quem construiu a locomoção — o hábito apaga o efeito.',
  );
  if (observador === null || observador.trim() === '') {
    diario.alerta('Ensaio não registrado: sem observador, o relato não tem origem.');
    return;
  }
  const relato: string | null = window.prompt('Como foi, nas palavras de quem experimentou?');
  if (relato === null || relato.trim() === '') {
    diario.alerta('Ensaio não registrado: o relato é a metade que a instrumentação não mede.');
    return;
  }
  const ensaio: Ensaio = oficina.registrarEnsaio(observador.trim(), relato.trim());
  atualizarLocomocao();
  diario.nota(
    `Ensaio de ${ensaio.forma} registrado: ${ensaio.duracaoS.toFixed(0)} s, ` +
      `${ensaio.metrosPercorridos.toFixed(1)} m e ${ensaio.engasgosNoPeriodo} engasgos no período.`,
  );
});

const raizAncoragem: HTMLElement = exigirElemento('ancoragem');
const botaoRepousar: HTMLElement = exigirElemento('repousar');
const botaoAferirAncoragem: HTMLElement = exigirElemento('aferir-ancoragem');

function atualizarAncoragem(): void {
  montarAncoragem(raizAncoragem, oficina.ancoragem());
}

atualizarAncoragem();

botaoRepousar.addEventListener('click', () => {
  oficina.repousar();
  atualizarAncoragem();
  diario.nota(
    'A bancada voltou ao lugar de origem e espera outra escolha. Repousá-la sobre a mesma mesa, ' +
      'de dois pontos diferentes, é o ensaio que mostra a precisão real da detecção nesta sala.',
  );
});

const raizMarcador: HTMLElement = exigirElemento('marcador');
const raizDegradacao: HTMLElement = exigirElemento('degradacao');
const botaoImprimirMarcador: HTMLElement = exigirElemento('imprimir-marcador');
const botaoEntrarMarcador: HTMLElement = exigirElemento('entrar-marcador');
const botaoAferirMarcador: HTMLElement = exigirElemento('aferir-marcador');

const problemasDoPadrao: string[] = inconsistenciasDoPadrao();
if (problemasDoPadrao.length > 0) {
  diario.alerta(`O padrão do marcador tem problemas: ${problemasDoPadrao.join(' ')}`);
}

function atualizarMarcador(): void {
  montarMarcador(raizMarcador, oficina.marcador());
}

function atualizarDegradacao(): void {
  montarDegradacao(raizDegradacao, oficina.degradacao());
}

atualizarMarcador();
atualizarDegradacao();

void oficina.decidirRegime().then((escolha: Escolha) => {
  atualizarDegradacao();
  diario.nota(
    `Consulta ao aparelho concluída. O melhor regime disponível aqui é ${escolha.nome}` +
      (escolha.preteridos.length === 0
        ? ', e nada foi degradado.'
        : `, depois de ${escolha.preteridos.length} regime(s) fora de alcance — a folha abaixo diz o que falta em cada um e o que este aparelho ainda faz.`),
  );
});

botaoImprimirMarcador.addEventListener('click', () => {
  const desenho: HTMLCanvasElement = desenharParaImpressao(1024);
  const aba: Window | null = window.open('');
  if (aba === null) {
    diario.alerta(
      'O navegador bloqueou a abertura da aba com o marcador. Libere as janelas para este ' +
        'endereço, ou imprima o desenho a partir de outra máquina.',
    );
    return;
  }
  const imagem: HTMLImageElement = aba.document.createElement('img');
  imagem.src = desenho.toDataURL('image/png');
  imagem.style.width = '15cm';
  aba.document.body.appendChild(imagem);
  diario.nota(
    'Marcador aberto em outra aba, dimensionado para 15 cm de lado. Imprima SEM o ajuste ' +
      'automático à página e confira o quadrado preto com uma régua: o número está no código, e ' +
      'divergência entre os dois vira erro de escala do mundo virtual.',
  );
});

botaoEntrarMarcador.addEventListener('click', () => {
  if (oficina.registrandoPorMarcador()) {
    oficina.sairDoMarcador();
    botaoEntrarMarcador.textContent = 'Registrar por marcador impresso';
    atualizarMarcador();
    atualizarJanela();
    diario.nota('Câmera desligada e regime em janela de volta. O fundo da cena voltou a ser nosso.');
    return;
  }
  void oficina.entrarPorMarcador().then(() => {
    const ligou: boolean = oficina.registrandoPorMarcador();
    botaoEntrarMarcador.textContent = ligou
      ? 'Desligar a câmera e voltar à janela'
      : 'Registrar por marcador impresso';
    atualizarMarcador();
    diario.nota(
      ligou
        ? 'Câmera ligada e detecção em curso. Aponte para o papel: a bancada nasce sobre ele, e ' +
            'o tremor entre quadros está medido na folha abaixo.'
        : 'A câmera não foi obtida, e a folha abaixo diz por quê. O regime em janela continua ' +
            'inteiro, e ele monta a bancada do primeiro parafuso ao último.',
    );
  });
});

botaoAferirMarcador.addEventListener('click', () => {
  atualizarMarcador();
  atualizarDegradacao();
  diario.nota(
    oficina.registrandoPorMarcador()
      ? 'Aferição refeita com a câmera ligada. Apoie o aparelho numa superfície firme e leia o ' +
          'tremor: com tudo parado, ele deveria ser zero, e não é.'
      : 'Aferição refeita fora do regime por marcador. A folha informa a medida do papel a ' +
          'conferir com régua e o que a estimativa de câmera assume.',
  );
});

botaoAferirAncoragem.addEventListener('click', () => {
  atualizarAncoragem();
  diario.nota(
    oficina.emRealidadeAumentada()
      ? 'Aferição refeita dentro da sessão aumentada. A correção acumulada é o número que ' +
          'cresce enquanto se anda em volta da bancada.'
      : 'Aferição refeita fora de sessão aumentada: a folha informa o que este aparelho responde ' +
          'sem ela, que é quase nada — e essa é a resposta certa, não uma folha vazia.',
  );
});

const raizComposicao: HTMLElement = exigirElemento('composicao');
const raizPainelDiegetico: HTMLElement = exigirElemento('painel-diegetico');
const raizRegistro: HTMLElement = exigirElemento('registro');
const botaoAbrirMelhor: HTMLElement = exigirElemento('abrir-melhor');
const botaoAuditarComposicao: HTMLElement = exigirElemento('auditar-composicao');
const botaoChamarPainel: HTMLElement = exigirElemento('chamar-painel');
const botaoAferirPainel: HTMLElement = exigirElemento('aferir-painel');
const botaoRegistrarAparelho: HTMLElement = exigirElemento('registrar-aparelho');
const botaoRegistrarObservacao: HTMLElement = exigirElemento('registrar-observacao');
const botaoExportarRegistro: HTMLElement = exigirElemento('exportar-registro');

function atualizarComposicao(): void {
  montarComposicao(raizComposicao, oficina.composicao(), oficina.percurso());
}

function atualizarPainelDiegetico(): void {
  montarPainelDiegetico(raizPainelDiegetico, oficina.legibilidadeDoPainel());
}

function atualizarRegistro(): void {
  montarRegistroDoProjeto(raizRegistro, oficina.registro(), oficina.uso());
}

atualizarComposicao();
atualizarPainelDiegetico();
atualizarRegistro();

botaoAuditarComposicao.addEventListener('click', () => {
  atualizarComposicao();
  diario.nota(
    'Auditoria refeita. Ela confere ligação, e não comportamento: o que cada camada deve fazer ' +
      'à vista está escrito ao lado dela, e essa conferência é de gente.',
  );
});

botaoAbrirMelhor.addEventListener('click', () => {
  void oficina.abrirMelhorRegime().then(() => {
    atualizarComposicao();
    atualizarSessao();
    atualizarMarcador();
    atualizarDegradacao();
    diario.nota(
      `Abertura concluída. O regime em uso é ${oficina.regimeEmUso()}, e a folha da composição ` +
        'traz cada tentativa com o que o aparelho respondeu.',
    );
  });
});

botaoChamarPainel.addEventListener('click', () => {
  const perto: boolean = oficina.alternarChamadaDoPainel();
  botaoChamarPainel.textContent = perto
    ? 'Devolver o painel ao lugar'
    : 'Chamar o painel para perto';
  atualizarPainelDiegetico();
  diario.nota(
    perto
      ? 'O painel veio para a borda da bancada voltada a quem lê. Ele continua pendurado no ' +
          'suporte do tampo: soltá-lo da bancada para segui-lo pela sala o faria deixar de ser ' +
          'objeto do mundo justamente quando é mais útil.'
      : 'O painel voltou ao lugar de origem sobre o tampo.',
  );
});

botaoAferirPainel.addEventListener('click', () => {
  atualizarPainelDiegetico();
  diario.nota(
    'Leitura aferida a partir de onde a câmera está agora. Dentro do visor, afaste-se dois ' +
      'passos e refaça: é o ponto em que a altura aparente da letra cruza o limiar adotado.',
  );
});

botaoRegistrarAparelho.addEventListener('click', () => {
  const aparelho: string | null = window.prompt(
    'Qual aparelho? Modelo e navegador, não "meu celular" — o parque é heterogêneo, e o que se ' +
      'quer saber é onde funcionou.',
  );
  if (aparelho === null || aparelho.trim() === '') {
    diario.alerta('Aparelho não registrado: sem o modelo, a linha não diz onde o ambiente abriu.');
    return;
  }
  const funcionou: string | null = window.prompt('O que funcionou neste aparelho?');
  const naoFuncionou: string | null = window.prompt(
    'E o que não funcionou? "Nada" também é resposta.',
  );
  const quem: string | null = window.prompt('Quem abriu?');
  if (funcionou === null || naoFuncionou === null || quem === null || quem.trim() === '') {
    diario.alerta('Aparelho não registrado: o registro incompleto é o que envelhece pior.');
    return;
  }
  oficina.registrarAparelho({
    aparelho: aparelho.trim(),
    regimeAberto: oficina.regimeEmUso(),
    oQueFuncionou: funcionou.trim(),
    oQueNaoFuncionou: naoFuncionou.trim(),
    quemAbriu: quem.trim(),
  });
  atualizarRegistro();
  diario.nota(
    'Aparelho registrado. Ele fica no armazenamento local DESTE navegador: o que foi anotado no ' +
      'celular ficou no celular, e o destino da lista é o repositório do projeto.',
  );
});

botaoRegistrarObservacao.addEventListener('click', () => {
  const quem: string | null = window.prompt(
    'Quem montou? Nunca quem construiu o ambiente — o hábito apaga o efeito.',
  );
  if (quem === null || quem.trim() === '') {
    diario.alerta('Observação não registrada: sem quem experimentou, o relato não tem origem.');
    return;
  }
  const travou: string | null = window.prompt(
    'Onde essa pessoa travou? Deixe vazio se ela concluiu a montagem.',
  );
  if (travou === null) {
    return;
  }
  const relato: string | null = window.prompt('Nas palavras dela, e não no seu resumo:');
  if (relato === null || relato.trim() === '') {
    diario.alerta('Observação não registrada: o relato é a metade que a instrumentação não mede.');
    return;
  }
  oficina.registrarObservacao({
    quem: quem.trim(),
    regime: oficina.regimeEmUso(),
    ondeTravou: travou.trim(),
    relato: relato.trim(),
    concluiu: travou.trim() === '',
  });
  atualizarRegistro();
  diario.nota(
    'Observação registrada nesta sessão. Ela some ao recarregar a página, de propósito: ' +
      'transcreva-a enquanto quem montou ainda está por perto e pode ser perguntado.',
  );
});

botaoExportarRegistro.addEventListener('click', () => {
  const aba: Window | null = window.open('');
  if (aba === null) {
    diario.alerta(
      'O navegador bloqueou a aba com o registro. Libere as janelas para este endereço, ou copie ' +
        'o texto da folha acima.',
    );
    return;
  }
  const bloco: HTMLPreElement = aba.document.createElement('pre');
  bloco.textContent = oficina.exportarRegistro();
  aba.document.body.appendChild(bloco);
  diario.nota(
    'Registro aberto em outra aba, já formatado. Cole-o no repositório do projeto: o ' +
      'armazenamento local não viaja, e registro que morre no aparelho em que foi feito é a ' +
      'lista escrita de memória na véspera da entrega.',
  );
});
