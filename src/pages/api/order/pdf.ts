import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import fs from "fs";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { code } = req.query;

  if (!code || typeof code !== "string") {
    res.status(400).json({ error: "Missing or invalid order code" });
    return;
  }

  const fileName = `Objednavka_${code}.pdf`;
  // Use absolute path from project root
  const filePath = path.join(process.cwd(), "Soubory", "PDF", fileName);

  fs.stat(filePath, (statErr, stats) => {
    if (statErr || !stats.isFile()) {
      res.status(404).json({ error: "PDF file not found" });
      return;
    }

    res.setHeader("Content-Type", "application/pdf");
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);
  });
}
