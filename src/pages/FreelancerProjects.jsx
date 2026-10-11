import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";
import "./FreelancerProjects.css";
function FreelancerProjects({
  darkMode,
  setDarkMode,
  handleLogout,
  freelancerProjects,
  loading,
  handleMarkWorkCompleted,
  setPage,
  setSelectedChatProject
}) {
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);

  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Payment details
  const [paymentsByProject, setPaymentsByProject] = useState({});
  const [paymentLoading, setPaymentLoading] = useState(true);

  // Project list controls
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // Submitted work viewer
  const [submittedWork, setSubmittedWork] = useState([]);
  const [showSubmittedWork, setShowSubmittedWork] = useState(false);
  const [submittedWorkLoading, setSubmittedWorkLoading] = useState(false);
  const [submittedWorkError, setSubmittedWorkError] = useState("");

  // Load freelancer payments
  useEffect(() => {
    const loadFreelancerPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          return;
        }

        const response = await axios.get(
          "http://localhost:8080/api/payments/my-freelancer-payments",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        const paymentMap = {};

        (response.data || []).forEach((payment) => {
          paymentMap[payment.projectId] = payment;
        });

        setPaymentsByProject(paymentMap);

        console.log("FREELANCER PAYMENTS:", response.data);
      } catch (error) {
        console.error("LOAD FREELANCER PAYMENTS ERROR:", error);
      } finally {
        setPaymentLoading(false);
      }
    };

    loadFreelancerPayments();
  }, []);

  // Submit completed work
  const handleSubmitWork = async (event) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file.");
      return;
    }

    if (!description.trim()) {
      alert("Please enter a description.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Please login again.");
      return;
    }

    const formData = new FormData();

    formData.append("projectId", selectedProject.id);
    formData.append("description", description);
    formData.append("file", file);

    try {
      setSubmitting(true);

      await axios.post(
        "http://localhost:8080/api/work-submissions/upload",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Work submitted successfully! 🎉");

      // Close the modal and clear the form
      setShowSubmitForm(false);
      setSelectedProject(null);
      setDescription("");
      setFile(null);

      // Do not reload the entire application.
      // Keep the user on the current projects page.
      setPage("freelancerProjects");
    } catch (error) {
      console.log("SUBMIT WORK ERROR:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
          "Failed to submit work."
        );
      } else {
        alert("Unable to connect to the backend.");
      }
    } finally {
      setSubmitting(false);
    }
  };


  // Load submitted work for a project
  const handleViewSubmittedWork = async (projectId) => {
    if (!projectId) {
      setSubmittedWorkError("Project ID is missing.");
      setSubmittedWork([]);
      setShowSubmittedWork(true);
      return;
    }

    try {
      setSubmittedWorkLoading(true);
      setSubmittedWorkError("");
      setSubmittedWork([]);
      setShowSubmittedWork(true);

      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/work-submissions/project/${projectId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setSubmittedWork(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("LOAD SUBMITTED WORK ERROR:", error);
      setSubmittedWorkError(
        error.response?.data?.message ||
        "Could not load submitted work. Please check the backend and try again."
      );
    } finally {
      setSubmittedWorkLoading(false);
    }
  };

  const handleDownloadSubmittedWork = async (work) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `http://localhost:8080/api/work-submissions/download/${work.id}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = url;
      link.download = work.fileName || "submitted-work";
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("DOWNLOAD SUBMITTED WORK ERROR:", error);
      setSubmittedWorkError("Could not download this file. Please try again.");
    }
  };

  const projects = Array.isArray(freelancerProjects)
    ? freelancerProjects
    : [];

  const filteredProjects = useMemo(() => {
    const search = searchText.trim().toLowerCase();

    return projects.filter((project) => {
      const matchesSearch =
        !search ||
        String(project.title || "").toLowerCase().includes(search) ||
        String(project.description || "").toLowerCase().includes(search) ||
        String(project.category || "").toLowerCase().includes(search) ||
        String(project.location || "").toLowerCase().includes(search) ||
        String(project.clientEmail || "").toLowerCase().includes(search);

      const status = String(project.status || "").toUpperCase();
      const matchesStatus =
        statusFilter === "ALL" ||
        (statusFilter === "IN_PROGRESS" && status === "IN_PROGRESS") ||
        (statusFilter === "COMPLETED" && status === "COMPLETED") ||
        (statusFilter === "PENDING" &&
          ["OPEN", "PENDING", "WORK_COMPLETED"].includes(status));

      return matchesSearch && matchesStatus;
    });
  }, [projects, searchText, statusFilter]);

  const completedCount = projects.filter(
    (project) => String(project.status || "").toUpperCase() === "COMPLETED"
  ).length;

  const inProgressCount = projects.filter(
    (project) => String(project.status || "").toUpperCase() === "IN_PROGRESS"
  ).length;

  const getStatusLabel = (status) => {
    const normalized = String(status || "NOT_STARTED").toUpperCase();

    if (normalized === "IN_PROGRESS") return "In Progress";
    if (normalized === "COMPLETED") return "Completed";
    if (normalized === "WORK_COMPLETED") return "Awaiting Approval";
    if (normalized === "ON_HOLD") return "On Hold";
    if (normalized === "OPEN") return "Open";
    if (normalized === "PENDING") return "Pending";

    return normalized.replaceAll("_", " ");
  };

  const getStatusClass = (status) => {
    const normalized = String(status || "NOT_STARTED").toLowerCase();

    if (normalized === "in_progress") return "fc-status-progress";
    if (normalized === "completed") return "fc-status-completed";
    if (normalized === "work_completed") return "fc-status-review";
    if (normalized === "on_hold") return "fc-status-hold";
    if (normalized === "open" || normalized === "pending") {
      return "fc-status-pending";
    }

    return "fc-status-not-started";
  };

  const getProgress = (project) => {
    const status = String(project.status || "").toUpperCase();

    if (status === "COMPLETED") return 100;
    if (status === "WORK_COMPLETED") return 90;
    if (status === "IN_PROGRESS") return 60;
    if (status === "ON_HOLD") return 30;

    const value = Number(project.progress);
    if (Number.isFinite(value)) {
      return Math.max(0, Math.min(100, value));
    }

    return 0;
  };

  const formatDate = (value) => {
    if (!value) return "Not set";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  };

  const formatPaymentDate = (value) => {
    if (!value) return "Not available";

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);

    return date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit"
    });
  };

  const openProjectDetails = (project) => {
    setSelectedProject(project);
    setShowProjectDetails(true);
  };

  const closeProjectDetails = () => {
    setShowProjectDetails(false);
    setSelectedProject(null);
  };

  const openSubmitForm = (project) => {
    setSelectedProject(project);
    setShowSubmitForm(true);
    setShowProjectDetails(false);
  };

  const closeSubmitForm = () => {
    setShowSubmitForm(false);
    setSelectedProject(null);
    setDescription("");
    setFile(null);
  };

  const selectedPayment = selectedProject
    ? paymentsByProject[selectedProject.id]
    : null;

  const selectedProgress = selectedProject
    ? getProgress(selectedProject)
    : 0;

  const selectedStatus = selectedProject
    ? String(selectedProject.status || "").toUpperCase()
    : "";

  const currentName =
    localStorage.getItem("name") || "You";

  return (
    <div className={`dashboard-page freelancer-projects-page ${darkMode ? "fc-projects-dark" : ""}`}>
      {/* NAVBAR */}
      <header className="navbar">
        <div className="nav-brand">
          FreelanceConnect
        </div>

        <div className="nav-user">
          <span>
            My Projects
          </span>

          <NotificationBell />

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
            type="button"
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <button
            className="logout-button"
            onClick={handleLogout}
            type="button"
          >
            Logout
          </button>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="dashboard-container fc-projects-container">
        {/* BACK BUTTON */}
        <button
          className="my-projects-back-button fc-back-link"
          onClick={() => setPage("freelancerDashboard")}
          type="button"
        >
          <span>←</span>
          Back to Dashboard
        </button>

        {/* PAGE HEADER */}
        <section className="fc-projects-page-heading">
          <div className="fc-projects-title-group">
            <div className="fc-projects-heading-icon" aria-hidden="true">
              <span>▱</span>
            </div>

            <div>
              <span className="fc-projects-eyebrow">
                PROJECT MANAGEMENT
              </span>

              <h1>
                My Projects
              </h1>

              <p>
                Track your assigned projects, manage your work, and
                monitor project progress.
              </p>
            </div>
          </div>

          <div className="fc-total-projects-card">
            <div className="fc-total-projects-icon" aria-hidden="true">
              ◈
            </div>

            <div className="fc-total-projects-copy">
              <span>Total Projects</span>
              <strong>{projects.length}</strong>
              <small>
                {inProgressCount} in progress · {completedCount} completed
              </small>
            </div>
          </div>
        </section>

        {/* PROJECT TABLE PANEL */}
        <section className="fc-projects-panel">
          <div className="fc-projects-toolbar">
            <label className="fc-project-search">
              <span aria-hidden="true">⌕</span>
              <input
                type="search"
                placeholder="Search projects..."
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                aria-label="Search projects"
              />
            </label>

            <div className="fc-projects-toolbar-actions">
              <label className="fc-project-filter">
                <span aria-hidden="true">▽</span>
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  aria-label="Filter projects by status"
                >
                  <option value="ALL">All Projects</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">Pending / Awaiting Approval</option>
                </select>
              </label>
            </div>
          </div>

          {loading ? (
            <div className="fc-projects-empty-state">
              <div className="fc-empty-icon">◌</div>
              <h3>Loading Projects...</h3>
              <p>Your assigned projects will appear here.</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="fc-projects-empty-state">
              <div className="fc-empty-icon">▱</div>
              <h3>No Projects Yet</h3>
              <p>
                Projects assigned to you will appear here once a client
                selects your proposal.
              </p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="fc-projects-empty-state">
              <div className="fc-empty-icon">⌕</div>
              <h3>No Matching Projects</h3>
              <p>Try a different search term or status filter.</p>
              <button
                type="button"
                className="fc-outline-button"
                onClick={() => {
                  setSearchText("");
                  setStatusFilter("ALL");
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="fc-projects-table-scroll">
              <table className="fc-projects-table">
                <thead>
                  <tr>
                    <th>Project</th>
                    <th>Client</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredProjects.map((project) => {
                    const progress = getProgress(project);
                    const status = String(project.status || "").toUpperCase();

                    return (
                      <tr key={project.id}>
                        <td>
                          <div className="fc-project-cell">
                            <div className={`fc-project-type-icon fc-project-icon-${String(project.category || "").toLowerCase().includes("design") ? "design" : String(project.category || "").toLowerCase().includes("mobile") ? "mobile" : String(project.category || "").toLowerCase().includes("writing") ? "writing" : "web"}`}>
                              {String(project.category || "").toLowerCase().includes("design")
                                ? "✎"
                                : String(project.category || "").toLowerCase().includes("mobile")
                                  ? "▯"
                                  : String(project.category || "").toLowerCase().includes("writing")
                                    ? "▤"
                                    : "⌘"}
                            </div>

                            <div className="fc-project-cell-copy">
                              <strong>{project.title || `Project #${project.id}`}</strong>
                              <span>
                                {project.description || "No project description provided."}
                              </span>
                              <small>
                                Project #{project.id}
                              </small>
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="fc-client-cell">
                            <div className="fc-client-avatar">
                              {String(project.clientEmail || "C").charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <strong>
                                {project.clientName || project.clientEmail || "Client"}
                              </strong>
                              <span>{project.category || "Project"}</span>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className={`fc-project-status ${getStatusClass(project.status)}`}>
                            <i />
                            {getStatusLabel(project.status)}
                          </span>
                        </td>

                        <td>
                          <div className="fc-progress-cell">
                            <strong>{progress}%</strong>
                            <div className="fc-progress-track">
                              <span
                                style={{ width: `${progress}%` }}
                                className={progress === 100 ? "fc-progress-complete" : ""}
                              />
                            </div>
                          </div>
                        </td>

                        <td>
                          <div className="fc-deadline-cell">
                            <span aria-hidden="true">▦</span>
                            {formatDate(project.deadline || project.dueDate)}
                          </div>
                        </td>

                        <td>
                          <div className="fc-project-actions">
                            <button
                              type="button"
                              className="fc-view-button"
                              onClick={() => openProjectDetails(project)}
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="fc-more-button"
                              aria-label={`More actions for ${project.title || "project"}`}
                              onClick={() => openProjectDetails(project)}
                            >
                              •••
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {!loading && filteredProjects.length > 0 && (
            <div className="fc-projects-table-footer">
              Showing <strong>{filteredProjects.length}</strong> of{" "}
              <strong>{projects.length}</strong> projects
            </div>
          )}
        </section>
      </main>

      {/* PROJECT DETAILS MODAL — opens when View is clicked */}
      {showProjectDetails && selectedProject && (
        <div
          className="fc-project-details-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeProjectDetails();
            }
          }}
        >
          <section
            className="fc-project-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fc-project-details-title"
          >
            <button
              type="button"
              className="fc-project-details-close"
              onClick={closeProjectDetails}
              aria-label="Close project details"
            >
              ×
            </button>

            <div className="fc-details-eyebrow">
              PROJECT DETAILS
            </div>

            <div className="fc-details-top">
              <div className="fc-details-main">
                <div className="fc-details-project-icon">⌘</div>

                <div className="fc-details-project-copy">
                  <span className="fc-details-project-number">
                    PROJECT #{selectedProject.id}
                  </span>

                  <h2 id="fc-project-details-title">
                    {selectedProject.title || `Project #${selectedProject.id}`}
                  </h2>

                  <span className={`fc-project-status fc-details-status ${getStatusClass(selectedProject.status)}`}>
                    <i />
                    {getStatusLabel(selectedProject.status)}
                  </span>

                  <p>
                    {selectedProject.description || "No project description provided."}
                  </p>
                </div>
              </div>

              <div className="fc-details-summary">
                <div className="fc-details-summary-row">
                  <div className="fc-summary-icon">₹</div>
                  <div>
                    <span>BUDGET</span>
                    <strong>₹{Number(selectedProject.budget || 0).toLocaleString("en-IN")}</strong>
                  </div>
                </div>

                <div className="fc-details-summary-row">
                  <div className="fc-summary-icon">▦</div>
                  <div>
                    <span>CATEGORY</span>
                    <strong>{selectedProject.category || "Not specified"}</strong>
                  </div>
                </div>

                <div className="fc-details-summary-row">
                  <div className="fc-summary-icon">●</div>
                  <div>
                    <span>LOCATION</span>
                    <strong>📍 {selectedProject.location || "Remote"}</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* PAYMENT DETAILS */}
            <section className="fc-details-section fc-payment-section">
              <div className="fc-details-section-heading">
                <div className="fc-section-heading-icon">▣</div>
                <h3>Payment Details</h3>
              </div>

              {paymentLoading ? (
                <div className="fc-payment-loading">
                  Loading payment details...
                </div>
              ) : selectedPayment ? (
                <div className="fc-payment-details-grid">
                  <div className="fc-payment-detail-item">
                    <span className={`fc-payment-pill ${selectedPayment.status === "PAID" ? "fc-payment-pill-paid" : "fc-payment-pill-pending"}`}>
                      {selectedPayment.status === "PAID" ? "✓ PAID" : "◷ PENDING"}
                    </span>
                    <span className="fc-payment-label">Payment Amount</span>
                    <strong className="fc-payment-amount">
                      ₹{Number(selectedPayment.amount || 0).toLocaleString("en-IN")}
                    </strong>
                  </div>

                  <div className="fc-payment-detail-item">
                    <span className={`fc-payment-round-icon ${selectedPayment.status === "PAID" ? "is-paid" : ""}`}>
                      {selectedPayment.status === "PAID" ? "✓" : "◷"}
                    </span>
                    <span className="fc-payment-label">Payment Status</span>
                    <strong className={selectedPayment.status === "PAID" ? "fc-payment-text-paid" : "fc-payment-text-pending"}>
                      {selectedPayment.status === "PAID"
                        ? "✓ Payment Received"
                        : "⏳ Payment Pending"}
                    </strong>
                  </div>

                  <div className="fc-payment-detail-item">
                    <span className="fc-payment-round-icon fc-payment-date-icon">▦</span>
                    <span className="fc-payment-label">Payment Date</span>
                    <strong>
                      {formatPaymentDate(selectedPayment.paymentDate)}
                    </strong>
                  </div>

                  <div className="fc-payment-demo-note">
                    <span className="fc-payment-info-icon">i</span>
                    <div>
                      <strong>DEMO SIMULATION ONLY —</strong>
                      <p>No real money will be charged or transferred.</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="fc-payment-not-found">
                  <span>ⓘ</span>
                  <div>
                    <strong>Payment information is not available yet.</strong>
                    <p>Payment details will appear here when a payment record is created.</p>
                  </div>
                </div>
              )}
            </section>

            {/* PROJECT PROGRESS */}
            <section className="fc-details-section fc-project-progress-section">
              <div className="fc-details-section-heading">
                <div className="fc-section-heading-icon">♧</div>
                <div className="fc-progress-heading-copy">
                  <h3>Project Progress</h3>
                  <span>{getStatusLabel(selectedProject.status)}</span>
                </div>
                {selectedProgress === 100 && (
                  <div className="fc-progress-complete-mark">✓</div>
                )}
              </div>

              <div className="fc-details-progress-track">
                <span
                  style={{ width: `${selectedProgress}%` }}
                  className={selectedProgress === 100 ? "is-complete" : ""}
                />
              </div>
              <div className="fc-details-progress-caption">
                <span>{selectedProgress}% completed</span>
                <span>{selectedProgress === 100 ? "All work completed" : "Keep up the progress"}</span>
              </div>
            </section>

            {/* COMPLETION MESSAGE */}
            {selectedStatus === "COMPLETED" ? (
              <section className="fc-project-completed-banner">
                <div className="fc-completed-trophy">♜</div>
                <div>
                  <h3>Project Completed</h3>
                  <p>This project has been successfully completed.</p>
                </div>
              </section>
            ) : selectedStatus === "WORK_COMPLETED" ? (
              <section className="fc-project-review-banner">
                <div className="fc-completed-trophy">✓</div>
                <div>
                  <h3>Work Submitted</h3>
                  <p>Your submitted work is waiting for client approval.</p>
                </div>
              </section>
            ) : (
              <section className="fc-project-active-banner">
                <div className="fc-completed-trophy">↗</div>
                <div>
                  <h3>Project In Progress</h3>
                  <p>Continue working and submit your completed work when ready.</p>
                </div>
              </section>
            )}

            {/* DETAILS FOOTER ACTIONS */}
            <div className="fc-project-details-footer">
              <div>
                {selectedStatus === "IN_PROGRESS" && (
                  <button
                    type="button"
                    className="fc-view-submitted-work-button"
                    onClick={() => {
                      setSelectedChatProject(selectedProject);
                      setShowProjectDetails(false);
                      setPage("chat");
                    }}
                  >
                    <span>⌁</span>
                    Open Project Chat
                  </button>
                )}

                {selectedStatus === "COMPLETED" && (
                  <button
                    type="button"
                    className="fc-view-submitted-work-button"
                    onClick={() => handleViewSubmittedWork(selectedProject.id)}
                  >
                    <span>↗</span>
                    View Submitted Work
                  </button>
                )}
              </div>

              <div className="fc-details-footer-right">
                {selectedStatus === "IN_PROGRESS" && (
                  <button
                    type="button"
                    className="fc-details-submit-work-button"
                    onClick={() => openSubmitForm(selectedProject)}
                  >
                    📤 Submit Work
                  </button>
                )}

                <span className="fc-demo-payment-complete">
                  <span>✓</span>
                  {selectedPayment?.status === "PAID"
                    ? "Demo payment completed"
                    : "FreelanceConnect project"}
                </span>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* SUBMITTED WORK MODAL */}
      {showSubmittedWork && (
        <div
          className="fc-submitted-work-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowSubmittedWork(false);
              setSubmittedWorkError("");
            }
          }}
        >
          <section
            className="fc-submitted-work-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="fc-submitted-work-title"
          >
            <button
              type="button"
              className="fc-submitted-work-close"
              onClick={() => {
                setShowSubmittedWork(false);
                setSubmittedWorkError("");
              }}
              aria-label="Close submitted work"
            >
              ×
            </button>

            <div className="fc-details-eyebrow">WORK SUBMISSION</div>
            <h2 id="fc-submitted-work-title">Submitted Work</h2>
            <p className="fc-submitted-work-intro">
              Files and descriptions submitted for this project.
            </p>

            {submittedWorkLoading ? (
              <div className="fc-submitted-work-message">
                Loading submitted work...
              </div>
            ) : submittedWorkError ? (
              <div className="fc-submitted-work-message fc-submitted-work-error">
                {submittedWorkError}
              </div>
            ) : submittedWork.length === 0 ? (
              <div className="fc-submitted-work-message">
                No submitted work was found for this project.
              </div>
            ) : (
              <div className="fc-submitted-work-list">
                {submittedWork.map((work) => (
                  <article className="fc-submitted-work-item" key={work.id}>
                    <div className="fc-submitted-work-file-icon">↗</div>
                    <div className="fc-submitted-work-copy">
                      <h3>{work.fileName || "Submitted file"}</h3>
                      <p>{work.description || "No description provided."}</p>
                      <span className="fc-submitted-work-status">
                        {String(work.status || "SUBMITTED").replaceAll("_", " ")}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="fc-submitted-work-download"
                      onClick={() => handleDownloadSubmittedWork(work)}
                    >
                      Download file
                    </button>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      {/* SUBMIT WORK MODAL — existing functionality preserved */}
      {showSubmitForm && selectedProject && (
        <div className="submit-work-overlay">
          <div className="submit-work-modal">
            <button
              className="submit-work-close"
              type="button"
              onClick={closeSubmitForm}
            >
              ✕
            </button>

            <h2>
              Submit Your Work
            </h2>

            <p>
              Submit the completed work for:
            </p>

            <strong>
              {selectedProject.title}
            </strong>

            <form
              onSubmit={handleSubmitWork}
              className="submit-work-form"
            >
              <label>
                Work Description
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe the work you completed..."
                rows="5"
              />

              <label>
                Upload Completed Work
              </label>

              <input
                type="file"
                onChange={(event) =>
                  setFile(event.target.files[0])
                }
              />

              {file && (
                <div className="selected-file">
                  📎 {file.name}
                </div>
              )}

              <button
                type="submit"
                className="apply-button"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : "Submit Work"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default FreelancerProjects;