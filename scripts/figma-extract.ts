/**
 * figma-extract.ts
 *
 * Reads your entire Figma file ONCE via the REST API and outputs:
 *   1. figma-context.md  → paste into Windsurf to generate all components
 *   2. tokens.ts         → ready to drop into src/lib/tokens.ts
 *
 * Usage:
 *   cd notes-app-ale/scripts
 *   npx tsx figma-extract.ts
 *
 * Env vars loaded automatically from (in priority order):
 *   1. scripts/.env           ← create this for script-specific vars
 *   2. frontend/.env.local    ← reuses what you already have
 *   3. Shell environment      ← export FIGMA_TOKEN=... in terminal
 */

import * as fs from "fs";
import * as path from "path";

// ─────────────────────────────────────────
// ENV LOADING — no dotenv package needed
// Supports: KEY=value, KEY="value", KEY='value', # comments
// ─────────────────────────────────────────
function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return;
  console.log(`📄 Loading env from: ${filePath}`);
  const lines = fs.readFileSync(filePath, "utf-8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    // Shell env vars take priority — only set if not already defined
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

const scriptsDir = path.resolve(__dirname);
const rootDir = path.resolve(__dirname, "..");

loadEnvFile(path.join(scriptsDir, ".env"));                 // scripts/.env
loadEnvFile(path.join(rootDir, "frontend", ".env.local"));  // frontend/.env.local

// ─────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────
const FILE_KEY = process.env.FIGMA_FILE_KEY || "";
const TOKEN = process.env.FIGMA_TOKEN || "";
const OUTPUT_DIR = path.join(__dirname, "../.windsurf");

if (!TOKEN) {
  console.error("\n❌ FIGMA_TOKEN is missing.");
  console.error("   Add it to frontend/.env.local:\n");
  console.error("   FIGMA_TOKEN=your_token_here\n");
  process.exit(1);
}
if (!FILE_KEY) {
  console.error("\n❌ FIGMA_FILE_KEY is missing.");
  console.error("   Add it to frontend/.env.local:\n");
  console.error("   FIGMA_FILE_KEY=your_file_key_here\n");
  process.exit(1);
}
// ─────────────────────────────────────────

const BASE = "https://api.figma.com/v1";

async function figma(endpoint: string) {
  const res = await fetch(`${BASE}${endpoint}`, {
    headers: { "X-Figma-Token": TOKEN },
  });
  if (!res.ok) throw new Error(`Figma API error ${res.status}: ${endpoint}`);
  return res.json();
}

// ── Helpers ──────────────────────────────

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.round(v * 255).toString(16).padStart(2, "0"))
      .join("")
  );
}

function getFill(node: any): string {
  const fill = node.fills?.[0];
  if (!fill || fill.type !== "SOLID") return "none";
  const { r, g, b } = fill.color;
  const hex = rgbToHex(r, g, b);
  const opacity = fill.opacity !== undefined ? fill.opacity : 1;
  return opacity < 1 ? `${hex} / ${Math.round(opacity * 100)}%` : hex;
}

function getTextStyle(node: any): Record<string, string> {
  if (!node.style) return {};
  return {
    fontFamily: node.style.fontFamily,
    fontSize: `${node.style.fontSize}px`,
    fontWeight: String(node.style.fontWeight),
    lineHeight: node.style.lineHeightPx
      ? `${node.style.lineHeightPx}px`
      : "auto",
    letterSpacing: node.style.letterSpacing
      ? `${node.style.letterSpacing}px`
      : "0",
    textAlign: node.style.textAlignHorizontal?.toLowerCase() || "left",
  };
}

function getLayout(node: any): Record<string, string> {
  const layout: Record<string, string> = {};
  if (node.layoutMode) {
    layout.direction =
      node.layoutMode === "HORIZONTAL" ? "flex-row" : "flex-col";
    layout.gap = node.itemSpacing ? `${node.itemSpacing}px` : "0";
    layout.paddingTop = `${node.paddingTop ?? 0}px`;
    layout.paddingRight = `${node.paddingRight ?? 0}px`;
    layout.paddingBottom = `${node.paddingBottom ?? 0}px`;
    layout.paddingLeft = `${node.paddingLeft ?? 0}px`;
    layout.justifyContent = node.primaryAxisAlignItems || "MIN";
    layout.alignItems = node.counterAxisAlignItems || "MIN";
  }
  if (node.absoluteBoundingBox) {
    layout.width = `${Math.round(node.absoluteBoundingBox.width)}px`;
    layout.height = `${Math.round(node.absoluteBoundingBox.height)}px`;
  }
  if (node.cornerRadius) layout.borderRadius = `${node.cornerRadius}px`;
  if (node.topLeftRadius) {
    layout.borderRadius = `${node.topLeftRadius}px ${node.topRightRadius}px ${node.bottomRightRadius}px ${node.bottomLeftRadius}px`;
  }
  return layout;
}

function getEffects(node: any): string[] {
  return (node.effects || []).map((e: any) => {
    if (e.type === "DROP_SHADOW") {
      const { r, g, b, a } = e.color;
      return `shadow: ${e.offset.x}px ${e.offset.y}px ${e.radius}px rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)},${a.toFixed(2)})`;
    }
    if (e.type === "INNER_SHADOW") return `inner-shadow: ${e.radius}px`;
    if (e.type === "LAYER_BLUR") return `blur: ${e.radius}px`;
    return e.type;
  });
}

// Colors Figma uses internally for its own UI — not real design values
const FIGMA_INTERNAL_COLORS = new Set([
  "#9747ff", // component boundary purple (dev mode)
  "#18a0fb", // frame selection blue
  "#1abcfe", // figma brand blue
  "#0acf83", // figma green
  "#ff7262", // figma prototype red
  "#f24e1e", // figma orange
]);

function getBorder(node: any): Record<string, string> {
  const border: Record<string, string> = {};
  if (node.strokes?.length) {
    const stroke = node.strokes[0];
    if (!stroke.color) return border;
    const { r, g, b } = stroke.color;
    const hex = rgbToHex(r, g, b);
    // Skip Figma annotation colors — these are UI chrome, not design values
    if (FIGMA_INTERNAL_COLORS.has(hex.toLowerCase())) return border;
    border.borderColor = hex;
    border.borderWidth = `${node.strokeWeight}px`;
    border.borderStyle = stroke.type?.toLowerCase() || "solid";
  }
  return border;
}

// ── Traversal ─────────────────────────────

interface ComponentInfo {
  name: string;
  nodeId: string;
  type: string;
  description: string;
  variants: VariantInfo[];
  layout: Record<string, string>;
  fill: string;
  border: Record<string, string>;
  effects: string[];
  children: ChildInfo[];
}

interface VariantInfo {
  name: string;
  properties: Record<string, string>;
  layout: Record<string, string>;
  fill: string;
  textStyle?: Record<string, string>;
  effects: string[];
  border: Record<string, string>;
}

interface ChildInfo {
  name: string;
  type: string;
  fill: string;
  textStyle?: Record<string, string>;
  layout: Record<string, string>;
  text?: string;
  effects: string[];
  border: Record<string, string>;
}

function extractChildren(nodes: any[]): ChildInfo[] {
  return (nodes || []).map((child) => {
    const info: ChildInfo = {
      name: child.name,
      type: child.type,
      fill: getFill(child),
      layout: getLayout(child),
      effects: getEffects(child),
      border: getBorder(child),
    };
    if (child.type === "TEXT") {
      info.textStyle = getTextStyle(child);
      info.text = child.characters;
    }
    return info;
  });
}

function extractComponentSet(node: any): ComponentInfo {
  const variants: VariantInfo[] = [];

  if (node.children) {
    for (const child of node.children) {
      if (child.type === "COMPONENT") {
        variants.push({
          name: child.name,
          properties: child.componentPropertyDefinitions || {},
          layout: getLayout(child),
          fill: getFill(child),
          textStyle: getTextStyle(child),
          effects: getEffects(child),
          border: getBorder(child),
        });
      }
    }
  }

  return {
    name: node.name,
    nodeId: node.id,
    type: node.type,
    description: node.description || "",
    variants,
    layout: getLayout(node),
    fill: getFill(node),
    border: getBorder(node),
    effects: getEffects(node),
    children: extractChildren(node.children || []),
  };
}

function traverse(
  node: any,
  components: ComponentInfo[],
  styles: any[],
  seenIds: Set<string>,
  depth = 0
) {
  // Skip INSTANCE nodes — they are copies of components, not definitions
  // This is the main cause of duplicates in the output
  if (node.type === "INSTANCE") return;

  if (node.type === "COMPONENT_SET") {
    // Only process each node ID once
    if (!seenIds.has(node.id)) {
      seenIds.add(node.id);
      components.push(extractComponentSet(node));
    }
    // Don't recurse into component set children — extractComponentSet handles them
    return;
  }

  // Top-level COMPONENT (not inside a COMPONENT_SET) — treat as single-variant component
  if (node.type === "COMPONENT") {
    if (!seenIds.has(node.id)) {
      seenIds.add(node.id);
      components.push(extractComponentSet(node));
    }
    return;
  }

  if (node.type === "TEXT" && node.styles) {
    styles.push({
      name: node.name,
      text: node.characters,
      style: getTextStyle(node),
    });
  }

  if (node.children) {
    for (const child of node.children) {
      traverse(child, components, styles, seenIds, depth + 1);
    }
  }
}

// ── Token extraction ──────────────────────

// Walk the node tree to collect fills for style IDs
function collectStyleFills(
  node: any,
  styleToFill: Record<string, string>
): void {
  if (node.styles?.fill && node.fills?.[0]?.color) {
    const { r, g, b } = node.fills[0].color;
    const hex = rgbToHex(r, g, b);
    if (!FIGMA_INTERNAL_COLORS.has(hex.toLowerCase())) {
      styleToFill[node.styles.fill] = hex;
    }
  }
  if (node.children) {
    for (const child of node.children) {
      collectStyleFills(child, styleToFill);
    }
  }
}

function extractTokens(stylesData: any, fileData: any): string {
  const styleMap = fileData.styles || {};
  const styleToFill: Record<string, string> = {};

  // Walk tree to map style IDs → actual hex values
  collectStyleFills(fileData.document, styleToFill);

  // Build color tokens from real Figma styles
  const colorEntries: string[] = [];
  const textEntries: string[] = [];

  for (const [nodeId, style] of Object.entries(styleMap) as any) {
    const rawName = style.name as string;
    // Skip Figma internal styles
    if (rawName.startsWith("_") || rawName.includes("figma")) continue;

    const tokenName = rawName
      .replace(/\//g, ".")
      .replace(/\s+/g, "-")
      .toLowerCase();

    if (style.styleType === "FILL") {
      const hex = styleToFill[nodeId] || "/* value not found — check Figma */";
      colorEntries.push(`    "${tokenName}": "${hex}"`);
    }
    if (style.styleType === "TEXT") {
      textEntries.push(`    "${tokenName}": {}`);
    }
  }

  const colorsBlock = colorEntries.length
    ? colorEntries.join(",\n")
    : `    // No color styles found in this Figma file.
    // Make sure your colors are defined as Figma Styles (not just local fills).
    // Primary color placeholder — replace with your actual value:
    primary: "#REPLACE_ME"`;

  return `// src/lib/tokens.ts
// Auto-generated by figma-extract.ts — do not edit manually
// Re-run npm run extract to update from Figma

export const tokens = {
  colors: {
${colorsBlock}
  },
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'JetBrains Mono, monospace',
    },
    scale: {
      xs:   '0.75rem',   // 12px
      sm:   '0.875rem',  // 14px
      base: '1rem',      // 16px
      lg:   '1.125rem',  // 18px
      xl:   '1.25rem',   // 20px
      '2xl':'1.5rem',    // 24px
      '3xl':'1.875rem',  // 30px
      '4xl':'2.25rem',   // 36px
    },
    weight: {
      normal:    400,
      medium:    500,
      semibold:  600,
      bold:      700,
    },
    lineHeight: {
      tight:  '1.25',
      snug:   '1.375',
      normal: '1.5',
      relaxed:'1.625',
    },
  },
  spacing: {
    px:   '1px',
    0.5:  '0.125rem',
    1:    '0.25rem',
    2:    '0.5rem',
    3:    '0.75rem',
    4:    '1rem',
    5:    '1.25rem',
    6:    '1.5rem',
    8:    '2rem',
    10:   '2.5rem',
    12:   '3rem',
    16:   '4rem',
    20:   '5rem',
    24:   '6rem',
  },
  radius: {
    none: '0',
    sm:   '0.25rem',   // 4px
    md:   '0.375rem',  // 6px
    lg:   '0.5rem',    // 8px
    xl:   '0.75rem',   // 12px
    '2xl':'1rem',      // 16px
    full: '9999px',
  },
  shadows: {
    sm:  '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md:  '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg:  '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl:  '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  },
} as const

export type ColorToken = keyof typeof tokens.colors
export type Tokens = typeof tokens
`;
}

// ── Markdown output ───────────────────────

// ── Intent inference helpers ──────────────

function inferComponentRole(name: string, node: any): string {
  const n = name.toLowerCase();
  if (n.includes("button") || n.includes("btn")) return "interactive-button";
  if (n.includes("input") || n.includes("field") || n.includes("textfield")) return "form-input";
  if (n.includes("card")) return "content-card";
  if (n.includes("modal") || n.includes("dialog")) return "overlay";
  if (n.includes("nav") || n.includes("header")) return "navigation";
  if (n.includes("sidebar")) return "layout-sidebar";
  if (n.includes("badge") || n.includes("tag") || n.includes("chip")) return "label";
  if (n.includes("avatar")) return "user-avatar";
  if (n.includes("icon")) return "icon-wrapper";
  if (n.includes("list")) return "list-container";
  if (n.includes("empty")) return "empty-state";
  if (n.includes("toast") || n.includes("alert") || n.includes("notification")) return "feedback";
  if (n.includes("dropdown") || n.includes("select") || n.includes("menu")) return "dropdown";
  if (n.includes("checkbox") || n.includes("radio") || n.includes("toggle") || n.includes("switch")) return "form-control";
  if (n.includes("search")) return "search-input";
  if (n.includes("editor") || n.includes("textarea")) return "text-editor";
  return "ui-component";
}

function inferHtmlElement(role: string): string {
  const map: Record<string, string> = {
    "interactive-button": "button (with onClick, type, disabled props)",
    "form-input": "input (with value, onChange, placeholder, disabled props)",
    "text-editor": "textarea (with value, onChange, rows props)",
    "form-control": "input[type=checkbox|radio] or div with role",
    "content-card": "article or div (with semantic children)",
    "overlay": "dialog or div with role=dialog and aria-modal",
    "navigation": "nav with ul/li links",
    "layout-sidebar": "aside (with children slot)",
    "label": "span (inline) or div (block)",
    "user-avatar": "div with img or initials fallback",
    "list-container": "ul with li children",
    "empty-state": "div with aria-live for dynamic content",
    "feedback": "div with role=alert or role=status",
    "dropdown": "div with role=listbox and keyboard nav",
    "search-input": "input[type=search] with role=searchbox",
    "icon-wrapper": "span with aria-hidden=true",
    "ui-component": "div (assess context and choose appropriate element)",
  };
  return map[role] || "div";
}

function inferIsInteractive(role: string): boolean {
  return ["interactive-button", "form-input", "form-control", "dropdown", "search-input", "text-editor"].includes(role);
}

function variantNamesToProps(variants: VariantInfo[]): string {
  // Extract unique property keys from variant names like "Type=Primary, Size=MD, State=Default"
  const propMap: Record<string, Set<string>> = {};
  for (const v of variants) {
    const parts = v.name.split(",").map((p) => p.trim());
    for (const part of parts) {
      const [key, val] = part.split("=").map((s) => s.trim());
      if (key && val) {
        if (!propMap[key]) propMap[key] = new Set();
        propMap[key].add(val);
      }
    }
  }
  if (!Object.keys(propMap).length) return "";
  return Object.entries(propMap)
    .map(([key, vals]) => `  ${key.toLowerCase()}: ${[...vals].map((v) => `"${v.toLowerCase()}"`).join(" | ")}`)
    .join("\n");
}

function componentToMarkdown(c: ComponentInfo): string {
  const role = inferComponentRole(c.name, c);
  const htmlEl = inferHtmlElement(role);
  const isInteractive = inferIsInteractive(role);
  const propsFromVariants = variantNamesToProps(c.variants);
  const hasVariants = c.variants.length > 1;

  let md = `### ${c.name}\n\n`;

  // Intent block — this is the key addition
  md += `**React intent:**\n`;
  md += `- Role: \`${role}\`\n`;
  md += `- Render as: \`${htmlEl}\`\n`;
  md += `- Needs \`"use client"\`: ${isInteractive ? "yes (has interactions)" : "no (presentational)"}\n`;
  md += `- Use \`cva\`: ${hasVariants ? "yes" : "no"}\n`;
  md += `- Use \`forwardRef\`: ${isInteractive ? "yes" : "no"}\n`;
  if (propsFromVariants) {
    md += `- Inferred props from variants:\n\`\`\`typescript\n${propsFromVariants}\n\`\`\`\n`;
  }
  md += `\n`;

  // Visual spec — compact, only what's needed
  md += `**Visual spec:**\n`;
  const l = c.layout;
  if (l.direction) md += `- Layout: \`${l.direction}\`, gap: \`${l.gap}\`\n`;
  if (l.paddingTop) md += `- Padding: \`${l.paddingTop} ${l.paddingRight} ${l.paddingBottom} ${l.paddingLeft}\`\n`;
  if (l.borderRadius) md += `- Border radius: \`${l.borderRadius}\`\n`;
  if (c.fill !== "none") md += `- Background: \`${c.fill}\` → map to token\n`;
  if (Object.keys(c.border).length) md += `- Border: \`${c.border.borderWidth} ${c.border.borderStyle} ${c.border.borderColor}\`\n`;
  if (c.effects.length) md += `- Effects: ${c.effects.join(", ")}\n`;
  if (l.width && !l.width.includes("undefined")) md += `- Base size: \`${l.width} × ${l.height}\`\n`;

  // Variants — only visual diffs, not full repeat
  if (hasVariants) {
    md += `\n**Variant visual diffs** (implement as cva):\n`;
    for (const v of c.variants) {
      const parts = v.name.split(",").map((p) => p.trim()).join(", ");
      const diffs: string[] = [];
      if (v.fill !== c.fill && v.fill !== "none") diffs.push(`bg: \`${v.fill}\``);
      if (v.layout.borderRadius !== l.borderRadius && v.layout.borderRadius) diffs.push(`radius: \`${v.layout.borderRadius}\``);
      if (v.effects.length) diffs.push(`effects: ${v.effects.join(", ")}`);
      if (v.textStyle?.fontSize) diffs.push(`font: \`${v.textStyle.fontSize}/${v.textStyle.fontWeight}\``);
      if (Object.keys(v.border).length) diffs.push(`border: \`${v.border.borderWidth} ${v.border.borderColor}\``);
      if (diffs.length) {
        md += `- \`${parts}\` → ${diffs.join(", ")}\n`;
      } else {
        md += `- \`${parts}\` → same base styles\n`;
      }
    }
  }

  // Children — only text nodes and key structural children
  const meaningfulChildren = c.children.filter(
    (ch) => ch.type === "TEXT" || ch.type === "VECTOR" || ch.name.toLowerCase().includes("icon")
  );
  if (meaningfulChildren.length) {
    md += `\n**Key children:**\n`;
    for (const ch of meaningfulChildren) {
      if (ch.type === "TEXT") {
        md += `- Text \`"${ch.text || ch.name}"\`: font \`${ch.textStyle?.fontSize}/${ch.textStyle?.fontWeight}\`, color \`${ch.fill}\`\n`;
      } else {
        md += `- Icon/Vector \`${ch.name}\`: size \`${ch.layout.width} × ${ch.layout.height}\`\n`;
      }
    }
  }

  return md + "\n";
}

function buildContextFile(
  components: ComponentInfo[],
  fileData: any
): string {
  const groups: Record<string, ComponentInfo[]> = {};

  for (const c of components) {
    const group = c.name.split("/")[0].trim();
    if (!groups[group]) groups[group] = [];
    groups[group].push(c);
  }

  // Separate loose frames (non-components) from proper components
  const properComponents = components.filter(
    (c) => c.type === "COMPONENT_SET" || c.variants.length > 0
  );
  const looseFrames = components.filter(
    (c) => c.type === "FRAME" && c.variants.length === 0
  );

  let md = `# Figma Design Context — notes-app-ale
> Auto-generated by figma-extract.ts
> File: ${fileData.name}
> Last modified: ${fileData.lastModified}
> Components found: ${properComponents.length} component sets, ${looseFrames.length} loose frames

This is a **React-oriented** design spec. Each entry describes:
1. What React element/pattern to use (intent)
2. The visual values to apply (spec)
3. How variants map to props (cva)

Do NOT copy values literally. Interpret them as a senior React developer would.

---

## Design Tokens

| Token | Value | Tailwind key |
|---|---|---|
| Primary | #6366F1 | primary |
| Primary Hover | #4F46E5 | primary-hover |
| Background | #FFFFFF | background |
| Surface | #F9FAFB | surface |
| Border | #E5E7EB | border |
| Text Primary | #111827 | text-primary |
| Text Secondary | #6B7280 | text-secondary |
| Font Family | Inter | font-sans |
| Base Font Size | 16px | text-base |
| Base Border Radius | 8px | rounded-lg |

---

## Component Sets (${properComponents.length} total)

`;

  for (const [group, items] of Object.entries(groups)) {
    const groupComponents = items.filter(
      (c) => c.type === "COMPONENT_SET" || c.variants.length > 0
    );
    if (!groupComponents.length) continue;
    md += `## ${group}\n\n`;
    for (const item of groupComponents) {
      md += componentToMarkdown(item);
    }
    md += "---\n\n";
  }

  if (looseFrames.length) {
    md += `## Loose Frames (${looseFrames.length} — treat as page sections or one-off layouts)\n\n`;
    for (const frame of looseFrames) {
      md += `### ${frame.name}\n`;
      md += `- Size: \`${frame.layout.width} × ${frame.layout.height}\`\n`;
      md += `- Children: ${frame.children.length} elements\n`;
      md += `- Treat as: page section or layout wrapper, not a reusable component\n\n`;
    }
    md += "---\n\n";
  }

  md += `
---

## Integration Prompt — paste this after the spec above into Windsurf Cascade

\`\`\`
You are a senior React/Next.js engineer. Above is a design spec for the notes-app-ale frontend.

IMPORTANT: This spec is an INPUT for your engineering judgment, not instructions to copy literally.
Read it the way a developer reads a Figma handoff:
- Use the intent fields to decide the right React pattern
- Use the visual spec for Tailwind class values
- Use variant diffs to define cva variant keys
- Loose frames are page sections, not components

## Your task — implement the full frontend in this order:

### 1. Foundation
- frontend/src/lib/tokens.ts — typed design tokens
- frontend/src/lib/utils.ts — cn() helper (clsx + tailwind-merge)
- frontend/tailwind.config.ts — extend theme with tokens
- frontend/src/styles/globals.css — CSS custom properties
- frontend/__tests__/lib/tokens.test.ts — token shape tests

### 2. Base UI components (frontend/src/components/ui/)
For each component in the spec:
- Decide the right HTML element and React pattern from the intent field
- Write test FIRST (TDD — confirm Red before implementing)
- Use cva only when variants exist
- Use forwardRef for interactive elements
- TypeScript props interface — no any
- Tailwind only — map visual spec values to classes, use tokens not hex
- Export from index.ts

### 3. Notes feature components (frontend/src/components/notes/)
- Pure presentational — no data fetching
- Props must match the Note model: { id, title, body, createdAt, updatedAt, tags }
- Compose using base UI components from step 2

### 4. Layout components (frontend/src/components/layout/)
- Navbar, Sidebar, PageWrapper
- Use semantic HTML (nav, aside, main)

### 5. Pages (frontend/src/app/)
- page.tsx, login/page.tsx, not-found.tsx
- Compose from components — no layout logic in page files
- Run npm run build to verify after each page

## Non-negotiable rules
- TDD: test before implementation, every time
- TypeScript only, never any
- Tailwind only, no inline styles  
- Colors from tokens, never hardcoded hex
- Coverage must stay at 80%+
- Run npm run test after every component

Work through each step fully. After each component show:
| Property | Figma value | Tailwind class | Token used |
\`\`\`
`;

  return md;
}

// ── Main ──────────────────────────────────

async function main() {
  console.log("🔍 Fetching Figma file...");

  const fileData = await figma(`/files/${FILE_KEY}`);
  console.log(`✅ File: ${fileData.name} (last modified: ${fileData.lastModified})`);

  console.log("🔍 Traversing component tree...");
  const components: ComponentInfo[] = [];
  const styles: any[] = [];
  traverse(fileData.document, components, styles, new Set<string>());

  console.log(`✅ Found ${components.length} components`);

  // Warn if Figma file has no defined styles — common cause of bad token extraction
  const styleCount = Object.keys(fileData.styles || {}).length;
  const colorStyleCount = Object.values(fileData.styles || {}).filter(
    (s: any) => s.styleType === "FILL"
  ).length;

  if (colorStyleCount === 0) {
    console.warn(`
⚠️  No Figma Color Styles found in this file.
   Colors like #9747ff in the output are Figma UI chrome, not your design colors.
   To fix: In Figma, select a color → right-click → "Create style"
   Then re-run this script and tokens.ts will have your real colors.
   For now, tokens.ts has placeholders you can fill in manually.
`);
  } else {
    console.log(`✅ Found ${colorStyleCount} color styles → tokens.ts`);
  }

  // Build outputs
  const contextFile = buildContextFile(components, fileData);
  const tokensFile = extractTokens(fileData.styles, fileData);

  // Write files
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(path.join(OUTPUT_DIR, "context"), { recursive: true });

  const contextPath = path.join(OUTPUT_DIR, "context", "figma-context.md");
  const tokensPath = path.join(__dirname, "../frontend/src/lib/tokens.ts");

  fs.writeFileSync(contextPath, contextFile);
  console.log(`✅ Context file written to: ${contextPath}`);

  // Only write tokens if src/lib exists
  const libDir = path.dirname(tokensPath);
  if (fs.existsSync(libDir)) {
    fs.writeFileSync(tokensPath, tokensFile);
    console.log(`✅ Tokens written to: ${tokensPath}`);
  } else {
    const fallbackTokensPath = path.join(OUTPUT_DIR, "context", "tokens.ts");
    fs.writeFileSync(fallbackTokensPath, tokensFile);
    console.log(`✅ Tokens written to: ${fallbackTokensPath} (move to frontend/src/lib/tokens.ts)`);
  }

  console.log(`
────────────────────────────────────────
✅ Done! Next steps:

1. Open .windsurf/context/figma-context.md
2. Select all (Ctrl/Cmd + A)
3. Open Windsurf Cascade
4. Paste the entire file
5. The integration prompt is at the bottom — it tells Cascade exactly what to build

Cascade will read the full design spec and generate all components in one session.
────────────────────────────────────────
`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});