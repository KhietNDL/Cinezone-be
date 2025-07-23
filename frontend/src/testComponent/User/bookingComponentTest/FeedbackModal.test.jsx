/* eslint-disable */
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import FeedbackModal from "../../../layouts/User/bookingComponent/FeedbackModal";

describe("FeedbackModal", () => {
  const setup = (props = {}) => {
    const defaultProps = {
      isOpen: true,
      feedbackRating: 0,
      feedbackComment: "",
      hoveredStar: 0,
      isSubmittingFeedback: false,
      setFeedbackRating: jest.fn(),
      setFeedbackComment: jest.fn(),
      setHoveredStar: jest.fn(),
      setIsFeedbackOpen: jest.fn(),
      onSubmit: jest.fn(),
    };
    return render(<FeedbackModal {...defaultProps} {...props} />);
  };

  it("does not render when isOpen is false", () => {
    setup({ isOpen: false });
    expect(screen.queryByText(/movie feedback/i)).not.toBeInTheDocument();
  });

  it("renders modal content when open", () => {
    setup();
    expect(screen.getByText(/movie feedback/i)).toBeInTheDocument();
    expect(screen.getByText(/share your thoughts/i)).toBeInTheDocument();
    expect(
      screen.getByText(/how would you rate this movie/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/submit feedback/i)).toBeInTheDocument();
  });

  it("calls setFeedbackRating and setHoveredStar on star hover/click", () => {
    const setFeedbackRating = jest.fn();
    const setHoveredStar = jest.fn();
    setup({ setFeedbackRating, setHoveredStar });
    const buttons = screen.getAllByRole("button");
    // buttons[0] là nút đóng modal, buttons[1-5] là các nút rating
    // Hover star 3 (tức là buttons[3])
    fireEvent.mouseEnter(buttons[3]);
    expect(setHoveredStar).toHaveBeenCalledWith(3);
    // Click star 3
    fireEvent.click(buttons[3]);
    expect(setFeedbackRating).toHaveBeenCalledWith(3);
    // Mouse leave
    fireEvent.mouseLeave(buttons[3]);
    expect(setHoveredStar).toHaveBeenCalledWith(0);
  });

  it("calls setFeedbackComment on textarea change", () => {
    const setFeedbackComment = jest.fn();
    setup({ setFeedbackComment });
    const textarea = screen.getByPlaceholderText(/tell us what you think/i);
    fireEvent.change(textarea, { target: { value: "Great movie!" } });
    expect(setFeedbackComment).toHaveBeenCalledWith("Great movie!");
  });

  it("disables submit button if no rating or comment", () => {
    setup({ feedbackRating: 0, feedbackComment: "" });
    const btn = screen.getByRole("button", { name: /submit feedback/i });
    expect(btn).toBeDisabled();
  });

  it("enables submit button if rating and comment are provided", () => {
    setup({ feedbackRating: 4, feedbackComment: "Nice!" });
    const btn = screen.getByRole("button", { name: /submit feedback/i });
    expect(btn).not.toBeDisabled();
  });

  it("calls onSubmit when submit button is clicked", () => {
    const onSubmit = jest.fn();
    setup({ feedbackRating: 5, feedbackComment: "Awesome!", onSubmit });
    const btn = screen.getByRole("button", { name: /submit feedback/i });
    fireEvent.click(btn);
    expect(onSubmit).toHaveBeenCalled();
  });

  //   it("shows loading state when isSubmittingFeedback is true", () => {
  //     setup({
  //       isSubmittingFeedback: true,
  //       feedbackRating: 5,
  //       feedbackComment: "A",
  //     });
  //     expect(screen.getByText(/submitting/i)).toBeInTheDocument();
  //     const btn = screen.getByRole("button", { name: /submit feedback/i });
  //     expect(btn).toBeDisabled();
  //   });

  it("calls setIsFeedbackOpen and resets state when close button is clicked", () => {
    const setIsFeedbackOpen = jest.fn();
    const setFeedbackRating = jest.fn();
    const setFeedbackComment = jest.fn();
    const setHoveredStar = jest.fn();
    setup({
      setIsFeedbackOpen,
      setFeedbackRating,
      setFeedbackComment,
      setHoveredStar,
    });
    const closeBtn = screen.getAllByRole("button")[0];
    fireEvent.click(closeBtn);
    expect(setIsFeedbackOpen).toHaveBeenCalledWith(false);
    expect(setFeedbackRating).toHaveBeenCalledWith(0);
    expect(setFeedbackComment).toHaveBeenCalledWith("");
    expect(setHoveredStar).toHaveBeenCalledWith(0);
  });
});
