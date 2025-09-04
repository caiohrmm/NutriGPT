const dotenv = require('dotenv');
dotenv.config();

async function generatePlanSuggestion({ patient, preferences }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

  // Build prompt with patient data
  const age = patient.birthDate ? Math.max(0, Math.floor((Date.now() - new Date(patient.birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))) : null;
  const prompt = [
    'Gere um plano alimentar estruturado em JSON para 1 dia com 5-6 refeições, com campos: meals[ { time, title, items[], calories?, macros? } ], totalCalories, macros { protein, carbs, fats }, e um resumo em description.',
    'IMPORTANTE: O campo "items" deve ser um array de strings simples (ex: ["Aveia 60g", "Leite 200ml"]). NÃO use objetos.',
    'Restrições: evite alergias ou restrições informadas. Unidades em gramas e ml. Evite marcas comerciais.',
    'Dados do paciente:',
    `- Idade: ${age ?? 'N/D'}`,
    `- Sexo: ${patient.sex || 'N/D'}`,
    `- Peso: ${patient.weight || 'N/D'} kg`,
    `- Altura: ${patient.height || 'N/D'} cm`,
    `- Objetivo: ${patient.goal || 'N/D'}`,
    `- Restrições/ Alergias: ${Array.isArray(patient.allergies) ? patient.allergies.join(', ') : 'N/D'}`,
    preferences?.notes ? `- Preferências: ${preferences.notes}` : '',
    'Exemplo de formato esperado:',
    '{"meals": [{"time": "08:00", "title": "Café da manhã", "items": ["Aveia 60g", "Banana 1 un"], "calories": 300, "macros": {"protein": 10, "carbs": 50, "fats": 5}}], "totalCalories": 2000, "macros": {"protein": 100, "carbs": 250, "fats": 70}, "description": "Plano equilibrado"}',
    'Responda APENAS com JSON válido e nada mais.'
  ].filter(Boolean).join('\n');

  // Fallback if no API key
  if (!apiKey) {
    console.log('No GEMINI_API_KEY or GOOGLE_API_KEY found in environment variables. Using fallback plan.');
    return buildFallbackPlan(patient);
  }

  try {
    console.log('Using AI API key (first 10 chars):', apiKey.substring(0, 10) + '...');
    console.log('AI prompt:', prompt);
    
    // Lazy require to avoid hard dependency if not installed
    // eslint-disable-next-line global-require, import/no-extraneous-dependencies
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const text = result?.response?.text?.() || '';

    console.log('AI response text:', text);
    
    const parsed = safeParseJson(text);
    console.log('Parsed AI response:', parsed);
    
    if (parsed && parsed.meals && parsed.macros) {
      const normalized = normalizePlan(parsed);
      console.log('Normalized AI plan:', normalized);
      return normalized;
    }
    console.log('AI response invalid, using fallback');
    return buildFallbackPlan(patient);
  } catch (err) {
    console.error('AI generation error:', err);
    return buildFallbackPlan(patient);
  }
}

function safeParseJson(text) {
  try {
    // Trim code fences if present
    const cleaned = String(text).trim().replace(/^```json\n?|```$/g, '');
    return JSON.parse(cleaned);
  } catch (_e) {
    return null;
  }
}

function normalizePlan(plan) {
  const meals = Array.isArray(plan.meals) ? plan.meals.map((m) => ({
    time: String(m.time || ''),
    title: String(m.title || ''),
    items: Array.isArray(m.items) ? m.items.map((i) => {
      if (typeof i === 'string') return i;
      if (typeof i === 'object' && i !== null) {
        // Try common properties that might contain the food item text
        return i.name || i.food || i.item || i.description || i.text || JSON.stringify(i);
      }
      return String(i);
    }) : [],
    calories: numberOrNull(m.calories),
    macros: {
      protein: numberOrNull(m?.macros?.protein),
      carbs: numberOrNull(m?.macros?.carbs),
      fats: numberOrNull(m?.macros?.fats),
    },
  })) : [];

  return {
    description: String(plan.description || ''),
    meals,
    totalCalories: numberOrNull(plan.totalCalories) || null,
    macros: {
      protein: numberOrNull(plan?.macros?.protein),
      carbs: numberOrNull(plan?.macros?.carbs),
      fats: numberOrNull(plan?.macros?.fats),
    },
  };
}

function numberOrNull(v) {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function buildFallbackPlan(patient) {
  return {
    description: `Sugestão inicial baseada no objetivo: ${patient.goal || 'geral'}. Ajuste conforme necessário.`,
    meals: [
      { time: '08:00', title: 'Café da manhã', items: ['Aveia 60g', 'Iogurte natural 200ml', 'Banana 1 un'], calories: 450, macros: { protein: 20, carbs: 65, fats: 12 } },
      { time: '10:30', title: 'Lanche', items: ['Maçã 1 un', 'Castanhas 30g'], calories: 250, macros: { protein: 6, carbs: 22, fats: 15 } },
      { time: '13:00', title: 'Almoço', items: ['Arroz integral 120g', 'Feijão 100g', 'Frango grelhado 150g', 'Salada variada'], calories: 700, macros: { protein: 45, carbs: 80, fats: 18 } },
      { time: '16:00', title: 'Lanche', items: ['Iogurte proteico 200ml'], calories: 180, macros: { protein: 20, carbs: 12, fats: 3 } },
      { time: '19:30', title: 'Jantar', items: ['Quinoa 100g', 'Peixe 150g', 'Legumes no vapor'], calories: 600, macros: { protein: 40, carbs: 55, fats: 16 } },
    ],
    totalCalories: 2180,
    macros: { protein: 131, carbs: 234, fats: 64 },
  };
}

module.exports = { generatePlanSuggestion };


