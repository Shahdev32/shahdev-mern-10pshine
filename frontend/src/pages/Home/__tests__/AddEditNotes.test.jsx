import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import AddEditNotes from "../AddEditNotes";
import axiosInstance from "../../../utils/axiosInstance";

// Mock axiosInstance
jest.mock("../../../utils/axiosInstance", () => ({
  post: jest.fn(),
  put: jest.fn(),
}));

// Mock TagInput
jest.mock("../../../components/Input/TagInput", () => ({ tags, setTags }) => (
  <div data-testid="tag-input">Tags Component</div>
));

describe("AddEditNotes Component", () => {
  const mockGetAllNotes = jest.fn();
  const mockOnClose = jest.fn();
  const mockShowToast = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all form elements correctly", () => {
    render(
      <AddEditNotes
        noteData={{}}
        type="add"
        getAllNotes={mockGetAllNotes}
        onClose={mockOnClose}
        showToastMessage={mockShowToast}
      />
    );

    expect(screen.getByPlaceholderText("Go To Gym At 5")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Content")).toBeInTheDocument();
    expect(screen.getByTestId("tag-input")).toBeInTheDocument();
    expect(screen.getByText("ADD")).toBeInTheDocument();
  });

  test("shows validation error when title is empty", () => {
    render(
      <AddEditNotes
        noteData={{}}
        type="add"
        getAllNotes={mockGetAllNotes}
        onClose={mockOnClose}
        showToastMessage={mockShowToast}
      />
    );

    fireEvent.click(screen.getByText("ADD"));

    expect(screen.getByText("please enter the title")).toBeInTheDocument();
  });

  test("shows validation error when content is empty", () => {
    render(
      <AddEditNotes
        noteData={{ title: "Test Title" }}
        type="add"
        getAllNotes={mockGetAllNotes}
        onClose={mockOnClose}
        showToastMessage={mockShowToast}
      />
    );

    fireEvent.click(screen.getByText("ADD"));

    expect(screen.getByText("please enter the content")).toBeInTheDocument();
  });

  test("calls addNewNote API and closes modal on success", async () => {
    axiosInstance.post.mockResolvedValue({ data: { note: { _id: "1" } } });

    render(
      <AddEditNotes
        noteData={{ title: "Test Title", content: "Test Content" }}
        type="add"
        getAllNotes={mockGetAllNotes}
        onClose={mockOnClose}
        showToastMessage={mockShowToast}
      />
    );

    fireEvent.click(screen.getByText("ADD"));

    await waitFor(() => {
      expect(axiosInstance.post).toHaveBeenCalledWith("/add-note", {
        title: "Test Title",
        content: "Test Content",
        tags: [],
      });
      expect(mockShowToast).toHaveBeenCalledWith("Note Added Successfully");
      expect(mockGetAllNotes).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("calls editNote API and closes modal on success", async () => {
    axiosInstance.put.mockResolvedValue({ data: { note: { _id: "1" } } });

    render(
      <AddEditNotes
        noteData={{ _id: "1", title: "Old Title", content: "Old Content" }}
        type="edit"
        getAllNotes={mockGetAllNotes}
        onClose={mockOnClose}
        showToastMessage={mockShowToast}
      />
    );

    fireEvent.click(screen.getByText("UPDATE"));

    await waitFor(() => {
      expect(axiosInstance.put).toHaveBeenCalledWith("/edit-note/1", {
        title: "Old Title",
        content: "Old Content",
        tags: [],
      });
      expect(mockShowToast).toHaveBeenCalledWith("Note Updated Successfully");
      expect(mockGetAllNotes).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test("sets error message if API fails", async () => {
    axiosInstance.post.mockRejectedValue({
      response: { data: { message: "API Error" } },
    });

    render(
      <AddEditNotes
        noteData={{ title: "Title", content: "Content" }}
        type="add"
        getAllNotes={mockGetAllNotes}
        onClose={mockOnClose}
        showToastMessage={mockShowToast}
      />
    );

    fireEvent.click(screen.getByText("ADD"));

    await waitFor(() => {
      expect(screen.getByText("API Error")).toBeInTheDocument();
    });
  });

  test("close button calls onClose", () => {
    render(
      <AddEditNotes
        noteData={{}}
        type="add"
        getAllNotes={mockGetAllNotes}
        onClose={mockOnClose}
        showToastMessage={mockShowToast}
      />
    );

  fireEvent.click(screen.getByTestId("close-btn"));
    expect(mockOnClose).toHaveBeenCalled();
  });
});
