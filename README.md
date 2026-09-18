# Essay Support (MyThorneAI)

A Next.js 14 (App Router) + TypeScript + Tailwind CSS web application for automated essay diagnostics, rubric alignment, and iterative writing feedback.

---

## 🚀 Quickstart: Running Locally

Follow these steps to run the application locally on any computer:

### 1. Prerequisites
- **Node.js**: v18.17+ or v20+ recommended (Node 20+ supported)
- **npm**: v9+ or v10+

### 2. Installation
Open your terminal in the project root folder and run:

```bash
# 1. Install all required dependencies
npm install
```

### 3. Start Development Server
```bash
# 2. Run local development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your web browser.

---

## 📋 Available Scripts & Commands

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js dev server on `http://localhost:3000` with hot-reloading |
| `npx tsc --noEmit` | Runs full TypeScript type check without generating build files |
| `npm run build` | Compiles an optimized production build for all 4 routes |
| `npm run start` | Runs the compiled production server on `http://localhost:3000` |
| `npm run lint` | Runs Next.js ESLint checks |

---

## 🧪 Step-by-Step Local Testing Guide

To test the entire workflow end-to-end:

### Test 1: Upload Screen (`/`)
1. Visit [http://localhost:3000](http://localhost:3000).
2. Notice the button **"Check my Essay"** is disabled when the text area is empty.
3. You can:
   - Click **"Load sample argumentative essay"** to test with pre-built academic draft text.
   - Or paste/type your own essay directly into the drop zone textarea.
   - Or drag and drop a `.txt` file into the dashed box.
   - Or click **"Upload a file"** to select a document from your computer.
4. Observe the real-time word and character counter update.
5. Click **"Check my Essay"**:
   - Observe the subtle loading spinner (`"Analyzing your essay..."`).
   - The app will automatically populate the Zustand store and navigate to `/editor`.

### Test 2: Diagnostic Editor (`/editor`)
1. **Visual Highlighting**:
   - Observe the amber highlight (`bg-amber-100/90 text-amber-950 border-b-2 border-accent`) identifying the exact substring of the active issue.
2. **Suggestion Card (Right Column)**:
   - Inspect the unified flowline connecting **1. What** $\to$ **2. Why** $\to$ **3. How to Fix**.
   - Click **"Next"** and **"Previous"**: verify the highlighted text in the manuscript shifts to match the next issue.
   - Click **"Mark Resolved"**: notice the issue updates, turns green, and the top-right circular progress indicator advances (e.g. `25%` $\to$ `50%`).
3. **Interactive Mode Switcher**:
   - Click **"Direct Edit"** in the top bar of the manuscript to type or modify the essay text in real-time.
   - Click **"Highlighted View"** to return to diagnostic reading mode.
4. **Assignment Criteria Modal**:
   - Click **"Add prompt +"** or **"Edit prompt"** in the top banner.
   - The modal appears as an overlay with fields for Instructions, Detected essay type, and Education level.
   - Test closing via the **X button**, the **Cancel** button, or pressing `Escape`.
   - Click **"Check against my assignment"** to save and navigate to `/results`.
5. **Bottom CTA**:
   - Click **"Check my Essay"** at the bottom of the suggestion panel to simulate re-analysis and navigate to `/results`.

### Test 3: Evaluation Results (`/results`)
1. **Dynamic Heading & Copy**:
   - Observe how the heading and badge adapt dynamically (e.g., *"Outstanding Work!"* if all resolved, or *"Great Progress!"* if 3 of 4 resolved).
2. **Progress Bar**:
   - Displays `"{resolvedCount} of {totalCount} fixed ({percentage}%)"`.
3. **Smart Back Navigation**:
   - Click **"Back to editor"**: notice it automatically sets the editor to the first unresolved issue instead of blindly resetting to issue 1.
4. Click **"See my Progress"** to advance to `/progress`.

### Test 4: Trajectory & Chart (`/progress`)
1. Observe the 3 summary metric cards (Initial Score, Latest Score, Net Growth).
2. Inspect the **Recharts Line/Area chart**:
   - Upward progression across drafts.
   - Primary blue line (`#2954D9`), soft gradient area fill underneath, rounded data point dots.
   - Hover over points to view the custom tooltip.
3. Click **"Start New essay"**:
   - Resets active draft text, issues, and assignment for a clean submission.
   - Keeps historical draft records intact.
   - Navigates back to the root `/` upload screen.

### Test 5: Empty State Protection
1. Open a new incognito window and navigate directly to [http://localhost:3000/editor](http://localhost:3000/editor) or [http://localhost:3000/results](http://localhost:3000/results).
2. Verify you are automatically redirected back to `/` so you never get trapped in a broken empty state.

### Test 6: Mobile Responsiveness (375px)
1. Open Chrome DevTools (`F12`) and toggle Device Emulation (`Ctrl+Shift+M` or `Cmd+Option+M`).
2. Select **iPhone SE** or set width to **375px**.
3. Verify that the two-column editor smoothly stacks the suggestion card below the essay document, with no horizontal overflow.

---

## 🌿 Git Guide: How to Push to Remote Tomorrow

When you are ready to commit and push your project to a remote Git repository (e.g. GitHub, GitLab, or Bitbucket):

### Step 1: Initialize Git (if not already done)
```bash
git init
```

### Step 2: Check Status
Verify that `.gitignore` prevents `node_modules` and `.next` from staging:
```bash
git status
```
*(You should only see source files like `app/`, `components/`, `lib/`, `package.json`, etc. You should NOT see `node_modules` or `.next`)*.

### Step 3: Stage and Commit
```bash
git add .
git commit -m "feat: complete Essay Support app with upload, editor, results, and progress routes"
```

### Step 4: Link Remote Repository
If you haven't linked a remote repository yet, copy the repository URL from GitHub (or your Git provider) and run:
```bash
# If using HTTPS:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git

# Or if using SSH:
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPOSITORY.git
```

Verify the remote is connected:
```bash
git remote -v
```

### Step 5: Push to Remote Branch
```bash
# Rename branch to main (standard)
git branch -M main

# Push to origin
git push -u origin main
```

*(If you are pushing to a feature branch instead of main, e.g. `feature/essay-support`)*:
```bash
git checkout -b feature/essay-support
git push -u origin feature/essay-support
```

---

## 🔄 Making Future Updates Tomorrow

Whenever you make new code changes tomorrow, follow this quick standard cycle:

```bash
# 1. Check what files you modified
git status

# 2. View differences if needed
git diff

# 3. Stage changes
git add .

# 4. Commit with a descriptive message
git commit -m "feat: update essay diagnostic logic"

# 5. Push changes to remote
git push
```

---

## 🎨 MyThorneAI Design System Tokens

- **Primary Blue**: `#2954D9`
- **CTA Gradient**: `#F5A623` $\to$ `#F7931E`
- **Surface**: White `#FFFFFF`, Panels `#F5F7FB`
- **Borders**: `#E4E7EC`, 1px, `rounded-xl` (12px) / `rounded-2xl` (16px)
- **Text**: Heading `#101828`, Body `#475467`, Muted `#667085`
- **Pill Buttons**: `rounded-full` with subtle hover elevation
- **Typography**: Inter geometric sans-serif loaded via `next/font/google`
