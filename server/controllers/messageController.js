import twilio from "twilio";

export const sendSMS = async (req, res) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const { phone, message } = req.body;

    const response = await client.messages.create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    res.status(200).json({
      success: true,
      sid: response.sid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

export const sendWhatsapp = async (req, res) => {
  try {
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN
    );

    const { phone, message } = req.body;

    const response = await client.messages.create({
      body: message,
      from: "whatsapp:+14155238886",
      to: `whatsapp:${phone}`,
    });

    res.status(200).json({
      success: true,
      sid: response.sid,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};