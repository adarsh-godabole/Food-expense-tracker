import { google } from "googleapis";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export function getAuthUrl() {
  const scopes = ["https://www.googleapis.com/auth/gmail.readonly"];

  return oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });
}

export async function getTokenFromCode(code: string) {
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export async function refreshAccessToken(refreshToken: string) {
  oauth2Client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await oauth2Client.refreshAccessToken();
  return credentials;
}

export async function fetchOrderEmails(
  accessToken: string,
  startDate?: string,
  endDate?: string
) {
  oauth2Client.setCredentials({ access_token: accessToken });
  const gmail = google.gmail({ version: "v1", auth: oauth2Client });

  // Use provided dates or default to 2 months ago
  let afterDate: string;
  let beforeDate: string;

  if (startDate && endDate) {
    // Convert YYYY-MM-DD to YYYY/MM/DD format for Gmail query
    afterDate = startDate.replace(/-/g, '/');
    beforeDate = endDate.replace(/-/g, '/');
  } else {
    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(twoMonthsAgo.getMonth() - 2);
    afterDate = twoMonthsAgo.toISOString().split('T')[0].replace(/-/g, '/');
    beforeDate = new Date().toISOString().split('T')[0].replace(/-/g, '/');
  }

  // Search for emails from Swiggy and Zomato within date range
  const queries = [
    `from:noreply@swiggy.in after:${afterDate} before:${beforeDate}`,
    `from:no-reply@zomato.com after:${afterDate} before:${beforeDate}`,
    `from:orders@swiggy.in after:${afterDate} before:${beforeDate}`,
    `from:order@zomato.com after:${afterDate} before:${beforeDate}`,
  ];

  const allEmails = [];

  for (const query of queries) {
    try {
      console.log(`Searching with query: ${query}`);
      const response = await gmail.users.messages.list({
        userId: "me",
        q: query,
        maxResults: 500,
      });

      console.log(`Found ${response.data.messages?.length || 0} messages for query: ${query}`);

      if (response.data.messages) {
        for (const message of response.data.messages) {
          const email = await gmail.users.messages.get({
            userId: "me",
            id: message.id!,
            format: "full",
          });

          allEmails.push(email.data);
        }
      }
    } catch (error) {
      console.error(`Error fetching emails for query "${query}":`, error);
    }
  }

  console.log(`Total emails fetched: ${allEmails.length}`);
  return allEmails;
}

export function parseOrderEmail(email: any) {
  const headers = email.payload?.headers || [];
  const getHeader = (name: string) =>
    headers.find((h: any) => h.name.toLowerCase() === name.toLowerCase())
      ?.value || "";

  const from = getHeader("from");
  const subject = getHeader("subject");
  const date = getHeader("date");

  console.log(`\n--- Parsing email ---`);
  console.log(`From: ${from}`);
  console.log(`Subject: ${subject}`);
  console.log(`Date: ${date}`);

  // Determine platform
  let platform: "swiggy" | "zomato" | null = null;
  if (from.toLowerCase().includes("swiggy")) platform = "swiggy";
  if (from.toLowerCase().includes("zomato")) platform = "zomato";

  if (!platform) {
    console.log(`Skipping - not from Swiggy or Zomato`);
    return null;
  }

  console.log(`Platform: ${platform}`);

  // Get email body - recursively extract from all parts
  const extractBody = (parts: any[]): string => {
    let text = "";
    for (const part of parts) {
      if (part.body?.data) {
        text += Buffer.from(part.body.data, "base64").toString("utf-8");
      }
      if (part.parts) {
        text += extractBody(part.parts);
      }
    }
    return text;
  };

  let body = "";
  if (email.payload?.body?.data) {
    body = Buffer.from(email.payload.body.data, "base64").toString("utf-8");
  } else if (email.payload?.parts) {
    body = extractBody(email.payload.parts);
  }

  console.log(`Body : ${body}`);

  // Extract items from email body
  const extractItems = (emailBody: string): string[] => {
    const items: string[] = [];
    const skipWords = [
      'item name', 'items', 'item', 'name', 'quantity', 'qty', 'price', 'amount',
      'item total', 'delivery', 'discount', 'tax', 'cgst', 'sgst', 'charges',
      'fee', 'subtotal', 'grand total', 'total', 'bill', 'packaging', 'platform',
      'order', 'gst', 'packing', 'handling', 'tip', 'donation', 'saved', 'you saved'
    ];

    // Strategy 1: Find "Item Name" header and extract cells below it
    const itemNameHeaderPattern = /<t[dh][^>]*>\s*(item\s*name|items?|dish\s*name)\s*<\/t[dh]>/gi;
    const headerMatch = itemNameHeaderPattern.exec(emailBody);

    if (headerMatch) {
      // Found the header, now extract all td cells after it in the same table
      const afterHeader = emailBody.substring(headerMatch.index);
      // Look for td elements with meaningful content
      const cellPattern = /<td[^>]*>([^<]+)<\/td>/gi;
      let cellMatch;

      while ((cellMatch = cellPattern.exec(afterHeader)) !== null) {
        const cellText = cellMatch[1]?.trim();
        if (cellText && cellText.length > 2 && cellText.length < 100) {
          const lowerText = cellText.toLowerCase();

          // Skip if it's a number, price, or skip word
          const isNumber = /^[\d.,₹\sRs]+$/.test(cellText);
          const isSkipWord = skipWords.some(word => lowerText === word || lowerText.includes(word));

          if (!isNumber && !isSkipWord) {
            items.push(cellText);
          }
        }

        // Stop after collecting reasonable number or reaching end of table
        if (items.length >= 20 || cellMatch[0].includes('</table>')) break;
      }
    }

    // Strategy 2: Look for specific styled cells (original approach)
    if (items.length === 0) {
      const tdPattern = /<td\s+width=['"]50%['"]\s+style=['"]font-size:\s*15px['"]>([^<]+)<\/td>/gi;
      const tdMatches = emailBody.matchAll(tdPattern);

      for (const match of tdMatches) {
        const item = match[1]?.trim();
        if (item && item.length > 2 && item.length < 100) {
          const lowerItem = item.toLowerCase();
          if (!skipWords.some(word => lowerItem === word || lowerItem.includes(word))) {
            items.push(item);
          }
        }
      }
    }

    // Strategy 3: Fallback patterns
    if (items.length === 0) {
      const fallbackPatterns = [
        /<td[^>]*>([A-Z][A-Za-z\s&',.-]{3,50}?)<\/td>/gi,
        /(?:^|\n)\s*(?:[\d]+\s*x\s*)?([A-Z][A-Za-z\s&',.-]+?)(?:\s+x\s*\d+|\s*₹|\s*Rs\.?)/gm,
      ];

      for (const pattern of fallbackPatterns) {
        const matches = emailBody.matchAll(pattern);
        for (const match of matches) {
          const item = match[1]?.trim();
          if (item && item.length > 2 && item.length < 100) {
            const lowerItem = item.toLowerCase();
            const isNumber = /^[\d.,₹\sRs]+$/.test(item);
            if (!isNumber && !skipWords.some(word => lowerItem.includes(word))) {
              items.push(item);
            }
          }
        }
        if (items.length > 0) break;
      }
    }

    // Remove duplicates and limit to reasonable number
    return [...new Set(items)].slice(0, 15);
  };

  const items = extractItems(body);
  console.log(`Extracted items: ${items.length > 0 ? items.join(', ') : 'none'}`);

  // Extract amount using regex patterns
  let amount = 0;
  let description = "";
  let restaurantName = "";

  if (platform === "swiggy") {
    // Common Swiggy patterns (including Instamart)
    const amountMatches = [
      /Total[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Grand Total[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Amount Paid[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Bill[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)\s*paid/i,
      /To Pay[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Item total[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /You paid[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Order Value[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/,
    ];

    for (const pattern of amountMatches) {
      const match = body.match(pattern);
      if (match) {
        amount = parseFloat(match[1].replace(/,/g, ""));
        console.log(`Found Swiggy amount: ₹${amount}`);
        break;
      }
    }

    if (amount === 0) {
      console.log(`Could not extract amount from Swiggy email`);
      console.log(`Body preview: ${body.substring(0, 500)}`);
    }

    // Extract restaurant name
    const restaurantMatch = body.match(/(?:from|at)\s+([A-Z][A-Za-z\s&',.-]{2,50}?)(?:\s*,|\s*\(|\s*-|\n|<)/i);
    const instamartMatch = subject.toLowerCase().includes("instamart");

    if (instamartMatch) {
      restaurantName = "Swiggy Instamart";
      description = items.length > 0 ? items.join(", ") : "Instamart Order";
    } else if (restaurantMatch) {
      restaurantName = restaurantMatch[1].trim();
      description = items.length > 0
        ? `${restaurantName}: ${items.slice(0, 3).join(", ")}${items.length > 3 ? '...' : ''}`
        : `Order from ${restaurantName}`;
    } else {
      restaurantName = "Swiggy";
      description = items.length > 0 ? items.slice(0, 3).join(", ") : "Swiggy Order";
    }
  } else if (platform === "zomato") {
    // Common Zomato patterns
    const amountMatches = [
      /Total[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Grand Total[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Bill Amount[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Bill[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)\s*(?:paid|total)/i,
      /To Pay[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Item total[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /You paid[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /Order Value[:\s]+(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/i,
      /(?:Rs\.?|₹|INR)\s*([\d,]+(?:\.\d{2})?)/,
    ];

    for (const pattern of amountMatches) {
      const match = body.match(pattern);
      if (match) {
        amount = parseFloat(match[1].replace(/,/g, ""));
        console.log(`Found Zomato amount: ₹${amount}`);
        break;
      }
    }

    if (amount === 0) {
      console.log(`Could not extract amount from Zomato email`);
      console.log(`Body preview: ${body.substring(0, 500)}`);
    }

    // Extract restaurant name
    const restaurantMatch = body.match(/(?:from|at)\s+([A-Z][A-Za-z\s&',.-]{2,50}?)(?:\s*,|\s*\(|\s*-|\n|<)/i);

    if (restaurantMatch) {
      restaurantName = restaurantMatch[1].trim();
      description = items.length > 0
        ? `${restaurantName}: ${items.slice(0, 3).join(", ")}${items.length > 3 ? '...' : ''}`
        : `Order from ${restaurantName}`;
    } else {
      restaurantName = "Zomato";
      description = items.length > 0 ? items.slice(0, 3).join(", ") : "Zomato Order";
    }
  }

  // Skip if we couldn't extract an amount
  if (amount === 0) {
    console.log(`Skipping email - no amount found\n`);
    return null;
  }

  const order = {
    id: email.id,
    date: new Date(date).toISOString().split("T")[0],
    platform,
    amount,
    description,
    subject,
    items: items.length > 0 ? items : undefined,
    restaurantName: restaurantName || undefined,
  };

  console.log(`✓ Successfully parsed order: ${description} - ₹${amount}`);
  if (items.length > 0) {
    console.log(`  Items: ${items.join(', ')}`);
  }
  console.log('');
  return order;
}
