# Plano de MVP e Fluxo de Telas - Vibe Finanças (v2 Extreme)

Este documento descreve as diretrizes de design, a arquitetura do **Motor de IA Autônomo** (Vibe Cognitive Engine) e o fluxo do usuário no aplicativo.

---

## 1. O Agente Financeiro: Persona e Tom de Voz

O Agente Financeiro do **Vibe Finanças** chama-se **Vibe**. Ele se comporta de duas maneiras:
1. **Chat Conversacional (Interface Ativa)**: Amigável, empático, acolhedor e direto. Guia o usuário no chat.
2. **Motor Autônomo (Interface Passiva/Cognitiva)**: Roda em segundo plano simulando auditoria de gastos, gerando análises e criando logs de pensamento. Seu tom é de um "analista silencioso mas proativo", detalhando seu raciocínio lógico em um terminal de logs integrado.

---

## 2. Arquitetura do Vibe Cognitive Engine

O motor autônomo opera em um ciclo contínuo de **Perceber -> Pensar -> Agir**:

```
      +------------------+
      |    PERCEBER      | <--- Entrada do Usuário (Chat, Transações, Simulações)
      +--------+---------+
               |
               v
      +------------------+
      |     PENSAR       | ---> Atualiza "Pensamentos do Agente" no Painel
      +--------+---------+      Calcula Projeções e Audita Limites
               |
               v
      +------------------+
      |      AGIR        | ---> Imprime logs no Terminal do Agente
      +------------------+      Atualiza Dashboard, Gráficos e emite Insights
```

* **Perceber**: Observa qualquer mudança no estado das transações ou no acionamento de simulações.
* **Pensar**:
  * Executa projeções financeiras para 1, 3 e 6 meses.
  * Verifica se os gastos por categoria excederam os limites saudáveis (ex: Alimentação > 40% das despesas).
  * Avalia a velocidade de economia em relação à meta mensal.
* **Agir**:
  * Imprime logs detalhados de auditoria no console.
  * Altera o status cognitivo ("Auditando", "Projetando", "Finalizado").
  * Alimenta o chat com insights de economia ou atualiza o saldo futuro simulado.

---

## 3. Fluxo Conceitual de Telas (Layout de 3 Colunas)

Esta versão aprimorada usa um layout de 3 colunas no desktop para dar visibilidade total ao motor de IA:

```
+-------------------------------------------------------------------------------+
|  VIBE FINANÇAS 💸  [Tema: Escuro]                              [Resetar Dados] |
+-----------------------+-----------------------+-------------------------------+
| COLUNA 1: DASHBOARD   | COLUNA 2: CHAT        | COLUNA 3: MOTOR AUTÔNOMO      |
|                       |                       |                               |
| [ Saldo: R$ 1.420 ]   | [Vibe]: Olá! O que    | ** STATUS: PENSANDO **        |
| [ Receitas: R$ 2.000 ]| comprou hoje?         | [Pensamento]:                 |
| [ Despesas: R$ 580 ]  |                       | "Analisando histórico e       |
|                       | [Usuário]: gastei 30  | projetando 6 meses..."        |
| +-------------------+ | com Uber.             |                               |
| | GRÁFICO DE GASTOS | |                       | CONSOLE DE LOGS DO AGENTE:    |
| |   (Doughnut)      | | [Vibe]: R$ 30,00      | > [09:12] Iniciando Auditoria |
| +-------------------+ | anotado em            | > [09:12] 4 transações lidas  |
|                       | Transporte! 🚗        | > [09:13] Projeção: R$ 2.040  |
| [ Meta: R$ 500 ]      |                       |                               |
| Progresso: [==== ] 60%| +-------------------+ | SIMULADOR DE CENÁRIOS:        |
|                       | | [Digite transação]| | [Simular Aumento de Salário ] |
|                       | +-------------------+ | [Simular Despesa Médica     ] |
+-----------------------+-----------------------+-------------------------------+
```

### Detalhes do Novo Painel (Coluna 3):
1. **Cognitive State Indicator**: Cabeçalho animado que mostra a atividade do agente (ex: `STATUS: COGNITION ACTIVE` com efeito de pulso).
2. **Pensamentos do Vibe**: Balão contendo o texto em tempo real de suas reflexões analíticas.
3. **Terminal de Logs**: Área preta com fonte verde neon que rola automaticamente, exibindo as etapas lógicas que a IA executou autonomamente.
4. **Central de Simulação**: Botões rápidos de eventos macroeconômicos que demonstram como o motor de IA se adapta a eventos inesperados.

---

## 4. Plano de Validação Inicial (Métricas do MVP)

1. **Tempo de Resposta do Motor**: Tempo que o motor leva para recalcular projeções e reescrever logs após uma transação. (Alvo: < 500ms).
2. **Entendimento de Cenários**: O usuário consegue compreender as projeções do terminal sem precisar ler relatórios externos.
3. **Visual WOW Factor**: Taxa de engajamento e surpresa positiva dos usuários ao verem o motor "pensar" em tempo real no terminal.
