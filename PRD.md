# Documento de Requisitos de Produto (PRD) - Vibe Finanças

## 1. Visão Geral e Contexto
O **Vibe Finanças** é um aplicativo de organização de finanças pessoais cujo objetivo principal é tornar o controle de gastos um hábito leve e sem fricção. Ao invés de preencher planilhas complexas ou formulários infinitos de cadastro de despesas, o usuário gerencia sua vida financeira conversando em linguagem natural com um **Agente Financeiro inteligente**.

O conceito central baseia-se na filosofia do **Vibe Coding**: simplicidade, intenção clara e uma interface altamente intuitiva e acolhedora.

---

## 2. Problema a ser Resolvido
A maioria das ferramentas de finanças pessoais falha por dois motivos principais:
1. **Fricção de entrada de dados**: Exigir que o usuário insira manualmente a categoria, valor, data, conta bancária e tags para cada cafezinho comprado faz com que ele desista nas primeiras semanas.
2. **Falta de engajamento personalizado**: Relatórios frios e gráficos estáticos não ensinam o usuário a economizar nem oferecem uma experiência empática ou motivadora.

---

## 3. Público-Alvo
* **Jovens e adultos iniciantes no controle financeiro** que buscam uma forma descomplicada de entender para onde vai o seu dinheiro.
* **Pessoas ocupadas** que preferem mandar uma mensagem rápida de texto ou voz do que abrir uma planilha.
* **Usuários cansados de interfaces bancárias ou financeiras burocráticas** e que apreciam um design moderno, dinâmico e relaxante.

---

## 4. Funcionalidades-Chave do MVP

### F1: Chat Conversacional com Processamento de Linguagem Natural (NLP)
* **Descrição**: Canal central onde o usuário digita ou fala suas transações.
* **Exemplos de entrada**:
  * *"Gastei 50 reais de almoço hoje"* -> Registra despesa de R$ 50,00, categoria: *Alimentação*.
  * *"Recebi 3500 de salário"* -> Registra receita de R$ 3.500,00, categoria: *Salário*.
  * *"Comprei um livro de R$ 42,90 na Amazon"* -> Registra despesa de R$ 42,90, categoria: *Educação* ou *Lazer*.

### F2: Classificação e Organização Automática
* **Descrição**: O Agente Financeiro identifica o tipo de transação (Receita ou Despesa), extrai o valor numérico e categoriza automaticamente o gasto (Alimentação, Transporte, Lazer, Saúde, Educação, etc.).

### F3: Dashboard Financeiro em Tempo Real
* **Descrição**: Painel visual dinâmico com:
  * Saldo Total Atual (Receitas - Despesas).
  * Gráfico de Pizza ou Rosca mostrando a distribuição dos gastos por categoria.
  * Histórico de transações recentes formatadas de forma elegante.

### F4: Metas de Economia e Acompanhamento
* **Descrição**: Definição simples de uma meta financeira (ex: "Economizar R$ 500 este mês"). O progresso é exibido visualmente no dashboard.

### F5: Insights Ativos do Agente Financeiro
* **Descrição**: Dicas amigáveis baseadas no comportamento de gastos, geradas pelo agente de IA. Se o usuário gastar muito com alimentação, o agente envia uma dica com uma sugestão de economia sutil e encorajadora.

---

## 5. Requisitos de Interface e Design (Vibe do App)
A interface deve transmitir calma, foco e controle.
* **Tema**: Sleek Dark Mode (modo escuro elegante) com tons de azul profundo, roxo vibrante e detalhes em verde esmeralda para saldo positivo.
* **Estilo**: Glassmorphism (efeito vidro fosco) para cartões de informação, criando profundidade visual.
* **Tipografia**: Outfit ou Inter para leitura rápida e moderna.
* **Interações**: Efeitos hover suaves, digitação dinâmica do Agente e transições fluidas de tela.

---

## 6. Critérios de Sucesso do MVP
* O usuário consegue registrar um gasto em menos de 5 segundos.
* O sistema categoriza corretamente 90% das entradas típicas em português.
* O dashboard reflete as atualizações instantaneamente após cada mensagem no chat.
