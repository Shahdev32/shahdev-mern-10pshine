import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResetPassword from "./ResetPassword";
import axiosInstance from "../../utils/axiosInstance";

// Mock axiosInstance
jest.mock("../../utils/axiosInstance", () => ({
  post: jest.fn(),
}));

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("ResetPassword Component", () => {
  const token = "test-token";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders ResetPassword form", () => {
    render(
      <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText("Reset Password")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("New Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /update password/i })).toBeInTheDocument();
  });

  test("updates password input value", () => {
    render(
      <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("New Password");
    fireEvent.change(input, { target: { value: "newpassword123" } });
    expect(input.value).toBe("newpassword123");
  });

  test("submits form and navigates on success", async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { message: "Success" } });

    render(
      <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("New Password");
    fireEvent.change(input, { target: { value: "newpassword123" } });

    const button = screen.getByRole("button", { name: /update password/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith(
        `/api/auth/reset-password/${token}`,
        { password: "newpassword123" }
      );
      expect(mockedNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("shows alert on error", async () => {
    axiosInstance.post.mockRejectedValueOnce(new Error("Invalid token"));
    window.alert = jest.fn();

    render(
      <MemoryRouter initialEntries={[`/reset-password/${token}`]}>
        <Routes>
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("New Password");
    fireEvent.change(input, { target: { value: "newpassword123" } });

    const button = screen.getByRole("button", { name: /update password/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid or expired link");
    });
  });
});
