import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import TagInput from "./TagInput";

// Mock react-icons
jest.mock("react-icons/md", () => ({
  MdAdd: () => <span data-testid="MdAdd">+</span>,
  MdClose: () => <span data-testid="MdClose">x</span>,
}));

describe("TagInput Component", () => {
  let tags;
  let setTags;

  beforeEach(() => {
    tags = ["React", "JS"];
    setTags = jest.fn();
  });

  it("renders existing tags", () => {
    render(<TagInput tags={tags} setTags={setTags} />);
    expect(screen.getByText("# React")).toBeInTheDocument();
    expect(screen.getByText("# JS")).toBeInTheDocument();
  });

  it("adds a new tag on button click", () => {
    render(<TagInput tags={tags} setTags={setTags} />);

    const input = screen.getByPlaceholderText("Add tags");
    const addButton = screen.getByTestId("MdAdd").parentElement;

    fireEvent.change(input, { target: { value: "Node" } });
    fireEvent.click(addButton);

    expect(setTags).toHaveBeenCalledWith(["React", "JS", "Node"]);
    expect(input.value).toBe("");
  });

  it("adds a new tag on Enter key", () => {
    render(<TagInput tags={tags} setTags={setTags} />);
    const input = screen.getByPlaceholderText("Add tags");

    fireEvent.change(input, { target: { value: "HTML" } });
    fireEvent.keyDown(input, { key: "Enter", code: "Enter" });

    expect(setTags).toHaveBeenCalledWith(["React", "JS", "HTML"]);
    expect(input.value).toBe("");
  });

  it("does not add empty tag", () => {
    render(<TagInput tags={tags} setTags={setTags} />);
    const input = screen.getByPlaceholderText("Add tags");
    const addButton = screen.getByTestId("MdAdd").parentElement;

    fireEvent.change(input, { target: { value: "   " } });
    fireEvent.click(addButton);

    expect(setTags).not.toHaveBeenCalled();
  });

  it("removes a tag when remove button is clicked", () => {
    render(<TagInput tags={tags} setTags={setTags} />);
    const removeButtons = screen.getAllByTestId("MdClose");

    fireEvent.click(removeButtons[0]); // Remove "React"
    expect(setTags).toHaveBeenCalledWith(["JS"]);
  });
});
