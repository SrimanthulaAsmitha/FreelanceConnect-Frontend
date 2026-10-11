import { useState } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";

const API_URL = import.meta.env.VITE_API_URL;

function Applicants({
  darkMode,
  setDarkMode,
  handleLogout,
  selectedMyProject,
  applicants,
  handleAcceptProposal,
  setPage
}) {

  const [selectedFreelancer, setSelectedFreelancer] =
    useState(null);

  const [loadingProfile, setLoadingProfile] =
    useState(false);


  /* ================= VIEW FREELANCER PROFILE ================= */

  const handleViewProfile = async (proposal) => {

    try {

      setLoadingProfile(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        alert("Please login again");
        return;
      }

const response = await axios.get(
  `${API_URL}/api/profile/freelancer/${encodeURIComponent(
    proposal.freelancerEmail
  )}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setSelectedFreelancer(
        response.data
      );

    } catch (error) {

      console.log(
        "FREELANCER PROFILE ERROR:",
        error
      );

      if (
        error.response?.status === 404
      ) {

        alert(
          "This freelancer has not created a profile yet."
        );

      } else if (
        error.response?.status === 401 ||
        error.response?.status === 403
      ) {

        alert(
          "Session expired. Please login again."
        );

      } else {

        alert(
          "Could not load freelancer profile."
        );

      }

    } finally {

      setLoadingProfile(false);

    }
  };


  return (
    <div className="dashboard-page">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="nav-brand">
          FreelanceConnect
        </div>

        <div className="nav-user">

          <span>
            Applicants
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

        <button
          className="back-button"
          onClick={() =>
            setPage("myProjects")
          }
        >
          ← Back to My Projects
        </button>


        {/* ================= PAGE HEADER ================= */}

        <section className="welcome-section">

          <span className="applicants-label">
            PROJECT MANAGEMENT
          </span>

          <h1>
            Project Applicants
          </h1>

          <p>
            Review freelancers who applied for your project
            and choose the right person for the job.
          </p>

        </section>


        {/* ================= PROJECT SUMMARY ================= */}

        {selectedMyProject && (

          <div className="professional-project-summary">

            <div className="summary-header">

              <div>

                <span className="summary-label">
                  YOUR PROJECT
                </span>

                <h2>
                  {selectedMyProject.title}
                </h2>

              </div>

              <span
                className={`status ${selectedMyProject.status?.toLowerCase()}`}
              >
                {selectedMyProject.status}
              </span>

            </div>


            <div className="summary-description">

              <span>
                PROJECT DESCRIPTION
              </span>

              <p>
                {selectedMyProject.description}
              </p>

            </div>


            <div className="summary-info-grid">

              <div className="summary-info-card">

                <span>
                  Budget
                </span>

                <strong>
                  ₹{selectedMyProject.budget}
                </strong>

              </div>


              <div className="summary-info-card">

                <span>
                  Category
                </span>

                <strong>
                  {selectedMyProject.category}
                </strong>

              </div>


              <div className="summary-info-card">

                <span>
                  Location
                </span>

                <strong>
                  {selectedMyProject.location}
                </strong>

              </div>


              <div className="summary-info-card">

                <span>
                  Applicants
                </span>

                <strong>
                  {applicants.length}
                </strong>

              </div>

            </div>

          </div>

        )}


        {/* ================= APPLICANTS ================= */}

        <div className="applicants-section-header">

          <div>

            <h2>
              Applications
            </h2>

            <p>
              {applicants.length} freelancer
              {applicants.length !== 1 ? "s" : ""} applied
            </p>

          </div>

        </div>


        {applicants.length === 0 ? (

          /* ================= EMPTY STATE ================= */

          <div className="professional-empty-applicants">

            <div className="empty-applicant-icon">
              👤
            </div>

            <h2>
              No Applicants Yet
            </h2>

            <p>
              No freelancers have applied to this
              project yet. Applications will appear
              here when freelancers submit proposals.
            </p>

          </div>

        ) : (

          /* ================= APPLICANT LIST ================= */

          <div className="professional-applicant-list">

            {applicants.map(
              (proposal) => (

                <div
                  className="professional-applicant-card"
                  key={proposal.id}
                >

                  {/* ================= APPLICANT HEADER ================= */}

                  <div className="applicant-card-header">

                    <div className="freelancer-profile">

                      <div className="freelancer-avatar">

                        {proposal.freelancerEmail
                          ?.charAt(0)
                          ?.toUpperCase()}

                      </div>

                      <div>

                        <span className="freelancer-label">
                          FREELANCER
                        </span>

                        <h3>
                          {proposal.freelancerEmail}
                        </h3>

                      </div>

                    </div>


                    <span
                      className={`status ${proposal.status?.toLowerCase()}`}
                    >
                      {proposal.status}
                    </span>

                  </div>


                  {/* ================= PROPOSAL DETAILS ================= */}

                  <div className="applicant-details">

                    <div className="applicant-detail">

                      <span>
                        PROPOSED BUDGET
                      </span>

                      <strong>
                        ₹{proposal.bidAmount}
                      </strong>

                    </div>


                    <div className="applicant-detail">

                      <span>
                        PROJECT BUDGET
                      </span>

                      <strong>
                        ₹{selectedMyProject?.budget}
                      </strong>

                    </div>


                    <div className="applicant-detail">

                      <span>
                        APPLICATION STATUS
                      </span>

                      <strong>
                        {proposal.status}
                      </strong>

                    </div>

                  </div>


                  {/* ================= MESSAGE ================= */}

                  <div className="applicant-message">

                    <span>
                      PROPOSAL MESSAGE
                    </span>

                    <p>
                      {proposal.message}
                    </p>

                  </div>


                  {/* ================= ACTION ================= */}

                  <div className="applicant-action">

                    <button
                      className="profile-view-button"
                      onClick={() =>
                        handleViewProfile(
                          proposal
                        )
                      }
                      disabled={loadingProfile}
                    >

                      {loadingProfile
                        ? "Loading..."
                        : "View Profile"}

                    </button>


                    {proposal.status ===
                      "PENDING" &&
                      selectedMyProject?.status ===
                      "OPEN" && (

                      <button
                        className="blue-button"
                        onClick={() =>
                          handleAcceptProposal(
                            proposal
                          )
                        }
                      >
                        Accept Freelancer
                      </button>

                    )}

                  </div>


                  {/* ================= ACCEPTED ================= */}

                  {proposal.status ===
                    "ACCEPTED" && (

                    <div className="professional-accepted-message">

                      <span>
                        ✓
                      </span>

                      <div>

                        <strong>
                          Freelancer Accepted
                        </strong>

                        <p>
                          This freelancer has been
                          selected for the project.
                        </p>

                      </div>

                    </div>

                  )}

                </div>
              )
            )}

          </div>

        )}


        {/* =====================================================
            FREELANCER PROFILE MODAL
        ===================================================== */}

        {selectedFreelancer && (

          <div
            className="freelancer-profile-overlay"
            onClick={() =>
              setSelectedFreelancer(null)
            }
          >

            <div
              className="freelancer-profile-modal"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {/* ================= PROFILE HEADER ================= */}

              <div className="professional-profile-header">

                <div className="professional-profile-avatar">

                  {selectedFreelancer.name
                    ? selectedFreelancer.name
                        .charAt(0)
                        .toUpperCase()
                    : "F"}

                </div>


                <div className="professional-profile-heading">

                  <span>
                    FREELANCER PROFILE
                  </span>

                  <h2>
                    {selectedFreelancer.name ||
                      "Freelancer"}
                  </h2>

                  <p>
                    📍{" "}
                    {selectedFreelancer.location ||
                      "Location not provided"}
                  </p>

                </div>


                <button
                  className="professional-profile-close"
                  onClick={() =>
                    setSelectedFreelancer(null)
                  }
                >
                  ×
                </button>

              </div>


              {/* ================= PROFILE CONTENT ================= */}

              <div className="professional-profile-content">


                {/* ================= ABOUT ================= */}

                <div className="professional-profile-section">

                  <div className="professional-section-title">
                    ABOUT
                  </div>

                  <p className="professional-profile-bio">

                    {selectedFreelancer.bio ||
                      "This freelancer has not added a bio yet."}

                  </p>

                </div>


                {/* ================= SKILLS ================= */}

                <div className="professional-profile-section">

                  <div className="professional-section-title">
                    SKILLS
                  </div>

                  {selectedFreelancer.skills ? (

                    <div className="professional-profile-skills">

                      {selectedFreelancer.skills
                        .split(",")
                        .map(
                          (skill, index) => (

                            <span key={index}>
                              {skill.trim()}
                            </span>

                          )
                        )}

                    </div>

                  ) : (

                    <p className="professional-no-data">
                      No skills added yet.
                    </p>

                  )}

                </div>


                {/* ================= DETAILS ================= */}

                <div className="professional-profile-section">

                  <div className="professional-section-title">
                    PROFESSIONAL DETAILS
                  </div>


                  <div className="professional-profile-grid">


                    <div className="professional-profile-detail">

                      <span>
                        EXPERIENCE
                      </span>

                      <strong>
                        {selectedFreelancer.experience ||
                          "Not provided"}
                      </strong>

                    </div>


                    <div className="professional-profile-detail">

                      <span>
                        EDUCATION
                      </span>

                      <strong>
                        {selectedFreelancer.education ||
                          "Not provided"}
                      </strong>

                    </div>


                    <div className="professional-profile-detail">

                      <span>
                        WORK HOURS
                      </span>

                      <strong>
                        {selectedFreelancer.hoursToWork ||
                          "Not provided"}
                      </strong>

                    </div>


                    <div className="professional-profile-detail">

                      <span>
                        LOCATION
                      </span>

                      <strong>
                        {selectedFreelancer.location ||
                          "Not provided"}
                      </strong>

                    </div>

                  </div>

                </div>


                {/* ================= CONTACT ================= */}

                <div className="professional-profile-contact">

                  <div>

                    <span>
                      CONTACT
                    </span>

                    <strong>
                      {selectedFreelancer.email}
                    </strong>

                  </div>

                </div>

              </div>


              {/* ================= FOOTER ================= */}

              <div className="professional-profile-footer">

                <button
                  className="profile-close-button"
                  onClick={() =>
                    setSelectedFreelancer(null)
                  }
                >
                  Close Profile
                </button>

              </div>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Applicants;