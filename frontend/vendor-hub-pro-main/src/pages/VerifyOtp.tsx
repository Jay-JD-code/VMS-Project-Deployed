import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function VerifyOtp() {
  const [otp, setOtp]             = useState("");
  const [error, setError]         = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  // ✅ Helper: extract a readable message from any backend response body.
  //    GlobalExceptionHandler returns { "message": "..." } JSON for errors.
  //    Success responses may be plain text or JSON — handle both.
  const parseMessage = (body: string, fallback: string): string => {
    try {
      const parsed = JSON.parse(body);
      return parsed.message ?? parsed.error ?? fallback;
    } catch {
      return body?.trim() || fallback;
    }
  };

  const handleVerify = async () => {
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("http://localhost:8080/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const body = await res.text();

      if (!res.ok) {
        // ✅ FIX: Parse JSON error body → shows "Invalid OTP" not {"message":"Invalid OTP"}
        setError(parseMessage(body, "Invalid OTP. Please try again."));
        return;
      }

      // Success: body is JSON { "resetToken": "..." }
      let resetToken: string;
      try {
        const parsed = JSON.parse(body);
        resetToken = parsed.resetToken ?? body;
      } catch {
        resetToken = body;
      }

      navigate("/reset-password", { state: { email, resetToken } });

    } catch {
      setError("Unable to reach server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded-lg shadow w-80">
        <h2 className="text-lg font-semibold mb-1">Verify OTP</h2>
        <p className="text-sm text-gray-500 mb-4">
          Enter the OTP sent to{" "}
          <span className="font-medium text-gray-700">{email}</span>
        </p>

        <input
          className="w-full border rounded px-3 py-2 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => { setOtp(e.target.value); if (error) setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleVerify()}
        />

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleVerify}
          disabled={isLoading || !otp.trim()}
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? "Verifying..." : "Verify OTP"}
        </button>
      </div>
    </div>
  );
}