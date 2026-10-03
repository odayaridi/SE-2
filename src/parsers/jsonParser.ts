import { readFile } from "node:fs/promises";

export type JSONValue = string | number | boolean | null | JSONValue[] | { [key: string]: JSONValue };

/** Read and parse a JSON document without changing any of its JSON value types. */
export async function parseJSON<T extends JSONValue = JSONValue>(filePath: string): Promise<T> {
  let content: string;
  try { content = await readFile(filePath, "utf8"); }
  catch (error) { throw new Error(`Unable to read JSON file "${filePath}": ${messageOf(error)}`, { cause: error }); }
  if (content.trim() === "") throw new Error(`Invalid JSON in "${filePath}": file is empty.`);
  try { return JSON.parse(content) as T; }
  catch (error) { throw new Error(`Invalid JSON in "${filePath}": ${messageOf(error)}`, { cause: error }); }
}

function messageOf(error: unknown): string { return error instanceof Error ? error.message : String(error); }
