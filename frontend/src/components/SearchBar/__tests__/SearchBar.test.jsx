import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import SearchBar from "../SearchBar";

describe("SearchBar Component", () => {
  const setup = (value = "") => {
    const onChange = jest.fn();
    const handleSearch = jest.fn();
    const onClearSearch = jest.fn();

    render(
      <SearchBar
        value={value}
        onChange={onChange}
        handleSearch={handleSearch}
        onClearSearch={onClearSearch}
      />
    );

    return { onChange, handleSearch, onClearSearch };
  };

  test("renders input field", () => {
    setup();
    expect(screen.getByPlaceholderText("Search Notes")).toBeInTheDocument();
  });

  test("calls onChange when typing", () => {
    const { onChange } = setup();

    fireEvent.change(screen.getByPlaceholderText("Search Notes"), {
      target: { value: "React" },
    });

    expect(onChange).toHaveBeenCalled();
  });

  test("calls handleSearch when search icon clicked", () => {
    const { handleSearch } = setup("test");

    fireEvent.click(screen.getByTestId("search-btn"));

    expect(handleSearch).toHaveBeenCalledTimes(1);
  });

  test("shows clear button when value exists", () => {
    setup("React");

    expect(screen.getByTestId("clear-btn")).toBeInTheDocument();
  });

  test("calls onClearSearch when clear clicked", () => {
    const { onClearSearch } = setup("React");

    fireEvent.click(screen.getByTestId("clear-btn"));

    expect(onClearSearch).toHaveBeenCalledTimes(1);
  });

  test("does not show clear button when empty", () => {
    setup("");

    expect(screen.queryByTestId("clear-btn")).not.toBeInTheDocument();
  });
});
