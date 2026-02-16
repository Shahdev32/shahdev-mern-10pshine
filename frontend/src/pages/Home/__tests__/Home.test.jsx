import React from "react";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import "@testing-library/jest-dom";
import Home from "../Home";
import axiosInstance from "../../../utils/axiosInstance";
import { MemoryRouter } from "react-router-dom";

// Mock axiosInstance
jest.mock("../../../utils/axiosInstance", () => ({
  get: jest.fn(),
  delete: jest.fn(),
  put: jest.fn(),
}));

// Mock react-modal with setAppElement
jest.mock("react-modal", () => {
  const React = require("react");
  const Modal = ({ isOpen, children }) => (isOpen ? <div>{children}</div> : null);
  Modal.setAppElement = jest.fn();
  return Modal;
});

// Mock NoteCard component
jest.mock("../../../components/Cards/NoteCard", () => ({
  title,
  date,
  content,
  onEdit,
  onDelete,
  onPinNote,
}) => (
  <div data-testid="note-card">
    <h3>{title}</h3>
    <button onClick={onEdit}>Edit</button>
    <button onClick={onDelete}>Delete</button>
    <button onClick={onPinNote}>Pin</button>
  </div>
));

// Mock Navbar
jest.mock("../../../components/Navbar/Navbar", () => () => <div>Navbar</div>);

// Mock AddEditNotes
jest.mock("../AddEditNotes", () => () => <div>AddEditNotes Modal</div>);

// Mock Toast
jest.mock("../../../components/ToastMessage/Toast", () => ({ isShown, message }) =>
  isShown ? <div data-testid="toast">{message}</div> : null
);

describe("Home Component", () => {
  const notesMock = [
    { _id: "1", title: "Note 1", content: "Content 1", createdOn: "2026-01-01", isPinned: false, tags: [] },
    { _id: "2", title: "Note 2", content: "Content 2", createdOn: "2026-01-02", isPinned: true, tags: ["tag1"] },
  ];

  beforeEach(() => {
    axiosInstance.get.mockReset();
    axiosInstance.delete.mockReset();
    axiosInstance.put.mockReset();
  });

  test("renders 'No Notes Yet' message when no notes", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { notes: [] } }) // getAllNotes
      .mockResolvedValueOnce({ data: { user: { name: "Test User" } } }); // getUserInfo

    await act(async () => {
      render(<Home />, { wrapper: MemoryRouter });
    });

    expect(screen.getByText(/No Notes Yet/i)).toBeInTheDocument();
  });

  test("renders notes when fetched", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { notes: notesMock } }) // getAllNotes
      .mockResolvedValueOnce({ data: { user: { name: "Test User" } } }); // getUserInfo

    await act(async () => {
      render(<Home />, { wrapper: MemoryRouter });
    });

    const noteCards = await screen.findAllByTestId("note-card");
    expect(noteCards.length).toBe(2);
    expect(screen.getByText("Note 1")).toBeInTheDocument();
    expect(screen.getByText("Note 2")).toBeInTheDocument();
  });

  test("opens AddEditNotes modal when add button clicked", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { notes: [] } }) // getAllNotes
      .mockResolvedValueOnce({ data: { user: { name: "Test User" } } }); // getUserInfo

    await act(async () => {
      render(<Home />, { wrapper: MemoryRouter });
    });

    const addButton = screen.getByRole("button");
    fireEvent.click(addButton);

    expect(screen.getByText("AddEditNotes Modal")).toBeInTheDocument();
  });

  test("delete note triggers toast and refetches notes", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { notes: notesMock } }) // getAllNotes
      .mockResolvedValueOnce({ data: { user: { name: "Test User" } } }); // getUserInfo

    axiosInstance.delete.mockResolvedValue({ data: { error: false } });
    axiosInstance.get.mockResolvedValue({ data: { notes: [] } }); // refreshed notes

    await act(async () => {
      render(<Home />, { wrapper: MemoryRouter });
    });

    const deleteButtons = await screen.findAllByText("Delete");
    await act(async () => {
      fireEvent.click(deleteButtons[0]);
    });

    expect(await screen.findByTestId("toast")).toHaveTextContent("Note Deleted Successfully");
  });

  test("pin note triggers toast", async () => {
    axiosInstance.get
      .mockResolvedValueOnce({ data: { notes: notesMock } }) // getAllNotes
      .mockResolvedValueOnce({ data: { user: { name: "Test User" } } }); // getUserInfo

    axiosInstance.put.mockResolvedValue({ data: { note: notesMock[0] } });
    axiosInstance.get.mockResolvedValue({ data: { notes: notesMock } }); // refreshed notes

    await act(async () => {
      render(<Home />, { wrapper: MemoryRouter });
    });

    const pinButtons = await screen.findAllByText("Pin");
    await act(async () => {
      fireEvent.click(pinButtons[0]);
    });

    expect(await screen.findByTestId("toast")).toHaveTextContent("Note Updated Successfully");
  });
});
