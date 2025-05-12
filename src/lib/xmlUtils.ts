export function parseOrderXml(xmlString: string): { email: string; phone: string } {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlString, "application/xml");

    // Extract email from <conemail> tag
    const emailElement = xmlDoc.getElementsByTagName("conemail")[0];
    // Extract phone from <contel1> tag
    const phoneElement = xmlDoc.getElementsByTagName("contel1")[0];

    if (!emailElement || !phoneElement) {
      throw new Error("Missing conemail or contel1 element in XML.");
    }

    const email = emailElement.textContent?.trim();
    const phone = phoneElement.textContent?.trim();

    if (!email || !phone) {
      throw new Error("Email or phone content is empty.");
    }

    return { email, phone };
  } catch (error) {
    console.error("Error parsing XML:", error);
    throw error;
  }
}
