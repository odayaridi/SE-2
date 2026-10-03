import path from 'path';
import { parseCSV } from './parsers/csvParser';
import { parseJSON } from './parsers/jsonParser';
import { parseXML } from './parsers/xmlParser';
import logger from './util/logger';

const dataPath = (fileName: string) => path.resolve(__dirname, './data', fileName);

async function main() {
  try {
    const [csvOrders, jsonOrders, xmlOrders] = await Promise.all([
      parseCSV(dataPath('cake orders.csv')),
      parseJSON(dataPath('book orders.json')),
      parseXML(dataPath('toy orders.xml')),
    ]);

    logger.info(`Parsed ${csvOrders.length} CSV rows.`);
    logger.info(`Parsed ${Array.isArray(jsonOrders) ? jsonOrders.length : 1} JSON records.`);
    const data = xmlOrders.data;
    const xmlRowCount = typeof data === 'object' && data !== null && !Array.isArray(data) && Array.isArray(data.row)
      ? data.row.length
      : 0;
    logger.info(`Parsed ${xmlRowCount} XML rows.`);
  } catch (error) {
    logger.error(error);
  }
}

main();
