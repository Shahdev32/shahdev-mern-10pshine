import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await axiosInstance.post("/api/auth/forgot-password", {
      email: email,
    });

    setMessage(res.data.message);

  } catch (err) {
    setMessage("Something went wrong");
  }
};

  return (
    <div className="flex justify-center mt-32">
      <div className="w-96 bg-white p-8 rounded border">
        <h2 className="text-xl mb-4">Forgot Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter email"
            className="input-box"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button className="btn-primary mt-3">
            Send Reset Link
          </button>
        </form>

        {message && <p className="text-sm mt-3">{message}</p>}
      </div>
    </div>
  );
};

export default ForgotPassword;

