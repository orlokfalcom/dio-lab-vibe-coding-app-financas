# Plano de MVP e Fluxo de Telas - Vibe Finanças

Este documento descreve as diretrizes de design, o tom de voz do Agente Financeiro e a jornada do usuário no MVP da aplicação.

---

## 1. O Agente Financeiro: Persona e Tom de Voz

O Agente Financeiro do **Vibe Finanças** chama-se **Vibe**. Ele não se comporta como um gerente de banco tradicional ou um robô analítico frio.

* **Nome**: Vibe
* **Personalidade**: Um amigo empático, inteligente e otimista, que entende que lidar com dinheiro pode ser estressante e busca desmistificar esse processo.
* **Tom de Voz**:
  * **Acolhedor e Calmo**: Sempre usa palavras encorajadoras. Nunca julga o usuário por gastar dinheiro, mas o ajuda a refletir.
  * **Simples e Acessível**: Evita termos técnicos de economia (como "amortização", "superávit") a menos que seja estritamente necessário, explicando-os de forma simples.
  * **Conciso**: Dá respostas diretas e fáceis de ler no chat do celular.
  * **Exemplo de Resposta**:
    * *Usuário*: "gastei 80 reais com japa hoje à noite."
    * *Vibe*: "Registrado! R$ 80,00 em Alimentação. 🍣 Nada como um sushi para relaxar! Notei que essa semana seus gastos com janta fora subiram um pouco. Que tal tentarmos cozinhar algo amanhã para manter a meta de economia no trilho?"

---

## 2. Fluxo Conceitual de Telas

O aplicativo foi projetado como uma **Single Page Application (SPA)** focada em duas colunas principais no desktop (ou abas deslizantes no mobile):

### Tela Principal (Painel Unificado)

```
+-------------------------------------------------------+
|  VIBE FINANÇAS 💸                      [Tema: Escuro] |
+---------------------------+---------------------------+
| COLUNA 1: DASHBOARD VISUAL| COLUNA 2: CHAT COM O VIBE |
|                           |                           |
| [ Saldo: R$ 1.420,00 ]    | [Vibe]: Olá! O que você   |
| [ Receitas: R$ 2.000 ]    | comprou ou recebeu hoje?  |
| [ Despesas: R$ 580   ]    |                           |
|                           | [Usuário]: gastei 30 com  |
| +-----------------------+ | Uber.                     |
| | GRÁFICO DE GASTOS     | |                           |
| |   (Pizza / Rosca)     | | [Vibe]: R$ 30,00 salvo  |
| | Alimentação | Lazer   | | em Transporte! 🚗        |
| +-----------------------+ |                           |
|                           | +-----------------------+ |
| [ Meta: Salvar R$ 500  ]  | | [Digite sua transação]| |
| Progress: [=====   ] 60%  | +-----------------------+ |
+---------------------------+---------------------------+
```

#### Elementos e Fluxos:
1. **Header**: Logo minimalista "Vibe Finanças", botão de alternar tema (Dark/Light) e botão de reset de dados para testes.
2. **Coluna Esquerda - Painel Analítico**:
   * **Indicadores Rápidos**: Cards com Saldo, Receitas e Despesas totais.
   * **Gráfico de Pizza Interativo**: Distribuição percentual de despesas por categoria em tempo real (Alimentação, Transporte, Lazer, Saúde, Outros).
   * **Metas Financeiras**: Barra de progresso visual de economia baseada nas despesas registradas em relação ao salário/receita.
3. **Coluna Direita - Central de Chat**:
   * Área de mensagens rolável que inicia com uma mensagem amigável de boas-vindas do Vibe.
   * Campo de entrada de texto ("Escreva o que você gastou ou ganhou...") e botão de envio rápido.
   * Animação de digitação ("Vibe está pensando...") para simular a resposta em tempo real.

---

## 3. Plano de Validação Inicial (Métricas do MVP)

Para medir se o MVP cumpre o seu propósito de reduzir o esforço de preenchimento e engajar o usuário, acompanharemos as seguintes métricas conceituais:

1. **Taxa de Sucesso de Conversão de Texto**: Percentual de frases escritas pelo usuário que o sistema consegue interpretar e categorizar com sucesso sem precisar de correção manual. (Alvo: > 85%).
2. **Tempo Médio de Registro**: O tempo que o usuário gasta desde a abertura do app até a confirmação da transação no chat. (Alvo: < 6 segundos).
3. **Frequência de Uso (Engajamento)**: Quantas vezes o usuário interage com o Vibe durante a semana. Um app tradicional é aberto uma vez por mês; queremos que o Vibe Finanças seja usado diariamente como um diário de finanças. (Alvo: 4+ acessos por semana).
4. **Taxa de Alcance de Metas**: Porcentagem de usuários que conseguem atingir a meta mensal proposta com a ajuda dos lembretes e insights do Vibe. (Alvo: > 60%).
