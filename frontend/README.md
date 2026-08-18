# PreLegal Frontend Web Application ⚖️

This is the Next.js 16 frontend application for **PreLegal**, an open-source web platform for drafting and customizing standard **Common Paper** legal agreements.

> For full project documentation, architectural overview, and legal template catalog details, see the root [`README.md`](../README.md).

---

## 🚀 Quick Start

### Installation

```bash
npm install
```

### Development Server

Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

---

## 🧪 Testing

### Automated Unit & Integration Tests

Run all 12 Vitest component and integration tests:

```bash
npm test
```

### Manual QA Guide

For detailed manual testing instructions covering party synchronization, party swap, PDF generation, print preview, and template catalog modals, refer to [`MANUAL_TESTING.md`](./MANUAL_TESTING.md).

---

## 🛠️ Tech Stack & Dependencies

- **Framework**: Next.js 16 (App Router)
- **UI Engine**: React 19, TypeScript
- **Styling**: Tailwind CSS v4, Lucide React
- **PDF & Canvas Export**: `jspdf`, `html2canvas`
- **Effects**: `canvas-confetti`
- **Test Runner**: Vitest, React Testing Library
