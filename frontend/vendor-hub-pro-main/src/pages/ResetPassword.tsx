import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Eye, EyeOff, CheckCircle2, XCircle } from "lucide-react";

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const { resetToken } = location.state || {};

  const [password, setPassword]               = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword]       = useState(false);
  const [showConfirm, setShowConfirm]         = useState(false);
  const [error, setError]                     = useState("");
  const [isLoading, setIsLoading]             = useState(false);

  const confirmTouched  = confirmPassword.length > 0;
  const passwordsMatch  = password === confirmPassword;

  const handleReset = async () => {
    setError("");

    if (!password)            { setError("Please enter a new password."); return; }
    if (password.length < 6)  { setError("Password must be at least 6 characters."); return; }
    if (!passwordsMatch)      { setError("Passwords do not match."); return; }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resetToken,
          newPassword: password,
          confirmNewPassword: confirmPassword,
        }),
      });

      // ✅ FIX: Backend returns plain text "Password updated successfully" on 200,
      //    or throws a RuntimeException (caught as 500 by Spring by default).
      //    We read the body first so we can show the actual backend error message.
      const body = await res.text();

      if (!res.ok) {
        // ✅ FIX: Extract readable message from Spring's default error JSON:
        //    { "status": 500, "error": "...", "message": "Passwords do not match", ... }
        let message = "Reset failed. Please try again.";
        try {
          const parsed = JSON.parse(body);
          message = parsed.message ?? parsed.error ?? message;
        } catch {
          if (body && body.length < 200) message = body;
        }
        setError(message);
        return;
      }

      navigate("/login", {
        state: { message: "Password reset successful. Please log in." },
      });

    } catch {
      setError("Unable to reach server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="p-6 bg-white rounded-lg shadow w-80">
        <h2 className="text-lg font-semibold mb-1">Reset Password</h2>
        <p className="text-sm text-gray-500 mb-5">Enter and confirm your new password.</p>

        {/* ── NEW PASSWORD ── */}
        <label className="block text-xs font-medium text-gray-700 mb-1">New Password</label>
        <div className="relative mb-3">
          <input
            type={showPassword ? "text" : "password"}
            className="w-full border rounded px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="New password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* ── CONFIRM PASSWORD ── */}
        <label className="block text-xs font-medium text-gray-700 mb-1">Confirm Password</label>
        <div className="relative mb-1">
          <input
            type={showConfirm ? "text" : "password"}
            className={`w-full border rounded px-3 py-2 pr-9 text-sm focus:outline-none focus:ring-2 transition-colors
              ${confirmTouched
                ? passwordsMatch
                  ? "border-green-400 focus:ring-green-400"
                  : "border-red-400 focus:ring-red-400"
                : "focus:ring-purple-400"
              }`}
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleReset()}
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            tabIndex={-1}
          >
            {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>

        {/* ── LIVE MATCH FEEDBACK ── */}
        {confirmTouched && (
          <div className={`flex items-center gap-1.5 mb-3 text-xs font-medium ${passwordsMatch ? "text-green-600" : "text-red-500"}`}>
            {passwordsMatch
              ? <><CheckCircle2 size={13} /> Passwords match</>
              : <><XCircle size={13} /> Passwords do not match</>}
          </div>
        )}

        {/* ── SUBMIT ERROR ── */}
        {error && <p className="text-xs text-red-500 mb-3">{error}</p>}

        <button
          onClick={handleReset}
          disabled={isLoading || !password || !confirmPassword}
          className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 rounded text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed transition-colors mt-1"
        >
          {isLoading ? "Resetting..." : "Reset Password"}
        </button>
      </div>
    </div>
  );
}