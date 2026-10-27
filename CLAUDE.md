# Postgraduate Portal — Design System Rules (Figma MCP Integration)

This doc tells Claude how design tokens, components, and assets map between this
codebase and Figma, so Figma → code (and code → Figma) work stays consistent
with what already exists here. Read this before generating or editing any UI.

## 1. Stack Summary

- **Framework**: Angular 17, standalone components (no NgModules). Every
  component declares `standalone: true` and its own `imports: [...]`.
- **Language**: TypeScript, template-driven forms (`FormsModule` + `[(ngModel)]`),
  not Reactive Forms.
- **Styling**: Plain SCSS per component (`styleUrls: ['./x.component.scss']`),
  no CSS Modules, no Tailwind, no styled-components, no Angular Material.
- **Notifications**: `ngx-toastr`. **Masked inputs**: `ngx-mask`. **PDF/export**:
  `jspdf` + `html2canvas` (loaded as global scripts, see `pdf.service.ts`).
- **Build**: Angular CLI (`@angular-devkit/build-angular:browser`), config in
  `angular.json`. Output to `dist/postgraduate-portal`.

## 2. Design Tokens

**Single source of truth**: `src/styles.scss`, defined as CSS custom properties
on `:root`. There is no JSON/YAML token file and no build-time token
transformer (e.g. Style Dictionary) — tokens are hand-authored CSS variables
consumed directly in component SCSS via `var(--token-name)`.

```scss
:root {
  /* Brand */
  --color-primary-navy: #121a6d;
  --color-primary-navy-hover: #1a238a;
  --color-primary-navy-gradient-end: #1e3a8a;
  --color-primary-blue: #3ba8ff;

  /* Text */
  --color-text-primary: #0f172a;
  --color-text-secondary: #64748b;
  --color-text-muted: #94a3b8;
  --color-text-white: #ffffff;

  /* Surfaces & borders */
  --color-background-main: #f8fafc;
  --color-background-card: #ffffff;
  --color-border-default: #e2e8f0;

  /* Status */
  --color-status-success: #22c55e;
  --color-status-warning: #f59e0b;
  --color-status-error: #ef4444;

  /* Disabled state */
  --color-disabled-bg: #cbd5e1;
  --color-disabled-input-bg: #f1f5f9;
  --color-disabled-border: #cbd5e1;
  --color-disabled-text: #94a3b8;

  /* Third-party brand */
  --color-google-red: #ea4335;

  /* Typography */
  --font-family-base: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI",
    Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  --font-size-h1: 32px;
  --font-size-h2: 24px;
  --font-size-h3: 18px;
  --font-size-body: 16px;
  --font-size-label: 14px;
  --font-size-caption: 12px;

  /* Radii */
  --radius-card: 16px;
  --radius-control: 12px;
  --radius-pill: 999px;

  /* Shadows */
  --shadow-card: 0px 4px 16px rgba(18, 26, 109, 0.06);
  --shadow-hover: 0px 8px 24px rgba(18, 26, 109, 0.12);
  --shadow-focus: 0 0 0 4px rgba(59, 168, 255, 0.15);
}
```

**Rules when translating Figma variables into code:**

- Match a Figma variable to an *existing* `--color-*`/`--font-*`/`--radius-*`/
  `--shadow-*` token by value first, name second — several forms hardcode raw
  hex (e.g. `#67748e`, `#344767`, `#17c1e8`) instead of a token, which is
  legacy drift, not the intended pattern. Don't propagate more of that; use
  the token.
- If Figma introduces a genuinely new value (no existing token matches),
  add it to the `:root` block in `src/styles.scss` following the existing
  naming scheme (`--color-*`, `--font-size-*`, `--radius-*`, `--shadow-*`),
  don't inline a new hex value in a component file.
- There is no dark-mode token set and no spacing-scale tokens (`--space-*`)
  yet — spacing is ad hoc `px` values per component. Don't invent a spacing
  token system unless asked; follow the local component's existing spacing.
- Font sizes below `--font-size-caption` (12px) or one-off sizes (e.g. `48px`
  request counters, `20px` form sub-headers) are written as literal `px` in
  component SCSS — that's consistent with current practice, not a bug to fix.

## 3. Component Library

There is **no shared/UI component library** (no `src/app/shared/`, no atoms/
molecules directory, no Storybook, no design-system package). Every screen is
a standalone Angular component under `src/app/components/`, and each one
defines its own buttons, inputs, cards, badges, etc. in its own `.scss` file —
patterns are duplicated across components rather than extracted.

```
src/app/components/
├── dashboard/                     # main landing screen after login
├── login/                         # auth screen
├── sidebar/                       # persistent app-shell nav (app-sidebar)
├── forms/                         # one folder per request-type form
│   ├── course-add-drop-form/
│   ├── medical-exam-form/
│   ├── major-transfer-form/
│   ├── refund-form/
│   ├── re-entry-form/
│   ├── midterm-replacement-form/
│   ├── final-exam-replacement-form/
│   ├── replacement-exam-declaration-form/
│   ├── semester-postponement-form/
│   ├── semester-withdrawal-form/
│   ├── student-appeal-form/
│   └── withdrawal-form/
├── request-list/                  # list/table of submitted requests
├── pending-requests/               # approver's queue
├── program-director-decision/     # approval/decision screen
├── view-request/                  # read-only request detail
├── letter-document/                # generated letter/document view
├── print-form/                    # print-optimized layout
└── sequence/                      # admin: approval-sequence config
    ├── sequence-form/
    ├── create-sequence/
    ├── list-sequence/
    └── listsequence-status/
```

Each component folder is: `*.component.ts`, `*.component.html`,
`*.component.scss` (co-located, one component per folder). Example component
decorator shape to follow when creating a new one from a Figma frame:

```ts
@Component({
  selector: "app-medical-exam-form",
  standalone: true,
  imports: [CommonModule, SidebarComponent, FormsModule],
  templateUrl: "./medical-exam-form.component.html",
  styleUrls: ["./medical-exam-form.component.scss"],
})
export class MedicalExamFormComponent implements OnInit { ... }
```

**When implementing a new Figma design:**

- Create a new folder under `src/app/components/` (or `forms/` if it's a
  request-type form) mirroring this three-file structure.
- Don't invent a new shared component abstraction (e.g. a generic `<app-button>`)
  unless explicitly asked — the codebase's existing convention is per-component
  styling, even though it's repetitive. Match existing structure over
  "improving" it.
- All the request-form components (`forms/*`) follow the same page skeleton:
  `<app-sidebar>` + a `.form-header` with logos/title + collapsible
  `.form-section` blocks + role-gated save/submit buttons
  (`canViewSection`/`canEditSection`/`canSubmitForm` pattern in the `.ts`). New
  form screens from Figma should reuse this skeleton rather than a bespoke layout.
- Role-based visibility (student vs. physician vs. admin, etc.) is handled in
  the component class, not in template-only conditionals — check
  `AuthService.currentUserValue.role` patterns in existing form `.ts` files
  before wiring up a new form's visibility rules.

## 4. Frameworks & Libraries

| Concern | Library | Notes |
|---|---|---|
| UI framework | Angular 17 (standalone components) | No NgModules anywhere in `src/app` |
| Forms | `@angular/forms` `FormsModule` (template-driven) | `[(ngModel)]`, not `FormGroup`/Reactive Forms |
| Styling | Plain SCSS, CSS custom properties | No Tailwind/Material/Bootstrap component usage in app code |
| Icons (declared) | `nucleo-icons` (icon font), Font Awesome 6 (CDN in `index.html`) | See §5 — largely unused in favor of emoji/inline SVG |
| Notifications | `ngx-toastr` | Registered via `provideToastr()` in `app.config.ts` |
| Input masking | `ngx-mask` | Registered via `provideEnvironmentNgxMask()` |
| PDF/export | `jspdf`, `html2canvas` | Declared as globals in `pdf.service.ts`, used for form-to-PDF export |
| Routing | `@angular/router`, `provideRouter(routes)` | Routes in `src/app/app.routes.ts` |
| HTTP | `provideHttpClient()` via `ApiService` wrapper | `src/app/services/api.service.ts` |
| Build | Angular CLI / `@angular-devkit/build-angular` | `angular.json`, budgets: 2MB warn/5MB error initial bundle |

`src/assets/css/soft-ui-dashboard*.css` and `src/assets/js/*` (Bootstrap,
Popper, Chart.js extension, bootstrap-notify) are leftovers from the
"Soft UI Dashboard" Creative Tim starter template this project was
bootstrapped from. **They are not the active styling system** — the live
design language is the `src/styles.scss` CSS-variable system plus
per-component SCSS. Don't reach for Bootstrap/Soft-UI classes when
implementing a Figma design; use the token system in §2.

## 5. Asset Management

- Static assets live under `src/assets/` (`img/`, `images/`, `fonts/`, `css/`,
  `js/`), registered verbatim in `angular.json` → `architect.build.options.assets`.
  There's no image-optimization pipeline, responsive-image generation, or CDN
  config — assets are served as-is from the built `dist/` output.
- Reference assets from templates with root-relative paths, e.g.
  `src/assets/img/logos/...` → `<img src="assets/img/logos/visa.png">` (the
  `src/` prefix is stripped at build time since `sourceRoot` is `src`).
- Most of `src/assets/img/` (curved-images, illustrations, theme logos,
  small-logos) is unused leftover from the Soft UI Dashboard template — don't
  treat their presence as evidence of an active pattern. Check whether an
  asset is actually referenced from a component before reusing it.
- New imagery exported from Figma should go under a purpose-named subfolder
  of `src/assets/img/` (e.g. `img/forms/`, matching how `curved-images/` and
  `logos/` are already scoped) rather than dropped loose in `img/`.
- Fonts: only "Inter" is actually used (loaded via Google Fonts `<link>` in
  `src/index.html`, referenced as `--font-family-base`). The bundled
  `nucleo-icons`/`nucleo` webfonts in `src/assets/fonts/` back the icon font
  in §6 but are not used for body text.

## 6. Icon System

Icons are **not** consistently sourced from one system — three approaches
coexist, in order of actual usage:

1. **Emoji characters** (dominant pattern) — wrapped in `<i class="icon">`,
   sized via `font-size` on the wrapper. This is what most nav items, buttons,
   and alerts use today:
   ```html
   <i class="icon">🏠</i>  <!-- dashboard -->
   <i class="icon">📅</i>  <!-- calendar/schedule -->
   <i class="icon">⏳</i>  <!-- pending -->
   <i class="icon">📋</i>  <!-- list/document -->
   <i class="icon">⚙️</i>  <!-- admin/settings -->
   <i class="submenu-icon">📄</i>
   <i class="arrow">›</i>  <!-- chevron, not technically an "icon" but styled the same way -->
   ```
   `.icon { font-style: normal; }` is the only global rule (`src/styles.scss`);
   sizing/spacing is set per-component (e.g. `.nav-item .icon { width: 24px; }`).

2. **Inline SVG** — used where a crisper/scalable icon was wanted (e.g. the
   calendar-card info button in `dashboard.component.html`):
   ```html
   <button class="info-btn">
     <svg viewBox="0 0 24 24" fill="currentColor">
       <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/>
     </svg>
   </button>
   ```
   Sized via `svg { width: 18px; height: 18px; }` scoped to the button class.
   Uses `fill="currentColor"` so it inherits the button's `color` token.

3. **Font Awesome 6** (CDN link in `src/index.html`) and the `nucleo-icons`
   icon font (`src/assets/css/nucleo-icons.css`) are both loaded globally but
   **not actually referenced** in any current component template — they're
   template leftovers, available but dormant.

**When implementing icons from a Figma design:**

- Prefer inline SVG (pattern 2) for new work — it scales cleanly and can
  inherit color via `currentColor`, matching how the codebase already treats
  the one "real" icon it has. Wrap it in a sized container class the same way
  `.info-btn svg` does.
- Match existing emoji icons where a nav/action already has a well-known
  emoji equivalent, for visual consistency with the rest of the sidebar/dashboard,
  rather than mixing a new SVG into a list of emoji icons (or vice versa) in
  the same view.
- Don't introduce Font Awesome or nucleo-icon classes into new components —
  they're loaded but treating them as "the icon system" would create a fourth,
  even less consistent, pattern.
- There is no icon naming convention beyond the emoji/inline-SVG literal
  itself — no `icon-<name>.svg` asset files, no icon component/registry.

## 7. Styling Approach

- **Methodology**: vanilla component-scoped SCSS (Angular's default
  `ViewEncapsulation.Emulated`), one `.scss` file per component, no CSS
  Modules/BEM enforcement, no CSS-in-JS.
- **Global styles**: `src/styles.scss` — token `:root` block, box-sizing
  reset, `body`/`button`/`a` base rules, and print rules (`@media print`)
  that hide `.sidebar`/`.top-nav`/`.no-print` for printable forms.
- **Toastr styles**: imported at the top of `src/styles.scss` via
  `@import "ngx-toastr/toastr";`.
- **Responsive design**: plain `@media` breakpoints per component, no
  utility-class grid system. Two breakpoints recur across components:
  `@media (max-width: 1200px)` (collapse multi-column grids to 1 column) and
  `@media (max-width: 768px)` (mobile: fixed/off-canvas sidebar via
  `.sidebar { position: fixed; left: -260px; }` + `.sidebar.open { left: 0; }`,
  show `.menu-toggle`, stack `.stats-grid`).
- **Layout primitives**: flexbox and CSS grid directly (`display: flex`,
  `display: grid` + `grid-template-columns: repeat(auto-fit, minmax(...))`),
  no layout framework.
- **State/variant styling**: BEM-ish modifier classes applied via Angular
  class bindings, e.g. `[class.active]="activeRoute === 'dashboard'"`,
  `[class.has-event]="hasEvent(day)"`, `.stat-card.stat-info`/`.stat-danger`/
  `.stat-success` for card color variants. Follow this modifier-class pattern
  (base class + state class) for new variant styling rather than inline
  `[style.*]` bindings — the one exception already in the codebase
  (`[style.background]="type.color"` for dynamic request-type colors) is for
  a genuinely data-driven color, not a fixed variant.
- Sidebar width (`260px`) and its `margin-left: 260px` counterpart on
  `.main-content` are hardcoded in multiple component SCSS files (dashboard,
  forms, etc.) rather than tokenized — if Figma changes sidebar width, expect
  to update it in each component, or take the opportunity to promote it to a
  `--sidebar-width` token in `styles.scss` if asked to do a broader cleanup.

## 8. Project Structure

```
src/
├── app/
│   ├── components/        # all feature UI, see §3 for full tree
│   ├── services/           # AuthService, ApiService, FormStorageService, PdfService
│   ├── models/              # form.model.ts — User, form data interfaces
│   ├── app.component.*      # root shell
│   ├── app.config.ts         # standalone providers (router, http, toastr, ngx-mask, animations)
│   └── app.routes.ts          # route table
├── assets/                 # img/fonts/css/js — see §5
├── environments/            # environment.ts / environment.prod.ts (API base URLs etc.)
├── index.html               # Font Awesome + Google Fonts (Inter) CDN links
└── styles.scss               # global tokens + resets, see §2
```

- **Feature organization**: by screen/request-type, not by atomic-design layer
  or by feature-domain module. `forms/` groups the twelve request-type forms
  together since they share the section/role-gating pattern; everything else
  is a flat folder under `components/`.
- **Services** are plain injectable singletons (no NgRx/Akita/state library).
  `ApiService` centralizes HTTP calls (`get`/`post`/`patch`), `AuthService`
  holds `currentUserValue` and role info consumed by nearly every component's
  `canViewSection`/`canEditSection` methods, `PdfService` wraps the
  `jspdf`/`html2canvas` globals for export, `FormStorageService` persists
  in-progress form state.
- **Models**: a single `src/app/models/form.model.ts` holds shared interfaces
  (e.g. `User`); form-specific field shapes are defined inline in each form
  component (e.g. `formData` object literals, local `interface
  RegionalExamination`/`LabTest` in `medical-exam-form.component.ts`) rather
  than centralized — follow that local-interface convention for new forms
  instead of growing the shared models file.

## 9. Practical Checklist for Figma → Code Work

1. Pull colors/type/radii/shadows from Figma variables → map to existing
   `--color-*`/`--font-size-*`/`--radius-*`/`--shadow-*` tokens in
   `src/styles.scss` by **value**. Only add a new token if no match exists.
2. Create the component under `src/app/components/<name>/` (or
   `forms/<name>/` for a request form) with co-located `.ts`/`.html`/`.scss`,
   `standalone: true`.
3. For icons: inline SVG with `fill="currentColor"`, sized via a wrapper
   class — don't pull in Font Awesome/nucleo classes.
4. For request-form screens: reuse the `app-sidebar` + `.form-header` +
   sectioned layout + `canViewSection`/`canEditSection`/`canSubmitForm` role
   pattern already established across `forms/*`.
5. For responsive behavior: mirror the `1200px`/`768px` breakpoint pattern
   already used everywhere else, don't introduce new breakpoints ad hoc.
6. Don't pull in a new CSS methodology, component library, or state
   management tool to "properly" implement a design — match the existing
   per-component SCSS + template-driven-forms + plain-services approach even
   where it's repetitive.
