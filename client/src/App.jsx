import { useState } from "react";
import api from "./services/api";

function App() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // { type: "success" | "error", text: string }

  const showStatus = (type, text) => {
    setStatus({ type, text });
    setTimeout(() => setStatus(null), 4000);
  };

  const sendSMS = async () => {
    if (!phone.trim()) return showStatus("error", "Please enter a phone number.");
    if (!message.trim()) return showStatus("error", "Please enter a message.");
    try {
      setLoading(true);
      const { data } = await api.post("/sms", { phone, message });
      console.log(data);
      showStatus("success", "SMS sent successfully!");
    } catch (error) {
      console.log(error);
      showStatus("error", "Failed to send SMS. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsapp = async () => {
    if (!phone.trim()) return showStatus("error", "Please enter a phone number.");
    if (!message.trim()) return showStatus("error", "Please enter a message.");
    try {
      setLoading(true);
      const { data } = await api.post("/whatsapp", { phone, message });
      console.log(data);
      showStatus("success", "WhatsApp message sent successfully!");
    } catch (error) {
      console.log(error);
      showStatus("error", "Failed to send WhatsApp. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const charCount = message.length;
  const charWarn = charCount > 140 && charCount <= 160;
  const charOver = charCount > 160;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Tw</span>
            </div>
            <h1 className="text-xl font-semibold text-gray-900">Twilio Messenger</h1>
          </div>
          <p className="text-sm text-gray-500 ml-12">Send SMS & WhatsApp messages</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">

          {/* Phone Field */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Recipient
            </label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading}
              className="w-full h-11 px-4 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white transition disabled:opacity-50"
            />
          </div>

          {/* Message Field */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Message
            </label>
            <textarea
              placeholder="Type your message here…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={loading}
              rows={5}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white resize-none transition disabled:opacity-50"
            />
            <p className={`text-xs text-right mt-1 ${charOver ? "text-red-500" : charWarn ? "text-amber-500" : "text-gray-400"}`}>
              {charCount} / 160
              {charOver && " — will split into multiple SMS"}
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-100 mb-5" />

          {/* Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={sendSMS}
              disabled={loading}
              className="h-11 rounded-xl bg-red-500 hover:bg-red-600 active:scale-95 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send SMS"}
            </button>
            <button
              onClick={sendWhatsapp}
              disabled={loading}
              className="h-11 rounded-xl bg-green-500 hover:bg-green-600 active:scale-95 text-white text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send WhatsApp"}
            </button>
          </div>

          {/* Status Banner */}
          {status && (
            <div
              className={`mt-4 px-4 py-3 rounded-xl text-sm font-medium ${
                status.type === "success"
                  ? "bg-green-50 text-green-700 border border-green-200"
                  : "bg-red-50 text-red-700 border border-red-200"
              }`}
            >
              {status.text}
            </div>
          )}
        </div>

        {/* Footer tip */}
        <p className="text-center text-xs text-gray-400 mt-4">
          Use E.164 format — <code className="bg-gray-100 px-1 py-0.5 rounded text-gray-500">+[country][number]</code>
        </p>

      </div>
    </div>
  );
}

export default App;