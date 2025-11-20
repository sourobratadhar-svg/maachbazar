// api/index.js
import axios from "axios";

export default async function handler(req, res) {
  const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
  const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;

  // ✅ Webhook verification (GET)
  if (req.method === "GET") {
    const mode = req.query["hub.mode"];
    const token = req.query["hub.verify_token"];
    const challenge = req.query["hub.challenge"];

    if (mode === "subscribe" && token === VERIFY_TOKEN) {
      console.log("✅ Webhook verified!");
      return res.status(200).send(challenge);
    } else {
      console.warn("❌ Verification failed");
      return res.status(403).send("Forbidden");
    }
  }

  // ✅ Message handling (POST)
  if (req.method === "POST") {
    try {
      const body = req.body;
      console.log("📩 Incoming webhook:", JSON.stringify(body, null, 2));

      if (body.object && body.entry?.[0]?.changes?.[0]?.value?.messages) {
        const message = body.entry[0].changes[0].value.messages[0];
        const from = message.from;
        console.log(`💬 Message from ${from}`);

        // reply example
        await axios.post(
          `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`,
          {
            messaging_product: "whatsapp",
            to: from,
            text: { body: "Hello from Maachbazar! How can I help you today?" },
          },
          {
            headers: {
              Authorization: `Bearer ${WHATSAPP_TOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
      }

      return res.status(200).send("EVENT_RECEIVED");
    } catch (err) {
      console.error("Error:", err.response?.data || err.message);
      return res.status(500).send("Error processing webhook");
    }
  }

  // ✅ Unsupported methods
  return res.status(405).send("Method Not Allowed");
}
