import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { parseCSV } from "../src/parsers/csvParser";
import { parseJSON } from "../src/parsers/jsonParser";
import { parseXML } from "../src/parsers/xmlParser";

let directory: string;
const file = (name: string) => path.join(directory, name);

beforeEach(async () => { directory = await mkdtemp(path.join(tmpdir(), "parser-tests-")); });
afterEach(async () => { await rm(directory, { recursive: true, force: true }); });

describe("parseCSV", () => {
  it("parses CRLF files, quoted commas, escaped quotes, and multiline values", async () => {
    await writeFile(file("orders.csv"), 'name,notes\r\nCake,"sweet, large"\r\n"A ""quote""","line one\nline two"\r\n');
    await expect(parseCSV(file("orders.csv"))).resolves.toEqual([
      ["name", "notes"], ["Cake", "sweet, large"], ["A \"quote\"", "line one\nline two"],
    ]);
  });

  it("returns no rows for an empty file and rejects unterminated fields", async () => {
    await writeFile(file("empty.csv"), " \n");
    await expect(parseCSV(file("empty.csv"))).resolves.toEqual([]);
    await writeFile(file("bad.csv"), 'name,"missing end');
    await expect(parseCSV(file("bad.csv"))).rejects.toThrow("unterminated");
  });
});

describe("parseJSON", () => {
  it("preserves strings, numbers, booleans, nulls, objects, and arrays", async () => {
    await writeFile(file("data.json"), '{"name":"book","price":12.5,"available":true,"tags":["new",2],"metadata":null}');
    await expect(parseJSON(file("data.json"))).resolves.toEqual({
      name: "book", price: 12.5, available: true, tags: ["new", 2], metadata: null,
    });
  });

  it("gives clear errors for empty, malformed, and missing files", async () => {
    await writeFile(file("empty.json"), "");
    await writeFile(file("bad.json"), "{bad}");
    await expect(parseJSON(file("empty.json"))).rejects.toThrow("file is empty");
    await expect(parseJSON(file("bad.json"))).rejects.toThrow("Invalid JSON");
    await expect(parseJSON(file("missing.json"))).rejects.toThrow("Unable to read JSON");
  });
});

describe("parseXML", () => {
  it("parses nested elements, repeated elements, attributes, CDATA, and entities", async () => {
    await writeFile(file("data.xml"), '<?xml version="1.0"?><store id="7"><order><item>Cake &amp; Tea</item><tag>fresh</tag><tag><![CDATA[sale < 50%]]></tag></order><empty /></store>');
    await expect(parseXML(file("data.xml"))).resolves.toEqual({
      store: {
        "@attributes": { id: "7" },
        order: { item: "Cake & Tea", tag: ["fresh", "sale < 50%"] },
        empty: "",
      },
    });
  });

  it("gives clear errors for empty, malformed, and missing files", async () => {
    await writeFile(file("empty.xml"), "");
    await writeFile(file("bad.xml"), "<store><item>cake</store>");
    await expect(parseXML(file("empty.xml"))).rejects.toThrow("file is empty");
    await expect(parseXML(file("bad.xml"))).rejects.toThrow("mismatched closing tag");
    await expect(parseXML(file("missing.xml"))).rejects.toThrow("Unable to read XML");
  });
});
