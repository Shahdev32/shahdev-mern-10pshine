import { render, screen, fireEvent } from "@testing-library/react";
import ProfileInfo from "../ProfileInfo";

/* ---------------- MOCKS ---------------- */

// mock helper
jest.mock("../../../utils/helper", () => ({
  getInitials: jest.fn(() => "SK"),
}));

// mock navigate
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

/* ---------------- TESTS ---------------- */

describe("ProfileInfo Component", () => {
  const user = {
    _id: "123",
    fullName: "Shahdev Kumar",
  };

  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it("renders user initials", () => {
    render(<ProfileInfo userInfo={user} onLogout={() => {}} />);
    expect(screen.getByText("SK")).toBeInTheDocument();
  });

  it("renders user full name", () => {
    render(<ProfileInfo userInfo={user} onLogout={() => {}} />);
    expect(screen.getByText("Shahdev Kumar")).toBeInTheDocument();
  });

  it("shows default name when userInfo is null", () => {
    render(<ProfileInfo userInfo={null} onLogout={() => {}} />);
    expect(screen.getByText("User")).toBeInTheDocument();
  });

  it("navigates to edit page when username clicked", () => {
    render(<ProfileInfo userInfo={user} onLogout={() => {}} />);
    fireEvent.click(screen.getByText("Shahdev Kumar"));
    expect(mockNavigate).toHaveBeenCalledWith("/user/123/edit");
  });

  it("does NOT navigate if userInfo missing", () => {
    render(<ProfileInfo userInfo={null} onLogout={() => {}} />);
    fireEvent.click(screen.getByText("User"));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("calls logout function when Logout button clicked", () => {
    const mockLogout = jest.fn();
    render(<ProfileInfo userInfo={user} onLogout={mockLogout} />);
    fireEvent.click(screen.getByText("Logout"));
    expect(mockLogout).toHaveBeenCalledTimes(1);
  });
});
