# Especificações

## 1. Identificação e cena
Grupo Projeto 7 

* Isabella Estella de Oliveira - 1962380
* Giovana Cristina dos Santos Castro - 1961078
* Giovana dos Santos Oliveira - 1961112

Cena escolhida: **Bateria Acústica**

## 2. O que a pessoa faz ali

A pessoa ficará responsável de encontrar todos os componentes e completar a montagem da bateria. Cada componente estará em determinado lugar no cenário e a pessoa terá que interagir com o ambiente para conseguir “pegar” o componente da bateria e colocar o componente em seu devido lugar na bateria.

## 3. Inventário de objetos
* Bumbo;
* Caixa;
* Chimbal;
* Prato de ataque;
* Prato de condução;
* Tons e surdo;

## 4. O espaço e as escalas
A cena acontecerá no chão, no próprio estúdio de música, e terá a proporção e o tamanho real dos objetos.

A sala terá aproximadamente o tamanho de um estúdio de música, cerca de 12m² (3 metros de sala por 4 metros, por exemplo). Com o estúdio em uma boa proporção como essa, vamos conseguir fazer com que as peças e a bateria como um todo, ocupem um tamanho real, em uma escala pelo menos 90% fiel (que seria uma bateria com cerca de 2m a 1.5m totais).

Realizando uma pesquisa rápida em um site de instrumentos, creio que os objetos terão aproximadamente as seguintes medidas:

* **Bumbo:** 16 de diâmetro com cerca de 12 a 17” de profundidade.
* **Caixa:** 13 de diâmetro, com cerca de 3,5” a 10” de profundidade.
* **Chimbal:** 12 a 14 polegadas.
* **Prato de ataque:** entre 14 a 16 polegadas.
* **Prato de condução:** cerca de 20 polegadas.
* **Tons e surdo:** tom de 10” e surdo de 12” ou 14”. 

## 5. As ações do usuário
Ao mirar no objeto da bateria que estará disposto no chão do estúdio, ele irá se realçar. Caso o item apenas faça parte do cenário e não envolva interação, nada acontece. 

Dessa forma, o usuário poderá apanhar/pegar o objeto de modo que ele estará acionado no momento, acompanhando-o até onde desejar montar a bateria. Caso não puder apanhá-lo, simplesmente será notificado que o objeto em questão está travado.

Ao usuário tentar encaixar o item no seu devido lugar, ele deve se aproximar e soltar, de modo que a peça se encaixe perfeitamente na bateria. Porém, caso o objeto em sua mão não esteja correto para o encaixe, então será recusado e o usuário perderá a chance, sendo notificado.

## 6. A tarefa e sua validação
O principal objetivo (tarefa) é conseguir montar a bateria por completo e assim conseguir tocar.

Se caso a pessoa pegar um elemento que não faz parte da bateria, ela não será encaixada no espaço na bateria que a pessoa tentou colocar. Então, terá uma validação dos componentes que são colocados no espaço onde deve ser colocado a bateria e além disso, uma verificação de se a pessoa conseguiu pegar todos os componentes que a bateria tem que ter. Se caso a pessoa tiver pegado todos os componentes, seu objetivo estará concluído e assim, poderá tocar a bateria completa.

## 7. Regras de encaixe e tolerâncias
Se a pessoa pegar um componente (que não faz parte da bateria) e tentar encaixar ela em determinado lugar na bateria, o elemento pego não será encaixado e não fará parte do corpo da bateria. A pessoa terá uma tolerância de até 5 erros em encaixar os componentes na bateria, caso ele ultrapasse 5 erros, ele terá perdido o jogo e deverá reiniciar ele do zero.
E, além de tentar encaixar peças erradas, a pessoa tem que estar próxima de, pelo menos, 30 centímetros do local onde foi definido montar a bateria  e o componente precisa estar alinhado ao espaço onde ele deve ficar de pelo menos 70% com diferença angular de até 15°.

## 8. Retorno ao usuário
O usuário perceberá se suas ações estão corretas ou não, principalmente por meio de cor e som. Por exemplo, ao mirar um objeto que pode ser apanhado/pego, irá dar um leve zoom e contraste nele, mas, caso ele apenas faça parte do cenário sem que envolva interação, não acontecerá nenhuma mudança visual ou sonora. 

Ao acionar o objeto, que poderá ser colhido, terá um leve efeito sonoro, mas, caso contrário, não terá mudança.

Quando o usuário encaixar o objeto correto em seu devido lugar, irá ter um simples som correspondente a ele, mas, se o objeto na tentativa estiver errado, será emitido um som de negativa.

## 9. Os três regimes

|      Aspecto  |          Tela |          Visor |          Camêra |
| ------------- |:-------------:|:-------------:|:-------------:|
| Como se olha      | A cena será observada pelo monitor e para mudar o ângulo de visão, poderá ser utilizado a câmera virtual para isso.     | A cena é observada através do visor mesmo e com o movimento da cabeça, pode visualizar o ambiente.     | O usuário utiliza a câmera do celular para visualizar o ambiente virtual e com o movimento do celular, poder visualizar a cena de diversos ângulos.     |
| Como se interage      | A pessoa utilizará mouse e teclado para interagir com o ambiente.     | A pessoa poderá utilizar o controle do visor para interagir e manipular os objetos.     | A pessoa poderá manipular e interagir com os objetos através da tela do celular.     |
| Limitações / dificuldades      | Não terá uma visão estereoscópica do ambiente     | Não precisará de um monitor para visualizar o ambiente.     | Não terá a mesma imersão que o visor e poderá sofrer determinadas limitações (exemplo, se movimentar até extremidades e visualizar elementos de determinado ângulo)     |

## 10. Orçamento e desempenho
No total, aproximadamente 22 objetos distintos (exceto pelos pratos, que podem ser parecidos) de interação, sendo eles:

* Sendo pelo menos 7 peças corretas, que serão parte bateria em si.
* E cerca de 15 objetos serão errados, que é onde o usuário enfrentará o “desafio”, dentro da montagem da bateria.
É esperado que o cenário rode de maneira fluída, sem travamentos e congelamentos de imagem, para manter a cena fiel à realidade.

**Ordem de degradação:**
* A primeira opção é reduzir a quantidade de detalhes no cenário em si, tornando a cena mais simples, sem muita informação.
* A segunda opção seria reduzir o detalhamento nos modelos e nos objetos utilizados, para minimizar a renderização do modelo.
* A terceira opção é limitar a quantidade de objetos de interação errados, para não pesar na quantidade que o usuário precisa encaixar na bateria.

## 11. Erros, limites e degradação
1. **O aparelho não suporta o regime pedido:** Será informado que a máquina não suporta o que está sendo processado, em um alerta de erro antes mesmo da cena começar a rodar, para evitar erros de renderização etc.
2. **A permissão de câmera é negada:** Ficará semelhante ao celular quando é negado alguma permissão que é necessária.A tela ficará preta, com o aviso da permissão, e o usuário não irá conseguir passar para a simulação da cena em si.
3. **O rastreamento se perde:** O objeto congela, aguardando até que a conexão seja restabelecida entre o sensor e o objeto, evitando que o componente só suma e por algum erro não volte, ocasionando um bug que dificulta no término da cena.
4. **A pessoa sai do espaço útil:** O espaço será limitado, não permitindo que o usuário ande para um limbo, saindo fora da cena. Caso ele chegue no limite e ainda assim, tente ultrapassar, suas ações serão mantidas dentro da cena. Para os casos onde o usuário tentar pegar algo fora de seu alcance, o objeto não será tocado, não permitindo a interação, para evitar que interações “fantasmas” aconteçam.

## 12. Ativos, formatos e licenças
Inicialmente, pensamos em usar a biblioteca three.js (https://threejs.org/) para estar desenvolvendo o ambiente e os componentes em escala do real e desenvolver os componentes em 3D. A biblioteca three.js não possui licença, pois é distribuída sob a licença de código aberto MIT License. 

Para efeitos sonoros pensamos em utilizar o https://mixkit.co/ e sua licença para fins educacionais é gratuita: https://mixkit.co/license/ 

E para os componentes da bateria, utilizar o https://freesound.org/ a onde é permitido o uso para fins educacionais, porém, citaremos os autores dos sons também em nosso projeto.

## 13. Plano de construção por blocos

|      Bloco  |          O que será desenvolvida |          O que estará funcionando no final |
| ------------- |:-------------:|:-------------:|
| Bloco 1 - Estrutura da cena  | Desenvolvimento do ambiente virtual, objetos que o ambiente terá e proporção e posição dos componentes.  | A cena será executada e a pessoa poderá já visualizar os componentes já em cena.  |
| Bloco 2 - Interação   | Desenvolvimento da interação dos objetos. | O usuário poderá pegar os componentes e mover eles de lugar, deixar em determinado espaço e visualizar os componentes em todos os ângulos ao pegá-lo.     |
| Bloco 3 - Regras de encaixe  | Delimitar o determinado espaço dos componentes e aplicar regra de verificação se o ângulo e a posição que o objeto está sendo colocado está correto com o que é esperado.   | A pessoa poderá fazer tentativas de encaixar o objeto que deverá ir para a bateria e ver o componente no devido lugar ou não conseguirá encaixá-lo (caso o componente não faça parte do corpo da bateria).  |
| Bloco 4 - Validação e Testes  | Aplicar validação de tentativas de tentar colocar objetos que não sejam do corpo da bateria, se a pessoa colocou todos os componentes, se ao tocar no elemento, ele faz o som que é dele; se a pessoa consegue visualizar o componente de todos os ângulos e consegue interagir com o ambiente.   | A pessoa terá uma base sólida do jogo, podem interagir, ouvir o som dos componentes e já ver em cena os acertos e erros que ela pode cometer e se realizando o objetivo principal, poderá tocar a bateria com todos os componentes simultaneamente ou se não, ultrapassando o limite de chances,vendo o jogo ser reiniciado do zero.  |
| Bloco 5 - Adaptação para os três regimes  | Adaptação do código em receber diferentes fontes de entrada de interação e realizar os possíveis testes para ver se de fato está respeitando o hardware e entrada de interação feita pelo usuário.   |A pessoa poderá jogar o jogo através do computador, de um visor e de um celular.   |
| Bloco 6 - Otimização e testes  | Otimização de códigos e corrigir pequenas variações e bugs que o jogo pode vir a ter.  | Código refinado e limpo e com correção de possíveis bugs realizados.     |

## 14. Riscos e decisões em aberto

Riscos:

- Dúvida se conseguiremos entregar o projeto proposto com base em todas as suas funcionalidades, dentro do prazo previsto. Para isso iremos nos planejar e dividir da melhor forma possível as demandas semanais;
- Entregar o projeto de acordo com as funcionalidades propostas. Para que isso seja realizado devemos nos atentar ao que foi documentado;
- Dúvida se haverá conhecimento suficiente para desenvolver o que será necessário para chegar no produto final. Buscar além do material disponibilizado, outras fontes que possam enriquecer o nosso desenvolvimento.

Decisões em aberto:

- Quais objetos irão compor o cenário, além dos que fazem parte da bateria. Iremos  pesquisar as possibilidades;
- Quais serão os sons e cores específicos para retorno ao usuário. Iremos pesquisar e analisar quais serão as melhores opções.
