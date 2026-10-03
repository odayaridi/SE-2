import { readFile } from "node:fs/promises";

/** Parse an RFC-4180-style CSV file into rows of string values. */
export async function parseCSV(filePath: string): Promise<string[][]> {
  let content: string;
  try {
    content = await readFile(filePath, "utf8");
  } catch (error) {
    throw new Error(`Unable to read CSV file "${filePath}": ${messageOf(error)}`, { cause: error });
  }

  if (content.trim() === "") return [];
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];
    if (quoted) {
      if (character === '"' && content[index + 1] === '"') { field += '"'; index += 1; }
      else if (character === '"') quoted = false;
      else field += character;
      continue;
    }
    if (character === '"') {
      if (field !== "") throw new Error(`Invalid CSV: unexpected quote at character ${index}.`);
      quoted = true;
    } else if (character === ",") { row.push(field); field = ""; }
    else if (character === "\n" || character === "\r") {
      if (character === "\r" && content[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((value) => value !== "")) rows.push(row);
      row = []; field = "";
    } else field += character;
  }
  if (quoted) throw new Error("Invalid CSV: unterminated quoted field.");
  row.push(field);
  if (row.some((value) => value !== "")) rows.push(row);
  return rows;
}

function messageOf(error: unknown): string { return error instanceof Error ? error.message : String(error); }
