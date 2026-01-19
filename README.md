<p align="center">
  <img src="11.png" alt="KaspaStream Logo" width="25%"/>
</p>

# ⚡KaspaStream: The Instant Gig Economy

KaspaStream is a real-time micro-task marketplace that lets anyone create small jobs instantly and broadcast them to workers — powered by AI parsing and Kaspa-based payments.

Instead of posting tasks manually or negotiating prices back and forth, KaspaStream allows users to describe a task in natural language, automatically generate a payment address, and publish it to a live task feed where workers can pick it up immediately.


<img width="1324" height="596" alt="image" src="https://github.com/user-attachments/assets/ce5492a3-78ba-427d-baa0-b0b573edbce6" />


<img width="1355" height="603" alt="image" src="https://github.com/user-attachments/assets/aea113c4-633d-4e05-bef6-e42b72de3a3c" />


## 🎬Demo Video

[Watch the demo on YouTube](https://youtu.be/Oo8ETimud20)


## 🚀 What Problem Does KaspaStream Solve?
Traditional gig platforms make you wait days for payouts. Crypto platforms on Bitcoin or Ethereum are too slow or expensive for small tasks.

KaspaStream changes the game. By leveraging Kaspa's BlockDAG architecture, we created a marketplace where payments aren't just fast—they are instant. Workers complete a task, AI verifies it in seconds, and money streams directly to their wallet. No escrow delays. No high gas fees. Just pure speed.

- Posting micro-tasks is slow and fragmented

- Payments require manual coordination

- Workers don’t have visibility into new tasks instantly

- Existing platforms are centralized and complex

- KaspaStream fixes this by combining:

- Natural language task creation

- Real-time task broadcasting

- Automated crypto payment generation

- A simple, fast user experience

## ✨ Key Features

1. 🧠 AI-Powered Task Creation: Don't fill out forms. Just type "I need 5 people to retweet my post for 10 KAS" and our AI parses the logic instantly.

2. 👁️ AI Vision Verification: Workers can upload screenshots as proof. Our AI analyzes the image context to verify the job was actually done.

3. 📱 Telegram Bridge: Post tasks directly from Telegram! A custom bot syncs seamlessly with the React web dashboard.

4. 💎 Real-Time Payments: The UI updates the moment a transaction hits the Kaspa mempool. No refreshing required.

5. 🎮 Worker Gamification: Earn streaks, rank up from Rank D to Rank S, and unlock earning multipliers.

## 🛠️ The Tech Stack
- Frontend: React, Vite, Tailwind CSS (Glassmorphism UI)

- Backend/Bridge: Node.js, Express, Telegraf (Telegram Bot API)

- Blockchain: Kaspa WASM SDK, RPC monitoring

- Artificial Intelligence: OpenRouter API (Google Gemini 2.0 Flash / Vision)

- State Management: React Context API + Custom Hooks

## 🚀 Installation & Setup
Follow these steps to run the full ecosystem (Frontend + Backend Bridge).

1. Prerequisites
- Node.js (v18+)

- A Telegram Bot Token (from @BotFather)

- An OpenRouter API Key

2. Clone & Install
```
git clone https://github.com/yourusername/kaspastream.git
cd kaspastream
```
### Install Frontend Dependencies
```
cd fronted
npm install
```
### Install Server Dependencies
```
cd server
npm install
cd ..
```
3. Environment Configuration
- Frontend (.env) Create a .env file in the Fronted directory:
```
VITE_OPENROUTER_API_KEY=your_openrouter_key_here
```
- Create a .env file in the server directory:
Backend (server/.env)
```
PORT=3001
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENROUTER_API_KEY=your_apikey
```
4. Running the App
You need to run two terminals simultaneously.

- Terminal 1 (The Bridge Server):
```
cd server
node index.js
```
You should see: 🚀 Bridge Server running on port 3001

- Terminal 2 (The Frontend):
```
cd fronted
npm run dev
Open your browser to http://localhost:5173
```


## 🔮 Future Roadmap
- Mainnet Integration: Switch from simulated/testnet payments to full Mainnet wallet connectivity.

- DAO Governance: Allow Rank S workers to vote on platform fees.

- Recurring Streams: Support for "subscription-based" tasks using Kaspa's high throughput.


### Contact
1. Email: ashishpatnaik2806@gmail.com
2. X account: https://x.com/ashdebugs


<div align="center">
Built with ❤️ for Kaspa by Ashish-Patnaik.
</div>

<div align="center">
Don't Forget to ⭐Star⭐ the repo
</div>

