# Monday Generator Redesign Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Rebuild the Monday page into a more shareable "周一续命包" experience with stronger emotional hooks and practical outputs.

**Architecture:** Keep the site as a zero-dependency static page. Move all content generation into a standalone module that can be tested with Node, then wire the page UI to that module with a thin browser script.

**Tech Stack:** HTML, CSS, vanilla JavaScript, Node built-in test runner

---

### Task 1: Add failing tests for the content engine

**Files:**
- Create: `package.json`
- Create: `test/logic.test.js`

**Step 1: Write the failing test**

Add tests that expect:
- a full result package for a valid mode
- fallback behavior for unknown mode
- detail text to appear in generated content when provided

**Step 2: Run test to verify it fails**

Run: `npm test`
Expected: FAIL because `logic.js` does not exist yet

### Task 2: Implement the Monday content engine

**Files:**
- Create: `logic.js`

**Step 1: Write minimal implementation**

Add:
- a fixed mode list
- deterministic content templates
- `createMondayKit()` that returns headline, excuse, reply, caption, and share text

**Step 2: Run test to verify it passes**

Run: `npm test`
Expected: PASS

### Task 3: Rebuild the page around the new engine

**Files:**
- Create: `styles.css`
- Create: `app.js`
- Modify: `index.html`

**Step 1: Build the new layout**

Add:
- stronger hero copy
- mode selector
- intensity selector
- optional detail input
- result cards with copy actions
- dynamic "本周最常复制" area

**Step 2: Wire browser behavior**

Use `createMondayKit()` in the browser to render results and copy/share text.

### Task 4: Verify end to end

**Files:**
- None

**Step 1: Run automated verification**

Run: `npm test`
Expected: PASS

**Step 2: Run local preview**

Run: `python3 -m http.server 8001`

**Step 3: Manually verify**

Check:
- mode switching works
- generation updates all cards
- copy buttons work
- mobile layout remains readable
