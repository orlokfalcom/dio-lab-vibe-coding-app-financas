/* ==========================================================================
   STATE MANAGEMENT & DEFAULT SEED DATA (v2 Autonomous)
   ========================================================================== */
let state = {
  transactions: [],
  goal: 500.00,
  theme: 'dark',
  simulations: {
    salaryMultiplier: 1.0,  // e.g. 1.1 for +10%
    extraExpense: 0,        // e.g. aluguel increase
    emergencyCount: 0       // simulated emergency count
  }
};

const defaultTransactions = [
  {
    id: 't-1',
    description: 'Salário Mensal',
    amount: 3200.00,
    type: 'income',
    category: 'Salário',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 't-2',
    description: 'Supermercado da semana',
    amount: 280.00,
    type: 'expense',
    category: 'Alimentação',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 't-3',
    description: 'Corrida de Uber',
    amount: 38.50,
    type: 'expense',
    category: 'Transporte',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 't-4',
    description: 'Cinema e pipoca',
    amount: 65.00,
    type: 'expense',
    category: 'Lazer',
    date: new Date().toISOString()
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
  "Crie uma reserva de emergência equivalente a 3 a 6 meses de suas despesas essenciais antes de começar a investir.",
  "Evite compras por impulso! Se gostou de algo, espere 24 horas. Muitas vezes você vai perceber que não precisava.",
  "Dica do Vibe: Seus gastos com Alimentação estão subindo? Que tal preparar marmitas aos domingos para economizar?",
  "Pequenas despesas repetitivas (como cafezinhos diários) podem somar centenas de reais ao final do ano. Faça uma limpa!",
  "Pague a si mesmo primeiro: Assim que receber, transfira uma quantia diretamente para investimentos antes de gastar."
];

const agentThoughts = [
  "Auditando padrões de transação no banco de dados local...",
  "Calculando saldo projetado utilizando regressão linear simples nos logs de gastos...",
  "Analisando distribuição de categorias. Alerta: Lazer e Alimentação representam a maior fatia.",
  "Verificando velocidade de poupança acumulada em comparação à meta de economia de R$ {goal}...",
  "Calculando risco de endividamento baseado na taxa de queima (Burn Rate) atual...",
  "Rodando simulação de Monte Carlo para estimar saldo final em 6 meses com variação padrão..."
];

let expensesChart = null;
let agentLoopInterval = null;

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  loadData();
  initTheme();
  setupEventListeners();
  setupVoiceSimulation();
  setupSliderListeners();
  updateDashboard();
  initChat();
  
  // Start the Brain Synaptic Mind canvas
  initCognitiveCanvas();
  
  // Start the Vibe Autonomous Cognitive Engine Loop
  startAgentEngine();
});

// Load state from localStorage or seed
function loadData() {
  const savedState = localStorage.getItem('vibe_finance_state_v2');
  if (savedState) {
    try {
      state = JSON.parse(savedState);
      // Ensure simulations block is initialized
      if (!state.simulations) {
        state.simulations = { salaryMultiplier: 1.0, extraExpense: 0, emergencyCount: 0, inflationRate: 0 };
      } else {
        if (state.simulations.inflationRate === undefined) state.simulations.inflationRate = 0;
      }
      // Ensure budgets block is initialized
      if (!state.budgets) {
        state.budgets = {
          'Alimentação': 600.00,
          'Transporte': 300.00,
          'Lazer': 400.00,
          'Saúde': 300.00,
          'Educação': 500.00,
          'Outros': 300.00
        };
      }
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
  state.simulations = {
    salaryMultiplier: 1.0,
    extraExpense: 0,
    emergencyCount: 0,
    inflationRate: 0
  };
  state.budgets = {
    'Alimentação': 600.00,
    'Transporte': 300.00,
    'Lazer': 400.00,
    'Saúde': 300.00,
    'Educação': 500.00,
    'Outros': 300.00
  };
  saveState();
}

function saveState() {
  localStorage.setItem('vibe_finance_state_v2', JSON.stringify(state));
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
  updateChart();
  logToTerminal(`Mudança de tema do sistema de UI executada para: [${state.theme.toUpperCase()}]`, 'system');
}

/* ==========================================================================
   EVENT LISTENERS Setup
   ========================================================================== */
function setupEventListeners() {
  // Theme toggle
  document.getElementById('theme-toggle').addEventListener('click', toggleTheme);

  // Reset database
  document.getElementById('reset-btn').addEventListener('click', () => {
    if (confirm('Tem certeza de que deseja resetar todas as suas transações, dados e cenários?')) {
      seedDefaultData();
      updateDashboard();
      initChat(true); // Restart chat history
      logToTerminal("Banco de dados local limpo. Parâmetros reiniciados para padrão de fábrica.", "audit");
      saveState();
      triggerAutonomousAction("Reset de Dados executado pelo usuário. Iniciando novos cálculos de projeção.");
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
      triggerAutonomousAction(`Meta de economia mensal alterada para R$ ${value.toFixed(2)}. Reavaliando probabilidade de alcance.`);
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

  // Setup Simulator Buttons
  setupSimulationListeners();
}

/* ==========================================================================
   SCENARIO SIMULATOR ACTIONS
   ========================================================================== */
function setupSimulationListeners() {
  const simEmergency = document.getElementById('sim-emergency-btn');
  const simClear = document.getElementById('sim-clear-btn');

  if (simEmergency) {
    simEmergency.addEventListener('click', () => {
      state.simulations.emergencyCount++;
      
      // Create a simulated transaction
      const emergencyTrans = {
        id: 'sim-e-' + Date.now(),
        description: `[SIMULADO] Despesa de Emergência #${state.simulations.emergencyCount}`,
        amount: 600.00,
        type: 'expense',
        category: 'Saúde',
        date: new Date().toISOString()
      };
      
      state.transactions.push(emergencyTrans);
      saveState();
      logToTerminal(`CENÁRIO ATIVADO: Despesa médica emergencial simulada de R$ 600,00 anotada.`, "audit");
      updateDashboard();
      triggerAutonomousAction("Despesa médica de emergência de R$ 600,00 aplicada. Recalculando velocidade de caixa.");
      updateActiveSimBadge();
    });
  }

  if (simClear) {
    simClear.addEventListener('click', () => {
      // Filter out simulated transactions
      state.transactions = state.transactions.filter(t => !t.id.startsWith('sim-e-'));
      state.simulations = {
        salaryMultiplier: 1.0,
        extraExpense: 0,
        emergencyCount: 0,
        inflationRate: 0
      };
      saveState();
      logToTerminal("CENÁRIOS LIMPOS: Sliders, despesas simuladas e multiplicadores reiniciados.", "system");
      
      updateDashboard();
      triggerAutonomousAction("Redefinindo projeções financeiras para valores reais. Processando...");
      updateActiveSimBadge();
    });
  }
}

function updateActiveSimBadge() {
  const badge = document.getElementById('active-sim-badge');
  const list = document.getElementById('active-sim-list');
  if (!badge || !list) return;

  const sims = [];
  
  if (state.simulations.salaryMultiplier > 1.0) {
    const pct = Math.round((state.simulations.salaryMultiplier - 1.0) * 100);
    sims.push(`Salário (+${pct}%)`);
  }
  if (state.simulations.extraExpense > 0) {
    sims.push(`Custo Extra (+R$ ${state.simulations.extraExpense.toFixed(0)})`);
  }
  if (state.simulations.inflationRate > 0) {
    sims.push(`Inflação (+${state.simulations.inflationRate}%)`);
  }
  if (state.transactions.some(t => t.id.startsWith('sim-e-'))) {
    sims.push(`Despesa Emergencial`);
  }

  if (sims.length > 0) {
    badge.style.display = 'block';
    list.innerText = sims.join(', ');
  } else {
    badge.style.display = 'none';
  }
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

  // Render lists and charts
  renderTransactions();
  renderCategoryBudgets();
  updateChart();
  updateActiveSimBadge();
  syncSlidersUI();

  // Run autonomous computations for projections immediately
  recalculateProjections(balanceTotal, incomeTotal, expensesTotal);

  // Create/recreate Icons
  lucide.createIcons();
}

function renderTransactions() {
  const listEl = document.getElementById('transactions-list');
  listEl.innerHTML = '';

  const sorted = [...state.transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

  if (sorted.length === 0) {
    listEl.innerHTML = `<li class="no-data" style="padding: 20px;"><p style="font-size: 0.75rem; color: var(--text-muted)">Nenhuma transação cadastrada.</p></li>`;
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
    logToTerminal(`Transação excluída: ${deleted.description} de R$ ${deleted.amount.toFixed(2)}.`, "audit");
    triggerAutonomousAction(`Transação removida. Recalculando integridade dos planos e projeções de longo prazo.`);
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

  const colorMap = {
    'Alimentação': '#ef4444',
    'Transporte': '#3b82f6',
    'Lazer': '#f59e0b',
    'Saúde': '#10b981',
    'Educação': '#8b5cf6',
    'Outros': '#6b7280'
  };

  const chartColors = chartLabels.map(l => colorMap[l] || '#ec4899');
  const textColor = state.theme === 'dark' ? '#f8fafc' : '#0f172a';
  const borderColor = state.theme === 'dark' ? '#0a0e1c' : '#ffffff';

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
              boxWidth: 8,
              font: {
                family: 'Inter',
                size: 9
              },
              color: textColor,
              padding: 6
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
   VIBE COGNITIVE ENGINE (AUTONOMOUS LOOP & SCENARIOS)
   ========================================================================== */
function startAgentEngine() {
  logToTerminal("Iniciando Vibe Cognitive Engine...", "system");
  logToTerminal("Status da Cognição: ACTIVE. Lendo banco de dados de transações...", "system");
  
  // Set a periodic action loop (runs every 6 seconds)
  agentLoopInterval = setInterval(() => {
    runAutonomousAuditCycle();
  }, 6000);

  // Run immediately once
  runAutonomousAuditCycle();
}

function logToTerminal(message, type = 'system') {
  const terminal = document.getElementById('agent-terminal');
  if (!terminal) return;

  const timestamp = new Date().toLocaleTimeString('pt-BR');
  const logEl = document.createElement('p');

  if (type === 'system') {
    logEl.className = 'terminal-system-log';
    logEl.innerHTML = `&gt; [${timestamp}] [SYS] ${message}`;
  } else if (type === 'audit') {
    logEl.className = 'terminal-audit-log';
    logEl.innerHTML = `&gt; [${timestamp}] [AUDIT] <span style="color: var(--danger-text)">⚠ ${message}</span>`;
  } else {
    logEl.innerHTML = `&gt; [${timestamp}] [AGENTE] ${message}`;
  }

  terminal.appendChild(logEl);
  terminal.scrollTop = terminal.scrollHeight;
  
  // Keep logs to a maximum of 40 lines
  while (terminal.children.length > 40) {
    terminal.children[0].remove();
  }
}

function updateThoughtBubble(thought) {
  const thoughtBubble = document.getElementById('agent-thought-bubble');
  if (thoughtBubble) {
    // Simple fade transition by temporary class
    thoughtBubble.style.opacity = 0.5;
    setTimeout(() => {
      thoughtBubble.innerHTML = thought;
      thoughtBubble.style.opacity = 1;
    }, 200);
  }
}

// Recalculates 1m, 3m and 6m projections dynamically
function recalculateProjections(currentBalance, baseIncome, baseExpense) {
  // Pull monthly income and expense estimates based on recorded transactions
  let monthlyIncome = 0;
  let monthlyExpense = 0;

  state.transactions.forEach(t => {
    // If it's a simulated transaction, we don't count it as recurring monthly income/expense base
    if (t.id.startsWith('sim-e-')) return;
    
    if (t.type === 'income') {
      // In this concept, we estimate monthly salary based on 'Salário' category or total income
      // Let's take the sum of 'Salário' category as the recurring salary base, or default to total income if none
      if (t.category === 'Salário') monthlyIncome += t.amount;
    } else {
      // For expenses, we assume everything recorded is typical monthly expense or sum them
      // Let's divide by the span or estimate a recurring expenditure rate. We can assume all expenses are monthly base
      monthlyExpense += t.amount;
    }
  });

  // Fallbacks in case values are zero, to make projections interesting
  if (monthlyIncome === 0) monthlyIncome = baseIncome || 1200; 
  if (monthlyExpense === 0) monthlyExpense = baseExpense || 500;

  // Apply Simulation modifiers
  const simulatedMonthlyIncome = monthlyIncome * state.simulations.salaryMultiplier;
  const inflationMultiplier = 1.0 + (state.simulations.inflationRate || 0) / 100.0;
  const simulatedMonthlyExpense = (monthlyExpense + state.simulations.extraExpense) * inflationMultiplier;

  // Projections: Balance + (Income - Expense) * Months
  const netMonthly = simulatedMonthlyIncome - simulatedMonthlyExpense;

  const proj1m = currentBalance + netMonthly * 1;
  const proj3m = currentBalance + netMonthly * 3;
  const proj6m = currentBalance + netMonthly * 6;

  // Update UI Elements
  updateProjectionValue('proj-1m', proj1m);
  updateProjectionValue('proj-3m', proj3m);
  updateProjectionValue('proj-6m', proj6m);
}

function updateProjectionValue(elementId, value) {
  const el = document.getElementById(elementId);
  if (!el) return;

  el.innerText = formatCurrency(value);
  if (value >= 0) {
    el.style.color = 'var(--success-text)';
  } else {
    el.style.color = 'var(--danger-text)';
  }
}

// Forces the agent to think and act immediately (e.g. after transaction addition)
function triggerAutonomousAction(triggerReason) {
  const statusEl = document.getElementById('engine-status');
  if (statusEl) {
    statusEl.innerText = "STATUS: COGNITION ACTIVE (PENSANDO)";
    statusEl.style.color = "var(--accent)";
  }

  logToTerminal(`Gatilho: ${triggerReason}`, 'system');
  
  setTimeout(() => {
    runAutonomousAuditCycle();
    if (statusEl) {
      statusEl.innerText = "STATUS: COGNITION ACTIVE";
      statusEl.style.color = "var(--cyber-neon)";
    }
  }, 1000);
}

// Periodic check of state, prints reports to terminal and changes thoughts
function runAutonomousAuditCycle() {
  // 1. Choose a random agent thought to display
  let randomThought = agentThoughts[Math.floor(Math.random() * agentThoughts.length)];
  randomThought = randomThought.replace('{goal}', state.goal.toFixed(0));
  updateThoughtBubble(randomThought);

  // 2. Compute state statistics
  let totalIncome = 0;
  let totalExpense = 0;
  const categories = {};

  state.transactions.forEach(t => {
    if (t.type === 'income') {
      totalIncome += t.amount;
    } else {
      totalExpense += t.amount;
      categories[t.category] = (categories[t.category] || 0) + t.amount;
    }
  });

  const balance = totalIncome - totalExpense;

  // 3. Log actions to terminal
  logToTerminal("Varredura cíclica do balancete executada com sucesso.", "system");
  logToTerminal(`Transações analisadas: ${state.transactions.length}. Saldo líquido corrente: R$ ${balance.toFixed(2)}`, "system");

  // 4. Autonomous Auditing / Anomaly Detection Warnings
  if (totalExpense > 0 && totalIncome > 0) {
    const expenseRatio = totalExpense / totalIncome;
    if (expenseRatio > 0.85) {
      logToTerminal(`Alerta de Risco: Taxa de despesa está em ${(expenseRatio*100).toFixed(0)}% da receita. Margem de segurança crítica!`, "audit");
      updateThoughtBubble("ATENÇÃO: Recomendo frear despesas de Lazer imediatamente. Risco de deficit de fluxo de caixa.");
    }
  }

  // Anomaly: category ratio alert (e.g. Food taking more than 45% of total expenses)
  if (totalExpense > 0) {
    for (const [cat, value] of Object.entries(categories)) {
      if (cat !== 'Salário' && cat !== 'Outros') {
        const catRatio = value / totalExpense;
        if (catRatio > 0.40) {
          logToTerminal(`Alerta de Categoria: Gastos em [${cat}] representam ${(catRatio*100).toFixed(0)}% das despesas totais.`, "audit");
          updateThoughtBubble(`Anomalia detectada: Concentração excessiva em **${cat}**. Vamos otimizar isso?`);
        }
      }
    }
  }

  // Savings goal feedback
  if (state.goal > 0) {
    const currentSaved = Math.max(0, balance);
    const speed = currentSaved / state.goal;
    if (speed >= 1.0) {
      logToTerminal("Meta de economia batida. Projeção de excedente financeiro estabelecida.", "system");
    } else if (speed < 0.5 && balance > 0) {
      logToTerminal(`Velocidade de economia em ${(speed*100).toFixed(0)}%. Ritmo abaixo do planejado para bater a meta.`, "system");
    }
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
    addVibeMessage(`Olá! Sou o **Vibe**, seu parceiro com **Motor de IA Autônomo** integrado. 🤖💸

Estou monitorando suas transações em tempo real no painel ao lado. Registre seus gastos escrevendo em linguagem natural e veja como meu console cognitivo recalcula suas projeções!

Exemplos:
* *“Ganhei 4000 de salário hoje”*
* *“Paguei R$ 120 de luz”*
* *“Comprei pizza por R$ 50”*

Experimente também os cenários de simulação rápida!`);
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

function addVibeMessage(markdownText) {
  const chatHistory = document.getElementById('chat-history');
  
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
  }, 750);
}

function scrollToBottom() {
  const chatHistory = document.getElementById('chat-history');
  chatHistory.scrollTop = chatHistory.scrollHeight;
}

/* ==========================================================================
   NLP SIMULATOR (NATURAL LANGUAGE PROCESSING)
   ========================================================================== */
function processUserPhrase(phrase) {
  const clean = phrase.toLowerCase().trim();
  
  // Greetings
  const greetings = ['oi', 'ola', 'olá', 'bom dia', 'boa tarde', 'boa noite', 'e ai', 'eae', 'hello'];
  if (greetings.some(g => clean === g || clean.startsWith(g + ' '))) {
    addVibeMessage("Olá! Meu motor autônomo está ativo e pronto. O que quer registrar hoje?");
    return;
  }

  // Help requests
  const helpKeywords = ['ajuda', 'ajudar', 'como funciona', 'comandos', 'comando', 'oque fazer', 'o que fazer'];
  if (helpKeywords.some(k => clean.includes(k))) {
    addVibeMessage(`Escreva o que aconteceu em linguagem natural! Exemplos:
* **"recebi 300 de freela"** (Adiciona Receita de R$ 300 em Salário)
* **"gastei 80 no restaurante"** (Adiciona Despesa de R$ 80 em Alimentação)

Para receber uma dica de finanças, digite **"dica"**.`);
    return;
  }

  // Tips request
  const tipKeywords = ['dica', 'dicas', 'economia', 'economizar', 'conselho', 'poupanca', 'poupança'];
  if (tipKeywords.some(k => clean.includes(k))) {
    const randomIndex = Math.floor(Math.random() * financialTips.length);
    const randomTip = financialTips[randomIndex];
    addVibeMessage(`Conselho financeiro do Vibe: 💡\n\n${randomTip}`);
    return;
  }

  // Try parsing numbers
  const amountRegex = /(?:r\$\s*)?(\d+(?:[\.,]\d{2})?)/i;
  const match = clean.match(amountRegex);

  if (!match) {
    addVibeMessage(`Não entendi o valor monetário. 🤔
    
Tente: *"gastei 25 no uber"* ou *"recebi 100 de presente"*.`);
    return;
  }

  let amountStr = match[1].replace(',', '.');
  const amount = parseFloat(amountStr);

  if (isNaN(amount) || amount <= 0) {
    addVibeMessage("Por favor, digite um valor monetário válido acima de zero.");
    return;
  }

  // Determine type
  let type = 'expense';
  const incomeKeywords = ['recebi', 'ganhei', 'salario', 'salário', 'pix de entrada', 'renda', 'recebimento', 'freela', 'faturamento', 'deposito', 'depósito'];
  const expenseKeywords = ['gastei', 'paguei', 'comprei', 'custa', 'custou', 'despesa', 'debito', 'débito', 'perdi', 'transferi'];

  if (incomeKeywords.some(kw => clean.includes(kw))) {
    type = 'income';
  } else if (expenseKeywords.some(kw => clean.includes(kw))) {
    type = 'expense';
  } else {
    if (clean.includes('salario') || clean.includes('salário') || clean.includes('freela')) {
      type = 'income';
    }
  }

  // Determine Category
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

  if (type === 'income' && category === 'Outros') {
    if (clean.includes('salário') || clean.includes('salario')) {
      category = 'Salário';
    }
  } else if (type === 'expense' && category === 'Salário') {
    category = 'Outros';
  }

  // Extract description
  let description = phrase;
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
  if (descClean) {
    description = descClean.charAt(0).toUpperCase() + descClean.slice(1);
  } else {
    description = type === 'income' ? 'Receita Adicional' : `Gasto com ${category}`;
  }

  const newTransaction = {
    id: 't-' + Date.now(),
    description: description,
    amount: amount,
    type: type,
    category: category,
    date: new Date().toISOString()
  };

  state.transactions.push(newTransaction);
  saveState();
  updateDashboard();

  // Create Vibe response
  const emoji = categoryIcons[category] || '🏷️';
  const typeText = type === 'income' ? 'receita' : 'despesa';
  
  let vibeResponse = `**Registrado com sucesso!** ${emoji}\n\n`;
  vibeResponse += `* **Descrição**: ${description}\n`;
  vibeResponse += `* **Categoria**: ${category}\n`;
  vibeResponse += `* **Valor**: ${formatCurrency(amount)}\n\n`;

  if (type === 'income') {
    vibeResponse += `Receita computada! Meu motor de IA atualizou suas projeções futuras no painel lateral.`;
  } else {
    vibeResponse += `Gasto anotado. Acompanhe a auditoria do meu motor no console de logs!`;
  }

  addVibeMessage(vibeResponse);
  
  // Trigger cognitive audit action
  triggerAutonomousAction(`Nova transação registrada pelo chat: ${description} (${formatCurrency(amount)})`);
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

function parseMarkdown(text) {
  let html = escapeHTML(text);
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  html = html.split('\n').map(line => {
    if (line.trim().startsWith('* ')) {
      return `<li>${line.trim().substring(2)}</li>`;
    }
    return line;
  }).join('\n');
  
  html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
  
  html = html.split('\n\n').map(p => {
    if (p.trim().startsWith('<ul>') || p.trim().startsWith('<li>')) return p;
    return `<p>${p.replace(/\n/g, '<br>')}</p>`;
  }).join('');

  return html;
}

/* ==========================================================================
   NEW GRAPHICAL ENGINE & INTERACTIVE LOGIC ADDITIONS
   ========================================================================== */

// Voice Recognition simulation
const voicePhrases = [
  "Ganhei 4500 reais de salário ontem",
  "Gastei 120 com almoço no restaurante",
  "Paguei 35 reais de corrida de Uber",
  "Recebi 400 reais de freela extra",
  "Gastei 250 de supermercado semanal",
  "Paguei 90 reais de mensalidade do curso",
  "Comprei ingressos de cinema por 65 reais",
  "Gastei 150 na farmácia com remédios",
  "Paguei 200 reais de conta de luz"
];

let voiceRecordingTimeout = null;

function setupVoiceSimulation() {
  const voiceBtn = document.getElementById('voice-btn');
  const voiceOverlay = document.getElementById('voice-overlay');
  const cancelVoiceBtn = document.getElementById('cancel-voice-btn');
  const voiceTranscription = document.getElementById('voice-transcription');

  if (!voiceBtn || !voiceOverlay) return;

  voiceBtn.addEventListener('click', () => {
    // Open voice simulation overlay
    voiceOverlay.style.display = 'flex';
    voiceTranscription.innerText = '"..."';
    logToTerminal("Iniciando gravação de entrada de voz simulada.", "system");
    updateCognitiveVisualizerSpeed(true);

    // Simulate sound wave processing and transcription
    let step = 0;
    const phrase = voicePhrases[Math.floor(Math.random() * voicePhrases.length)];
    const words = phrase.split(' ');
    let currentText = '';
    
    function streamWords() {
      if (step < words.length) {
        currentText += (step === 0 ? '' : ' ') + words[step];
        voiceTranscription.innerText = `"${currentText}..."`;
        step++;
        voiceRecordingTimeout = setTimeout(streamWords, 300 + Math.random() * 150);
      } else {
        voiceTranscription.innerText = `"${phrase}"`;
        voiceTranscription.style.color = 'var(--success-text)';
        
        voiceRecordingTimeout = setTimeout(() => {
          voiceOverlay.style.display = 'none';
          voiceTranscription.style.color = 'var(--text-primary)';
          addUserMessage(phrase);
          processUserPhrase(phrase);
          updateCognitiveVisualizerSpeed(false);
        }, 1000);
      }
    }
    
    voiceRecordingTimeout = setTimeout(streamWords, 700);
  });

  cancelVoiceBtn.addEventListener('click', () => {
    if (voiceRecordingTimeout) clearTimeout(voiceRecordingTimeout);
    voiceOverlay.style.display = 'none';
    voiceTranscription.style.color = 'var(--text-primary)';
    logToTerminal("Entrada de voz cancelada pelo usuário.", "system");
    updateCognitiveVisualizerSpeed(false);
  });
}

// Synaptic network canvas simulation
let canvasParticles = [];
let canvasAnimationId = null;
let particleSpeedMultiplier = 0.8;

function getCSSColor(varName, fallback) {
  const val = getComputedStyle(document.documentElement).getPropertyValue(varName).trim();
  return val || fallback;
}

function initCognitiveCanvas() {
  const canvas = document.getElementById('cognitive-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  function resizeCanvas() {
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }
  
  resizeCanvas();
  window.removeEventListener('resize', resizeCanvas);
  window.addEventListener('resize', resizeCanvas);
  
  canvasParticles = [];
  const particleCount = 24;
  for (let i = 0; i < particleCount; i++) {
    canvasParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      radius: Math.random() * 1.8 + 0.8
    });
  }
  
  function animate() {
    if (!document.getElementById('cognitive-canvas')) return; // Exit if unmounted
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const primaryColor = getCSSColor('--primary', '#8b5cf6');
    const cyberColor = getCSSColor('--cyber-neon', '#06b6d4');
    const connectionColor = getCSSColor('--panel-border', 'rgba(255, 255, 255, 0.08)');
    
    // Draw connection lines
    ctx.lineWidth = 0.6;
    for (let i = 0; i < canvasParticles.length; i++) {
      for (let j = i + 1; j < canvasParticles.length; j++) {
        const dx = canvasParticles[i].x - canvasParticles[j].x;
        const dy = canvasParticles[i].y - canvasParticles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < 60) {
          const alpha = (1 - dist / 60) * 0.22;
          ctx.strokeStyle = connectionColor.includes('rgba') ? connectionColor : `rgba(139, 92, 246, ${alpha})`;
          ctx.beginPath();
          ctx.moveTo(canvasParticles[i].x, canvasParticles[i].y);
          ctx.lineTo(canvasParticles[j].x, canvasParticles[j].y);
          ctx.stroke();
        }
      }
    }
    
    // Draw particles
    canvasParticles.forEach((p, idx) => {
      p.x += p.vx * particleSpeedMultiplier;
      p.y += p.vy * p.radius * 0.5 * particleSpeedMultiplier;
      
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      
      ctx.fillStyle = idx % 2 === 0 ? primaryColor : cyberColor;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    
    canvasAnimationId = requestAnimationFrame(animate);
  }
  
  if (canvasAnimationId) cancelAnimationFrame(canvasAnimationId);
  animate();
}

function updateCognitiveVisualizerSpeed(isThinking) {
  particleSpeedMultiplier = isThinking ? 3.8 : 0.8;
}

// Category Budgets Logic
function renderCategoryBudgets() {
  const budgetsList = document.getElementById('budgets-list');
  if (!budgetsList) return;
  
  budgetsList.innerHTML = '';
  
  const categoryLimits = state.budgets || {
    'Alimentação': 600.00,
    'Transporte': 300.00,
    'Lazer': 400.00,
    'Saúde': 300.00,
    'Educação': 500.00,
    'Outros': 300.00
  };

  const expensesPerCategory = {};
  state.transactions.forEach(t => {
    if (t.type === 'expense') {
      expensesPerCategory[t.category] = (expensesPerCategory[t.category] || 0) + t.amount;
    }
  });

  const activeExpenseCategories = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Outros'];

  activeExpenseCategories.forEach(cat => {
    const limit = categoryLimits[cat] || 300.00;
    const rawSpent = expensesPerCategory[cat] || 0;
    
    // Inflate budget spent by simulated inflation Rate
    const inflationMultiplier = 1.0 + (state.simulations.inflationRate || 0) / 100.0;
    const spent = rawSpent * inflationMultiplier;
    
    const percentage = Math.min(100, Math.round((spent / limit) * 100));
    
    let colorClass = 'normal';
    let statusText = 'Orçamento sob controle';
    
    if (percentage >= 100) {
      colorClass = 'danger';
      statusText = 'Limite excedido! Reduzir imediatamente.';
    } else if (percentage >= 75) {
      colorClass = 'warning';
      statusText = 'Atenção: Consumo elevado.';
    } else if (percentage >= 40) {
      statusText = 'Consumo moderado';
    }
    
    const budgetItem = document.createElement('div');
    budgetItem.className = 'budget-item';
    
    const emoji = categoryIcons[cat] || '🏷️';
    
    budgetItem.innerHTML = `
      <div class="budget-info">
        <span class="budget-meta">${emoji} ${cat}</span>
        <span class="budget-percentage">${percentage}% (${formatCurrency(spent)} / ${formatCurrency(limit)})</span>
      </div>
      <div class="budget-bar-bg">
        <div class="budget-bar-fill ${colorClass}" style="width: ${percentage}%"></div>
      </div>
      <span class="budget-status-text">${statusText}</span>
    `;
    budgetsList.appendChild(budgetItem);
  });
}

// Slider Scenario Builder Events
function setupSliderListeners() {
  const sliderSalary = document.getElementById('slider-salary');
  const sliderRent = document.getElementById('slider-rent');
  const sliderInflation = document.getElementById('slider-inflation');

  if (!sliderSalary) return;

  // Track inputs
  sliderSalary.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.simulations.salaryMultiplier = 1.0 + val / 100.0;
    document.getElementById('val-sim-salary').innerText = `+${val}%`;
    saveState();
    updateDashboard();
    updateCognitiveVisualizerSpeed(true);
    debouncedTriggerAction(`Aumento salarial reajustado via painel para +${val}%`);
  });

  sliderRent.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.simulations.extraExpense = val;
    document.getElementById('val-sim-rent').innerText = formatCurrency(val);
    saveState();
    updateDashboard();
    updateCognitiveVisualizerSpeed(true);
    debouncedTriggerAction(`Aumento fixo de despesas simulado para ${formatCurrency(val)}`);
  });

  sliderInflation.addEventListener('input', (e) => {
    const val = parseInt(e.target.value);
    state.simulations.inflationRate = val;
    document.getElementById('val-sim-inflation').innerText = val === 0 ? 'Estável (0%)' : `Risco de +${val}%`;
    saveState();
    updateDashboard();
    updateCognitiveVisualizerSpeed(true);
    debouncedTriggerAction(`Fator de risco inflacionário geral reajustado para +${val}%`);
  });
}

// Sync values from state to UI inputs
function syncSlidersUI() {
  const sliderSalary = document.getElementById('slider-salary');
  const sliderRent = document.getElementById('slider-rent');
  const sliderInflation = document.getElementById('slider-inflation');

  const valSalary = document.getElementById('val-sim-salary');
  const valRent = document.getElementById('val-sim-rent');
  const valInflation = document.getElementById('val-sim-inflation');

  if (sliderSalary) {
    const pct = Math.round((state.simulations.salaryMultiplier - 1.0) * 100);
    if (parseInt(sliderSalary.value) !== pct) sliderSalary.value = pct;
    if (valSalary) valSalary.innerText = `+${pct}%`;
  }

  if (sliderRent) {
    const rent = state.simulations.extraExpense || 0;
    if (parseInt(sliderRent.value) !== rent) sliderRent.value = rent;
    if (valRent) valRent.innerText = formatCurrency(rent);
  }

  if (sliderInflation) {
    const infl = state.simulations.inflationRate || 0;
    if (parseInt(sliderInflation.value) !== infl) sliderInflation.value = infl;
    if (valInflation) valInflation.innerText = infl === 0 ? 'Estável (0%)' : `Risco de +${infl}%`;
  }
}

// Debounce terminal outputs to prevent spamming
let triggerActionTimeout = null;
function debouncedTriggerAction(message) {
  if (triggerActionTimeout) clearTimeout(triggerActionTimeout);
  triggerActionTimeout = setTimeout(() => {
    triggerAutonomousAction(message);
    updateCognitiveVisualizerSpeed(false);
  }, 750);
}

