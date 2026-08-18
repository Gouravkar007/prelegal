# PreLegal ⚖️

> An open-source web application for drafting, customizing, previewing, and exporting standard legal agreements built on the **Common Paper** open-source legal framework.

![Next.js 16](https://img.shields.io/badge/Next.js-16.3.0-black?style=flat-square&logo=next.js)
![React 19](https://img.shields.io/badge/React-19.2.8-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss)
![Vitest](https://img.shields.io/badge/Vitest-4.1.10-6E9F18?style=flat-square&logo=vitest)
![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)

---

## 📌 Project Overview

**PreLegal** streamlines the creation of legally binding commercial agreements by providing an intuitive, interactive builder built around standard **Common Paper** open-source legal templates. 

Instead of dealing with unformatted word processing templates or risky manual edits, PreLegal allows startups, legal teams, and businesses to generate clean, standard contracts (such as Mutual NDAs) with custom variables, real-time live preview, and multi-format export capabilities.

### Why Common Paper?
Common Paper contracts are standard, open-source legal agreements created by a network of experienced attorneys. By standardizing terms, parties spend less time negotiating boilerplate language and more time closing deals safely.

---

## ✨ Key Features

- **📝 Interactive Form Builder**:
  - Multi-tab configuration for **Party Details** (Party 1 & Party 2 company names, entity types, addresses, emails, signatories).
  - Quick **Swap Parties** toggle to switch Party 1 and Party 2 positions instantly.
  - Granular **MNDA Terms** settings: Purpose presets, Agreement Term (fixed years vs. until terminated), Confidentiality Term (fixed years vs. perpetuity), Governing Law State, Jurisdiction, and Custom Modifications.

- **⚡ Built-in Preset Scenarios**:
  - One-click loading of realistic commercial agreement presets:
    - *SaaS Integration Partnership*
    - *Venture Capital / Investment Due Diligence*
    - *Vendor & Consultant Evaluation*

- **📄 Real-Time Live Document Preview**:
  - **View Mode Switcher**: View Cover Page only, Standard Terms only, or Full Agreement.
  - **Variable Highlighting**: Toggle amber background highlights on custom form variables to quickly audit changes vs. boilerplate text.

- **📚 Common Paper Templates Catalog**:
  - Searchable interactive modal catalog featuring 12 standard Common Paper legal agreement templates (Mutual NDA, CSA, SLA, DPA, BAA, PSA, Pilot, AI Addendum, etc.).

- **🖨️ Export & Distribution**:
  - **PDF Export**: Instant vector/canvas rendering to `.pdf` via `html2canvas` + `jsPDF`.
  - **Native Print**: `window.print` with dedicated `@media print` CSS styling hiding UI buttons and layout sidebars.
  - **Markdown Clipboard Copy**: Copy formatted GitHub Flavored Markdown to clipboard with interactive feedback and celebratory confetti animation (`canvas-confetti`).

- **🧪 Automated & Manual Test Suites**:
  - Fully tested with Vitest & React Testing Library (12 unit and integration tests).
  - Detailed manual QA testing guide provided in [`frontend/MANUAL_TESTING.md`](frontend/MANUAL_TESTING.md).

---

## 📚 Standard Legal Templates Catalog

PreLegal includes the standard **Common Paper** legal templates catalog indexed in `catalog.json`:

| Template Name | File | Description |
| :--- | :--- | :--- |
| **Common Paper Mutual NDA** | `Mutual-NDA.md` | Standard mutual non-disclosure agreement for sharing confidential information. |
| **Mutual NDA Cover Page** | `Mutual-NDA-coverpage.md` | Cover page and key terms summary sheet for the Common Paper Mutual NDA. |
| **Cloud Service Agreement (CSA)** | `CSA.md` | Standard SaaS agreement establishing terms for subscriptions, availability, and usage. |
| **Service Level Agreement (SLA)** | `sla.md` | SLA addendum defining uptime commitments, support response times, and service credits. |
| **Data Processing Addendum (DPA)** | `DPA.md` | DPA governing data privacy, GDPR compliance, and controller/processor responsibilities. |
| **Design Partner Agreement** | `design-partner-agreement.md` | Agreement for early-stage design partners testing products and providing feedback. |
| **Professional Services Agreement (PSA)** | `psa.md` | Framework agreement for professional services, consulting, and SOWs. |
| **Partnership Agreement** | `Partnership-Agreement.md` | Commercial partnership agreement for co-marketing, referral, or reseller partnerships. |
| **Business Associate Agreement (BAA)** | `BAA.md` | BAA addendum for HIPAA compliance and handling Protected Health Information (PHI). |
| **Software License Agreement** | `Software-License-Agreement.md` | On-premises software license agreement governing installation, scope, and audits. |
| **Pilot Agreement** | `Pilot-Agreement.md` | Short-term pilot agreement for evaluating software or services during a trial period. |
| **AI Addendum** | `AI-Addendum.md` | Addendum governing AI feature usage, model training rights, and output ownership. |

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Library**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **Document Rendering & Export**: `jspdf`, `html2canvas`, `canvas-confetti`
- **Testing**: [Vitest](https://vitest.dev/), [@testing-library/react](https://testing-library.com/)

---

## 📁 Repository Structure

```
prelegal/
├── catalog.json              # Catalog index of all 12 Common Paper templates
├── LICENSE                   # MIT License file
├── README.md                 # Project root documentation
├── templates/                # Raw Common Paper markdown legal templates
│   ├── AI-Addendum.md
│   ├── BAA.md
│   ├── CSA.md
│   ├── DPA.md
│   ├── Mutual-NDA-coverpage.md
│   ├── Mutual-NDA.md
│   ├── Partnership-Agreement.md
│   ├── Pilot-Agreement.md
│   ├── Software-License-Agreement.md
│   ├── design-partner-agreement.md
│   ├── psa.md
│   └── sla.md
└── frontend/                 # Next.js web application
    ├── MANUAL_TESTING.md     # QA step-by-step testing suite guide
    ├── package.json
    ├── vitest.config.mts
    └── src/
        ├── app/              # Next.js app directory (page.tsx, globals.css)
        ├── components/       # Header, Toolbar, PartyForm, TermsForm, NDADocumentPreview, CatalogModal
        ├── types/            # TypeScript interfaces & sample preset data (nda.ts)
        └── __tests__/        # Vitest unit & integration test files
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation & Development Server

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Gouravkar007/prelegal.git
   cd prelegal/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 🧪 Testing

### Automated Test Suite
To run the automated Vitest component & integration test suite:
```bash
cd frontend
npm test
```

### Manual QA Guide
For a step-by-step walkthrough of manual test scenarios (party synchronization, swap functionality, PDF export, print styling, markdown copy, template modal), refer to [`frontend/MANUAL_TESTING.md`](frontend/MANUAL_TESTING.md).

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) - see the LICENSE file for details. Common Paper standard contract templates included in `templates/` are distributed under their respective open-source license.
