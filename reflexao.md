# Reflexão sobre o Processo de Vibe Coding - Vibe Finanças

Este documento consolida os aprendizados e impressões obtidas durante o desenvolvimento deste projeto utilizando a metodologia de **Vibe Coding** (desenvolvimento colaborativo orientado por conversas, contexto e intenção com IA).

---

## 1. O que funcionou muito bem?
* **Velocidade de Estruturação Conceitual**: A definição do PRD e do plano de MVP ocorreu em minutos. Ao invés de passar horas decidindo arquitetura de banco de dados ou criando fluxogramas complexos, a conversa natural com a IA permitiu validar a ideia do produto de forma rápida e fluida.
* **Geração de Ideias Criativas**: O tom de voz do Agente Financeiro ("Vibe") e a sugestão de focar na redução de fricção de dados através de chat em linguagem natural surgiram como respostas diretas à intenção clara de simplificar a vida do usuário.
* **Alinhamento do Escopo**: A divisão entre a documentação conceitual e a posterior criação do protótipo web de alta fidelidade ajudou a manter o foco em cada etapa, sem pressa para codificar antes de entender a "vibe" do produto.

---

## 2. O que não funcionou exatamente como o esperado?
* **Limitações do Processamento de Linguagem Natural Local (no Protótipo)**: Como o protótipo roda 100% no navegador do cliente sem backend real conectado a uma API complexa de LLM, a interpretação das frases foi simulada usando Regex e mapeamento de palavras-chave estruturadas em JavaScript. Funciona muito bem para frases padrão (ex: "gastei X com Y"), mas frases altamente ambíguas podem exigir refinamento no código do app.js.
* **Ajuste Fino de Design**: Traduzir o conceito de "glassmorphism premium" em CSS puro requer atenção aos detalhes de cores, opacidade e filtros de desfoque (`backdrop-filter`). Algumas versões iniciais podem parecer simples se não usarmos as variáveis CSS e sombras corretas.

---

## 3. O que aprendi sobre conversar com IAs?
* **Intenção é mais importante que Sintaxe**: No Vibe Coding, você não precisa saber de cabeça a sintaxe exata do CSS ou a melhor API de gráficos. Se você souber explicar *o que* quer alcançar, a *vibe* visual que deseja passar (ex: "glassmorphism dark mode com roxo vibrante") e os dados que precisam ser exibidos, a IA se encarrega de fornecer os blocos de código ideais.
* **Contexto é Rei**: Passar um briefing bem estruturado (como o PRD simplificado sugerido no desafio) faz com que a IA seja muito mais precisa e assertiva nas respostas, economizando iterações e evitando respostas genéricas.
* **Iteração Incremental**: Em vez de pedir "crie um aplicativo completo de finanças agora", é muito mais produtivo e satisfatório quebrar o desenvolvimento em fases: planejar primeiro, desenhar a interface, criar a lógica de simulação do chat e depois integrar tudo.
