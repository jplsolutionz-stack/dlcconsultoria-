import test from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const distRoot = resolve(projectRoot, 'dist');
const htmlPath = resolve(distRoot, 'index.html');
const cssPath = resolve(distRoot, 'assets', 'styles.css');
const jsPath = resolve(distRoot, 'assets', 'site.js');

function readText(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : '';
}

function html() {
  return readText(htmlPath);
}

function css() {
  return readText(cssPath);
}

function js() {
  return readText(jsPath);
}

function attributeValues(source, attribute) {
  return [...source.matchAll(new RegExp(`${attribute}=["']([^"']+)["']`, 'gi'))]
    .map((match) => match[1]);
}

function imageSources(source) {
  return [...source.matchAll(/<img\b[^>]*\bsrc=["']([^"']+)["'][^>]*>/gi)]
    .map((match) => match[1]);
}

test('renders every required section', () => {
  const source = html();
  for (const id of ['solucoes', 'metodo', 'sobre', 'contato']) {
    assert.match(source, new RegExp(`<section[^>]+id=["']${id}["']`, 'i'));
  }
});

test('uses only confirmed conversion and social URLs', () => {
  const source = html();
  const links = attributeValues(source, 'href');
  const whatsappLinks = links.filter((href) => href.startsWith('https://wa.me/'));
  const expectedMessage = 'Olá, gostaria de conversar sobre consultoria ISO para minha empresa.';
  assert.equal(whatsappLinks.length, 3, 'every conversion point must remain covered');
  for (const href of whatsappLinks) {
    const url = new URL(href);
    assert.equal(url.origin, 'https://wa.me');
    assert.equal(url.pathname, '/5531973170620');
    assert.deepEqual([...url.searchParams.keys()], ['text']);
    assert.equal(url.searchParams.get('text'), expectedMessage);
  }
  assert.ok(links.includes('https://www.instagram.com/dlcconsultoria01/'));
  assert.ok(links.includes('https://br.linkedin.com/in/mariana-lima-9b2611210'));
});

test('keeps core content available without javascript', () => {
  const source = html();
  assert.match(source, /Transformamos requisitos em uma gestão que funciona no dia a dia/i);
  assert.match(source, /ISO 9001/i);
  assert.match(source, /ISO 14001/i);
  assert.match(source, /ISO 45001/i);
  assert.match(source, /Diagnóstico do cenário atual/i);
  assert.match(source, /Mariana Lima/i);
});

test('references existing local brand assets', () => {
  const source = html();
  const localImages = imageSources(source).filter((src) => src.startsWith('assets/'));
  assert.deepEqual(
    new Set(localImages),
    new Set([
      'assets/logo-dlc-completa.jpeg',
      'assets/logo-dlc-simbolo.jpeg',
      'assets/logo-dlc-servicos.png',
      'assets/mariana-lima.jpeg',
    ]),
  );
  for (const src of localImages) {
    assert.ok(existsSync(resolve(distRoot, src)), `${src} must exist`);
  }
});

test('presents Mariana with the supplied portrait in the about section', () => {
  const source = html();
  const about = source.match(/<section[^>]+id=["']sobre["'][^>]*>([\s\S]*?)<\/section>/i)?.[1] ?? '';
  assert.match(about, /<img\b[^>]*src=["']assets\/mariana-lima\.jpeg["'][^>]*>/i);
  assert.match(about, /alt=["']Mariana Lima, proprietária e consultora da DLC["']/i);
});

test('stagger timing stays fluid and bounded within each reveal group', async () => {
  const moduleUrl = `${new URL(`file:///${jsPath.replace(/\\/g, '/')}`).href}?stagger=${Date.now()}`;
  const { getRevealDelay } = await import(moduleUrl);
  assert.deepEqual([0, 1, 2, 3, 4].map(getRevealDelay), [0, 55, 110, 165, 0]);
});

test('uses a single h1 with ordered section headings', () => {
  const source = html();
  assert.equal((source.match(/<h1(?:\s|>)/gi) ?? []).length, 1);
  assert.ok((source.match(/<h2(?:\s|>)/gi) ?? []).length >= 5);
  assert.doesNotMatch(source, /<h3(?:\s|>)[\s\S]*?<h1(?:\s|>)/i);
});

test('defines the approved brand tokens', () => {
  const source = css();
  for (const token of [
    '--color-ink',
    '--color-blue',
    '--color-green',
    '--color-lime',
    '--color-warm',
    '--ease-out',
  ]) {
    assert.match(source, new RegExp(`${token}\\s*:`));
  }
});

test('avoids forbidden motion and layout patterns', () => {
  const source = css();
  assert.ok(source.length > 0, 'stylesheet must exist');
  assert.doesNotMatch(source, /transition\s*:\s*all\b/i);
  assert.doesNotMatch(source, /scale\(0(?:\.0+)?\)/i);
  assert.doesNotMatch(source, /\bease-in\b(?!-out)/i);
});

test('contains mobile and desktop breakpoints', () => {
  const source = css();
  assert.match(source, /@media\s*\([^)]*max-width\s*:\s*760px/i);
  assert.match(source, /@media\s*\([^)]*min-width\s*:\s*1100px/i);
});

test('provides visible focus styles', () => {
  const source = css();
  assert.match(source, /:focus-visible/);
  assert.match(source, /outline\s*:/i);
  assert.match(source, /\.skip-link/);
});

test('mobile menu exposes and updates aria state', async () => {
  assert.ok(existsSync(jsPath), 'site.js must exist');
  const toggle = {
    attributes: new Map([['aria-expanded', 'false']]),
    label: { textContent: 'Abrir menu' },
    setAttribute(name, value) { this.attributes.set(name, value); },
    getAttribute(name) { return this.attributes.get(name); },
    querySelector(selector) { return selector === '.sr-only' ? this.label : null; },
  };
  const menu = { dataset: {} };
  globalThis.document = {
    querySelector(selector) {
      if (selector === '.js-menu-toggle') return toggle;
      if (selector === '.js-mobile-menu') return menu;
      return null;
    },
  };

  try {
    const { setMenuOpen } = await import(`${new URL(`file:///${jsPath.replace(/\\/g, '/')}`).href}?test=${Date.now()}`);
    setMenuOpen(true);
    assert.equal(toggle.getAttribute('aria-expanded'), 'true');
    assert.equal(toggle.label.textContent, 'Fechar menu');
    assert.equal(menu.dataset.open, 'true');
    setMenuOpen(false);
    assert.equal(toggle.getAttribute('aria-expanded'), 'false');
    assert.equal(toggle.label.textContent, 'Abrir menu');
    assert.equal(menu.dataset.open, 'false');
  } finally {
    delete globalThis.document;
  }
});

test('javascript is progressive enhancement only', () => {
  const source = html();
  assert.match(source, /<html[^>]+class=["']no-js["']/i);
  assert.doesNotMatch(source, /classList\.replace\(['"]no-js['"],\s*['"]js['"]\)/i);
  assert.match(js(), /classList\.add\(['"]menu-ready['"]\)/i);
  const nav = source.match(/<nav\b[^>]*class=["'][^"']*js-mobile-menu[^"']*["'][^>]*>/i)?.[0] ?? '';
  assert.ok(nav.length > 0, 'mobile navigation must exist in HTML');
  assert.doesNotMatch(nav, /\bhidden\b/i);
});

test('keeps focus and small supporting text at accessible contrast', () => {
  const source = css();
  assert.match(source, /:focus-visible\s*\{[^}]*outline\s*:\s*3px\s+solid\s+#07558a/is);
  assert.match(source, /\.hero-note\s*\{[^}]*color\s*:\s*#526675/is);
  assert.match(source, /\.footer-bottom\s*\{[^}]*color\s*:\s*rgba\(255,\s*255,\s*255,\s*0\.72\)/is);
});

test('accounts for device safe areas when viewport-fit is enabled', () => {
  const source = css();
  assert.match(source, /env\(safe-area-inset-top/i);
  assert.match(source, /env\(safe-area-inset-left/i);
  assert.match(source, /env\(safe-area-inset-right/i);
});

test('reduced motion removes transform reveals', () => {
  const source = css();
  const block = source.match(/@media\s*\(prefers-reduced-motion:\s*reduce\)\s*\{([\s\S]*?)\n\}/i)?.[1] ?? '';
  assert.ok(block.length > 0, 'reduced-motion media query must exist');
  assert.match(block, /\.js-reveal/);
  assert.match(block, /transform\s*:\s*none/i);
  assert.match(block, /\.button:hover/);
  assert.match(block, /\.standard-card:hover/);
});

test('hover motion is pointer gated', () => {
  const source = css();
  const block = source.match(/@media\s*\(hover:\s*hover\)\s*and\s*\(pointer:\s*fine\)\s*\{([\s\S]*?)\n\}/i)?.[1] ?? '';
  assert.ok(block.length > 0, 'hover capability query must exist');
  assert.match(block, /:hover/);
});

test('mobile platform metadata is safe', () => {
  const markup = html();
  const styles = css();
  assert.match(markup, /viewport-fit=cover/i);
  assert.doesNotMatch(markup, /user-scalable\s*=\s*no|maximum-scale\s*=\s*1/i);
  assert.match(styles, /touch-action\s*:\s*manipulation/i);
  assert.match(styles, /-webkit-tap-highlight-color\s*:\s*transparent/i);
  assert.ok(js().length > 0, 'progressive enhancement script must exist');
});
