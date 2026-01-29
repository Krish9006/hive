# 🐝 Hive Dashboard: The Control Plane for Autonomous Agents

> **"Agents should not be black boxes."**

The **Hive Dashboard** is the official observability and metrics platform for the Aden Agent Framework. It transforms the fleeting, text-based logs of an agent run into a persistent, visual, and interactive narrative.

![Dashboard Preview](/path/to/screenshot.png)

## 🎯 Why This Dashboard? (The Problem)

Building autonomous agents is hard. Debugging them via CLI logs is harder.
When an agent fails, you typically see a wall of text. You don't see:
*   *What* alternatives did it consider?
*   *Why* did it choose option A over option B?
*   *How* did it recover from that tool error 5 steps ago?

**We built this Dashboard to solve the "Opacity Problem" in Agentic AI.**

## 🌟 Impact & Value

### 1. Build Trust with the "Thinking Cloud" 🧠
Trust is the currency of AI. To trust an agent, you need to see its brain.
*   **Cognitive Transparency**: We visualize not just the *action*, but the **decision process**.
*   **Rejection Analysis**: See the options the agent *discarded*. Often, knowing what an agent *didn't* do is as important as what it did.

### 2. Accelerate Debugging (Self-Healing Visualization) 🛡️
Hive Agents are designed to be resilient. This dashboard highlights that resilience.
*   **Recovery Badges**: Instantly spot where an agent encountered an error and self-corrected.
*   **X-Ray Mode**: One-click access to raw JSON inputs/outputs for every tool call.

### 3. Operational Visibility ⚡
*   **Cost Tracking**: Real-time estimation of token costs.
*   **Latency Analysis**: Pinpoint exactly which step is slowing down your workflow.

---

## ✨ Key Features

*   **Real-Time Sync**: Connects directly to the Hive local runtime (`~/.hive/storage`). No API server setup required.
*   **Zero-Config**: Just run `npm run dev`. If Hive is running, the Dashboard is working.
*   **Premium UX**: Designed with Framer Motion and Recharts for a fluid, modern experience.

## 🛠️ Technology Stack

*   **Framework**: [Next.js 14](https://nextjs.org/) (App Router & Server Components)
*   **Language**: JavaScript (ES6+)
*   **Styling**: Tailwind CSS + `clsx`
*   **Visualization**: Recharts (Metrics) + Framer Motion (Animations)
*   **Icons**: Lucide React

## 🚀 Getting Started

### Prerequisites
*   Node.js 18+
*   Python 3.11+ (Hive Framework)

### Installation
```bash
cd web
npm install
```

### Running the Dashboard
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

### Connecting to Real Agents
The dashboard is pre-configured to watch **Production Storage** (`~/.hive/storage/runs`).
Any agent run triggered via the Python SDK or CLI will appear here instantly.

**Simulate a Run (for testing):**
```bash
# From project root
python scripts/generate_mock_data.py
```

## 📂 Architecture

**Serverless-First Design**:
This project ignores the traditional "Database + API" layer in favor of **Direct File Access**.
*   **Why?** Agents run locally. Their logs are local.
*   **How?** Next.js Server Components read JSON logs directly from the filesystem. This ensures zero latency and absolute data truth.

---

*Contribution by [Krish gupta]for the Aden Ecosystem.*
