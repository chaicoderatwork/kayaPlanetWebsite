const ENQUIRY_EMAIL = "kaya.planetbeauty@gmail.com";

export type EnquiryRecord = {
  name: string;
  mobile: string;
  eventDate: string | null;
  service: string;
  functionName: string;
  area: string | null;
  source: string;
  createdAt: Date;
};

export async function saveEnquiryLocally(enquiry: EnquiryRecord) {
  if (process.env.VERCEL) return false;

  try {
    const fs = await import("fs/promises");
    const path = await import("path");
    const dir = path.join(process.cwd(), "data");
    await fs.mkdir(dir, { recursive: true });
    const file = path.join(dir, "enquiries.json");
    let existing: unknown[] = [];
    try {
      existing = JSON.parse(await fs.readFile(file, "utf8"));
      if (!Array.isArray(existing)) existing = [];
    } catch {
      existing = [];
    }
    existing.push({
      ...enquiry,
      createdAt: enquiry.createdAt.toISOString(),
    });
    await fs.writeFile(file, JSON.stringify(existing, null, 2));
    console.log("[enquiry] saved locally", enquiry.functionName, enquiry.eventDate);
    return true;
  } catch (error) {
    console.error("Local enquiry log failed:", error);
    return false;
  }
}

function enquiryMessage(enquiry: EnquiryRecord, formattedDate: string) {
  return [
    `New date check from ${enquiry.name}`,
    enquiry.mobile ? `Mobile: +91 ${enquiry.mobile}` : "Contact: via WhatsApp",
    `Function: ${enquiry.functionName}`,
    `Event date: ${formattedDate}`,
    `Area / venue: ${enquiry.area || "Not specified"}`,
    `Source: ${enquiry.source}`,
  ].join("\n");
}

async function sendWithWeb3Forms(
  enquiry: EnquiryRecord,
  formattedDate: string,
) {
  const accessKey = process.env.WEB3FORMS_ACCESS_KEY;
  // Free Web3Forms keys only accept browser POSTs. Server send is Pro-only.
  if (!accessKey || process.env.WEB3FORMS_SERVER_SIDE !== "1") return false;

  const response = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      access_key: accessKey,
      subject: `Date check: ${enquiry.functionName} — ${enquiry.name}`,
      from_name: "Kaya Planet website",
      name: enquiry.name,
      phone: `+91 ${enquiry.mobile}`,
      date: formattedDate,
      function: enquiry.functionName,
      area: enquiry.area || "Not specified",
      message: enquiryMessage(enquiry, formattedDate),
    }),
  });

  const data = (await response.json().catch(() => null)) as
    | { success?: boolean | string; message?: string }
    | null;
  const ok = Boolean(response.ok && (data?.success === true || data?.success === "true"));
  console.log("[enquiry] web3forms", ok ? "sent" : "not sent", data?.message || response.status);
  return ok;
}

async function sendWithFormSubmit(
  enquiry: EnquiryRecord,
  formattedDate: string,
) {
  const site = process.env.NEXT_PUBLIC_SITE_URL || "https://www.kayaplanet.com";
  const response = await fetch(
    `https://formsubmit.co/ajax/${encodeURIComponent(ENQUIRY_EMAIL)}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Origin: site,
        Referer: `${site}/`,
      },
      body: JSON.stringify({
        _subject: `Date check: ${enquiry.functionName} — ${enquiry.name}`,
        _template: "table",
        _captcha: "false",
        name: enquiry.name,
        phone: `+91 ${enquiry.mobile}`,
        date: formattedDate,
        function: enquiry.functionName,
        area: enquiry.area || "Not specified",
        message: enquiryMessage(enquiry, formattedDate),
      }),
    },
  );

  const data = (await response.json().catch(() => null)) as
    | { success?: boolean | string; message?: string }
    | null;
  const ok = Boolean(response.ok && (data?.success === true || data?.success === "true"));
  console.log(
    "[enquiry] formsubmit",
    ok ? "sent" : "not sent",
    data?.message || `HTTP ${response.status}`,
  );
  return ok;
}

export async function emailEnquiry(
  enquiry: EnquiryRecord,
  formattedDate: string,
) {
  try {
    if (await sendWithWeb3Forms(enquiry, formattedDate)) return true;
    return sendWithFormSubmit(enquiry, formattedDate);
  } catch (error) {
    console.error("Enquiry email notify failed:", error);
    return false;
  }
}
