import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    await axiosInstance.post(`/api/auth/reset-password/${token}`, {
      password: password,
    });

    alert("Password updated!");
    navigate("/login");

  } catch (err) {
    alert("Invalid or expired link");
  }
};


  return (
    <div className="flex justify-center mt-32">
      <div className="w-96 bg-white p-8 rounded border">
        <h2 className="text-xl mb-4">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            className="input-box"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn-primary mt-3">
            Update Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

