import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "../NoteCard";
import moment from "moment";

describe("NoteCard Component", () => {
  const mockProps = {
    title: "Test Note",
    date: "2025-02-10",
    content:
      "This is a long test note content that should be sliced at sixty characters for preview.",
    tags: ["react", "jest"],
    isPinned: false,
    onEdit: jest.fn(),
    onDelete: jest.fn(),
    onPinNote: jest.fn(),
  };

  test("renders title correctly", () => {
    render(<NoteCard {...mockProps} />);
    expect(screen.getByText("Test Note")).toBeInTheDocument();
  });

  test("renders formatted date correctly", () => {
    render(<NoteCard {...mockProps} />);
    const formattedDate = moment(mockProps.date).format("Do MMM YYYY");
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  test("renders sliced content (60 chars)", () => {
    render(<NoteCard {...mockProps} />);
    const sliced = mockProps.content.slice(0, 60);
    expect(screen.getByText(sliced)).toBeInTheDocument();
  });

  test("renders tags with # symbol", () => {
    render(<NoteCard {...mockProps} />);
    expect(screen.getByText("#react #jest")).toBeInTheDocument();
  });

  test("calls onPinNote when pin icon clicked", () => {
    render(<NoteCard {...mockProps} />);
    const pinBtn = document.querySelector(".icon-btn");
    fireEvent.click(pinBtn);
    expect(mockProps.onPinNote).toHaveBeenCalledTimes(1);
  });

  test("calls onEdit when edit icon clicked", () => {
    render(<NoteCard {...mockProps} />);
    const editBtn = document.querySelectorAll(".icon-btn")[1];
    fireEvent.click(editBtn);
    expect(mockProps.onEdit).toHaveBeenCalledTimes(1);
  });

  test("calls onDelete when delete icon clicked", () => {
    render(<NoteCard {...mockProps} />);
    const deleteBtn = document.querySelectorAll(".icon-btn")[2];
    fireEvent.click(deleteBtn);
    expect(mockProps.onDelete).toHaveBeenCalledTimes(1);
  });
});

