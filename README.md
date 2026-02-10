# Custom AI Chatbot

A full-stack AI chatbot application developed for a logistic company website.

**Academic Project**: Agile Software Development Module - University of Bedfordshire, 2025 Sept Intake

## 🏗️ Project Structure

```
custom-ai-chatbot/
├── admin-dashboard/    # Electron-based admin dashboard
├── api-server/         # Express.js backend API
├── chat-bubble/        # Next.js embeddable chat UI
└── packages/           # Shared packages (types, configs, etc.)
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- pnpm 10.0.0+

### Installation

```bash
# Install all dependencies
pnpm install
```

### Development

Run all applications concurrently:

```bash
pnpm dev
```

Or run individually:

```bash
pnpm dev:admin    # Admin Dashboard (Electron)
pnpm dev:api      # API Server (Express)
pnpm dev:chat     # Chat Bubble (Next.js)
```

## 📦 Build

Build all applications:

```bash
pnpm build
```

Or build individually:

```bash
pnpm build:admin
pnpm build:api
pnpm build:chat
```

## 🧹 Maintenance

```bash
pnpm lint        # Lint all projects
pnpm lint:fix    # Fix linting issues
pnpm format      # Format code with Biome
```

## 📚 Documentation

See individual project READMEs:

- [Admin Dashboard](./admin-dashboard/README.md)
- [API Server](./api-server/README.md)
- [Chat Bubble](./chat-bubble/README.md)

## 👤 Author

**Chamindu Vidyarathne**

- Email: <chamindudvidyarathne@gmail.com>

## 📄 License

MIT

```

### 4. **Root .nvmrc** (optional, for Node version management)
```

18.18.0
