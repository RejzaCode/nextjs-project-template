import { parseOrderXml } from "./xmlUtils";

interface OrderData {
  email: string;
  phone: string;
}

/**
 * Fetch and parse order XML file by order code via backend API.
 * @param orderCode - The order code in format "ODxxxxxxxx"
 * @returns OrderData with email and phone or undefined if not found/error.
 */
export async function fetchOrderData(orderCode: string): Promise<OrderData | undefined> {
  try {
    // Sanitize orderCode to extract only OD + digits
    const match = orderCode.match(/(OD\d+)/);
    const sanitizedCode = match ? match[1] : orderCode;

    // Fetch XML content from backend API
    const response = await fetch(`/api/order/xml?code=${sanitizedCode}`);
    if (!response.ok) {
      console.error(`Failed to fetch XML file for order code: ${sanitizedCode}, status: ${response.status}`);
      return undefined;
    }
    const xmlText = await response.text();
    const orderData = parseOrderXml(xmlText);
    return orderData;
  } catch (error) {
    console.error("Error fetching or parsing order XML:", error);
    return undefined;
  }
}

/**
 * Get the URL of the PDF file by order code via backend API.
 * @param orderCode - The order code in format "ODxxxxxxxx"
 * @returns URL string to the PDF file.
 */
export function getPdfUrl(orderCode: string): string {
  // Sanitize orderCode to extract only OD + digits
  const match = orderCode.match(/(OD\d+)/);
  const sanitizedCode = match ? match[1] : orderCode;

  // Return URL to backend API serving PDF file
  return `/api/order/pdf?code=${sanitizedCode}`;
}
