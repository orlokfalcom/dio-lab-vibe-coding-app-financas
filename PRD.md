# Documento de Requisitos de Produto (PRD) - Vibe Finanças (v2 Extreme)

## 1. Visão Geral e Contexto
O **Vibe Finanças** é um aplicativo de organização de finanças pessoais cujo objetivo principal é tornar o controle de gastos um hábito leve e sem fricção. Ao invés de preencher planilhas complexas ou formulários infinitos de cadastro de despesas, o usuário gerencia sua vida financeira conversando em linguagem natural com um **Agente Financeiro inteligente**.

Esta versão **v2 Extreme** inclui um **Motor de IA Autônomo** integrado, permitindo que a IA execute ciclos contínuos de análise, projeção e auditoria financeira por conta própria, reportando seu raciocínio ao usuário através de um console cognitivo.

O conceito central baseia-se na filosofia do **Vibe Coding**: simplicidade, intenção clara e uma interface altamente intuitiva e acolhedora.

---

## 2. Problema a ser Resolvido
A maioria das ferramentas de finanças pessoais falha por dois motivos principais:
1. **Fricção de entrada de dados**: Exigir que o usuário insira manualmente a categoria, valor, data, conta bancária e tags para cada despesa faz com que ele desista nas primeiras semanas.
2. **Falta de engajamento personalizado**: Relatórios frios e gráficos estáticos não ensinam o usuário a economizar nem oferecem uma experiência empática ou motivadora.
3. **Ausência de Pró-atividade (Estático)**: O usuário precisa abrir o app e analisar os dados manualmente. O sistema deve fazer análises de forma autônoma e propor projeções preditivas.

---

## 3. Público-Alvo
* **Jovens e adultos iniciantes no controle financeiro** que buscam uma forma descomplicada de entender para onde vai o seu dinheiro.
* **Pessoas ocupadas** que preferem mandar uma mensagem rápida de texto ou voz do que abrir uma planilha.
* **Usuários cansados de interfaces bancárias ou financeiras burocráticas** e que apreciam um design moderno, dinâmico e relaxante.

---

## 4. Funcionalidades-Chave do MVP (com Motor Autônomo)

### F1: Chat Conversacional com Processamento de Linguagem Natural (NLP)
* **Descrição**: Canal central onde o usuário digita ou fala suas transações. O Vibe processa a linguagem natural e anota no histórico.

### F2: Classificação e Organização Automática
* **Descrição**: O Agente Financeiro identifica o tipo de transação (Receita ou Despesa), extrai o valor numérico e categoriza automaticamente o gasto.

### F3: Dashboard Financeiro em Tempo Real
* **Descrição**: Painel visual dinâmico com saldo total atual, gráfico de pizza interativo mostrando a distribuição dos gastos por categoria e histórico de transações recentes.

### F4: Vibe Cognitive Engine (Motor de IA Autônomo)
* **Descrição**: Um motor que roda em segundo plano simulando o ciclo de pensamento de um agente autônomo.
* **Recursos**:
  * **Painel de Pensamentos**: Exibe o que a IA está analisando no momento (ex: "Calculando média de gastos diários...", "Projetando saldo para os próximos 6 meses...").
  * **Console de Logs do Agente**: Um terminal de depuração que imprime as ações autônomas realizadas (auditoria de transações, análise de metas, etc.).
  * **Projeção Preditiva**: O motor calcula automaticamente projeções de 1, 3 e 6 meses com base na taxa de despesas e receitas atuais.

### F5: Simulador de Cenários Macroeconômicos
* **Descrição**: Permite que o usuário teste eventos de simulação (ex: "Receber aumento", "Despesa de emergência", "Aumento no aluguel") e veja o impacto instantâneo de longo prazo calculado pelo motor de IA.

---

## 5. Requisitos de Interface e Design (Vibe do App)
A interface deve transmitir calma, foco e controle, com apelo estético extremo.
* **Tema**: Sleek Dark Mode (modo escuro elegante) com tons de azul profundo, roxo vibrante e detalhes neon.
* **Estilo**: Cyber-Glassmorphism (efeito vidro fosco com brilho de borda gradiente e sombras coloridas).
* **Tipografia**: Outfit ou Inter para leitura rápida e moderna.
* **Visualização de Terminal**: Área dedicada ao console do Agente Autônomo com fonte monoespaçada e animações de digitação de logs.

---

## 6. Critérios de Sucesso do MVP
* O usuário consegue registrar um gasto em menos de 5 segundos.
* O motor autônomo executa análises e projeções a cada nova transação ou simulação.
* O console de logs reflete de forma compreensível e transparente o comportamento do agente.
