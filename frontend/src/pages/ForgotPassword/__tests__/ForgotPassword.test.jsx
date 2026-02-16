import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import ForgotPassword from "../ForgotPassword";

// Mock axiosInstance
jest.mock("../../../utils/axiosInstance", () => ({
  post: jest.fn(),
}));

import axiosInstance from "../../../utils/axiosInstance";

describe("ForgotPassword Component", () => {

  test("renders form elements", () => {
    render(<ForgotPassword />);

    expect(screen.getByText("Forgot Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeInTheDocument();
  });

  test("updates email input value", () => {
    render(<ForgotPassword />);

    const input = screen.getByPlaceholderText("Enter email");

    fireEvent.change(input, { target: { value: "test@mail.com" } });

    expect(input.value).toBe("test@mail.com");
  });

  test("calls API and shows success message", async () => {
    // Mock API response
    axiosInstance.post.mockResolvedValue({
      data: { message: "Reset link sent successfully" },
    });

    render(<ForgotPassword />);

    // Type email
    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@mail.com" },
    });

    // Click submit
    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    // Wait for API call
    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        "/api/auth/forgot-password",
        { email: "test@mail.com" }
      );
    });

    // Wait for message to appear
    const successMessage = await screen.findByText("Reset link sent successfully");
    expect(successMessage).toBeInTheDocument();
  });

  test("shows error message on API failure", async () => {
    // Mock API failure
    axiosInstance.post.mockRejectedValue(new Error("Failed"));

    render(<ForgotPassword />);

    fireEvent.change(screen.getByPlaceholderText("Enter email"), {
      target: { value: "test@mail.com" },
    });

    fireEvent.click(screen.getByRole("button", { name: /send reset link/i }));

    // Wait for error message
    const errorMessage = await screen.findByText("Something went wrong");
    expect(errorMessage).toBeInTheDocument();
  });

});
