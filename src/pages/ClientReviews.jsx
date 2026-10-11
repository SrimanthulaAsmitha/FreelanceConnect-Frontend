
import NotificationBell from "../components/NotificationBell";

function ClientReviews({
  darkMode,
  setDarkMode,
  handleLogout,
  myProjects,
  reviews,
  reviewProject,
  setReviewProject,
  reviewRating,
  setReviewRating,
  reviewComment,
  setReviewComment,
  handleSubmitReview,
  submittingReview,
  setPage
}) {

  const completedProjects =
    myProjects.filter(
      (project) =>
        project.status === "COMPLETED"
    );

  return (
    <div className="dashboard-page">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="nav-brand">
          FreelanceConnect
        </div>

        <div className="nav-user">

          <span>
            Reviews
          </span>

          <NotificationBell />

          <button
            className="theme-button"
            onClick={() =>
              setDarkMode(!darkMode)
            }
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="dashboard-container">

        {/* ================= BACK BUTTON ================= */}

        <button
          className="client-reviews-back-button"
          onClick={() =>
            setPage("clientDashboard")
          }
        >
          <span>←</span>
          Back to Dashboard
        </button>


        {/* ================= PAGE HEADER ================= */}

        <section className="client-reviews-page-header">

          <span className="client-reviews-eyebrow">
            PROJECT FEEDBACK
          </span>

          <h1>
            Project Reviews
          </h1>

          <p>
            Share your experience and rate the freelancers you worked with.
          </p>

        </section>


        {/* ================= EMPTY ================= */}

        {completedProjects.length === 0 ? (

          <div className="professional-reviews-empty">

            <div className="reviews-empty-icon">
              ⭐
            </div>

            <h2>
              No Completed Projects
            </h2>

            <p>
              Reviews become available after your
              projects are completed.
            </p>

          </div>

        ) : (

          /* ================= PROJECTS ================= */

          <div className="professional-reviews-list">

            {completedProjects.map(
              (project) => {

                const alreadyReviewed =
                  reviews.some(
                    (review) =>
                      review.projectId ===
                      project.id
                  );

                return (

                  <div
                    className="professional-review-project-card"
                    key={project.id}
                  >

                    {/* CARD HEADER */}

                    <div className="review-project-header">

                      <div>

                        <span className="review-project-label">
                          COMPLETED PROJECT
                        </span>

                        <h2>
                          {project.title}
                        </h2>

                      </div>

                      <span className="status completed">
                        COMPLETED
                      </span>

                    </div>


                    {/* DESCRIPTION */}

                    <p className="review-project-description">
                      {project.description}
                    </p>


                    {/* PROJECT DETAILS */}

                    <div className="review-project-details">

                      <div className="review-detail">

                        <span>
                          FREELANCER
                        </span>

                        <strong>
                          {project.freelancerEmail}
                        </strong>

                      </div>


                      <div className="review-detail">

                        <span>
                          PROJECT BUDGET
                        </span>

                        <strong>
                          ₹{project.budget}
                        </strong>

                      </div>

                    </div>


                    {/* ACTION */}

                    {alreadyReviewed ? (

                      <div className="review-submitted">

                        <div className="review-check">
                          ✓
                        </div>

                        <div>

                          <strong>
                            Review Submitted
                          </strong>

                          <p>
                            Thank you for sharing your
                            feedback.
                          </p>

                        </div>

                      </div>

                    ) : (

                      <div className="review-action">

                        <button
                          className="blue-button review-button"
                          onClick={() =>
                            setReviewProject(
                              project
                            )
                          }
                        >
                          ⭐ Give Review
                        </button>

                      </div>

                    )}

                  </div>

                );

              }
            )}

          </div>

        )}


        {/* =================================================
            PROFESSIONAL REVIEW MODAL
        ================================================= */}

        {reviewProject && (

          <div
            className="professional-review-overlay"
            onClick={() =>
              setReviewProject(null)
            }
          >

            <div
              className="professional-review-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              {/* MODAL HEADER */}

              <div className="review-modal-header">

                <div>

                  <span>
                    SHARE YOUR EXPERIENCE
                  </span>

                  <h2>
                    Review Your Experience
                  </h2>

                </div>

                <button
                  className="review-modal-close"
                  onClick={() =>
                    setReviewProject(null)
                  }
                >
                  ×
                </button>

              </div>


              {/* PROJECT SUMMARY */}

              <div className="review-project-summary">

                <div className="review-summary-icon">
                  ✓
                </div>

                <div>

                  <span>
                    COMPLETED PROJECT
                  </span>

                  <strong>
                    {reviewProject.title}
                  </strong>

                  <p>
                    Freelancer:{" "}
                    {reviewProject.freelancerEmail}
                  </p>

                </div>

              </div>


              {/* FORM */}

              <form
                className="professional-review-form"
                onSubmit={(e) => {

                  e.preventDefault();

                  handleSubmitReview();

                }}
              >

                {/* RATING */}

                <div className="review-form-section">

                  <label>
                    How was your experience?
                  </label>

                  <p className="review-helper-text">
                    Select a rating from 1 to 5 stars.
                  </p>


                  <div className="professional-rating">

                    {[1, 2, 3, 4, 5].map(
                      (star) => (

                        <button
                          key={star}
                          type="button"
                          className={
                            Number(reviewRating) >= star
                              ? "star-button active"
                              : "star-button"
                          }
                          onClick={() =>
                            setReviewRating(
                              String(star)
                            )
                          }
                          aria-label={`Rate ${star} out of 5`}
                        >
                          ★
                        </button>

                      )
                    )}

                  </div>


                  {reviewRating && (

                    <div className="selected-rating-text">

                      {reviewRating === "5" &&
                        "Excellent experience"}

                      {reviewRating === "4" &&
                        "Very good experience"}

                      {reviewRating === "3" &&
                        "Good experience"}

                      {reviewRating === "2" &&
                        "Average experience"}

                      {reviewRating === "1" &&
                        "Poor experience"}

                    </div>

                  )}

                </div>


                {/* COMMENT */}

                <div className="review-form-section">

                  <label>
                    Your Review
                  </label>

                  <p className="review-helper-text">
                    Tell us about your experience
                    working with this freelancer.
                  </p>

                  <textarea
                    className="professional-review-textarea"
                    rows="5"
                    placeholder="Write your feedback here..."
                    value={reviewComment}
                    onChange={(e) =>
                      setReviewComment(
                        e.target.value
                      )
                    }
                    required
                  />

                </div>


                {/* ACTIONS */}

                <div className="review-modal-actions">

                  <button
                    type="button"
                    className="review-cancel-button"
                    onClick={() =>
                      setReviewProject(null)
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="blue-button review-submit-button"
                    disabled={
                      submittingReview ||
                      !reviewRating ||
                      !reviewComment.trim()
                    }
                  >
                    {submittingReview
                      ? "Submitting..."
                      : "Submit Review"}
                  </button>

                </div>

              </form>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default ClientReviews;
