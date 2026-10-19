# DLC Consultoria Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and privately publish a responsive, accessible landing page for DLC Consultoria that turns qualified visitors into WhatsApp conversations.

**Architecture:** Create a buildless static Site in `sites/dlc-consultoria/`, with semantic HTML in `dist/index.html`, presentation in `dist/assets/styles.css`, and minimal progressive enhancement in `dist/assets/site.js`. Keep all brand imagery local, test critical content and integration contracts with Node's built-in test runner, then package and publish through the Sites workflow.

**Tech Stack:** HTML5, modern CSS, vanilla JavaScript, Node.js built-in test runner, OpenAI Sites static hosting.

**Spec:** `docs/superpowers/specs/2026-10-19-dlc-consultoria-landing-page-design.md`

## Global Constraints

- The primary CTA must open `https://wa.me/5531973170620` with a prefilled Portuguese message about ISO consulting.
- Use only confirmed claims: DLC Consultoria & Certificações ISO, Mariana Lima, Minas Gerais, more than 10 years of publicly communicated experience, and the listed services.
- Do not imply that DLC is a certification body or guarantee certification.
- Do not add client logos, customer counts, approval rates, testimonials, or unverifiable results.
- Build a static Site with no server runtime, database, account system, form backend, analytics, or third-party UI dependency.
- Preserve browser zoom, keyboard access, visible focus, semantic heading order, alt text, reduced motion, and touch-safe interactions.
- Use the supplied blue-green identity and the three supplied logo files; do not redraw the mark.
- Motion is limited to feedback and explanation; never use `transition: all`, `scale(0)`, `ease-in`, ungated hover motion, or layout-property animation.
- The Site is private by default and should be published through the Sites workflow after validation.
- The current workspace is not a Git repository; task checkpoints are file/test gates, and the Sites source helper will create the deployment commit during packaging.

## Review Focus

- A malformed or partially encoded WhatsApp URL must never ship; Task 1 pins the exact number and message parameters.
- The page must remain readable and navigable when JavaScript is unavailable; Task 1 verifies all content and anchor destinations exist in HTML.
- Missing, renamed, or broken brand assets must fail before publication; Task 1 verifies every local image reference resolves to a file.
- Touch devices and reduced-motion users must not receive sticky hover or transform-heavy reveals; Task 3 tests capability and preference media queries.
- A 320 px viewport must not create horizontal scrolling or hide the CTA/menu; Task 4 includes explicit browser checks at 320 px, 390 px, 768 px, and 1440 px.

---

## File Map

- `sites/dlc-consultoria/dist/index.html` — semantic page content, metadata, navigation, sections, CTAs, and social links.
- `sites/dlc-consultoria/dist/assets/styles.css` — brand tokens, responsive layout, components, interaction states, motion, and accessibility rules.
- `sites/dlc-consultoria/dist/assets/site.js` — mobile menu state, progressive scroll reveal, and dynamic copyright year.
- `sites/dlc-consultoria/dist/assets/logo-dlc-completa.jpeg` — full brand lockup for header and footer.
- `sites/dlc-consultoria/dist/assets/logo-dlc-simbolo.jpeg` — brand symbol used as a decorative hero layer.
- `sites/dlc-consultoria/dist/assets/logo-dlc-servicos.png` — service identity reference displayed once in the solutions section.
- `sites/dlc-consultoria/tests/site.test.mjs` — contract tests for content, links, assets, semantics, CSS guardrails, and JS hooks.
- `sites/dlc-consultoria/package.json` — dependency-free Node test script.
- `sites/dlc-consultoria/.openai/hosting.json` — Sites project identity and `dist` static-directory declaration.
- `sites/dlc-consultoria/README.md` — local verification and publication notes.

---

### Task 1: Static foundation, verified content, and conversion contract

**Files:**
- Create: `sites/dlc-consultoria/package.json`
- Create: `sites/dlc-consultoria/tests/site.test.mjs`
- Create: `sites/dlc-consultoria/dist/index.html`
- Create: `sites/dlc-consultoria/dist/assets/logo-dlc-completa.png`
- Create: `sites/dlc-consultoria/dist/assets/logo-dlc-simbolo.jpeg`
- Create: `sites/dlc-consultoria/dist/assets/logo-dlc-servicos.png`

**Interfaces:**
- Consumes: the approved spec and the three source images in `C:/Users/joaol/Downloads/`.
- Produces: stable section IDs `solucoes`, `metodo`, `sobre`, and `contato`; `.js-menu-toggle`, `.js-mobile-menu`, `.js-reveal`, and `.js-year` hooks; local asset paths; exact WhatsApp and social URLs.

- [ ] **Step 1: Write the failing structural contract tests**

Create tests named `renders_every_required_section`, `uses_only_confirmed_conversion_and_social_urls`, `keeps_core_content_available_without_javascript`, `references_existing_local_brand_assets`, and `uses_a_single_h1_with_ordered_section_headings`. Assert the exact section IDs, `https://wa.me/5531973170620`, Instagram URL `https://www.instagram.com/dlcconsultoria01/`, LinkedIn URL `https://br.linkedin.com/in/mariana-lima-9b2611210`, one `<h1>`, and that every `src="assets/..."` resolves inside `dist/assets/`.

- [ ] **Step 2: Run tests to verify the foundation is absent**

Run: `node --test sites/dlc-consultoria/tests/site.test.mjs`

Expected: FAIL because `dist/index.html` and the local brand assets do not exist.

- [ ] **Step 3: Add the dependency-free project manifest**

Create `package.json` with `private: true` and a `test` script set to `node --test tests/*.test.mjs`. Do not add runtime or development dependencies.

- [ ] **Step 4: Copy the supplied brand assets**

Copy the three source images from `C:/Users/joaol/Downloads/` to the exact asset paths in the File Map. Preserve aspect ratio, do not upscale, and use `Logo DLC Consultoria 2026.png` as `logo-dlc-servicos.png`, `Logo DLC Consultoria e Certificações.jfif.jpeg` as `logo-dlc-completa.jpeg`, and `Só a imagem da logo.jfif.jpeg` as `logo-dlc-simbolo.jpeg`.

- [ ] **Step 5: Implement semantic HTML and final Portuguese copy**

Build the header, hero, credibility, solutions, method, benefits, Mariana, final CTA, and footer sections. Use “Transformamos requisitos em uma gestão que funciona no dia a dia” as the H1, include a clear consulting/preparation disclaimer in context, and set the WhatsApp URL with a URL-encoded message asking about ISO consulting.

- [ ] **Step 6: Run the structural contract tests**

Run: `node --test sites/dlc-consultoria/tests/site.test.mjs`

Expected: PASS for all Task 1 tests with zero missing assets.

- [ ] **Step 7: Record the task checkpoint**

Review `dist/index.html`, the three local assets, and the passing test output. Do not initialize a separate Git repository; the Sites source helper will create the deployment commit during Task 4.

---

### Task 2: Responsive visual system and page composition

**Files:**
- Create: `sites/dlc-consultoria/dist/assets/styles.css`
- Modify: `sites/dlc-consultoria/dist/index.html`
- Modify: `sites/dlc-consultoria/tests/site.test.mjs`

**Interfaces:**
- Consumes: Task 1 section IDs, class hooks, and asset paths.
- Produces: documented CSS tokens (`--color-ink`, `--color-blue`, `--color-green`, `--color-lime`, `--color-warm`, `--ease-out`), reusable `.container`, `.button`, `.section-heading`, `.standard-card`, `.method-step`, and responsive navigation styles.

- [ ] **Step 1: Add failing visual-system guardrail tests**

Add tests named `defines_the_approved_brand_tokens`, `avoids_forbidden_motion_and_layout_patterns`, `contains_mobile_and_desktop_breakpoints`, and `provides_visible_focus_styles`. Assert the required tokens/classes, reject `transition: all`, reject `scale(0)`, and require `:focus-visible` plus breakpoints covering compact and wide layouts.

- [ ] **Step 2: Run tests to verify the stylesheet is absent**

Run: `node --test sites/dlc-consultoria/tests/site.test.mjs`

Expected: FAIL because `styles.css` and its required contracts do not exist.

- [ ] **Step 3: Implement the design tokens and foundational layout**

Define the warm-white base, deep blue authority color, blue-green and lime accents derived from the supplied identity, restrained orange for ISO 45001, system font stack, spacing scale, container widths, focus ring, and surface/border rules. Link the stylesheet from `index.html`.

- [ ] **Step 4: Compose every section for desktop and mobile**

Implement the offset hero with the enlarged brand symbol, three distinct standard cards, connected five-step method, benefit grid, Mariana profile block, final CTA band, responsive header/footer, and mobile-safe spacing. Keep body copy selectable and apply control-only `user-select: none`.

- [ ] **Step 5: Run all static tests**

Run: `node --test sites/dlc-consultoria/tests/site.test.mjs`

Expected: PASS with no forbidden motion patterns and all required styles present.

- [ ] **Step 6: Record the task checkpoint**

Review the computed file list and passing tests; defer the deployment commit to Task 4.

---

### Task 3: Progressive interaction, restrained motion, and mobile-native behavior

**Files:**
- Create: `sites/dlc-consultoria/dist/assets/site.js`
- Modify: `sites/dlc-consultoria/dist/index.html`
- Modify: `sites/dlc-consultoria/dist/assets/styles.css`
- Modify: `sites/dlc-consultoria/tests/site.test.mjs`

**Interfaces:**
- Consumes: Task 1 `.js-*` hooks and Task 2 `--ease-out` token/components.
- Produces: `setMenuOpen(open: boolean): void`, IntersectionObserver-enhanced reveal behavior, current-year rendering, `aria-expanded` synchronization, Escape/outside-click menu dismissal, and motion/touch preference styles.

- [ ] **Step 1: Add failing interaction and accessibility contract tests**

Add tests named `mobile_menu_exposes_and_updates_aria_state`, `javascript_is_progressive_enhancement_only`, `reduced_motion_removes_transform_reveals`, `hover_motion_is_pointer_gated`, and `mobile_platform_metadata_is_safe`. Require `viewport-fit=cover`, no `user-scalable=no` or `maximum-scale=1`, `@media (prefers-reduced-motion: reduce)`, `@media (hover: hover) and (pointer: fine)`, and explicit property transitions.

- [ ] **Step 2: Run tests to verify interaction behavior is absent**

Run: `node --test sites/dlc-consultoria/tests/site.test.mjs`

Expected: FAIL on missing JavaScript behavior and mobile/motion contracts.

- [ ] **Step 3: Implement the accessible mobile menu and progressive reveals**

Implement `setMenuOpen(open)` around the existing hooks; synchronize `aria-expanded`, close on navigation, Escape, and outside click, and keep navigation visible when JavaScript is unavailable. Use IntersectionObserver only to enhance `.js-reveal` elements, never to hide essential content permanently.

- [ ] **Step 4: Implement motion and mobile-native safeguards**

Use 100–160 ms press feedback with `scale(0.97)`, 200–300 ms explanatory reveals with `cubic-bezier(0.23, 1, 0.32, 1)`, short 30–80 ms stagger values, reduced-motion opacity-only behavior, pointer-gated hover, `touch-action: manipulation`, transparent tap highlight, `100svh` only where the hero needs stable viewport height, and safe-area padding for fixed/mobile controls.

- [ ] **Step 5: Run the complete automated suite**

Run: `node --test sites/dlc-consultoria/tests/site.test.mjs`

Expected: PASS with every structural, content, asset, CSS, motion, and interaction contract green.

- [ ] **Step 6: Record the task checkpoint**

Review the passing suite and confirm the source still works as a complete document without JavaScript.

---

### Task 4: Site registration, browser QA, packaging, and private deployment

**Files:**
- Create: `sites/dlc-consultoria/.openai/hosting.json`
- Create: `sites/dlc-consultoria/README.md`
- Create: `sites/dlc-consultoria/dlc-consultoria-site.zip` outside `dist/` or at another absolute packaging path returned by the Sites workflow.
- Modify: any prior file only for defects observed during QA.

**Interfaces:**
- Consumes: the complete static output and passing test suite from Tasks 1–3.
- Produces: persisted Sites `project_id`, source commit SHA, packaged archive, saved version ID, private deployment URL, and concise local/device verification notes.

- [ ] **Step 1: Register the new private static Site and persist its identity**

Use the Sites native creation tool for a new private Site, then run the Sites `set-project-id.mjs` helper with the returned project ID and `--static-directory dist`. Verify `.openai/hosting.json` contains the exact `project_id` and `{ "static": { "directory": "dist" } }`.

- [ ] **Step 2: Read the local-preview reference and launch the supported preview**

Read `C:/Users/joaol/.codex/plugins/cache/openai-curated-remote/sites/1.0.2-remix-a.1/skills/sites/references/preview/local.md`, start the buildless static preview using the documented helper/runtime, and retain the preview session for QA.

- [ ] **Step 3: Perform desktop and mobile browser QA**

At 320 px, 390 px, 768 px, and 1440 px widths, verify no horizontal overflow, readable text, visible/focusable navigation, reachable WhatsApp CTA, intact logos, correct section progression, and no content hidden when reveals are disabled. Test keyboard navigation, Escape dismissal, reduced motion, and a touch-capability viewport. Capture screenshots for the narrow mobile and wide desktop states.

- [ ] **Step 4: Fix observed defects and rerun the full suite**

Run: `node --test sites/dlc-consultoria/tests/site.test.mjs`

Expected: PASS after any QA-driven changes, with zero known visual blockers.

- [ ] **Step 5: Document verification limits and local operation**

Write `README.md` with the test/preview commands, confirmed public links, and a note that sticky hover, browser chrome, safe-area behavior, and touch feel still require final verification on a physical phone.

- [ ] **Step 6: Package and push source through the Sites workflow helper**

Run `site-workflow.mjs` with the Site credential passed through stdin, `commands` containing the final Node test command, and an absolute `archivePath`. Confirm success returns the same project ID, a commit SHA, and the archive path.

- [ ] **Step 7: Save and deploy the private Site**

Call the private save-and-deploy native tool with the verified project ID, commit SHA, and unchanged archive. If the result is pending/building/publishing, poll only until a terminal deployment state.

- [ ] **Step 8: Verify and hand off the published result**

Confirm the native deployment result includes a successful status and URL, open the deployed URL in Codex when supported, and report the URL plus the physical-device verification limit.
