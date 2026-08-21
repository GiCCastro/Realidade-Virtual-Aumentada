
import type { EstadoDeRecurso } from '../devices/recursos';
import { descreverClasse, type GrausDeLiberdade } from '../devices/graus';
import type { ResultadoDaSonda, SondaEmSessao } from '../devices/sonda';


function rotuloDoSuporte(suporte: Suporte): string {
  switch (suporte) {
    case 'sim':
      return 'suportado';
    case 'nao':
      return 'não suportado';
    case 'desconhecido':
      return 'sem resposta';
  }
}

function celula(texto: string, cabecalho: boolean = false): HTMLTableCellElement {
  const elemento: HTMLTableCellElement = document.createElement(cabecalho ? 'th' : 'td');
  elemento.textContent = texto;
  return elemento;
}

function tabelaDeRegimes(linhas: readonly LinhaDoRelatorio[]): HTMLTableElement {
  const tabela: HTMLTableElement = document.createElement('table');

  const cabecalho: HTMLTableRowElement = tabela.insertRow();
  for (const titulo of [
    'Regime',
    'O que faz com o mundo',
    'Espaço de referência',
    'Rastreia',
    'Registro contra',
    'Neste aparelho',
  ]) {
    cabecalho.appendChild(celula(titulo, true));
  }

  for (const linha of linhas) {
    const fileira: HTMLTableRowElement = tabela.insertRow();
    fileira.appendChild(celula(linha.regime.nome));
    fileira.appendChild(celula(linha.regime.tratamentoDoMundo));
    fileira.appendChild(celula(linha.regime.espacoDeReferencia));
    fileira.appendChild(celula(linha.regime.rastreia));
    fileira.appendChild(celula(linha.regime.registroContra));
    fileira.appendChild(celula(`${rotuloDoSuporte(linha.suporte)} — ${linha.observacao}`));
  }

  return tabela;
}

function blocoDoDominio(dominio: Dominio, problemas: readonly string[]): HTMLElement {
  const bloco: HTMLElement = document.createElement('section');

  const titulo: HTMLHeadingElement = document.createElement('h2');
  titulo.textContent = `Domínio: ${dominio.nome}`;
  bloco.appendChild(titulo);

  const descricao: HTMLParagraphElement = document.createElement('p');
  descricao.textContent = dominio.descricao;
  bloco.appendChild(descricao);

  const tarefa: HTMLParagraphElement = document.createElement('p');
  tarefa.textContent = `Tarefa: ${dominio.tarefa.enunciado} Concluída quando: ${dominio.tarefa.estadoFinal}`;
  bloco.appendChild(tarefa);

  const inventario: HTMLParagraphElement = document.createElement('p');
  inventario.textContent =
    `${dominio.pecas.length} peças e ${dominio.sockets.length} encaixes declarados. ` +
    (problemas.length === 0
      ? 'Nenhuma inconsistência entre peças e encaixes.'
      : `Inconsistências: ${problemas.join(' ')}`);
  bloco.appendChild(inventario);

  return bloco;
}

export function montarRelatorio(
  raiz: HTMLElement,
  dominio: Dominio,
  problemas: readonly string[],
  linhas: readonly LinhaDoRelatorio[],
): void {
  raiz.replaceChildren();
  raiz.appendChild(blocoDoDominio(dominio, problemas));

  const tituloRegimes: HTMLHeadingElement = document.createElement('h2');
  tituloRegimes.textContent = 'Regimes: o que foi declarado e o que este aparelho responde';
  raiz.appendChild(tituloRegimes);
  raiz.appendChild(tabelaDeRegimes(linhas));
}

function rotuloDoEstado(estado: EstadoDeRecurso): string {
  switch (estado) {
    case 'concedido':
      return 'concedido';
    case 'negado':
      return 'não concedido';
    case 'indeterminado':
      return 'sem resposta';
  }
}

function rotuloDosGraus(graus: GrausDeLiberdade): string {
  switch (graus) {
    case 'tres':
      return 'três graus de liberdade — o aparelho acompanha para onde a cabeça aponta e não acompanha para onde ela vai';
    case 'seis':
      return 'seis graus de liberdade — o aparelho acompanha orientação e deslocamento';
    case 'indeterminado':
      return 'indeterminado — os espaços concedidos não bastam para afirmar nem uma coisa nem outra';
  }
}

function tabelaDeRecursos(sonda: SondaEmSessao): HTMLTableElement {
  const tabela: HTMLTableElement = document.createElement('table');
  const cabecalho: HTMLTableRowElement = tabela.insertRow();
  for (const titulo of ['Recurso', 'Para que serve', 'Neste aparelho']) {
    cabecalho.appendChild(celula(titulo, true));
  }
  for (const recurso of sonda.recursos) {
    const fileira: HTMLTableRowElement = tabela.insertRow();
    fileira.appendChild(celula(recurso.nome));
    fileira.appendChild(celula(recurso.paraQueServe));
    fileira.appendChild(celula(rotuloDoEstado(recurso.estado)));
  }
  return tabela;
}

function tabelaDeFontes(sonda: SondaEmSessao): HTMLElement {
  if (sonda.fontesDeEntrada.length === 0) {
    const vazio: HTMLParagraphElement = document.createElement('p');
    vazio.textContent =
      'Nenhuma fonte de entrada foi declarada durante a sondagem. Num visor, isso costuma significar controle desligado ou fora de alcance; num aparelho de mão, é o esperado até a primeira toque na tela.';
    return vazio;
  }
  const tabela: HTMLTableElement = document.createElement('table');
  const cabecalho: HTMLTableRowElement = tabela.insertRow();
  for (const titulo of ['Lado', 'Mira', 'Pose de punho', 'Mão articulada', 'Perfis']) {
    cabecalho.appendChild(celula(titulo, true));
  }
  for (const fonte of sonda.fontesDeEntrada) {
    const fileira: HTMLTableRowElement = tabela.insertRow();
    fileira.appendChild(celula(fonte.lado));
    fileira.appendChild(celula(fonte.mira));
    fileira.appendChild(celula(fonte.temPoseDePunho ? 'sim' : 'não'));
    fileira.appendChild(celula(fonte.temMao ? 'sim' : 'não'));
    fileira.appendChild(celula(fonte.perfis.join(', ')));
  }
  return tabela;
}

function paragrafo(texto: string): HTMLParagraphElement {
  const elemento: HTMLParagraphElement = document.createElement('p');
  elemento.textContent = texto;
  return elemento;
}

function subtitulo(texto: string): HTMLHeadingElement {
  const elemento: HTMLHeadingElement = document.createElement('h3');
  elemento.textContent = texto;
  return elemento;
}

export function montarSonda(
  raiz: HTMLElement,
  resultado: ResultadoDaSonda,
  confronto: string | undefined,
): void {
  raiz.replaceChildren();

  const titulo: HTMLHeadingElement = document.createElement('h2');
  titulo.textContent = 'Sonda de capacidades';
  raiz.appendChild(titulo);

  raiz.appendChild(paragrafo(descreverClasse(resultado.classe)));
  raiz.appendChild(
    paragrafo(
      resultado.semSessao.contextoSeguro
        ? 'A página está em contexto seguro, então a ausência de um recurso é resposta do aparelho.'
        : 'A página NÃO está em contexto seguro. Nada abaixo é informação sobre o aparelho: é a URL impedindo a pergunta.',
    ),
  );

  const sonda: SondaEmSessao | undefined = resultado.emSessao;
  if (sonda === undefined) {
    raiz.appendChild(
      paragrafo(resultado.motivoSemSessao ?? 'Não houve sessão, e o motivo não foi registrado.'),
    );
    return;
  }

  raiz.appendChild(subtitulo(`Recursos opcionais pedidos em ${sonda.modo}`));
  raiz.appendChild(tabelaDeRecursos(sonda));

  raiz.appendChild(subtitulo('Espaços de referência e graus de liberdade'));
  raiz.appendChild(
    paragrafo(
      sonda.espacosConcedidos.length === 0
        ? 'Nenhum espaço de referência foi concedido.'
        : `Concedidos: ${sonda.espacosConcedidos.join(', ')}.`,
    ),
  );
  raiz.appendChild(paragrafo(rotuloDosGraus(sonda.graus)));

  raiz.appendChild(subtitulo('Fontes de entrada declaradas'));
  raiz.appendChild(tabelaDeFontes(sonda));

  raiz.appendChild(subtitulo('Composição do fundo'));
  raiz.appendChild(paragrafo(`A sessão informou composição ${sonda.composicaoObservada}.`));
  if (confronto !== undefined) {
    raiz.appendChild(paragrafo(confronto));
  }

  raiz.appendChild(subtitulo('Estabilidade do rastreamento na janela observada'));
  raiz.appendChild(
    paragrafo(
      `${sonda.estabilidade.quadros} quadros observados, ` +
        `${sonda.estabilidade.quadrosSemPose} sem pose, ` +
        `${sonda.estabilidade.quadrosOcultos} com a sessão fora de primeiro plano.`,
    ),
  );
  raiz.appendChild(paragrafo(sonda.diagnostico));
}

export function montarEstruturaDaCena(
  raiz: HTMLElement,
  arvore: readonly string[],
  frasesDaOrdem: readonly string[],
): void {
  raiz.replaceChildren();
  raiz.appendChild(subtitulo('Como a cena está montada'));

  const bloco: HTMLPreElement = document.createElement('pre');
  bloco.textContent = arvore.join('\n');
  raiz.appendChild(bloco);

  raiz.appendChild(subtitulo('A ordem das operações não é livre'));
  for (const frase of frasesDaOrdem) {
    raiz.appendChild(paragrafo(frase));
  }
}

export function montarConteudo(
  raiz: HTMLElement,
  inventario: readonly string[],
  materiais: readonly string[],
  volumes: readonly string[],
  comparacao: string,
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('De onde veio a forma de cada peça'));
  for (const linha of inventario) {
    raiz.appendChild(paragrafo(linha));
  }

  raiz.appendChild(subtitulo('As superfícies, e o que cada uma cobra'));
  for (const linha of materiais) {
    raiz.appendChild(paragrafo(linha));
  }

  raiz.appendChild(subtitulo('O que se vê e o que colide'));
  for (const linha of volumes) {
    raiz.appendChild(paragrafo(linha));
  }
  raiz.appendChild(paragrafo(comparacao));
}

export function montarAtivosECusto(
  raiz: HTMLElement,
  ativo: readonly string[],
  repeticao: readonly string[],
  niveis: readonly string[],
  medicao: readonly string[],
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('O ativo que veio de fora, e o que foi ajustado nele'));
  for (const linha of ativo) {
    raiz.appendChild(paragrafo(linha));
  }

  raiz.appendChild(subtitulo('Repetição tratada como repetição'));
  for (const linha of repeticao) {
    raiz.appendChild(paragrafo(linha));
  }

  raiz.appendChild(subtitulo('Detalhe cobrado por distância'));
  for (const linha of niveis) {
    raiz.appendChild(paragrafo(linha));
  }

  raiz.appendChild(subtitulo('A medição, e a máquina em que ela foi obtida'));
  const bloco: HTMLPreElement = document.createElement('pre');
  bloco.textContent = medicao.join('\n');
  raiz.appendChild(bloco);
}

export function montarRegimeEmJanela(
  raiz: HTMLElement,
  orbita: readonly string[],
  regime: readonly string[],
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('A câmera em órbita, e como percorrer a cena'));
  raiz.appendChild(
    paragrafo(
      'Arraste com o cursor ou com um dedo para girar em volta da bancada. Use a roda, ' +
        'ou dois dedos, para aproximar e afastar.',
    ),
  );
  for (const linha of orbita) {
    raiz.appendChild(paragrafo(linha));
  }

  raiz.appendChild(subtitulo('O que este regime não oferece'));
  const bloco: HTMLPreElement = document.createElement('pre');
  bloco.textContent = regime.join('\n');
  raiz.appendChild(bloco);
}

export function montarInteracao(
  raiz: HTMLElement,
  apontamento: readonly string[],
  fronteira: readonly string[],
  interacao: readonly string[],
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('A abstração de apontar, e quem a alimenta'));
  raiz.appendChild(
    paragrafo(
      'Passe o cursor sobre as peças para ver o realce da mira, e clique para escolher. ' +
        'Arrastar gira a câmera e não seleciona nada: o gesto se decide pelo tanto que o ' +
        'cursor andou entre o botão descer e subir.',
    ),
  );
  for (const linha of apontamento) {
    raiz.appendChild(paragrafo(linha));
  }

  raiz.appendChild(subtitulo('O que vem pronto, o que se escreve aqui'));
  const limite: HTMLPreElement = document.createElement('pre');
  limite.textContent = fronteira.join('\n');
  raiz.appendChild(limite);

  raiz.appendChild(subtitulo('Mira e escolha, agora'));
  const estado: HTMLPreElement = document.createElement('pre');
  estado.textContent = interacao.join('\n');
  raiz.appendChild(estado);
}

export function montarManipulacaoEMontagem(
  raiz: HTMLElement,
  manipulacao: readonly string[],
  tolerancia: readonly string[],
  montagem: readonly string[],
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('Pegar, orientar e soltar'));
  raiz.appendChild(
    paragrafo(
      'Clique na peça para apanhá-la e clique de novo para soltar: no cursor a pega ' +
        'alterna, porque o botão está em disputa com a órbita e só a soltura diz se o ' +
        'gesto era clique ou arrasto. Com a peça na mão, Q e E a giram em torno do eixo ' +
        'vertical, R e F em torno do lateral. Onde há controle rastreado nada disso é ' +
        'preciso: a orientação vem da mão.',
    ),
  );
  for (const linha of manipulacao) {
    raiz.appendChild(paragrafo(linha));
  }

  raiz.appendChild(subtitulo('A folga do encaixe, e o que se tentou antes dela'));
  const folga: HTMLPreElement = document.createElement('pre');
  folga.textContent = tolerancia.join('\n');
  raiz.appendChild(folga);

  raiz.appendChild(subtitulo('A tarefa, e de que cada peça depende'));
  const tarefa: HTMLPreElement = document.createElement('pre');
  tarefa.textContent = montagem.join('\n');
  raiz.appendChild(tarefa);
}

export function montarSessao(
  raiz: HTMLElement,
  sessao: readonly string[],
  plataforma: readonly string[],
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('O ciclo de sessão, neste aparelho'));
  raiz.appendChild(
    paragrafo(
      'Entrar em sessão exige toque em um botão: o navegador recusa o pedido que não ' +
        'venha de um gesto de quem usa, e a recusa se parece com defeito do código. ' +
        'Fora de contexto seguro a interface sequer é exposta, e aí o sintoma é ' +
        'idêntico ao de um aparelho sem suporte — a causa, nesse caso, é o endereço.',
    ),
  );
  const negociado: HTMLPreElement = document.createElement('pre');
  negociado.textContent = sessao.join('\n');
  raiz.appendChild(negociado);

  raiz.appendChild(subtitulo('O que é da plataforma, o que se negocia e o que é deste projeto'));
  const linha: HTMLPreElement = document.createElement('pre');
  linha.textContent = plataforma.join('\n');
  raiz.appendChild(linha);
}

export function montarImersao(
  raiz: HTMLElement,
  escala: readonly string[],
  alcance: readonly string[],
  conforto: readonly string[],
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('Escala corporal e os dois percursos'));
  raiz.appendChild(
    paragrafo(
      'A conferência abaixo mede a cena e a confronta com o que ela declara. Fora de sessão ' +
        'ela vale como conferência de construção; dentro dela, some o assentamento contra a ' +
        'origem que o aparelho concedeu — e é aí que a diferença entre pedir o piso real e ' +
        'aceitar a altura da cabeça deixa de ser detalhe.',
    ),
  );
  const primeiro: HTMLPreElement = document.createElement('pre');
  primeiro.textContent = escala.join('\n');
  raiz.appendChild(primeiro);

  raiz.appendChild(subtitulo('O alcance do braço, medido peça por peça'));
  raiz.appendChild(
    paragrafo(
      'O que estiver fora do braço é problema de desenho, e o conserto é trazer a peça para ' +
        'perto. Instruir quem usa a dar um passo à frente transfere o problema para o outro ' +
        'lado e falha na sessão que não tem espaço livre para andar.',
    ),
  );
  const segundo: HTMLPreElement = document.createElement('pre');
  segundo.textContent = alcance.join('\n');
  raiz.appendChild(segundo);

  raiz.appendChild(subtitulo('Conforto: o que se conta e o que se provoca'));
  raiz.appendChild(
    paragrafo(
      'As provocações duram poucos segundos e se corrigem sozinhas. Aplique-as apenas em quem ' +
        'foi avisado do que vai sentir, e nunca em quem está sozinho com o visor no rosto.',
    ),
  );
  const terceiro: HTMLPreElement = document.createElement('pre');
  terceiro.textContent = conforto.join('\n');
  raiz.appendChild(terceiro);
}

export function montarLocomocao(
  raiz: HTMLElement,
  locomocao: readonly string[],
  area: readonly string[],
  comparacao: readonly string[],
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('O salto, o giro e a máscara'));
  raiz.appendChild(
    paragrafo(
      'Empurrar o comando para a frente abre a mira; soltar confirma o destino. No desktop o ' +
        'comando são as setas, e o salto leva o alvo da órbita — serve para conferir o gesto sem ' +
        'visor, o que importa quando há três aparelhos para a turma inteira.',
    ),
  );
  const primeiro: HTMLPreElement = document.createElement('pre');
  primeiro.textContent = locomocao.join('\n');
  raiz.appendChild(primeiro);

  raiz.appendChild(subtitulo('A borda da sala real'));
  raiz.appendChild(
    paragrafo(
      'A área física é a única coisa deste percurso que o ambiente não tem como deduzir: ela é ' +
        'propriedade do cômodo, e quem a declarou foi quem instalou o aparelho. Onde ela não é ' +
        'concedida, o ambiente diz que não sabe, em vez de desenhar um retângulo plausível.',
    ),
  );
  const segundo: HTMLPreElement = document.createElement('pre');
  segundo.textContent = area.join('\n');
  raiz.appendChild(segundo);

  raiz.appendChild(subtitulo('Contínuo e discreto, comparados por critério'));
  raiz.appendChild(
    paragrafo(
      'Os critérios estão escritos antes de qualquer ensaio, e metade deles só uma pessoa ' +
        'responde. O relato que vale é o de quem experimentou sem ter construído: quem construiu ' +
        'já se habituou ao próprio movimento e deixou de sentir o que ele produz.',
    ),
  );
  const terceiro: HTMLPreElement = document.createElement('pre');
  terceiro.textContent = comparacao.join('\n');
  raiz.appendChild(terceiro);
}

export function montarMarcador(raiz: HTMLElement, marcador: readonly string[]): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('O papel sobre a mesa, e o que ele custa em precisão'));
  raiz.appendChild(
    paragrafo(
      'Imprima o marcador pelo botão acima, confira o lado do quadrado preto com uma régua e ' +
        'ponha o papel sobre a mesa. Ligue a câmera e aponte: a bancada nasce sobre o papel, na ' +
        'escala que o número declarado no código determina.',
    ),
  );
  raiz.appendChild(
    paragrafo(
      'A comparação que interessa é com o registro do trecho anterior, e ela se faz no mesmo ' +
        'ambiente. Aqui a bancada treme, e o tremor está medido abaixo em milímetros; ela some ' +
        'quando o papel sai de quadro, porque não há mapa do cômodo a que recorrer; e a distância ' +
        'estimada depende de um campo de visão que o navegador não informa. Nada disso é defeito ' +
        'a corrigir: é o preço de reconhecer um gabarito numa imagem plana.',
    ),
  );
  const folha: HTMLPreElement = document.createElement('pre');
  folha.textContent = marcador.join('\n');
  raiz.appendChild(folha);
}

export function montarDegradacao(raiz: HTMLElement, degradacao: readonly string[]): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('Um endereço, muitos aparelhos, ninguém diante de uma tela em branco'));
  raiz.appendChild(
    paragrafo(
      'O ambiente consulta o aparelho ao carregar e escolhe qual regime abrir, por uma ordem de ' +
        'preferência decidida no projeto. A ordem está escrita abaixo com a razão de cada posição, ' +
        'porque nenhuma delas é obviamente correta quando os aparelhos diferem em várias ' +
        'dimensões ao mesmo tempo.',
    ),
  );
  raiz.appendChild(
    paragrafo(
      'Ao aparelho que não alcança um regime, o que se deve é uma mensagem que diga o que falta e ' +
        'o que ele ainda consegue fazer. Botão desabilitado ensina que o ambiente não funciona ' +
        'ali, e essa é a leitura errada: o regime em janela monta a bancada inteira.',
    ),
  );
  const folha: HTMLPreElement = document.createElement('pre');
  folha.textContent = degradacao.join('\n');
  raiz.appendChild(folha);
}

export function montarAncoragem(raiz: HTMLElement, ancoragem: readonly string[]): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('A cena sobre o mundo, e o que a mantém no lugar'));
  raiz.appendChild(
    paragrafo(
      'Entre em realidade aumentada, mire uma superfície até o anel aparecer e acione para ' +
        'pousar a bancada nela. Depois ande em volta: o que se verifica não é o instante do ' +
        'pouso, é a bancada continuar onde foi posta enquanto quem observa se move.',
    ),
  );
  raiz.appendChild(
    paragrafo(
      'A conferência que separa registro de papel de parede leva segundos e não pede ' +
        'instrumento nenhum. Se a bancada acompanhar a tela em vez de ficar sobre a mesa, a ' +
        'câmera está sendo usada como fundo, e o assunto deste trecho passou ao largo.',
    ),
  );
  const folha: HTMLPreElement = document.createElement('pre');
  folha.textContent = ancoragem.join('\n');
  raiz.appendChild(folha);
}

export function montarComposicao(
  raiz: HTMLElement,
  auditoria: readonly string[],
  percurso: readonly string[],
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('Está tudo aqui, e tudo alcançável a partir deste endereço?'));
  raiz.appendChild(
    paragrafo(
      'Cada módulo do percurso deixou uma camada. Nenhum deles podia responder se ela continuava ' +
        'ligada dois módulos depois: quem escreve a camada olha para ela, e o que se perde é ' +
        'justamente a ligação. A lista abaixo é declarada à mão e conferida por máquina a cada ' +
        'carregamento, contra o que esta composição de fato ligou.',
    ),
  );
  raiz.appendChild(
    paragrafo(
      'O que a conferência não faz é dizer que as camadas funcionam. Ela prova ligação, não ' +
        'comportamento — e é por isso que cada linha traz o que se deve VER acontecer. Essa ' +
        'coluna é o roteiro da conferência a olho, e ela continua sendo de gente.',
    ),
  );
  const folhaDaAuditoria: HTMLPreElement = document.createElement('pre');
  folhaDaAuditoria.textContent = auditoria.join('\n');
  raiz.appendChild(folhaDaAuditoria);

  raiz.appendChild(subtitulo('Entre escolher o regime e conseguir abri-lo'));
  raiz.appendChild(
    paragrafo(
      'A consulta ao aparelho diz qual regime ele alcança. A abertura pode falhar depois disso — ' +
        'permissão negada no diálogo, sessão tomada por outra aba, aparelho que declara suporte e ' +
        'recusa o pedido. Quando isso acontece, a degradação continua descendo a ordem declarada ' +
        'até o regime em janela, que não precisa ser aberto porque já está de pé desde que a ' +
        'página subiu.',
    ),
  );
  const folhaDoPercurso: HTMLPreElement = document.createElement('pre');
  folhaDoPercurso.textContent = percurso.join('\n');
  raiz.appendChild(folhaDoPercurso);
}

export function montarPainelDiegetico(raiz: HTMLElement, legibilidade: readonly string[]): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('O cartaz que sobrevive à entrada na sessão'));
  raiz.appendChild(
    paragrafo(
      'Um painel preso à janela do navegador desaparece no instante em que a sessão imersiva ' +
        'começa — que é exatamente quando ele faria mais falta. O deste ambiente é objeto da cena, ' +
        'preso à bancada, e por isso continua ali dentro do visor e sobre a mesa real, ancorado ao ' +
        'mesmo objeto que a ancoragem move.',
    ),
  );
  raiz.appendChild(
    paragrafo(
      'Ser objeto tem custo, e o custo é a leitura. O cartaz visto de lado é uma linha, e o texto ' +
        'a três metros não se lê. A resposta não foi aumentar o painel, que mentiria sobre a ' +
        'escala do mundo: ele gira em torno do próprio eixo vertical para encarar quem lê, e MEDE ' +
        'a altura aparente da letra, dizendo quando ela caiu abaixo do limiar em vez de fingir que ' +
        'está sendo lida.',
    ),
  );
  const folha: HTMLPreElement = document.createElement('pre');
  folha.textContent = legibilidade.join('\n');
  raiz.appendChild(folha);
}

export function montarRegistroDoProjeto(
  raiz: HTMLElement,
  registro: readonly string[],
  uso: readonly string[],
): void {
  raiz.replaceChildren();

  raiz.appendChild(subtitulo('O que ninguém reconstitui depois olhando o código'));
  raiz.appendChild(
    paragrafo(
      'O código diz o que o ambiente faz. Não diz por que a folga do encaixe é de quatro ' +
        'centímetros, o que se experimentou antes de fixá-la, em que máquina o número de ' +
        'milissegundos foi obtido, nem em que aparelhos este endereço foi de fato aberto. As ' +
        'grandezas sem medida aparecem como não medidas: preencher uma delas com valor plausível ' +
        'tornaria todas as outras não confiáveis.',
    ),
  );
  const folhaDoRegistro: HTMLPreElement = document.createElement('pre');
  folhaDoRegistro.textContent = registro.join('\n');
  raiz.appendChild(folhaDoRegistro);

  raiz.appendChild(subtitulo('Avaliar o ambiente pela tarefa que ele suporta'));
  raiz.appendChild(
    paragrafo(
      'A pergunta "o ambiente ficou bom?" não tem resposta. A que tem é outra: alguém consegue ' +
        'montar o mecanismo, e onde essa pessoa trava? A análise abaixo decompõe a tarefa em ' +
        'demandas — julgar profundidade, orientar a peça, lembrar a ordem, alcançar o que está ' +
        'longe — e mostra o que cada regime oferece a cada uma delas. Duas demandas desaparecem ' +
        'nos regimes sem corpo, e desaparecer não é ficar mais fácil: a tarefa passa a ser outra.',
    ),
  );
  const folhaDoUso: HTMLPreElement = document.createElement('pre');
  folhaDoUso.textContent = uso.join('\n');
  raiz.appendChild(folhaDoUso);
}
