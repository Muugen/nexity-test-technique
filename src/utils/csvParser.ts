"use server";

import csv from "csvtojson";

const parseCSV = async () => {
  const filePaths = process.cwd() + "/public/medias/properties.csv";

  try {
    const jsonArray = await csv().fromFile(filePaths);
    return jsonArray;
  } catch (error) {
    console.error("Error parsing CSV file:", error);
    throw error;
  }
};
export default parseCSV;
