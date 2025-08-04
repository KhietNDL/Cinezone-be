/* eslint-disable no-undef */
import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import MovieForm from "../../../layouts/Admin/movieComponent/MovieForm";

// Mock props with default values
const defaultProps = {
  showEditForm: false,
  handleCloseMovieForm: jest.fn(),
  nameOfVietnamese: "",
  nameOfEnglish: "",
  fromDate: "",
  toDate: "",
  actors: "",
  productionCompany: "",
  director: "",
  runningTime: "",
  genres: "",
  contentSynopsis: "",
  posterPreview: null,
  trailerPreview: null,
  versions: [{ VersionType: "", Language: "" }],
  iframeUrl: "",
  posterUploadRef: { current: null },
  trailerUploadRef: { current: null },
  handleInputChange: jest.fn(),
  handleVersionChange: jest.fn(),
  addVersion: jest.fn(),
  removeVersion: jest.fn(),
  handleFileChange: jest.fn(),
  handleCreateMovie: jest.fn(),
  handleEditMovie: jest.fn(),
  setPosterFileName: jest.fn(),
  setPosterPreview: jest.fn(),
  setTrailerFileName: jest.fn(),
  setTrailerPreview: jest.fn(),
  loading: false,
};

describe("MovieForm Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Rendering", () => {
    test("renders add movie form by default", () => {
      render(<MovieForm {...defaultProps} />);

      expect(screen.getByText("Add New Movie")).toBeInTheDocument();
      expect(
        screen.getByText("Fill in the details below to add a movie entry")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /create movie/i })
      ).toBeInTheDocument();
    });

    test("renders edit movie form when showEditForm is true", () => {
      render(<MovieForm {...defaultProps} showEditForm={true} />);

      expect(screen.getByText("Edit Movie")).toBeInTheDocument();
      expect(
        screen.getByText("Update the details below to edit the movie entry")
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /save changes/i })
      ).toBeInTheDocument();
    });

    test("renders all required form sections", () => {
      render(<MovieForm {...defaultProps} />);

      expect(screen.getByText("Movie Information")).toBeInTheDocument();
      expect(screen.getByText("Screening Period")).toBeInTheDocument();
      expect(screen.getByText("Production Details")).toBeInTheDocument();
      expect(screen.getByText("Technical Specifications")).toBeInTheDocument();
      expect(screen.getByText("Content & Media")).toBeInTheDocument();
      expect(screen.getByText("Movie Trailer")).toBeInTheDocument();
    });
  });

  describe("Form Interactions", () => {
    test("calls handleCloseMovieForm when close button is clicked", async () => {
      const user = userEvent.setup();
      render(<MovieForm {...defaultProps} />);

      const closeButton = screen.getByRole("button", { name: "" }); // X button
      await user.click(closeButton);

      expect(defaultProps.handleCloseMovieForm).toHaveBeenCalledTimes(1);
    });

    test("calls handleCloseMovieForm when cancel button is clicked", async () => {
      const user = userEvent.setup();
      render(<MovieForm {...defaultProps} />);

      const cancelButton = screen.getByRole("button", { name: /cancel/i });
      await user.click(cancelButton);

      expect(defaultProps.handleCloseMovieForm).toHaveBeenCalledTimes(1);
    });

    test("calls handleCreateMovie when create button is clicked", async () => {
      const user = userEvent.setup();
      render(<MovieForm {...defaultProps} />);

      const createButton = screen.getByRole("button", {
        name: /create movie/i,
      });
      await user.click(createButton);

      expect(defaultProps.handleCreateMovie).toHaveBeenCalledTimes(1);
    });

    test("calls handleEditMovie when save changes button is clicked", async () => {
      const user = userEvent.setup();
      render(<MovieForm {...defaultProps} showEditForm={true} />);

      const saveButton = screen.getByRole("button", { name: /save changes/i });
      await user.click(saveButton);

      expect(defaultProps.handleEditMovie).toHaveBeenCalledTimes(1);
    });
  });

  describe("Genre Selection", () => {
    test("renders all genre buttons", () => {
      render(<MovieForm {...defaultProps} />);

      const genreButtons = [
        "Action",
        "Adventure",
        "Animation",
        "Comedy",
        "Crime",
        "Drama",
        "Fantasy",
        "Horror",
        "Mystery",
        "Romance",
        "Sci-Fi",
        "Thriller",
        "War",
        "Western",
      ];

      genreButtons.forEach((genre) => {
        expect(screen.getByRole("button", { name: genre })).toBeInTheDocument();
      });
    });

    test("handles genre selection correctly", async () => {
      const user = userEvent.setup();
      render(<MovieForm {...defaultProps} />);

      const actionButton = screen.getByRole("button", { name: "Action" });
      await user.click(actionButton);

      expect(defaultProps.handleInputChange).toHaveBeenCalledWith(
        "Genres",
        "Action"
      );
    });

    test("displays selected genres correctly", () => {
      const propsWithGenres = {
        ...defaultProps,
        genres: "Action,Comedy,Drama",
      };

      render(<MovieForm {...propsWithGenres} />);

      const actionButton = screen.getByRole("button", { name: "Action" });
      const comedyButton = screen.getByRole("button", { name: "Comedy" });
      const dramaButton = screen.getByRole("button", { name: "Drama" });

      expect(actionButton).toHaveClass("bg-blue-600", "text-white");
      expect(comedyButton).toHaveClass("bg-blue-600", "text-white");
      expect(dramaButton).toHaveClass("bg-blue-600", "text-white");
    });
  });

  describe("Version Management", () => {
    test("calls addVersion when add version button is clicked", async () => {
      const user = userEvent.setup();
      render(<MovieForm {...defaultProps} />);

      const addVersionButton = screen.getByRole("button", {
        name: /add another version/i,
      });
      await user.click(addVersionButton);

      expect(defaultProps.addVersion).toHaveBeenCalledTimes(1);
    });

    test("disables add version button when 3 versions exist", () => {
      const propsWithMaxVersions = {
        ...defaultProps,
        versions: [
          { VersionType: "2D", Language: "VN" },
          { VersionType: "3D", Language: "ENG" },
          { VersionType: "IMAX", Language: "VN" },
        ],
      };

      render(<MovieForm {...propsWithMaxVersions} />);

      const addVersionButton = screen.getByRole("button", {
        name: /add another version/i,
      });
      expect(addVersionButton).toBeDisabled();
      expect(addVersionButton).toHaveClass("opacity-50", "cursor-not-allowed");
    });

    test("shows remove buttons for additional versions", () => {
      const propsWithMultipleVersions = {
        ...defaultProps,
        versions: [
          { VersionType: "2D", Language: "VN" },
          { VersionType: "3D", Language: "ENG" },
        ],
      };

      render(<MovieForm {...propsWithMultipleVersions} />);

      const removeButtons = screen.getAllByTitle("Remove version");
      expect(removeButtons).toHaveLength(1); // Only one remove button for the second version
    });
  });

  describe("File Upload", () => {
    test("shows upload areas when no files are selected", () => {
      render(<MovieForm {...defaultProps} />);

      expect(screen.getByText("Click to upload poster")).toBeInTheDocument();
      expect(screen.getByText("Click to upload trailer")).toBeInTheDocument();
    });

    test("shows poster preview when posterPreview is provided", () => {
      const propsWithPoster = {
        ...defaultProps,
        posterPreview: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD",
      };

      render(<MovieForm {...propsWithPoster} />);

      const posterImage = screen.getByAltText("Poster Preview");
      expect(posterImage).toBeInTheDocument();
      expect(posterImage).toHaveAttribute("src", propsWithPoster.posterPreview);
    });

    test("calls file change handlers when files are selected", async () => {
      const user = userEvent.setup();
      render(<MovieForm {...defaultProps} />);

      const posterInput = screen.getByLabelText("Click to upload poster");
      const file = new File(["test"], "poster.jpg", { type: "image/jpeg" });

      await user.upload(posterInput, file);

      expect(defaultProps.handleFileChange).toHaveBeenCalledWith(
        "PosterImage",
        expect.any(Object)
      );
    });
  });

  describe("Loading State", () => {
    test("shows loading overlay when loading is true", () => {
      render(<MovieForm {...defaultProps} loading={true} />);

      expect(
        screen.getByText("Đang thêm phim, vui lòng chờ...")
      ).toBeInTheDocument();
    });

    test("shows edit loading message when in edit mode", () => {
      render(
        <MovieForm {...defaultProps} showEditForm={true} loading={true} />
      );

      expect(
        screen.getByText("Đang cập nhật phim, vui lòng chờ...")
      ).toBeInTheDocument();
    });

    test("disables submit button when loading", () => {
      render(<MovieForm {...defaultProps} loading={true} />);

      const submitButton = screen.getByRole("button", {
        name: /create movie/i,
      });
      expect(submitButton).toBeDisabled();
    });
  });

  describe("Form Values", () => {
    test("displays provided form values correctly", () => {
      const propsWithValues = {
        ...defaultProps,
        nameOfVietnamese: "Phim Test",
        nameOfEnglish: "Test Movie",
        fromDate: "2024-01-01",
        toDate: "2024-12-31",
        actors: "Actor 1, Actor 2",
        productionCompany: "Test Studio",
        director: "Test Director",
        runningTime: "120",
        contentSynopsis: "This is a test movie synopsis",
        iframeUrl: "https://youtube.com/embed/test",
      };

      render(<MovieForm {...propsWithValues} />);

      expect(screen.getByDisplayValue("Phim Test")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Movie")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-01-01")).toBeInTheDocument();
      expect(screen.getByDisplayValue("2024-12-31")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Actor 1, Actor 2")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Studio")).toBeInTheDocument();
      expect(screen.getByDisplayValue("Test Director")).toBeInTheDocument();
      expect(screen.getByDisplayValue("120")).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("This is a test movie synopsis")
      ).toBeInTheDocument();
      expect(
        screen.getByDisplayValue("https://youtube.com/embed/test")
      ).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    test("has proper ARIA labels and roles", () => {
      render(<MovieForm {...defaultProps} />);

      // Check for proper form structure
      expect(
        screen.getByRole("button", { name: /create movie/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /cancel/i })
      ).toBeInTheDocument();

      // Check for required field indicators
      const requiredFields = screen.getAllByText("*");
      expect(requiredFields.length).toBeGreaterThan(0);
    });
  });

  describe("Error Handling", () => {});
});
