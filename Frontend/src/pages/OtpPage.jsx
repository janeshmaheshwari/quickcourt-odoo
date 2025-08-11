import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { verifyOtp } from "../services/authService";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const email = searchParams.get("email");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = await verifyOtp(email, otp);
    if (data.success) {
      navigate("/login");
    } else {
      alert(data.message || "Invalid OTP");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form className="bg-white p-6 rounded shadow-md w-96" onSubmit={handleSubmit}>
        <h2 className="text-2xl font-bold mb-4">Verify OTP</h2>
        <p className="mb-3">Enter the OTP sent to <b>{email}</b></p>
        <input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter OTP" className="w-full mb-3 p-2 border rounded" />
        <button type="submit" className="bg-green-600 text-white w-full py-2 rounded hover:bg-green-700">
          Verify
        </button>
      </form>
    </div>
  );
}
