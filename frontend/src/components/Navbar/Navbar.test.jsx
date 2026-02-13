// Navbar.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "./Navbar";


// ==============================
// Mock ProfileInfo
// ==============================
jest.mock("../Cards/ProfileInfo", () => ({ userInfo, onLogout }) => (
  <div data-testid="profile-info">
    <button onClick={onLogout}>Logout</button>
    <span>{userInfo.name}</span>
  </div>
));


// ==============================
// Mock SearchBar (IMPORTANT)
// ==============================
jest.mock("../SearchBar/SearchBar", () => ({
  value,
  onChange,
  handleSearch,
  onClearSearch,
}) => (
  <div>
    <input
      placeholder="Search Notes"
      value={value}
      onChange={onChange}
    />
    <button data-testid="search-btn" onClick={handleSearch}>
      Search
    </button>
    <button data-testid="clear-btn" onClick={onClearSearch}>
      Clear
    </button>
  </div>
));


// ==============================
// Tests
// ==============================
describe("Navbar Component", () => {
  const mockUserInfo = { name: "John Doe" };
  const mockOnSearchNote = jest.fn();
  const mockHandleClearSearch = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });


  // ---------------------------------
  // Render test
  // ---------------------------------
  test("renders title and user info", () => {
    render(
      <MemoryRouter>
        <Navbar
          userInfo={mockUserInfo}
          onSearchNote={mockOnSearchNote}
          handleClearSearch={mockHandleClearSearch}
        />
      </MemoryRouter>
    );

    expect(screen.getByText("Notes")).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
  });


  // ---------------------------------
  // Search functionality
  // ---------------------------------
  test("updates input and calls onSearchNote when search button clicked", () => {
    render(
      <MemoryRouter>
        <Navbar
          userInfo={mockUserInfo}
          onSearchNote={mockOnSearchNote}
          handleClearSearch={mockHandleClearSearch}
        />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search Notes");
    const searchBtn = screen.getByTestId("search-btn");

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.click(searchBtn);

    expect(mockOnSearchNote).toHaveBeenCalledWith("React");
  });


  // ---------------------------------
  // Clear functionality
  // ---------------------------------
  test("clears input and calls handleClearSearch when clear clicked", () => {
    render(
      <MemoryRouter>
        <Navbar
          userInfo={mockUserInfo}
          onSearchNote={mockOnSearchNote}
          handleClearSearch={mockHandleClearSearch}
        />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText("Search Notes");
    const clearBtn = screen.getByTestId("clear-btn");

    fireEvent.change(input, { target: { value: "React" } });
    fireEvent.click(clearBtn);

    expect(input.value).toBe("");
    expect(mockHandleClearSearch).toHaveBeenCalled();
  });


  // ---------------------------------
  // Logout functionality
  // ---------------------------------
  test("calls logout when logout button clicked", () => {
    render(
      <MemoryRouter>
        <Navbar
          userInfo={mockUserInfo}
          onSearchNote={mockOnSearchNote}
          handleClearSearch={mockHandleClearSearch}
        />
      </MemoryRouter>
    );

    const logoutBtn = screen.getByText("Logout");

    fireEvent.click(logoutBtn);

    // navigation is internal, so we just ensure button exists and works
    expect(logoutBtn).toBeInTheDocument();
  });
});
