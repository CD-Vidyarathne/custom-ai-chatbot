# Startup Chat Application - Task Breakdown

## Overview

A simplified desktop chat application with embeddable chat bubble, admin dashboard, and Node.js API. Built with ElectronJS (admin dashboard), Next.js (chat UI), and Express.js (API).

---

## 1. PROJECT SETUP & INFRASTRUCTURE

### 1.1 Repository Structure

- [ ] Initialize monorepo structure (or separate repos)
- [ ] Set up root package.json with workspace configuration
- [ ] Create directory structure:
  - `desktop-app/` (ElectronJS)
  - `chat-ui/` (Next.js)
  - `api/` (Node.js/Express)
- [ ] Set up shared TypeScript types/config package (optional)
- [ ] Configure .gitignore for all components

### 1.2 Development Environment

- [ ] Set up development scripts (dev, build, test)
- [ ] Configure environment variable management (.env files)
- [ ] Set up linting (ESLint) and formatting (Prettier)
- [ ] Create Docker setup for local development (optional)

---

## 2. SUPABASE AUTHENTICATION SETUP

### 2.1 Supabase Configuration

- [ ] Create Supabase project
- [ ] Set up authentication providers (email/password)
- [ ] Configure Supabase client libraries in all apps
- [ ] Set up environment variables for Supabase keys

### 2.2 Authentication Implementation

- [ ] Implement login/signup in desktop app (admin dashboard)
- [ ] Set up JWT token management
- [ ] Implement protected routes/API endpoints
- [ ] Add session management and refresh tokens
- [ ] Create auth middleware for Express API

---

## 3. API (Node.js/Express)

### 3.1 Project Setup

- [ ] Initialize Express.js project
- [ ] Set up TypeScript configuration
- [ ] Install dependencies (express, cors, dotenv, etc.)
- [ ] Set up project structure (routes, controllers, services, models)
- [ ] Configure database connection (PostgreSQL/SQLite via Supabase or separate DB)

### 3.2 Database Schema

- [ ] Design database schema:
  - `users` table (linked to Supabase auth.users)
  - `conversations` table (session_id, user_id, created_at, updated_at, status)
  - `messages` table (id, conversation_id, role, content, created_at)
  - `leads` table (id, conversation_id, name, email, phone, metadata, captured_at)
  - `persona` table (id, name, system_prompt, instructions, created_by, updated_at)
- ***

### 3.3 Authentication Middleware

- [ ] Create Supabase auth verification middleware
- [ ] Implement JWT token validation
- [ ] Add user context to requests

### 3.4 Chat API Endpoints

- [ ] `POST /api/chat/send` - Send message to AI agent
  - Validate request (message, conversation_id, user_id)
  - Process message with AI (OpenAI/Anthropic integration)
  - Save message to database
  - Return AI response
- [ ] `GET /api/chat/conversations` - Get user conversations
- [ ] `GET /api/chat/conversations/:id` - Get conversation details
- [ ] `GET /api/chat/conversations/:id/messages` - Get messages for conversation
- [ ] `POST /api/chat/conversations` - Create new conversation
- [ ] `PUT /api/chat/conversations/:id/close` - Close conversation

### 3.5 AI Integration

- [ ] Set up AI provider (OpenAI/Anthropic)
- [ ] Create AI service for message processing
- [ ] Implement conversation context management
- [ ] Add persona/system prompt injection
- [ ] Handle streaming responses (optional)
- [ ] Add error handling and retries

### 3.6 Leads API Endpoints

- [ ] `GET /api/leads` - Get all captured leads (admin only)
- [ ] `GET /api/leads/:id` - Get lead details
- [ ] `POST /api/leads` - Capture lead from conversation
- [ ] `PUT /api/leads/:id` - Update lead information
- [ ] Implement lead extraction logic (from conversation metadata)

### 3.7 Persona Management API

- [ ] `GET /api/persona` - Get current persona configuration
- [ ] `PUT /api/persona` - Update persona details (admin only)
  - Update system prompt
  - Update instructions
  - Update persona name
- [ ] Validate persona updates

### 3.8 Admin API Endpoints

- [ ] `GET /api/admin/conversations` - Get all conversations with filters
- [ ] `GET /api/admin/stats` - Get dashboard statistics
  - Total conversations
  - Active conversations
  - Total leads
  - Recent activity
- [ ] `GET /api/admin/monitoring` - Get monitoring data
  - Response times
  - Message counts
  - User activity

### 3.9 Error Handling & Validation

- [ ] Set up global error handler
- [ ] Create validation middleware (express-validator)
- [ ] Add request logging
- [ ] Implement rate limiting

### 3.10 Testing

- [ ] Set up Jest/Mocha test framework
- [ ] Write unit tests for services
- [ ] Write integration tests for API endpoints

---

## 4. CHAT UI (Next.js)

### 4.1 Project Setup

- [ ] Initialize Next.js project with TypeScript
- [ ] Set up Tailwind CSS
- [ ] Configure Next.js for iframe embedding
- [ ] Set up Supabase client
- [ ] Install dependencies (axios, react-query, etc.)

### 4.2 Chat Bubble Component

- [ ] Create chat bubble button component
  - Floating button with animation
  - Open/close state management
  - Position configuration
- [ ] Create chat window component
  - Message list display
  - Input field
  - Send button
  - Loading states
- [ ] Implement message rendering
  - User messages
  - Bot messages
  - Timestamps
  - Message status indicators

### 4.3 Chat Functionality

- [ ] Implement message sending
  - API integration
  - Optimistic updates
  - Error handling
- [ ] Implement message receiving
  - Polling or WebSocket connection
  - Real-time updates
- [ ] Add conversation persistence
  - Load conversation history
  - Save conversation state
- [ ] Implement session management
  - Create/retrieve conversation ID
  - Handle session expiration

### 4.4 Iframe Embedding

- [ ] Create embeddable page route (`/embed/:chatId`)
- [ ] Set up iframe communication (postMessage)
- [ ] Handle parent window communication
- [ ] Implement responsive design for iframe
- [ ] Add security (X-Frame-Options, CSP)

### 4.5 Styling & UX

- [ ] Design chat bubble UI
- [ ] Add animations (open/close, message appearance)
- [ ] Implement dark/light theme (optional)
- [ ] Add loading states and skeletons
- [ ] Implement error states and retry logic
- [ ] Add accessibility features

---

## 5. DESKTOP APP / ADMIN DASHBOARD (ElectronJS)

### 5.1 Project Setup

- [ ] Initialize Electron project
- [ ] Set up TypeScript
- [ ] Configure build tools
- [ ] Set up project structure (main process, renderer process)
- [ ] Install dependencies (React, React Router)
- [ ] Set up Supabase client for authentication

### 5.2 Main Process Setup

- [ ] Create main window configuration
- [ ] Set up window management
- [ ] Configure app menu
- [ ] Add application lifecycle handlers
- [ ] Set up IPC (Inter-Process Communication) handlers
- [ ] Configure app security (CSP, node integration settings)

### 5.3 Renderer Process - Authentication

- [ ] Create login page with Supabase auth
- [ ] Create signup page
- [ ] Add password reset functionality
- [ ] Implement session management
- [ ] Add logout functionality
- [ ] Set up protected routes
- [ ] Handle authentication state

### 5.4 Renderer Process - Dashboard Layout

- [ ] Create main dashboard layout
- [ ] Add navigation sidebar/menu
- [ ] Set up routing (React Router)
- [ ] Create header/navbar component
- [ ] Install UI component library (shadcn/ui, Material-UI, etc.)

### 5.5 Dashboard Home Page

- [ ] Display key statistics cards:
  - Total conversations
  - Active conversations
  - Total leads
  - Recent activity
- [ ] Fetch and display dashboard stats from API
- [ ] Add charts/graphs (optional):
  - Conversations over time
  - Message volume
- [ ] Add loading states
- [ ] Implement error handling

### 5.6 Conversations Page

- [ ] Create conversations list view
  - Table or card layout
  - Search functionality
  - Pagination
- [ ] Create conversation detail view
  - Message history display
  - User information
  - Conversation metadata
- [ ] Add real-time updates (polling or WebSocket)
- [ ] Implement conversation actions:
  - View details
- [ ] Integrate with API endpoints

### 5.7 Leads Page

- [ ] Create leads list view
  - Table with columns (name, email, phone, captured date)
  - Filter and search
  - Pagination
  - Export to CSV (optional)
- [ ] Create lead detail view
  - Lead information
  - Associated conversation
  - Edit lead information
- [ ] Integrate with API endpoints

### 5.8 Persona Configuration Page

- [ ] Create persona editor form
  - Persona name input
  - System prompt textarea
  - Instructions textarea
  - Preview section
- [ ] Implement save/update functionality
- [ ] Add validation
- [ ] Show current persona configuration
- [ ] Fetch and update persona via API
- [ ] Add test chat interface (optional)

### 5.11 Styling & UX

- [ ] Design consistent UI theme
- [ ] Add loading states and skeletons
- [ ] Implement error handling and notifications
- [ ] Optimize for desktop window sizes
- [ ] Add keyboard shortcuts
- [ ] Implement dark/light theme (optional)

### 5.14 Testing

- [ ] Test window management
- [ ] Test IPC communication
- [ ] Test app lifecycle
- [ ] Test authentication flows
- [ ] Test API integrations
- [ ] Test on different operating systems

---

## 6. INTEGRATION & DEPLOYMENT

### 7.1 API Deployment

- [ ] Set up production environment variables
- [ ] Configure database for production
- [ ] Set up API hosting (Vercel, Railway, AWS, etc.)
- [ ] Configure CORS for production domains
- [ ] Set up monitoring and logging (optional)

### 7.2 Chat UI Deployment

- [ ] Build Next.js app for production
- [ ] Deploy to hosting platform (Vercel, Netlify, etc.)
- [ ] Configure iframe embedding settings
- [ ] Test embeddable chat bubble

### 7.3 Desktop App Distribution

- [ ] Build production Electron app
- [ ] Create distribution packages
- [ ] Set up auto-update mechanism (optional)
- [ ] Test installation on target platforms

### 7.5 Integration Testing

- [ ] Test end-to-end flow:
  - User opens chat bubble
  - Sends message
  - Receives AI response
  - Lead is captured
  - Admin sees conversation and lead
- [ ] Test authentication across all components
- [ ] Test error scenarios
- [ ] Performance testing

---

## 7. DOCUMENTATION

### 8.1 API Documentation

- [ ] Document all API endpoints
- [ ] Create API examples
- [ ] Add authentication documentation
- [ ] Document error codes

### 8.2 User Documentation

- [ ] Create user guide for admin dashboard
- [ ] Document persona configuration
- [ ] Add FAQ section

## PRIORITY ORDER (MVP First)

### Phase 1: Core MVP

1. Project setup & Supabase auth
2. API: Database schema, auth middleware, basic chat endpoints, AI integration
3. Chat UI: Basic chat bubble, message sending/receiving, iframe embedding
4. Desktop App: Basic Electron app setup, authentication, dashboard layout
5. Desktop App: Conversations view, leads view

### Phase 2: Essential Features

6. API: Leads capture, persona management, admin endpoints
7. Desktop App: Persona configuration page, monitoring page
8. Integration testing and bug fixes

### Phase 3: Polish & Deploy

9. Styling and UX improvements
10. Testing and documentation
11. Deployment and distribution
