import React from "react";
import { render, screen, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Toast from "../Toast";

// mock timers for setTimeout
jest.useFakeTimers();

describe("Toast Component", () => {
  const defaultProps = {
    isShown: true,
    message: "Action successful",
    type: "success",
    onClose: jest.fn(),
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders message correctly", () => {
    render(<Toast {...defaultProps} />);

    expect(screen.getByText("Action successful")).toBeInTheDocument();
  });

  test("applies visible class when isShown is true", () => {
    const { container } = render(<Toast {...defaultProps} />);

    expect(container.firstChild).toHaveClass("opacity-100");
  });

  test("applies hidden class when isShown is false", () => {
    const { container } = render(
      <Toast {...defaultProps} isShown={false} />
    );

    expect(container.firstChild).toHaveClass("opacity-0");
  });

  test("renders delete icon when type is delete", () => {
    const { container } = render(
      <Toast {...defaultProps} type="delete" />
    );

    // icon renders as svg
    const icon = container.querySelector("svg");
    expect(icon).toBeInTheDocument();
  });

  test("calls onClose automatically after 3 seconds", () => {
    const onClose = jest.fn();

    render(<Toast {...defaultProps} onClose={onClose} />);

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test("clears timeout on unmount", () => {
    const onClose = jest.fn();

    const { unmount } = render(
      <Toast {...defaultProps} onClose={onClose} />
    );

    unmount();

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(onClose).not.toHaveBeenCalled();
  });
});
