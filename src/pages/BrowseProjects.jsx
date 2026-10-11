import NotificationBell from "../components/NotificationBell";

function BrowseProjects({
  darkMode,
  setDarkMode,
  handleLogout,
  search,
  setSearch,
  category,
  setCategory,
  loading,
  filteredProjects,
  selectedProject,
  setSelectedProject,
  handleViewProject,
  setPage
}) {

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}

      <header className="navbar">

        <div className="nav-brand">
          FreelanceConnect
        </div>

        <div className="nav-user">

          <span>
            Browse Projects
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


      <main className="dashboard-container">

        {/* PROFESSIONAL BACK BUTTON */}

        <button
          className="browse-back-button"
          onClick={() =>
            setPage("freelancerDashboard")
          }
        >
          <span>←</span>
          Back to Dashboard
        </button>


        {/* PROFESSIONAL PAGE HEADER */}

        <section className="browse-header-content">

          <span className="browse-eyebrow">
            FREELANCER WORKSPACE
          </span>

          <h1>
            Explore Opportunities
          </h1>

          <p>
            Discover projects that match your skills and start
            working with local clients. Showcase your expertise,
            collaborate with clients, and grow your freelance career.
          </p>

        </section>


        {/* SEARCH + FILTER */}

        <div className="browse-toolbar">

          <div className="browse-search">

            <span>
              🔍
            </span>

            <input
              type="text"
              placeholder="Search projects by title..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>


          <div className="browse-category">

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
            >

              <option value="">
                All Categories
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


        {/* PROJECT COUNT */}

        {!loading &&
          filteredProjects.length > 0 && (

            <div className="browse-result-count">

              <span>
                Available Projects
              </span>

              <strong>
                {filteredProjects.length}
              </strong>

            </div>

          )}


        {/* LOADING */}

        {loading ? (

          <div className="loading">

            Loading projects...

          </div>

        ) : filteredProjects.length === 0 ? (

          /* EMPTY */

          <div className="empty-state">

            <div className="empty-icon">
              📁
            </div>

            <h2>
              No Projects Found
            </h2>

            <p>
              Try changing your search or category filter.
            </p>

          </div>

        ) : (

          /* PROJECTS */

          <div className="projects-grid">

            {filteredProjects.map(
              (project) => (

                <div
                  className="project-card professional-browse-card"
                  key={project.id}
                >

                  {/* CARD TOP */}

                  <div className="browse-card-top">

                    <div className="browse-project-number">

                      PROJECT #{project.id}

                    </div>

                    <span
                      className={`status ${project.status?.toLowerCase()}`}
                    >
                      {project.status}
                    </span>

                  </div>


                  {/* TITLE */}

                  <h2 className="browse-project-title">

                    {project.title}

                  </h2>


                  {/* CATEGORY */}

                  <div className="browse-category-badge">

                    {project.category}

                  </div>


                  {/* DESCRIPTION */}

                  <p className="project-description">

                    {project.description}

                  </p>


                  {/* PROJECT INFO */}

                  <div className="browse-project-info">

                    <div className="browse-info-item">

                      <span>
                        BUDGET
                      </span>

                      <strong>
                        ₹{project.budget}
                      </strong>

                    </div>


                    <div className="browse-info-item">

                      <span>
                        LOCATION
                      </span>

                      <strong>
                        {project.location}
                      </strong>

                    </div>

                  </div>


                  {/* VIEW BUTTON */}

                  <button
                    className="blue-button browse-view-button"
                    onClick={() =>
                      handleViewProject(project)
                    }
                  >
                    View Project

                    <span>
                      →
                    </span>

                  </button>

                </div>

              )
            )}

          </div>

        )}


        {/* PROJECT DETAILS MODAL */}

        {selectedProject && (

          <div className="modal-overlay">

            <div className="project-modal professional-project-modal">

              {/* CLOSE */}

              <button
                className="close-button"
                onClick={() =>
                  setSelectedProject(null)
                }
              >
                ×
              </button>


              {/* PROJECT HEADER */}

              <div className="project-view-top">

                <div>

                  <div className="project-view-label">

                    PROJECT #{selectedProject.id}

                  </div>

                  <h2>

                    {selectedProject.title}

                  </h2>

                </div>

                <span

                  className={`project-view-status ${selectedProject.status?.toLowerCase()}`}
                >

                  {selectedProject.status}

                </span>

              </div>


              {/* CATEGORY */}

              <div className="project-view-category">

                {selectedProject.category}

              </div>


              {/* DESCRIPTION */}

              <div className="project-view-section">

                <h3>

                  About this project

                </h3>

                <p>

                  {selectedProject.description}

                </p>

              </div>


              {/* PROJECT INFORMATION */}

              <div className="project-view-info">

                <div className="project-view-info-box">

                  <span>

                    BUDGET

                  </span>

                  <strong>

                    ₹{selectedProject.budget}

                  </strong>

                </div>


                <div className="project-view-info-box">

                  <span>

                    CATEGORY

                  </span>

                  <strong>

                    {selectedProject.category}

                  </strong>

                </div>


                <div className="project-view-info-box">

                  <span>

                    LOCATION

                  </span>

                  <strong>

                    📍 {selectedProject.location}

                  </strong>

                </div>


                <div className="project-view-info-box">

                  <span>

                    PROJECT STATUS

                  </span>

                  <strong>

                    {selectedProject.status}

                  </strong>

                </div>

              </div>


              {/* APPLY INFORMATION */}

              {selectedProject.status === "OPEN" && (

                <div className="project-view-hint">

                  <div className="project-view-hint-icon">
                    ✓
                  </div>

                  <div>

                    <strong>

                      Interested in this project?

                    </strong>

                    <p>

                      Submit your proposal with your bid amount and explain why you are the right freelancer for this project.

                    </p>

                  </div>

                </div>

              )}


              {/* FOOTER */}

              <div className="project-view-footer">

                <button
                  className="project-view-close"
                  onClick={() =>
                    setSelectedProject(null)
                  }
                >
                  Close
                </button>


                {selectedProject.status === "OPEN" && (

                  <button
                    className="project-view-apply"
                    onClick={() => {

                      setPage(
                        "submitProposal"
                      );

                    }}
                  >

                    Apply Now

                    <span>
                      →
                    </span>

                  </button>

                )}

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default BrowseProjects;