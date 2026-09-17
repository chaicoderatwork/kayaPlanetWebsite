/** Browser-only Web3Forms submit. Free keys reject server-side POSTs. */

export function notifyDateCheckEmail(details: {
  name?: string;
  mobile?: string;
  eventDate: string;
  functionName: string;
  area?: string;
  source: string;
}) {
  const accessKey = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY;
  if (!accessKey) return;

  const formattedDate = details.eventDate
    ? new Date(`${details.eventDate}T00:00:00`).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Not specified";
  const displayName = details.name || "WhatsApp visitor";

  const message = [
    `New date check from ${displayName}`,
    details.mobile ? `Mobile: +91 ${details.mobile}` : "Contact: via WhatsApp",
    `Function: ${details.functionName}`,
    `Event date: ${formattedDate}`,
    `Area / venue: ${details.area || "Not specified"}`,
    `Source: ${details.source}`,
  ].join("\n");

  const form = new FormData();
  form.append("access_key", accessKey);
  form.append("subject", `Date check: ${details.functionName} — ${displayName}`);
  form.append("from_name", "Kaya Planet website");
  form.append("name", displayName);
  if (details.mobile) form.append("phone", `+91 ${details.mobile}`);
  form.append("date", formattedDate);
  form.append("function", details.functionName);
  form.append("area", details.area || "Not specified");
  form.append("message", message);
  form.append("botcheck", "");

  void fetch("https://api.web3forms.com/submit", {
    method: "POST",
    keepalive: true,
    body: form,
  }).catch(() => {
    /* WhatsApp still opens */
  });
}
