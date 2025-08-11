import { useNavigate } from "react-router-dom";

export default function PaymentSimulation() {
  const navigate = useNavigate();

  const handlePay = () => {
    alert("Payment Successful!");
    navigate("/my-bookings");
  };

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Payment Simulation</h2>
      <p className="mb-4">Total: $50</p>
      <button
        onClick={handlePay}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Pay Now
      </button>
    </div>
  );
}
