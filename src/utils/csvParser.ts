"use server";

import csv from "csvtojson";

const parseCSV = async () => {
  const filePaths = process.cwd() + "/public/medias/properties.csv";
  console.log({ filePaths });

  try {
    const jsonArray = await csv().fromFile(filePaths);
    // console.log(process.cwd());
    console.log(jsonArray);
    return jsonArray;
  } catch (error) {
    console.error("Error parsing CSV file:", error);
    throw error;
  }
};
export default parseCSV;
