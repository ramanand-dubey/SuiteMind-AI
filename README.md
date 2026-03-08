# SuiteMind AI

An AI-powered chatbot for NetSuite that answers questions about NetSuite functionality using uploaded documentation.

## What It Does

- **Chat Interface**: Users ask questions and get AI-powered answers
- **PDF Knowledge Base**: Admins upload PDF documents about NetSuite features
- **AI Processing**: Uses Cohere's advanced language model to understand docs and provide context-aware responses
- **Built for NetSuite**: Integrated as a Suitelet application within NetSuite

## Quick Overview

| Component | Purpose |
|-----------|---------|
| **Home** | Landing page with navigation |
| **Chat** | User interface for asking questions |
| **Admin** | Upload and manage knowledge base PDFs |
| **Backend** | Processes questions and generates AI responses |
| **Helper Library** | Shared utilities and configuration |
|**Dashboard** | Visualize workflows and see real-time AI impact analysis of SuiteMind AI Processes. |

## Project Structure

```
src/FileCabinet/SuiteScripts/SuiteMind AI/
├── JG_SL_SuiteMindAI_home.js          # Home/landing page
├── JG_SL_SuiteMindAI_admin.js         # Admin upload panel
├── JG_SL_SuiteMindAI_aichat.js        # Chat interface
├── JG_SL_SuiteMindAI_backend.js       # AI processing logic
├── JG_SL_SuiteMindAI_Hackathon.js     # Hidden MVP Dashboard
└── Lib/JG_Lib_SuiteMindAI_Helper.js   # Helper library
```

## Key Features

- 📄 PDF document uploads and processing
- 💬 Interactive chat interface  
- 🤖 AI-powered responses
- 👨‍💼 Admin dashboard for knowledge base management
- 🔒 Security features (XSS protection, file validation)
- 📊 Support for multiple knowledge base documents
- 📊 Visualize workflows and see real-time AI impact analysis of SuiteMind AI Processes.

## Current Knowledge Base

The system currently uses 3 documentation areas:
  - Temperature: 0.2
  - Top K: 3
  - Top P: 0.7
  - Frequency Penalty: 0.4
  - Presence Penalty: 0

## 📦 Current Knowledge Base

The system is currently configured with three main documentation areas:
1. **Sandbox Refresh Checklist** (ID: 117959)
2. **Purge Framework Process** (ID: 117957)
3. **Custom List Management System** (ID: 117968)

## 🔧 Configuration

### Script Parameters

The application uses the following script parameters:
- `customscript_sl_suitemind_ai_admin` - Admin script ID
- `customdeploy_sl_suitemind_ai_admin` - Admin deployment ID
- `customscript_sl_suitemind_ai` - Chat script ID
- `customdeploy_sl_suitemind_ai` - Chat deployment ID
- `ntx_sm_upload_folder` - File Cabinet folder ID for PDF uploads

### Default Account
- Account: TEST_ACCOUNT_28102025 (configured in project.json)

## 🛠️ Technologies & APIs

- **NetSuite**: SuiteCloud platform
- **Netsuite LLM Engine**: llm API
- **OCI Document Processing API**: documentCapture API
- **File Management**: N/file API
- **Language**: JavaScript (NetSuite SuiteScript 2.1)
- **Utilities**: N/runtime, N/log, N/url, N/search, N/record

## 📝 AI Behavior & Instructions

The AI is configured with specific system instructions to:
- Act as an expert NetSuite functionality assistant
- Maintain a friendly, conversational tone
- Analyze provided documents to answer questions accurately
- Use proper formatting (paragraphs, bullet points, headers)
- Indicate when information is not available in the knowledge base
- Prioritize accuracy and relevance

## 🔒 Security Features

- HTML escaping for XSS prevention in the Home page
- File type validation (PDF only)
- Script parameter-based URL resolution
- Same account module scope (SameAccount)

## 📋 Development Notes

1. Sandbox Refresh Checklist
2. Purge Framework Process
3. Custom List Management System

## How It Works

1. Login to Netsuite, Go to Home page > Support > Custom > SuiteMind AI, Click on to use it
2. **Admin uploads PDFs** → Documents stored in File Cabinet
3. **User asks a question** → Sent to AI backend
4. **AI analyzes documents** → Finds relevant information  
5. **Response generated** → Displayed to user in chat
6. **Process Intelligence Dashboard** --> Visualize workflows and see real-time AI impact analysis of SuiteMind AI Processes.



## Getting Started

- Deployment: Use SuiteCloud CLI to deploy scripts
- Configuration: Update script parameters in NetSuite
- Add Docs: Upload PDFs via Admin interface
- Use It: Access chat interface to ask questions

## Author

Ramanand Dubey | February 2026
