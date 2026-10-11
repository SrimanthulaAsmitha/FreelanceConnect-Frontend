
import NotificationBell from "../components/NotificationBell";

function PostProject({
  darkMode,
  setDarkMode,
  handleLogout,
  setPage,
  projectTitle,
  setProjectTitle,
  projectDescription,
  setProjectDescription,
  projectBudget,
  setProjectBudget,
  projectCategory,
  setProjectCategory,
  projectLocation,
  setProjectLocation,
  projectDeadline,
  setProjectDeadline,
  handlePostProject,
  postingProject
}) {

  return (
    <div className="dashboard-page">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="nav-brand">
          FreelanceConnect
        </div>

        <div className="nav-user">

          <span>
            Post a Project
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
          className="post-project-back-button"
          onClick={() =>
            setPage("clientDashboard")
          }
        >
          <span>←</span>
          Back to Dashboard
        </button>


        {/* ================= PAGE HEADER ================= */}

        <section className="post-project-page-header">

          <h1>
            Post a Project
          </h1>

          <p>
            Tell freelancers what you need help with.
          </p>

        </section>


        {/* ================= PROJECT FORM ================= */}

        <div className="professional-project-card">

          {/* ================= FORM HEADER ================= */}

          <div className="project-form-header">

            <div className="post-project-header-content">

              <span className="project-form-label">
                PROJECT DETAILS
              </span>

              <h2>
                Create a New Project
              </h2>

              <p>
                Provide clear details so the right freelancer can understand your project.
              </p>

            </div>

          </div>


          <div className="project-form-divider"></div>


          {/* ================= FORM ================= */}

          <form
            className="professional-project-form"
            onSubmit={handlePostProject}
          >

            {/* PROJECT TITLE */}

            <div className="professional-form-field">

              <label>
                Project Title
              </label>

              <input
                type="text"
                placeholder="Example: Build a responsive business website"
                value={projectTitle}
                onChange={(e) =>
                  setProjectTitle(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* DESCRIPTION */}

            <div className="professional-form-field">

              <label>
                Project Description
              </label>

              <textarea
                rows="6"
                placeholder="Describe your project requirements, expected work, and important details..."
                value={projectDescription}
                onChange={(e) =>
                  setProjectDescription(
                    e.target.value
                  )
                }
                required
              />

            </div>


            {/* BUDGET + CATEGORY */}

            <div className="professional-form-grid">

              <div className="professional-form-field">

                <label>
                  Project Budget
                </label>

                <input
                  type="number"
                  min="5000"
                  placeholder="Minimum ₹5,000"
                  value={projectBudget}
                  onChange={(e) =>
                    setProjectBudget(
                      e.target.value
                    )
                  }
                  required
                />

                <span className="field-hint">
                  Minimum project budget is ₹5,000.
                </span>

              </div>


              <div className="professional-form-field">

                <label>
                  Category
                </label>

                <select
                  value={projectCategory}
                  onChange={(e) =>
                    setProjectCategory(
                      e.target.value
                    )
                  }
                  required
                >

                  <option value="">
                    Select category
                  </option>

                  <option value="Full Stack Development">
                    Full Stack Development
                  </option>

                  <option value="Web Development">
                    Web Development
                  </option>

                  <option value="Video Editing">
                    Video Editing
                  </option>

                  <option value="Graphic Design">
                    Graphic Design
                  </option>

                  <option value="Photography">
                    Photography
                  </option>

                  <option value="Social Media">
                    Social Media
                  </option>

                  <option value="Content Writing">
                    Content Writing
                  </option>

                  <option value="Marketing">
                    Marketing
                  </option>

                  <option value="Data Entry">
                    Data Entry
                  </option>

                  <option value="Tutoring">
                    Tutoring
                  </option>

                </select>

              </div>

            </div>


            {/* LOCATION */}

            <div className="professional-form-field">

              <label>
                Location
              </label>

              <input
                type="text"
                placeholder="Example: Hyderabad"
                value={projectLocation}
                onChange={(e) =>
                  setProjectLocation(
                    e.target.value
                  )
                }
                required
              />

              <span className="field-hint">
                Mention the city or area where the work
                is based.
              </span>

            </div>


            {/* PROJECT DEADLINE */}

            <div className="professional-form-field">

              <label>
                Project Deadline
              </label>

              <input
                type="date"
                value={projectDeadline}
                onChange={(e) =>
                  setProjectDeadline(
                    e.target.value
                  )
                }
                required
              />

              <span className="field-hint">
                Select the date by which the project should be completed.
              </span>

            </div>


            {/* SUBMIT */}

            <div className="post-project-action">

              <button
                type="submit"
                className="professional-post-button"
                disabled={postingProject}
              >
                {postingProject
                  ? "Posting..."
                  : "Post Project"}
              </button>

            </div>

          </form>

        </div>

      </main>

    </div>
  );
}

export default PostProject;
