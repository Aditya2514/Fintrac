/**
 * Real AI Service powered by Google Gemini REST API.
 */

const getApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || localStorage.getItem('gemini_api_key');
};

/**
 * Shared helper: aggregates all financial data into a structured context object.
 * Used by both chatWithAdvisor and analyzeExpenses to avoid duplication.
 */
export const buildFinancialContext = (transactions, budget) => {
  const incomes = transactions.filter(t => t.type === 'income');
  const expenses = transactions.filter(t => t.type === 'expense');

  const totalIncome = incomes.reduce((s, t) => s + t.amount, 0);
  const totalExpenses = expenses.reduce((s, t) => s + t.amount, 0);
  const totalSavings = expenses
    .filter(t => t.category === 'Saving & Debts')
    .reduce((s, t) => s + t.amount, 0);

  const incomeCats = incomes.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const expenseCats = expenses.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const recurringExpenses = expenses.filter(t => t.isRecurring);
  const recurringTotal = recurringExpenses.reduce((s, t) => s + t.amount, 0);

  const catBreakdown = Object.entries(expenseCats).map(([cat, amount]) => {
    const limit = budget?.categories?.[cat] || 'No limit set';
    return `- ${cat}: Spent $${amount.toFixed(2)} (Budget Limit: ${limit === 'No limit set' ? limit : '$' + limit})`;
  }).join('\n');

  const incSummary = Object.entries(incomeCats).map(([c, v]) => `- ${c}: $${v}`).join('\n');
  const expSummary = Object.entries(expenseCats).map(([c, v]) => `- ${c}: $${v}`).join('\n');
  const budgetSummary = Object.entries(budget.categories || {}).map(([cat, limit]) => `- ${cat}: $${limit} limit`).join('\n');

  return {
    totalIncome,
    totalExpenses,
    totalSavings,
    netBalance: totalIncome - totalExpenses,
    incomeCats,
    expenseCats,
    recurringTotal,
    catBreakdown,
    incSummary,
    expSummary,
    budgetSummary,
    hasExpenses: expenses.length > 0,
  };
};

const callGeminiAPI = async (prompt) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API_KEY_MISSING');

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.7 }
    })
  });

  if (!response.ok) throw new Error(`API Request Failed: ${response.statusText}`);

  const data = await response.json();
  if (data.candidates && data.candidates.length > 0) {
    let text = data.candidates[0].content.parts.map(p => p.text).join('');
    return text.replace(/</g, '&lt;');
  }
  throw new Error('Invalid response payload from Gemini');
};

export const chatWithAdvisor = async (history, transactions, budget) => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('API_KEY_MISSING');

  const ctx = buildFinancialContext(transactions, budget);

  const systemInstruction = `
You are a highly sought-after, elite personal financial advisor. 
You are currently chatting directly with your client in a real-time conversational interface.
Be conversational, incredibly helpful, empathetic, and exceptionally precise. 

Always refer to their live financial data below to give personalized advice:
- Net Cash Flow: $${ctx.netBalance}
- Total Gross Income: $${ctx.totalIncome}
- Total Gross Expenses: $${ctx.totalExpenses}
- Total Emergency Savings Tracked: $${ctx.totalSavings}
- Global Target Budget: ${budget.amount > 0 ? '$'+budget.amount : 'Not specified'}

Income by Category:
${ctx.incSummary || 'None'}

Expenses by Category:
${ctx.expSummary || 'None'}

Budget Limits:
${ctx.budgetSummary || 'None specified'}

Use markdown formatting (bolding, lists) to make your chat responses highly readable.
Do not output a static report unless requested; reply naturally to their chat messages using this precise data context.
`;

  const formattedHistory = history.map(msg => ({
    role: msg.role === 'model' ? 'model' : 'user',
    parts: [{ text: msg.content }]
  }));

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: systemInstruction }] },
      contents: formattedHistory,
      generationConfig: { temperature: 0.7 }
    })
  });

  if (!response.ok) throw new Error(`API Request Failed: ${response.statusText}`);

  const data = await response.json();
  if (data.candidates && data.candidates.length > 0) {
    let text = data.candidates[0].content.parts.map(p => p.text).join('');
    return text.replace(/</g, '&lt;');
  }
  throw new Error('Invalid response payload from Gemini');
};

export const analyzeExpenses = async (transactions, budget) => {
  const ctx = buildFinancialContext(transactions, budget);

  if (!ctx.hasExpenses) {
    return "Not enough expense data to generate a deep analysis yet. Start tracking your spending!";
  }

  const prompt = `
You are a highly precise financial auditor evaluating a client's expense portfolio. 
Here is their comprehensive expense breakdown by category:
${ctx.catBreakdown}

They also have $${ctx.recurringTotal.toFixed(2)} tied up in fixed recurring subscriptions.

Run a highly detailed, comprehensive expense analysis and output a beautifully formatted, highly readable markdown report. You MUST follow this strict structural layout:

### 1. Category Audit
For EVERY SINGLE category listed above, create a highly readable section formatted EXACTLY like this:
#### [Emoji] **[Category Name]** (Spent: $[X] / Limit: $[Y])
> [Provide 2-3 sentences of deep, brutal analysis. Explain exactly why this spending behavior is good or bad. Conclude with a highly specific, actionable tip to optimize costs over the next 30 days.]

### 2. Overall Trajectory Summary
Looking at the macro weight of their categories and recurring cash burn, summarize their overall spending efficiency. Identify the absolute biggest systematic leak in their finances and provide one brutal, mathematically anchored directive they need to execute immediately to improve their savings rate.

Ensure your output strictly utilizes correct Markdown syntax (bolding, blockquotes, headings).
`;

  return await callGeminiAPI(prompt);
};
