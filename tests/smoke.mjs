import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");

const inlineScripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
assert.equal(inlineScripts.length, 1, "A página deve ter um único script inline principal");
for (const source of inlineScripts) new Function(source);

const externalScripts = [...html.matchAll(/<script\s+[^>]*src="([^"]+)"[^>]*><\/script>/gi)];
assert.ok(externalScripts.length >= 6, "Dependências externas essenciais não foram encontradas");
for (const match of externalScripts) {
  const src = match[1], tag = match[0];
  assert.match(src, /\d+\.\d+/, `Dependência sem versão fixa: ${src}`);
  assert.match(tag, /integrity="sha384-[^"]+"/, `SRI ausente: ${src}`);
  assert.match(tag, /crossorigin="anonymous"/, `crossorigin ausente: ${src}`);
}

const htmlWithoutScripts = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, "");
const ids = [...htmlWithoutScripts.matchAll(/\sid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, "Há IDs estáticos duplicados");

for (const anchor of html.matchAll(/<a\b[^>]*target="_blank"[^>]*>/gi)) {
  assert.match(anchor[0], /rel="[^"]*noopener[^"]*"/, "Link externo sem noopener");
}

assert.match(html, /<meta\s+name="robots"\s+content="noindex,nofollow,noarchive">/i);
assert.match(html, /<link\s+rel="canonical"\s+href="https:\/\/sauloemanuel07\.github\.io\/teste-4\/">/i);
assert.match(html, /role="progressbar"[^>]*aria-valuenow=/i);
assert.match(html, /Fotos compartilhadas pela oficina/);
assert.match(html, /html5-qrcode@2\.3\.8/);
assert.doesNotMatch(html, /qr-print-only/);
assert.doesNotMatch(html, /window\.open\("","_blank","noopener"\)/);
assert.equal((html.match(/new QRious/g) || []).length, 1, "QRious deve ser chamado apenas pelo helper seguro");
assert.match(html, /validateImportedState\(normalizeState\(raw\)\)/, "Importação deve validar o backup antes de gravar");
assert.match(html, /Promise\.allSettled\(\[syncWorkshopPublicIndex\(latest\),syncAffectedProjections/, "Projeções independentes devem ser tentadas em conjunto");
assert.match(html, /raw\.syncedMechanicEventIds\?\.\[eventId\]/, "Eventos técnicos devem ser idempotentes");
assert.match(html, /width:min\(var\(--sidebar\),calc\(100vw - 44px\)\)/, "Menu móvel deve respeitar a largura da tela");

console.log(`Smoke test aprovado: ${externalScripts.length} dependências, ${ids.length} IDs estáticos e JavaScript válido.`);
