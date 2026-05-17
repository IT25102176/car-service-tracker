import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { usersApi } from "@/lib/api";
import { clearCustomerSession, setCustomerSession } from "@/lib/customerSession";
import { clearAdminSession, setAdminSession } from "@/lib/adminSession";

export function LoginForm() {
  const navigate = useNavigate();
  const [mode, setMode] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (mode === "admin") {
      if (email.trim() !== "admin" || password !== "admin") {
        setError("Invalid admin credentials. Use admin / admin.");
        return;
      }
      clearCustomerSession();
      setAdminSession({ username: "admin" });
      navigate("/");
      return;
    }

    try {
      const customer = await usersApi.loginByPhone(phone);
      clearAdminSession();
      setCustomerSession({
        id: customer.id,
        name: customer.name,
        phone: customer.phone,
      });
      navigate("/customer");
    } catch (err) {
      setError(err.message || "Customer login failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <h1
        style={{ fontFamily: "Phudu, sans-serif", fontWeight: 700 }}
        className="text-4xl text-gray-900 text-center leading-tight"
      >
        Welcome back to <span>Auto</span>
        <span className="text-[#E9762B]">Serve</span>
      </h1>
      <p className="text-center text-sm text-gray-600 -mt-1">
        Sign in as admin or customer.
      </p>

      <div className="grid grid-cols-2 gap-2 rounded-2xl bg-gray-100 p-1">
        <button
          type="button"
          onClick={() => setMode("admin")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            mode === "admin" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
          }`}
        >
          Admin Login
        </button>
        <button
          type="button"
          onClick={() => setMode("customer")}
          className={`rounded-xl px-4 py-2 text-sm font-medium ${
            mode === "customer" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600"
          }`}
        >
          Customer Login
        </button>
      </div>

      {mode === "admin" ? (
        <div className="space-y-3">
          <Input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-2xl px-4 text-base transition duration-500"
          />
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 rounded-2xl px-4 text-base transition duration-500"
          />
        </div>
      ) : (
        <Input
          type="tel"
          placeholder="Enter your phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="h-12 rounded-2xl px-4 text-base transition duration-500"
        />
      )}

      {error && <p className="text-sm text-red-600">{error}</p>}

      <Button
        type="submit"
        className="w-full h-12 rounded-2xl text-white font-semibold bg-[#1F2A44] hover:bg-[#182036]"
      >
        {mode === "admin" ? "Login as Admin" : "Login as Customer"}
      </Button>
    </form>
  );
}
