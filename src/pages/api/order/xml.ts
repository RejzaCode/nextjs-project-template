import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Missing or invalid order code" });
    return;
  }

  const fileName = `Objednavka_${code}.xml`;
  // Use absolute path from project root
  const filePath = path.join(process.cwd(), "Soubory", "XML", fileName);

  console.log("Looking for XML file at:", filePath);

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      console.error("File not found or not a file:", filePath, statErr);
      res.status(404).json({ error: "XML file not found" });
      return;
    }

    fs.readFile(filePath, "utf-8", (err, data) => {
      if (err) {
        console.error("Error reading XML file:", filePath, err);
        res.status(500).json({ error: "Error reading XML file" });
        return;
      }
      res.setHeader("Content-Type", "application/xml");
      res.status(200).send(data);
    });
  });
}
