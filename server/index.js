const express = require('express');
const cors = require('cors');
const { Telegraf } = require('telegraf');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// --- Enhanced Database ---
// tasks will store objects with: { completions, target, expiresAt, ... }
let tasks = [];

// --- Enhanced AI Logic (OpenRouter) ---
async function parseTaskWithAI(text) {
  try {
    const prompt = `
Analyze this task request: "${text}"

Extract these fields into JSON:
- title: Short summary
- description: Full details
- reward: Amount in KAS (default 0.5)
- target_count: How many people needed? (look for "20 people", "5 testers". Default 1)
- duration_hours: How long is it open? (look for "2 days", "48 hours". Default 24 hours)

Respond ONLY with valid JSON.
`;

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "google/gemini-2.0-flash-exp:free", // fast + cheap, can swap models
        messages: [
          { role: "system", content: "You are a task extraction assistant." },
          { role: "user", content: prompt }
        ],
        temperature: 0.2,
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3001",
          "X-Title": "KaspaStream Bot"
        }
      }
    );

    const aiText = response.data.choices[0].message.content;
    const jsonMatch = aiText.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : null;

  } catch (e) {
    console.error("AI Error:", e.response?.data || e.message);

    return {
      title: text.slice(0, 50),
      description: text,
      reward: 0.5,
      target_count: 1,
      duration_hours: 24
    };
  }
}



bot.start((ctx) =>
  ctx.reply('Welcome to KaspaStream! ⚡\n\nCommands:\n/status - Check your active tasks\n\nJust type a task to create one!')
);

// 1. Status Command
bot.command('status', (ctx) => {
  const userId = ctx.from.id;
  const userTasks = tasks.filter(t => t.creatorId === userId);

  if (userTasks.length === 0) {
    return ctx.reply("You have no active tasks.");
  }

  let message = "📊 *Your Active Tasks*\n\n";

  userTasks.forEach((t, i) => {
    const timeLeft = Math.max(0, Math.ceil((t.expiresAt - Date.now()) / 3600000));
    const progress = Math.round((t.completions / t.target) * 100);

    message += `${i + 1}. *${t.title}*\n`;
    message += `   📈 Progress: ${t.completions}/${t.target} (${progress}%)\n`;
    message += `   ⏳ Expires: ${timeLeft} hours\n`;
    message += `   💰 Balance Used: ${(t.completions * t.reward).toFixed(2)} KAS\n\n`;
  });

  ctx.reply(message, { parse_mode: 'Markdown' });
});

// 2. Task Creation Handler
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  await ctx.reply('🤖 Analyzing task & setting duration...');

  const parsed = await parseTaskWithAI(text);

  if (parsed) {
    const durationHours = parsed.duration_hours || 24;
    const durationMs = durationHours * 60 * 60 * 1000;

    const newTask = {
      id: `tg_${Date.now()}`,
      creatorId: ctx.from.id, // Telegram user
      ...parsed,
      reward: parsed.reward || 0.5,
      target: parsed.target_count || 1,
      completions: 0,
      expiresAt: Date.now() + durationMs,
      status: 'pending',
      paymentAddress: `kaspa:qq${Date.now().toString(36).repeat(4).substring(0, 55)}`,
      createdAt: Date.now(),
      clientAddress: `Telegram: @${ctx.from.username || ctx.from.first_name}`
    };

    tasks.unshift(newTask);

    await ctx.reply(
      `✅ *Task Live!*\n\n` +
      `📌 *${newTask.title}*\n` +
      `🎯 Target: ${newTask.target} people\n` +
      `⏰ Duration: ${durationHours} hours\n` +
      `💰 Reward: ${newTask.reward} KAS\n\n` +
      `_Type /status to track progress_`,
      { parse_mode: 'Markdown' }
    );
  } else {
    await ctx.reply('❌ Could not parse task.');
  }
});

// --- API Endpoints ---

// GET: Serve only non-expired tasks
app.get('/tasks', (req, res) => {
  const activeTasks = tasks.filter(
    t => t.expiresAt > Date.now() && t.completions < t.target
  );
  res.json(activeTasks);
});

// POST: Report Completion (Called by React App)
app.post('/complete/:id', (req, res) => {
  const taskId = req.params.id;
  const task = tasks.find(t => t.id === taskId);

  if (task) {
    task.completions += 1;
    console.log(`Task ${taskId} completions: ${task.completions}/${task.target}`);

    // Notify Creator via Telegram
    bot.telegram.sendMessage(
      task.creatorId,
      `🎉 *Task Update: ${task.title}*\n\nA worker just completed this task!\nProgress: ${task.completions}/${task.target}`,
      { parse_mode: 'Markdown' }
    ).catch(e => console.error("Failed to msg user", e));

    res.json({ success: true });
  } else {
    res.status(404).json({ error: "Task not found" });
  }
});

// --- Start Services ---
bot.launch().then(() => console.log('🤖 Bot Started'));
app.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
