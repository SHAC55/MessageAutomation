import express from "express";
import { sendSMS, sendWhatsapp} from "../controllers/messageController.js";

const router = express.Router();

router.post("/sms", sendSMS);
router.post("/whatsapp", sendWhatsapp);

export default router;