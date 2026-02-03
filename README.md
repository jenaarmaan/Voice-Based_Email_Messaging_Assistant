# 🎙️ Govind | Voice-Based Email & Messaging Assistant

[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/jenaarmaan/Voice-Based_Email_Messaging_Assistant/graphs/commit-activity)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()
[![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20TS%20%7C%20Firebase-blue.svg)]()

Govind is a secure, **voice-first communication ecosystem** designed to bridge the gap between human intent and digital execution. Built with a focus on accessibility and security, it allows users to manage their emails and messages entirely through natural voice interactions.

---

## 🏆 Project Milestones

### 📍 Milestone 2: Core Functionality & Intelligent Voice Interaction
*Building the brain and muscle of the assistant.*

1️⃣ **Robust Voice Input Handling**
*   Implemented continuous voice listening with reduced accidental triggers.
*   Added command confirmation logic (system verifies sensitive actions).
*   Improved speech-to-text accuracy and stability.
*   **👉 Result:** Fixes one of the biggest friction points in modern voice assistants.

2️⃣ **Context-Aware Command Processing**
*   Introduced context tracking: The system remembers what you are doing (e.g., reading vs. composing).
*   Supports natural, multi-step conversations (e.g., "Compose email" → "To whom?" → "What subject?").
*   **👉 Result:** Makes interactions natural and human-like, not robotic.

3️⃣ **Secure Gmail Integration (Read + Send)**
*   Full Gmail API integration via OAuth.
*   Features: Voice-navigated inbox (Next, Previous, Repeat) and voice-composed messages.
*   Token handling: State-of-the-art secure handling (No hardcoding).

4️⃣ **Voice-Based Email Composition Pipeline**
*   A seamless, step-by-step drafting flow: Recipient selection, Subject dictation, and Body dictation.
*   Verification step before sending and error handling for unclear inputs.
*   **👉 Result:** Critical for blind and accessibility-focused users.

5️⃣ **Modular Backend Architecture**
*   Clean separation of concerns: `gmailReader`, `gmailSender`, `speechHandler`, `commandProcessor`.
*   Designed for massive scalability and future integrations.

6️⃣ **Security & Misuse Prevention**
*   Explicit confirmation steps for all irreversible actions.
*   Context validation to prevent unintended commands, wrong recipients, or incomplete messages.

7️⃣ **Stability & Developer Experience**
*   Comprehensive logging for voice inputs, recognized commands, and API responses.
*   Graceful handling of token expiry, network latency, and voice misinterpretation.

---

### 📍 Milestone 1: Setup & Authentication
*Establishing the secure, voice-first foundation.*

1️⃣ **Voice-Based Hands-Free Registration**
*   Developed a completely voice-guided onboarding experience.
*   Handles user input capture WITHOUT manual typing.
*   **👉 Result:** Full accessibility from the very first interaction.

2️⃣ **Advanced Biometric-Voice Login**
*   Secure authentication layer using **Face ID + Voice PIN**.
*   Multi-factor biometric verification for enhanced security.
*   **👉 Result:** State-of-the-art secure login without needing 2-factor physical keys.

3️⃣ **Always-Ready Wake Word Activation**
*   Integrated "Hey Govind" wake word detection.
*   Optimized for browser-based Speech-to-Text (Windows STT).
*   **👉 Result:** Low-latency response and environment-ready listening.

4️⃣ **Secure Infrastructure & Data Privacy**
*   **Firebase Integration:** Robust backend for Auth, Firestore, and Storage.
*   **Client-Side Encryption:** AES-based handling for all sensitive credentials.
*   **👉 Result:** User data is encrypted at rest and in transit.

5️⃣ **Privacy-First Architecture**
*   Design compliant with Federated Learning principles.
*   No transmission of raw voice data; only processed intents.
*   **👉 Result:** High privacy standards for enterprise and personal use.

6️⃣ **Milestone 1 Status**
*   ✅ Registration completed
*   ✅ Login completed
*   🚧 Logout & Session management (In Progress)

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Vite |
| **Styling** | Tailwind CSS, Shadcn UI |
| **State/Data** | React Query, Zod, React Hook Form |
| **Voice Processing** | Web Speech API (STT/TTS) |
| **Backend/Auth** | Firebase (Authentication, Firestore, Storage) |
| **Security** | OAuth 2.0, AES Encryption, Bcryptjs |
| **Testing** | Vitest, Jest |

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Firebase Account
- Google Cloud Project (for Gmail API)

### Installation
1.  **Clone the Repository**
    ```bash
    git clone https://github.com/jenaarmaan/Voice-Based_Email_Messaging_Assistant.git
    cd Voice-Based_Email_Messaging_Assistant
    ```
2.  **Install Dependencies**
    ```bash
    # For Milestone 2 source code
    cd milestone-2/source-code
    npm install
    ```
3.  **Environment Variables**
    Create a `.env` file in the source folder and add your Firebase and Google API credentials.
4.  **Run Development Server**
    ```bash
    npm run dev
    ```

---

## 🛡️ Security First
Security is not an afterthought in Govind. We implement:
- **OAuth 2.0:** Secure authorization for Gmail without ever storing user passwords.
- **Client-Side Encryption:** Sensitive credentials never leave the user's device in plain text.
- **Confirmation Loops:** Voice assistants are prone to misinterpretation; Govind requires explicit verbal confirmation for sending emails.

---

## 🗺️ Roadmap
- [x] **Milestone 1:** Secure Auth & Setup
- [x] **Milestone 2:** Gmail Integration & Voice Pipeline

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

Built with ❤️ by [Armaan Jena](https://github.com/jenaarmaan)
