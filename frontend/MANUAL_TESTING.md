# Manual Testing & QA Guide: PreLegal Mutual NDA Creator

This manual test suite provides step-by-step instructions to verify all core workflows, edge cases, accessibility features, and export capabilities of the PreLegal Mutual NDA application.

---

## Environment Setup
1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:3000` in Chrome/Edge/Safari.

---

## Test Suite 1: Interactive Multi-Step Form (`PartyForm` & `TermsForm`)

### Test 1.1: Party 1 & Party 2 Input Synchronization
- **Steps**:
  1. Change Party 1 Company Name to `"Acme Global Inc."`.
  2. Change Party 1 Signatory Name to `"Jane Doe"`.
  3. Change Party 2 Company Name to `"Beta Technologies LLC"`.
- **Expected Outcome**:
  - The live document preview on the right instantly reflects `"Acme Global Inc."` and `"Beta Technologies LLC"` in the Cover Page summary table, Signature Block, and Standard Terms preamble.

### Test 1.2: Swap Party 1 & Party 2
- **Steps**:
  1. Click the **"Swap Party 1 & Party 2"** button in the form pane.
- **Expected Outcome**:
  - Party 1 details move to Party 2, and Party 2 details move to Party 1.
  - The signature block and agreement text instantly update order.

### Test 1.3: Purpose & Presets Selector
- **Steps**:
  1. Click the **"2. MNDA Terms"** tab.
  2. Click a quick purpose preset pill (e.g. *"Evaluating a potential strategic investment..."*).
- **Expected Outcome**:
  - The textarea updates with the preset text.
  - The document preview updates Section 1 and Cover Page Purpose.

### Test 1.4: MNDA & Confidentiality Term Selectors
- **Steps**:
  1. Change MNDA Agreement Term to *"Expires after fixed years"* and set years to `3`.
  2. Change Term of Confidentiality to *"In perpetuity"*.
- **Expected Outcome**:
  - Cover Page checkmarks update (`[x] Expires 3 year(s)...`, `[x] In perpetuity`).

---

## Test Suite 2: Document Preview Controls

### Test 2.1: View Mode Toggles
- **Steps**:
  1. Click **"Cover Page"** mode button on the preview bar.
  2. Click **"Standard Terms"** mode button.
  3. Click **"Full Agreement"** mode button.
- **Expected Outcome**:
  - *Cover Page*: Only renders Cover Page title, summary, and signature table.
  - *Standard Terms*: Only renders 11 clauses of Common Paper terms.
  - *Full Agreement*: Renders both Cover Page and Standard Terms.

### Test 2.2: Variable Highlight Switch
- **Steps**:
  1. Click **"Highlight Inputs" / "Variables Highlighted"** toggle button.
- **Expected Outcome**:
  - When enabled, user-filled variables show yellow/amber highlighted background pills.
  - When disabled, variables blend seamlessly into normal contract typography.

---

## Test Suite 3: Document Export & Print Capabilities

### Test 3.1: Save / Print PDF (`window.print`)
- **Steps**:
  1. Click **"Print"** button in the top toolbar.
  2. Inspect the print preview modal.
- **Expected Outcome**:
  - Headers, navigation bars, form inputs, toolbar buttons, and backgrounds are hidden (`display: none`).
  - Only the formal legal agreement document is displayed on crisp white pages with black text.
  - No blank pages or truncated sections.

### Test 3.2: Direct PDF File Download (`html2canvas` + `jsPDF`)
- **Steps**:
  1. Click **"Download PDF"** button.
- **Expected Outcome**:
  - Button state changes to *"Exporting PDF..."* with a spinner.
  - A `.pdf` file named `MNDA_<Party1>_vs_<Party2>.pdf` automatically downloads to your downloads folder.

### Test 3.3: Copy Markdown to Clipboard
- **Steps**:
  1. Click **"Copy Markdown"** button.
- **Expected Outcome**:
  - Button updates to *"Copied to Clipboard!"* with green checkmark.
  - Confetti animation triggers.
  - Pasting into a markdown editor renders clean GitHub Flavored Markdown table and text.

---

## Test Suite 4: Common Paper Template Catalog

### Test 4.1: Template Search & Filtering
- **Steps**:
  1. Click **"Templates Catalog"** button in the top header.
  2. Type `"DPA"` or `"AI Addendum"` into the search box.
- **Expected Outcome**:
  - Modal displays matching Common Paper template entries with filename badge.
- **Keyboard Shortcut**: Press `Escape` key to close the modal.

---

## Test Suite 5: Automated Testing Execution
To run all 12 automated component and integration tests:
```bash
npm test
```
Expected result: `12 passed (12)`.
