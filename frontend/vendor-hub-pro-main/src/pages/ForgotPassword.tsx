import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail]         = useState("");
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);
  const navigate = useNavigate();

  const parseMessage = (body: string, fallback: string): string => {
    try {
      const parsed = JSON.parse(body);
      return parsed.message ?? parsed.error ?? fallback;
    } catch {
      return body?.trim() || fallback;
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!email.trim()) { setError("Please enter your email address."); return; }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const body = await res.text();

      if (!res.ok) {
        // ✅ FIX: Show backend error (e.g. "User not found") instead of navigating
        setError(parseMessage(body, "No account found with that email address."));
        return;
      }

      // Only navigate on success
      navigate("/verify-otp", { state: { email } });

    } catch {
      setError("Unable to reach server. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded-lg shadow w-80">
        <h2 className="text-lg font-semibold mb-1">Forgot Password</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter your email and we'll send you an OTP.
        </p>

        <input
          className="w-full border rounded px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter email"
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (error) setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleSubmit}
          disabled={loading || !email.trim()}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Sending..." : "Send OTP"}
        </button>
      </div>
    </div>
  );
}