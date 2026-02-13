import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Profile from "./Profile";
import Navbar from "../../components/Navbar/Navbar";

// Mock Navbar since it is imported
jest.mock("../../components/Navbar/Navbar", () => () => <div>Navbar</div>);

// Mock localStorage
const localStorageMock = (() => {
  let store = {};
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
    removeItem: jest.fn((key) => {
      delete store[key];
    }),
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

describe("Profile Component", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  test("renders profile form with default values", () => {
    render(<Profile />);

    // Check Navbar
    expect(screen.getByText("Navbar")).toBeInTheDocument();

    // Check inputs
    expect(screen.getByPlaceholderText("Enter your name")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter your country")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("LinkedIn profile link")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("GitHub profile link")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Languages you know (comma separated)")).toBeInTheDocument();

    // Default avatar initials
    expect(screen.getByText("U")).toBeInTheDocument(); // "User" initials
  });

  test("loads profile from localStorage", () => {
    const savedProfile = {
      name: "John Doe",
      gender: "Male",
      country: "USA",
      linkedin: "https://linkedin.com/in/johndoe",
      github: "https://github.com/johndoe",
      languages: "JavaScript,Python",
    };
    localStorage.setItem("userProfile", JSON.stringify(savedProfile));

    render(<Profile />);

    expect(screen.getByDisplayValue("John Doe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Male")).toBeInTheDocument();
    expect(screen.getByDisplayValue("USA")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://linkedin.com/in/johndoe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("https://github.com/johndoe")).toBeInTheDocument();
    expect(screen.getByDisplayValue("JavaScript,Python")).toBeInTheDocument();
    expect(screen.getByText("JD")).toBeInTheDocument(); // initials
  });

  test("updates input values and saves profile", async () => {
    render(<Profile />);

    const nameInput = screen.getByPlaceholderText("Enter your name");
    const countryInput = screen.getByPlaceholderText("Enter your country");
    const linkedinInput = screen.getByPlaceholderText("LinkedIn profile link");
    const githubInput = screen.getByPlaceholderText("GitHub profile link");
    const languagesInput = screen.getByPlaceholderText("Languages you know (comma separated)");
    const genderSelect = screen.getByRole("combobox");

    // Simulate user input
    fireEvent.change(nameInput, { target: { value: "Jane Doe" } });
    fireEvent.change(countryInput, { target: { value: "Canada" } });
    fireEvent.change(linkedinInput, { target: { value: "https://linkedin.com/in/janedoe" } });
    fireEvent.change(githubInput, { target: { value: "https://github.com/janedoe" } });
    fireEvent.change(languagesInput, { target: { value: "Python,React" } });
    fireEvent.change(genderSelect, { target: { value: "Female" } });

    // Submit form
    fireEvent.click(screen.getByText("Save Profile"));

    // Check localStorage
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith(
        "userProfile",
        JSON.stringify({
          name: "Jane Doe",
          gender: "Female",
          country: "Canada",
          linkedin: "https://linkedin.com/in/janedoe",
          github: "https://github.com/janedoe",
          languages: "Python,React",
        })
      );
    });

    // Success message
    expect(screen.getByText("Profile saved successfully!")).toBeInTheDocument();

    // Message disappears after 3 seconds
    await waitFor(
      () => {
        expect(screen.queryByText("Profile saved successfully!")).not.toBeInTheDocument();
      },
      { timeout: 3500 }
    );
  });
});
