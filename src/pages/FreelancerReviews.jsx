import NotificationBell from "../components/NotificationBell";

function FreelancerReviews({
darkMode,
setDarkMode,
handleLogout,
reviews,
setPage
}) {

return ( <div className="dashboard-page">

```
  {/* ================= NAVBAR ================= */}

  <header className="navbar">

    <div className="nav-brand">
      FreelanceConnect
    </div>

    <div className="nav-user">

      <span>
        My Reviews
      </span>

      <NotificationBell />

      <button
        className="theme-button"
        onClick={() => setDarkMode(!darkMode)}
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

    {/* ================= PROFESSIONAL BACK BUTTON ================= */}

    <button
      className="freelancer-reviews-back-button"
      onClick={() =>
        setPage("freelancerDashboard")
      }
    >
      <span>←</span>
      Back to Dashboard
    </button>


    {/* ================= PROFESSIONAL HEADER ================= */}

    <section className="freelancer-reviews-header-content">

      <span className="freelancer-reviews-eyebrow">
        FREELANCER WORKSPACE
      </span>

      <h1>
        My Reviews
      </h1>

      <p>
        See what clients say about your work.
        Explore their feedback, review your ratings,
        and understand how your completed projects
        contribute to your freelance reputation.
      </p>

    </section>


    {/* ================= REVIEWS ================= */}

    {reviews.length === 0 ? (

      <div className="empty-projects">

        <div className="empty-review-icon">
          ⭐
        </div>

        <h3>
          No Reviews Yet
        </h3>

        <p>
          Client reviews will appear here
          after you complete projects.
        </p>

      </div>

    ) : (

      <div className="freelancer-reviews-list">

        {reviews.map((review) => (

          <div
            className="professional-review-card"
            key={review.id}
          >

            {/* TOP */}

            <div className="review-card-top">

              <div>

                <span className="review-label">
                  CLIENT REVIEW
                </span>

                <h2>
                  Project #{review.projectId}
                </h2>

              </div>

              <div className="review-rating">

                {"⭐".repeat(
                  review.rating
                )}

              </div>

            </div>


            {/* DIVIDER */}

            <div className="review-divider"></div>


            {/* CLIENT */}

            <div className="review-client">

              <div className="review-avatar">
                {review.clientEmail
                  ?.charAt(0)
                  ?.toUpperCase()}
              </div>

              <div>

                <span>
                  Reviewed by
                </span>

                <strong>
                  {review.clientEmail}
                </strong>

              </div>

            </div>


            {/* COMMENT */}

            <div className="review-comment-box">

              <span>
                Client Feedback
              </span>

              <p>
                "{review.comment}"
              </p>

            </div>


            {/* FOOTER */}

            <div className="review-footer">

              <span>
                ⭐ {review.rating}/5 Rating
              </span>

              <span>
                Project #{review.projectId}
              </span>

            </div>

          </div>

        ))}

      </div>

    )}

  </main>

</div>

);
}

export default FreelancerReviews;
