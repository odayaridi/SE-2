import { readFile } from "node:fs/promises";

export type XMLValue = string | { [key: string]: XMLValue | XMLValue[] };
type XMLObject = { [key: string]: XMLValue | XMLValue[] };
interface XMLNode { name: string; attributes: Record<string, string>; children: XMLNode[]; text: string; }

/**
 * Read XML into a plain object. The root is retained; repeated siblings become
 * arrays; attributes and mixed text use `@attributes` and `#text` respectively.
 */
export async function parseXML(filePath: string): Promise<XMLObject> {
  let content: string;
  try { content = await readFile(filePath, "utf8"); }
  catch (error) { throw new Error(`Unable to read XML file "${filePath}": ${messageOf(error)}`, { cause: error }); }
  if (content.trim() === "") throw new Error(`Invalid XML in "${filePath}": file is empty.`);
  try { const root = parseDocument(content); return { [root.name]: toValue(root) }; }
  catch (error) { throw new Error(`Invalid XML in "${filePath}": ${messageOf(error)}`, { cause: error }); }
}

function parseDocument(xml: string): XMLNode {
  const tokens = xml.match(/<!--[\s\S]*?-->|<!\[CDATA\[[\s\S]*?\]\]>|<\?[\s\S]*?\?>|<[^>]+>|[^<]+/g) ?? [];
  const stack: XMLNode[] = [];
  let root: XMLNode | undefined;
  for (const token of tokens) {
    if (token.startsWith("<?") || token.startsWith("<!--")) continue;
    if (token.startsWith("<![CDATA[")) {
      if (!stack.length) throw new Error("text appears outside the root element.");
      stack[stack.length - 1].text += token.slice(9, -3); continue;
    }
    if (token.startsWith("</")) {
      const name = token.slice(2, -1).trim(); const node = stack.pop();
      if (!node || node.name !== name) throw new Error(`mismatched closing tag </${name}>.`);
      continue;
    }
    if (token.startsWith("<")) {
      if (token.startsWith("<!")) throw new Error("unsupported declaration.");
      const selfClosing = /\/\s*>$/.test(token);
      const inner = token.slice(1, selfClosing ? -2 : -1).trim();
      const match = /^([A-Za-z_][\w.:-]*)([\s\S]*)$/.exec(inner);
      if (!match) throw new Error(`invalid opening tag ${token}.`);
      const node: XMLNode = { name: match[1], attributes: parseAttributes(match[2]), children: [], text: "" };
      if (stack.length) stack[stack.length - 1].children.push(node);
      else if (root) throw new Error("document must contain exactly one root element.");
      else root = node;
      if (!selfClosing) stack.push(node);
      continue;
    }
    if (!stack.length && token.trim()) throw new Error("text appears outside the root element.");
    if (stack.length) stack[stack.length - 1].text += decodeEntities(token);
  }
  if (stack.length) throw new Error(`unclosed element <${stack[stack.length - 1].name}>.`);
  if (!root) throw new Error("document has no root element.");
  return root;
}

function parseAttributes(source: string): Record<string, string> {
  const attributes: Record<string, string> = {};
  const pattern = /\s+([A-Za-z_][\w.:-]*)\s*=\s*("[^"]*"|'[^']*')/g;
  let consumed = ""; let match: RegExpExecArray | null;
  while ((match = pattern.exec(source)) !== null) {
    if (attributes[match[1]] !== undefined) throw new Error(`duplicate attribute "${match[1]}".`);
    attributes[match[1]] = decodeEntities(match[2].slice(1, -1)); consumed += match[0];
  }
  if (consumed.trim() !== source.trim()) throw new Error(`invalid attribute syntax in <${source.trim()}>.`);
  return attributes;
}

function toValue(node: XMLNode): XMLValue {
  const text = node.text.trim();
  if (!node.children.length && !Object.keys(node.attributes).length) return text;
  const value: XMLObject = {};
  if (Object.keys(node.attributes).length) value["@attributes"] = node.attributes as unknown as XMLValue;
  if (text) value["#text"] = text;
  for (const child of node.children) {
    const childValue = toValue(child); const existing = value[child.name];
    value[child.name] = existing === undefined ? childValue : Array.isArray(existing) ? [...existing, childValue] : [existing, childValue];
  }
  return value;
}

function decodeEntities(value: string): string {
  return value.replace(/&(lt|gt|amp|quot|apos);/g, (_match, entity: string) => ({ lt: "<", gt: ">", amp: "&", quot: '"', apos: "'" })[entity] ?? "");
}
function messageOf(error: unknown): string { return error instanceof Error ? error.message : String(error); }
