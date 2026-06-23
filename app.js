/* ==========================================================================
   STATE MANAGEMENT & DEFAULT SEED DATA
   ========================================================================== */
let state = {
  transactions: [],
  goal: 500.00,
  theme: 'dark'
};

// Default transactions to make the UI look premium at first load
const defaultTransactions = [
  {
    id: 't-1',
    description: 'Salário Mensal',
    amount: 3200.00,
    type: 'income',
    category: 'Salário',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
  },
  {
    id: 't-2',
    description: 'Supermercado da semana',
    amount: 280.00,
    type: 'expense',
    category: 'Alimentação',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
  },
  {
    id: 't-3',
    description: 'Corrida de Uber',
    amount: 38.50,
    type: 'expense',
    category: 'Transporte',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
  },
  {
    id: 't-4',
    description: 'Cinema e pipoca',
    amount: 65.00,
    type: 'expense',
    category: 'Lazer',
    date: new Date().toISOString() // today
  }
];

const categoryIcons = {
  'Alimentação': '🍕',
  'Transporte': '🚗',
  'Lazer': '🍿',
  'Saúde': '💊',
  'Educação': '📚',
  'Salário': '💰',
  'Outros': '🏷️'
};

const financialTips = [
  "Regra 50/30/20: Use 50% de sua renda para necessidades básicas, 30% para desejos pessoais e economize/invista 20%!",
  "Crie uma reserva de emergência equivalente a 3 a 6 meses de suas despesas essenciais antes de começar a investir em renda variável.",
  "Evite compras por impulso! Se gostou de algo online, espere 24 horas antes de comprar. Muitas vezes você vai perceber que não precisava.",
  "Dica do Vibe: Seus gastos com Alimentação estão subindo? Que tal preparar marmitas aos domingos para economizar durante a semana?",
  "Pequenas despesas repetitivas (como cafezinhos diários ou assinaturas que você não usa) podem somar centenas de reais ao final do ano. Faça uma limpa!",
  "Pague a si mesmo primeiro: Assim que receber seu salário, transfira uma quantia diretamente para a poupança ou investimentos antes de gastar."
];

let expensesChart = null;

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initTheme();
  setupEventListeners();
  updateDashboard();
  initChat();
});

// Load state from localStorage or seed
function loadData() {
  const savedState = localStorage.getItem('vibe_finance_state');
  if (savedState) {
    try {
      state = JSON.parse(savedState);
    } catch (e) {
      console.error("Erro ao carregar dados do LocalStorage, reiniciando...", e);
      seedDefaultData();
    }
  } else {
    seedDefaultData();
  }
}

function seedDefaultData() {
  state.transactions = [...defaultTransactions];
  state.goal = 500.00;
  state.theme = 'dark';
  saveState();
}

function saveState() {
  localStorage.setItem('vibe_finance_state', JSON.stringify(state));
}

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  const themeBtn = document.getElementById('theme-toggle');
  updateThemeIcon(themeBtn);
}

function updateThemeIcon(btn) {
  if (state.theme === 'dark') {
    btn.innerHTML = '<i data-lucide="sun"></i>';
  } else {
    btn.innerHTML = '<i data-lucide="moon"></i>';
  }
  lucide.createIcons();
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', state.theme);
  saveState();
  const themeBtn = document.getElementById('theme-toggle');
  updateThemeIcon(themeBtn);
  
  // Re-render chart to adjust grid colors if needed
  updateChart();
}

/* ==========================================================================
   EVENT LISTENERS Setup
   ========================================================================== */
function setupEventListeners() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Reset database
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Tem certeza de que deseja resetar todas as suas transações e dados?')) {
      seedDefaultData();
      updateDashboard();
      initChat(true); // Restart chat history
      saveState();
    }
  });

  // Modal actions for Goal
  const goalModal = document.getElementById('goal-modal');
  const editGoalBtn = document.getElementById('edit-goal-btn');
  const cancelGoalBtn = document.getElementById('cancel-goal-btn');
  const saveGoalBtn = document.getElementById('save-goal-btn');
  const goalInput = document.getElementById('goal-input-value');

  editGoalBtn.addEventListener('click', () => {
    goalInput.value = state.goal;
    goalModal.classList.add('active');
  });

  cancelGoalBtn.addEventListener('click', () => {
    goalModal.classList.remove('active');
  });

  saveGoalBtn.addEventListener('click', () => {
    const value = parseFloat(goalInput.value);
    if (!isNaN(value) && value >= 0) {
      state.goal = value;
      saveState();
      updateDashboard();
      goalModal.classList.remove('active');
      addVibeMessage(`Sua nova meta de economia mensal foi definida para **R$ ${value.toFixed(2)}**! Vamos com tudo! 🎯`);
    }
  });

  // Chat Form submission
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text) return;
    
    // 1. Add user message
    addUserMessage(text);
    chatInput.value = '';
    
    // 2. Process with Vibe NLP
    processUserPhrase(text);
  });

  // Suggestion buttons click
  const suggestionContainer = document.querySelector('.suggestions-list');
  suggestionContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-suggestion');
    if (!btn) return;
    
    const phrase = btn.getAttribute('data-phrase');
    addUserMessage(phrase);
    processUserPhrase(phrase);
  });
}

/* ==========================================================================
   DASHBOARD UPDATES (CALCULATIONS & GRAPHS)
   ========================================================================== */
function updateDashboard() {
  let incomeTotal = 0;
  let expensesTotal = 0;

  state.transactions.forEach(t => {
    if (t.type === 'income') {
      incomeTotal += t.amount;
    } else {
      expensesTotal += t.amount;
    }
  });

  const balanceTotal = incomeTotal - expensesTotal;

  // Render values
  document.getElementById('total-income').innerText = formatCurrency(incomeTotal);
  document.getElementById('total-expenses').innerText = formatCurrency(expensesTotal);
  
  const balanceEl = document.getElementById('total-balance');
  balanceEl.innerText = formatCurrency(balanceTotal);

  // Balance trend look
  const trendEl = document.getElementById('balance-trend');
  if (balanceTotal >= 0) {
    balanceEl.style.color = 'var(--text-primary)';
    trendEl.className = 'trend text-success';
    trendEl.innerHTML = '<i data-lucide="arrow-up-right"></i><span>No controle</span>';
  } else {
    balanceEl.style.color = 'var(--danger-text)';
    trendEl.className = 'trend text-danger';
    trendEl.innerHTML = '<i data-lucide="arrow-down-right"></i><span>Atenção: negativo</span>';
  }

  // Update transactions count badge
  document.getElementById('transactions-count').innerText = state.transactions.length;

  // Render goal progress
  const progressTextEl = document.getElementById('goal-progress-text');
  const percentageEl = document.getElementById('goal-percentage');
  const progressBarEl = document.getElementById('goal-progress-bar');
  const goalMsgEl = document.getElementById('goal-status-msg');

  // "Economias" matches total income minus total expenses
  const savedAmount = Math.max(0, balanceTotal);
  const percentage = state.goal > 0 ? Math.min(100, Math.round((savedAmount / state.goal) * 100)) : 0;

  progressTextEl.innerText = `Salvo: ${formatCurrency(savedAmount)} / ${formatCurrency(state.goal)}`;
  percentageEl.innerText = `${percentage}%`;
  progressBarEl.style.width = `${percentage}%`;

  if (state.goal <= 0) {
    goalMsgEl.innerText = "Nenhuma meta mensal configurada. Clique no botão de editar acima.";
  } else if (percentage >= 100) {
    goalMsgEl.innerHTML = "🎉 **Incrível!** Você bateu sua meta de economia mensal!";
    goalMsgEl.style.color = "var(--success-text)";
  } else if (percentage >= 70) {
    goalMsgEl.innerText = "Quase lá! Suas economias estão evoluindo muito bem este mês.";
    goalMsgEl.style.color = "var(--text-secondary)";
  } else if (balanceTotal < 0) {
    goalMsgEl.innerText = "Você está com saldo negativo! Adicione receitas para equilibrar.";
    goalMsgEl.style.color = "var(--danger-text)";
  } else {
    goalMsgEl.innerText = "Cada centavo conta! Continue registrando seus gastos com o Vibe.";
    goalMsgEl.style.color = "var(--text-secondary)";
  }

  // Render recent transactions list
  renderTransactions();
  
  // Render / Update Chart.js
  updateChart();

  // Create/recreate Icons
  lucide.createIcons();
}

function renderTransactions() {
  const listEl = document.getElementById('transactions-list');
  listEl.innerHTML = '';

  // Sort transactions by date descending
  const sorted = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) {
    listEl.innerHTML = `<li class="no-data" style="padding: 20px;"><p style="font-size: 0.8rem; color: var(--text-muted)">Nenhuma transação cadastrada.</p></li>`;
    return;
  }

  sorted.forEach(t => {
    const item = document.createElement('li');
    item.className = 'transaction-item';
    item.setAttribute('data-id', t.id);

    const formattedDate = new Date(t.date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short'
    });

    const isIncome = t.type === 'income';
    const sign = isIncome ? '+' : '-';
    const valClass = isIncome ? 'income-val' : 'expense-val';
    const iconClass = isIncome ? 'income-icon' : 'expense-icon';
    const emoji = categoryIcons[t.category] || '🏷️';

    item.innerHTML = `
      <div class="transaction-info">
        <div class="transaction-icon ${iconClass}">
          <span>${emoji}</span>
        </div>
        <div class="transaction-details">
          <span class="transaction-desc">${t.description}</span>
          <span class="transaction-meta">${t.category} • ${formattedDate}</span>
        </div>
      </div>
      <div class="transaction-amount-area">
        <span class="transaction-val ${valClass}">${sign} ${formatCurrency(t.amount)}</span>
        <button class="btn-delete-trans" title="Excluir transação" onclick="deleteTransaction('${t.id}')">
          <i data-lucide="trash-2"></i>
        </button>
      </div>
    `;
    listEl.appendChild(item);
  });
}

// Global scope access to delete transactions
window.deleteTransaction = function(id) {
  const transIndex = state.transactions.findIndex(t => t.id === id);
  if (transIndex > -1) {
    const deleted = state.transactions[transIndex];
    state.transactions.splice(transIndex, 1);
    saveState();
    updateDashboard();
    addVibeMessage(`Removi a transação **"${deleted.description}"** (${formatCurrency(deleted.amount)}) do seu histórico.`);
  }
};

function formatCurrency(val) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

/* ==========================================================================
   CHART.JS CONFIGURATION
   ========================================================================== */
function updateChart() {
  const noDataEl = document.getElementById('no-data-msg');
  const chartCanvas = document.getElementById('expenses-chart');

  // Aggregating expenses by category
  const categories = {};
  let totalExpenses = 0;

  state.transactions.forEach(t => {
    if (t.type === 'expense') {
      categories[t.category] = (categories[t.category] || 0) + t.amount;
      totalExpenses += t.amount;
    }
  });

  if (totalExpenses === 0) {
    if (expensesChart) {
      expensesChart.destroy();
      expensesChart = null;
    }
    noDataEl.style.display = 'flex';
    chartCanvas.style.display = 'none';
    return;
  }

  noDataEl.style.display = 'none';
  chartCanvas.style.display = 'block';

  const chartLabels = Object.keys(categories);
  const chartData = Object.values(categories);

  // Set colors based on category names
  const colorMap = {
    'Alimentação': '#ef4444', // Red
    'Transporte': '#3b82f6',  // Blue
    'Lazer': '#f59e0b',       // Amber
    'Saúde': '#10b981',       // Emerald
    'Educação': '#8b5cf6',    // Violet
    'Outros': '#6b7280'       // Gray
  };

  const chartColors = chartLabels.map(l => colorMap[l] || '#ec4899');

  // Styles for Dark / Light theme
  const textColor = state.theme === 'dark' ? '#f3f4f6' : '#111827';
  const borderColor = state.theme === 'dark' ? '#111827' : '#ffffff';

  if (expensesChart) {
    expensesChart.data.labels = chartLabels;
    expensesChart.data.datasets[0].data = chartData;
    expensesChart.data.datasets[0].backgroundColor = chartColors;
    expensesChart.data.datasets[0].borderColor = borderColor;
    expensesChart.options.plugins.legend.labels.color = textColor;
    expensesChart.update();
  } else {
    const ctx = chartCanvas.getContext('2d');
    expensesChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: chartLabels,
        datasets: [{
          data: chartData,
          backgroundColor: chartColors,
          borderColor: borderColor,
          borderWidth: 2,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 12,
              font: {
                family: 'Inter',
                size: 11
              },
              color: textColor,
              padding: 10
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.raw || 0;
                const percentage = ((value / totalExpenses) * 100).toFixed(1);
                return ` ${context.label}: R$ ${value.toFixed(2)} (${percentage}%)`;
              }
            }
          }
        },
        cutout: '70%'
      }
    });
  }
}

/* ==========================================================================
   CHAT INTERACTIONS (SIMULATED AGENT LOGIC)
   ========================================================================== */
function initChat(reset = false) {
  const chatHistory = document.getElementById('chat-history');
  
  if (reset) {
    chatHistory.innerHTML = '';
  }

  if (chatHistory.children.length === 0) {
    // Add Vibe's initial greeting
    addVibeMessage(`Olá! Sou o **Vibe**, seu parceiro de organização financeira. 💸✨

Estou pronto para te ajudar a controlar seus gastos sem complicação! Você pode me contar suas despesas ou receitas digitando normalmente.

Por exemplo:
* *“recebi 3000 de salário”*
* *“gastei 45 no japa”*
* *“comprei um livro de 30 reais”*

Como posso te ajudar hoje?`);
  }
}

function addUserMessage(text) {
  const chatHistory = document.getElementById('chat-history');
  const msg = document.createElement('div');
  msg.className = 'message user';
  msg.innerHTML = `
    <div class="msg-avatar">Eu</div>
    <div class="msg-bubble">${escapeHTML(text)}</div>
  `;
  chatHistory.appendChild(msg);
  scrollToBottom();
}

// Bot message wrapper that uses typing indicator simulation
function addVibeMessage(markdownText) {
  const chatHistory = document.getElementById('chat-history');
  
  // 1. Create typing bubble
  const typingMsg = document.createElement('div');
  typingMsg.className = 'message agent';
  typingMsg.innerHTML = `
    <div class="msg-avatar"><i data-lucide="bot"></i></div>
    <div class="msg-bubble">
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  `;
  
  chatHistory.appendChild(typingMsg);
  lucide.createIcons();
  scrollToBottom();
  
  // 2. Replace typing with real message after delay
  setTimeout(() => {
    typingMsg.remove();
    
    const msg = document.createElement('div');
    msg.className = 'message agent';
    msg.innerHTML = `
      <div class="msg-avatar"><i data-lucide="bot"></i></div>
      <div class="msg-bubble">${parseMarkdown(markdownText)}</div>
    `;
    chatHistory.appendChild(msg);
    lucide.createIcons();
    scrollToBottom();
  }, 850);
}

// Simple direct bot response (no delay, used for sub-actions)
function addVibeMessageDirect(markdownText) {
  const chatHistory = document.getElementById('chat-history');
  const msg = document.createElement('div');
  msg.className = 'message agent';
  msg.innerHTML = `
    <div class="msg-avatar"><i data-lucide="bot"></i></div>
    <div class="msg-bubble">${parseMarkdown(markdownText)}</div>
  `;
  chatHistory.appendChild(msg);
  lucide.createIcons();
  scrollToBottom();
}

function scrollToBottom() {
  const chatHistory = document.getElementById('chat-history');
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

/* ==========================================================================
   NLP NLP SIMULATOR (NATURAL LANGUAGE PROCESSING)
   ========================================================================== */
function processUserPhrase(phrase) {
  const clean = phrase.toLowerCase().trim();
  
  // 1. Check for greetings
  const greetings = ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'eae', 'hello'];
  if (greetings.some(g => clean === g || clean.startsWith(g + ' '))) {
    addVibeMessage("Olá! Que bom falar com você. O que quer registrar hoje nas suas finanças?");
    return;
  }

  // 2. Check for help requests
  const helpKeywords = ['ajuda', 'ajudar', 'como funciona', 'comandos', 'comando', 'oque fazer', 'o que fazer'];
  if (helpKeywords.some(k => clean.includes(k))) {
    addVibeMessage(`Posso te ajudar a gerenciar suas economias de forma conversacional!
    
Você só precisa digitar o que aconteceu. Exemplos:
* **"recebi 150 de presente"** (Adiciona Receita de R$ 150 em Outros)
* **"gastei 55 com remédios"** (Adiciona Despesa de R$ 55 em Saúde)
* **"paguei 350 na faculdade"** (Adiciona Despesa de R$ 350 em Educação)

Você também pode pedir uma **"dica de economia"** a qualquer momento!`);
    return;
  }

  // 3. Check for finance tips request
  const tipKeywords = ['dica', 'dicas', 'economia', 'economizar', 'conselho', 'poupanca', 'poupança'];
  if (tipKeywords.some(k => clean.includes(k))) {
    const randomIndex = Math.floor(Math.random() * financialTips.length);
    const randomTip = financialTips[randomIndex];
    addVibeMessage(`Aqui vai um bom conselho financeiro: 💡\n\n${randomTip}`);
    return;
  }

  // 4. Try parsing finance amounts and details
  // Regex to match numbers: e.g., 50 | 50.00 | 50,20 | R$ 50 | R$50.00
  const amountRegex = /(?:r\$\s*)?(\d+(?:[\.,]\d{2})?)/i;
  const match = clean.match(amountRegex);

  if (!match) {
    addVibeMessage(`Não consegui identificar um valor monetário na sua mensagem. 🤔
    
Tente algo como: *"Gastei 35 reais no almoço"* ou *"Recebi R$ 150 de pix"* para que eu possa computar.`);
    return;
  }

  // Extracted amount
  let amountStr = match[1].replace(',', '.'); // standard float formatting
  const amount = parseFloat(amountStr);

  if (isNaN(amount) || amount <= 0) {
    addVibeMessage("O valor que você digitou parece inválido. Por favor, tente inserir um valor positivo acima de R$ 0,00.");
    return;
  }

  // Determine type: revenue (income) or expense (default)
  let type = 'expense';
  const incomeKeywords = ['recebi', 'ganhei', 'salario', 'salário', 'pix de entrada', 'renda', 'recebimento', 'freela', 'faturamento', 'deposito', 'depósito'];
  const expenseKeywords = ['gastei', 'paguei', 'comprei', 'custa', 'custou', 'despesa', 'debito', 'débito', 'perdi', 'transferi'];

  if (incomeKeywords.some(kw => clean.includes(kw))) {
    type = 'income';
  } else if (expenseKeywords.some(kw => clean.includes(kw))) {
    type = 'expense';
  } else {
    // Contextual fallback based on categories (e.g. if the category is Salário, it's income)
    if (clean.includes('salario') || clean.includes('salário') || clean.includes('freela')) {
      type = 'income';
    }
  }

  // Determine Category based on keywords
  let category = 'Outros';
  
  const categoryKeywords = {
    'Alimentação': ['comer', 'restaurante', 'pizza', 'japa', 'almoço', 'almoco', 'jantar', 'janta', 'café', 'cafe', 'comida', 'mercado', 'supermercado', 'padaria', 'lanche', 'iFood'],
    'Transporte': ['uber', 'transporte', 'táxi', 'taxi', 'gasolina', 'combustivel', 'combustível', 'ônibus', 'onibus', 'metro', 'metrô', 'passagem', 'viagem', 'pedágio', 'pedagio'],
    'Lazer': ['cinema', 'filme', 'netflix', 'spotify', 'jogo', 'game', 'lazer', 'festa', 'show', 'cerveja', 'bar', 'balada', 'teatro', 'role', 'rolê', 'viagem', 'hospedagem'],
    'Saúde': ['saude', 'saúde', 'medico', 'médico', 'remedio', 'remédio', 'farmacia', 'farmácia', 'dentista', 'hospital', 'plano de saúde', 'exame'],
    'Educação': ['curso', 'livro', 'faculdade', 'escola', 'educacao', 'educação', 'aula', 'mensalidade', 'estudo', 'palestra', 'udemy'],
    'Salário': ['salario', 'salário', 'pagamento', 'ganhei', 'receita', 'renda', 'faturamento', 'freela', 'pro-labore']
  };

  for (const [catName, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(kw => clean.includes(kw))) {
      category = catName;
      break;
    }
  }

  // Special cases adjustment
  if (type === 'income' && category === 'Outros') {
    if (clean.includes('salário') || clean.includes('salario')) {
      category = 'Salário';
    }
  } else if (type === 'expense' && category === 'Salário') {
    // A salary cannot be an expense in this design. Change to outros/educacao/etc.
    category = 'Outros';
  }

  // Generate description based on the phrase (remove numbers and simple transaction words to extract description)
  let description = phrase;
  
  // Let's make description clean: e.g. "Gastei 50 no almoço" -> "Almoço"
  // Try to remove amount and keywords
  let descClean = phrase.replace(new RegExp(match[0], 'i'), '');
  
  const removeWords = [
    /gastei\s+(?:com\s+)?/gi,
    /paguei\s+(?:o\s+|a\s+)?/gi,
    /comprei\s+(?:um\s+|uma\s+)?/gi,
    /recebi\s+(?:de\s+)?/gi,
    /ganhei\s+(?:de\s+)?/gi,
    /reais/gi,
    /de\s+salário/gi,
    /r\$/gi,
    /^\s+/,
    /\s+$/
  ];
  
  removeWords.forEach(pattern => {
    descClean = descClean.replace(pattern, '');
  });
  
  descClean = descClean.trim();
  // Capitalize first letter
  if (descClean) {
    description = descClean.charAt(0).toUpperCase() + descClean.slice(1);
  } else {
    description = type === 'income' ? 'Receita Adicional' : `Gasto com ${category}`;
  }

  // Create Transaction Object
  const newTransaction = {
    id: 't-' + Date.now(),
    description: description,
    amount: amount,
    type: type,
    category: category,
    date: new Date().toISOString()
  };

  // Add to State
  state.transactions.push(newTransaction);
  saveState();
  
  // Render Dashboard
  updateDashboard();

  // Create Vibe friendly response
  const emoji = categoryIcons[category] || '🏷️';
  const typeText = type === 'income' ? 'receita' : 'despesa';
  
  let vibeResponse = `**Registrado com sucesso!** ${emoji}\n\n`;
  vibeResponse += `* **Descrição**: ${description}\n`;
  vibeResponse += `* **Tipo**: ${typeText.charAt(0).toUpperCase() + typeText.slice(1)}\n`;
  vibeResponse += `* **Categoria**: ${category}\n`;
  vibeResponse += `* **Valor**: ${formatCurrency(amount)}\n\n`;

  // Custom message elements based on state/goals
  if (type === 'income') {
    vibeResponse += `Excelente notícia! R$ ${amount.toFixed(2)} a mais no saldo. Isso ajuda no progresso das metas financeiras deste mês! 📈`;
  } else {
    // Contextual comment based on size
    if (amount > 150) {
      vibeResponse += `Essa foi uma compra de maior valor. Já atualizei o gráfico! Lembre-se de verificar se este gasto cabe no seu orçamento mensal. ⚖️`;
    } else {
      vibeResponse += `Gasto anotado! Continue registrando para saber exatamente para onde vai seu suado dinheirinho. 😉`;
    }
  }

  addVibeMessage(vibeResponse);
}

/* ==========================================================================
   UTILITY HELPER FUNCTIONS
   ========================================================================== */
function escapeHTML(str) {
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

// Basic markdown parser for formatting bold text, bullet lists, code/italics
function parseMarkdown(text) {
  let html = escapeHTML(text);
  
  // Bold: **text**
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Italic: *text*
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Bullet lists
  html = html.split('\n').map(line => {
    if (line.trim().startsWith('* ')) {
      return `<li>${line.trim().substring(2)}</li>`;
    }
    return line;
  }).join('\n');
  
  // Wrap list tags
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  
  // Paragraph breaks (replace double newline with <p>)
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<ul>') || p.trim().startsWith('<li>')) return p;
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  return html;
}
