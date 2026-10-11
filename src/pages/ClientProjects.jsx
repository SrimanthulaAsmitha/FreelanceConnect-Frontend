
import { useEffect, useState } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";

const API_URL = import.meta.env.VITE_API_URL;

function ClientProjects({
  darkMode,
  setDarkMode,
  handleLogout,
  myProjects,
  loading,
  loadApplicants,
  handleApproveComplete,
  setPage
}) {
  const [selectedProject, setSelectedProject] = useState(null);

  // ================= SUBMITTED WORK =================

  const [submittedWork, setSubmittedWork] = useState(null);
  const [showSubmittedWork, setShowSubmittedWork] = useState(false);
  const [loadingWork, setLoadingWork] = useState(false);

  // ================= DEMO PAYMENTS =================

  const [paymentsByProject, setPaymentsByProject] = useState({});
  const [processingPayment, setProcessingPayment] = useState(null);

  // Inline messages instead of browser popups
  const [paymentMessage, setPaymentMessage] = useState("");
  const [paymentMessageType, setPaymentMessageType] = useState("success");

  // Inline demo-payment confirmation
  const [confirmingProject, setConfirmingProject] = useState(null);

  // ================= MESSAGE HELPERS =================

  const showPageMessage = (message, type = "error") => {
    setPaymentMessage(message);
    setPaymentMessageType(type);
  };

  const clearPageMessage = () => {
    setPaymentMessage("");
  };

  // ================= PAYMENT DATE FORMAT =================

  const formatPaymentDate = (date) => {
    if (!date) return "Not available";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not available";
    }

    return parsedDate.toLocaleString();
  };

  // ================= LOAD CLIENT PAYMENTS =================

  useEffect(() => {
    const loadClientPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) return;

        const response = await axios.get(
          `${API_URL}/api/payments/my-client-payments`,
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
      } catch (error) {
        console.log("LOAD CLIENT PAYMENTS ERROR:", error);
      }
    };

    loadClientPayments();
  }, []);

  // ================= DEMO PAYMENT =================

  const handleDemoPayment = async (project) => {
    try {
      clearPageMessage();
      setConfirmingProject(null);

      const token = localStorage.getItem("token");

      if (!token) {
        showPageMessage("Please login again.", "error");
        setPage("login");
        return;
      }

      setProcessingPayment(project.id);

      let payment = paymentsByProject[project.id];

      // Create a payment if one does not exist

if (!payment) {
  const createResponse = await axios.post(
    `${API_URL}/api/payments/project/${project.id}`,
    {},


          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        payment = createResponse.data;

        setPaymentsByProject((previous) => ({
          ...previous,
          [project.id]: payment
        }));
      }

      // Prevent duplicate demo payments
      if (
        payment.status === "PAID" ||
        payment.status === "SUCCESS" ||
        payment.status === "COMPLETED"
      ) {
        showPageMessage(
          "Demo payment is already completed. No real money was transferred.",
          "success"
        );
        return;
      }

      // Display confirmation inside the selected project card
      setConfirmingProject({
        projectId: project.id,
        projectTitle: project.title,
        paymentId: payment.id,
        amount: payment.amount
      });
    } catch (error) {
      console.log("DEMO PAYMENT ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Could not initiate the demo payment.";

      showPageMessage(message, "error");
    } finally {
      setProcessingPayment(null);
    }
  };

  // ================= CONFIRM DEMO PAYMENT =================

  const confirmDemoPayment = async () => {
    if (!confirmingProject) return;

    try {
      clearPageMessage();

      const token = localStorage.getItem("token");

      if (!token) {
        showPageMessage("Please login again.", "error");
        setPage("login");
        return;
      }

      const paymentId = confirmingProject.paymentId;
      const projectId = confirmingProject.projectId;

      setProcessingPayment(projectId);


const response = await axios.put(
  `${API_URL}/api/payments/${paymentId}/demo-confirm`,
  {},

        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPaymentsByProject((previous) => ({
        ...previous,
        [projectId]: response.data
      }));

      setConfirmingProject(null);

      showPageMessage(
        `Demo payment successful! Amount: ₹${response.data.amount}. Status: ${response.data.status}. No real money was transferred.`,
        "success"
      );
    } catch (error) {
      console.log("DEMO PAYMENT ERROR:", error);

      const message =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Could not process the demo payment.";

      showPageMessage(message, "error");
    } finally {
      setProcessingPayment(null);
    }
  };

  // ================= VIEW SUBMITTED WORK =================

  const handleViewSubmittedWork = async (project) => {
    try {
      clearPageMessage();
      setLoadingWork(true);

      const token = localStorage.getItem("token");

      if (!token) {
        showPageMessage("Please login again.", "error");
        setPage("login");
        return;
      }


const response = await axios.get(
  `${API_URL}/api/work-submissions/project/${project.id}`,
  {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (!response.data || response.data.length === 0) {
        showPageMessage("No submitted work found.", "error");
        return;
      }

      // Get the latest submission
      const latestSubmission =
        response.data[response.data.length - 1];

      setSubmittedWork(latestSubmission);
      setShowSubmittedWork(true);
    } catch (error) {
      console.log("VIEW SUBMITTED WORK ERROR:", error);
      showPageMessage("Could not load submitted work.", "error");
    } finally {
      setLoadingWork(false);
    }
  };

  // ================= DOWNLOAD WORK =================

  const handleDownloadWork = async () => {
    try {
      clearPageMessage();

      const token = localStorage.getItem("token");

      if (!token) {
        showPageMessage("Please login again.", "error");
        return;
      }

      if (!submittedWork) {
        showPageMessage("No submitted work selected.", "error");
        return;
      }

const response = await axios.get(
  `${API_URL}/api/work-submissions/download/${submittedWork.id}`,
  {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = document.createElement("a");

      link.href = url;

      link.setAttribute(
        "download",
        submittedWork.fileName
      );

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);

      showPageMessage(
        "Submitted work download started.",
        "success"
      );
    } catch (error) {
      console.log("DOWNLOAD WORK ERROR:", error);

      showPageMessage(
        "Could not download the submitted work.",
        "error"
      );
    }
  };

  // ================= PAYMENT CONFIRMATION CARD =================

  const renderPaymentConfirmation = (project) => {
    if (
      !confirmingProject ||
      confirmingProject.projectId !== project.id
    ) {
      return null;
    }

    return (
      <section
        aria-labelledby={`demo-payment-heading-${project.id}`}
        style={{
          width: "100%",
          boxSizing: "border-box",
          marginTop: "16px",
          padding: "18px",
          border: "1px solid var(--border-color, #bfdbfe)",
          borderRadius: "12px",
          background: "var(--card-secondary, rgba(59, 130, 246, 0.07))"
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
            marginBottom: "14px"
          }}
        >
          <div
            aria-hidden="true"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              width: "42px",
              height: "42px",
              borderRadius: "10px",
              background: "rgba(59, 130, 246, 0.12)",
              fontSize: "21px"
            }}
          >
            💳
          </div>

          <div style={{ minWidth: 0 }}>
            <h3
              id={`demo-payment-heading-${project.id}`}
              style={{
                margin: "0 0 5px",
                fontSize: "17px"
              }}
            >
              Confirm Demo Payment
            </h3>

            <p
              style={{
                margin: 0,
                fontSize: "13px",
                opacity: 0.75
              }}
            >
              Review the payment details before continuing.
            </p>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "12px",
            marginBottom: "14px"
          }}
        >
          <div
            style={{
              padding: "12px",
              borderRadius: "9px",
              border: "1px solid var(--border-color, #dbe3ef)"
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "12px",
                opacity: 0.7,
                marginBottom: "5px"
              }}
            >
              PROJECT
            </span>

            <strong
              style={{
                display: "block",
                overflowWrap: "anywhere",
                fontSize: "14px"
              }}
            >
              {confirmingProject.projectTitle}
            </strong>

            <span
              style={{
                display: "block",
                fontSize: "12px",
                opacity: 0.7,
                marginTop: "4px"
              }}
            >
              Project #{confirmingProject.projectId}
            </span>
          </div>

          <div
            style={{
              padding: "12px",
              borderRadius: "9px",
              border: "1px solid var(--border-color, #dbe3ef)"
            }}
          >
            <span
              style={{
                display: "block",
                fontSize: "12px",
                opacity: 0.7,
                marginBottom: "5px"
              }}
            >
              PAYMENT AMOUNT
            </span>

            <strong
              style={{
                display: "block",
                fontSize: "21px",
                color: "#2563eb"
              }}
            >
              ₹{confirmingProject.amount}
            </strong>
          </div>
        </div>

        <p
          style={{
            margin: "0 0 16px",
            padding: "10px 12px",
            borderRadius: "8px",
            background: "rgba(234, 179, 8, 0.10)",
            color: "var(--text-color, inherit)",
            fontSize: "12px",
            lineHeight: 1.6
          }}
        >
          <strong>Demo only:</strong> This simulates a payment.
          No real money will be charged or transferred.
        </p>

        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap"
          }}
        >
          <button
            type="button"
            className="blue-button"
            onClick={confirmDemoPayment}
            disabled={
              processingPayment === confirmingProject.projectId
            }
            style={{
              minHeight: "42px",
              padding: "10px 16px",
              borderRadius: "9px"
            }}
          >
            {processingPayment === confirmingProject.projectId
              ? "Processing..."
              : "✓ Confirm Demo Payment"}
          </button>

          <button
            type="button"
            className="secondary-modal-button"
            onClick={() => {
              setConfirmingProject(null);
              clearPageMessage();
            }}
            disabled={
              processingPayment === confirmingProject.projectId
            }
            style={{
              minHeight: "42px",
              padding: "10px 16px",
              borderRadius: "9px"
            }}
          >
            Cancel
          </button>
        </div>
      </section>
    );
  };

  // ================= PROJECT PAYMENT MESSAGE =================

  const renderProjectPaymentMessage = (project) => {
    if (!paymentMessage) return null;

    return (
      <div
        role="status"
        aria-live="polite"
        style={{
          marginTop: "14px",
          padding: "12px 14px",
          borderRadius: "9px",
          background:
            paymentMessageType === "error"
              ? "#fee2e2"
              : "#dcfce7",
          color:
            paymentMessageType === "error"
              ? "#991b1b"
              : "#166534",
          border:
            paymentMessageType === "error"
              ? "1px solid #fecaca"
              : "1px solid #bbf7d0",
          fontSize: "13px",
          lineHeight: 1.6,
          overflowWrap: "anywhere"
        }}
      >
        <span>{paymentMessage}</span>

        <button
          type="button"
          onClick={clearPageMessage}
          aria-label="Dismiss message"
          style={{
            float: "right",
            border: "none",
            background: "transparent",
            color: "inherit",
            cursor: "pointer",
            fontSize: "18px",
            marginLeft: "10px"
          }}
        >
          ×
        </button>
      </div>
    );
  };

  return (
    <div className="dashboard-page">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="nav-brand">
          FreelanceConnect
        </div>

        <div className="nav-user">

          <span className="nav-page-title">
            My Projects
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

      <main className="dashboard-container client-projects-page">

        {/* ================= TOP BAR ================= */}
        {/* ================= TOP BAR ================= */}

        <div className="projects-top-bar">
          <button
            className="back-button"
            onClick={() => setPage("clientDashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* ================= PAGE HEADER ================= */}
<section className="client-projects-header">
  <div className="client-projects-header-content">
    <div className="client-projects-header-text">
      <span className="section-eyebrow">
        PROJECT MANAGEMENT
      </span>

      <h1>My Projects</h1>

      <p>
        Track your posted projects, manage freelancers,
        and monitor project progress.
      </p>
    </div>

    <div className="project-count-box">
      <span>Total Projects</span>

      <strong>{myProjects?.length || 0}</strong>
    </div>
  </div>
</section>

        {/* ================= LOADING ================= */}

        {loading ? (

          <div className="professional-loading">

            <div className="loading-spinner"></div>

            <p>
              Loading your projects...
            </p>

          </div>

        ) : (myProjects || []).length === 0 ? (

          /* ================= EMPTY ================= */

          <div className="professional-empty-state">

            <div className="empty-icon">
              📁
            </div>

            <h2>
              No Projects Yet
            </h2>

            <p>
              You haven't posted any projects yet.
              Start by creating your first project.
            </p>

            <button
              className="blue-button"
              onClick={() => setPage("postProject")}
            >
              + Post a Project
            </button>

          </div>

        ) : (

          /* ================= PROJECT LIST ================= */

          <div className="professional-project-list">

            {myProjects.map((project) => (

              <div
                className="professional-project-card"
                key={project.id}
              >

                {/* ================= CARD TOP ================= */}

                <div className="professional-card-top">

                  <div className="project-title-area">

                    <span className="project-label">
                      PROJECT #{project.id}
                    </span>

                    <h2>
                      {project.title}
                    </h2>

                  </div>

                  <span
                    className={`status ${project.status?.toLowerCase()}`}
                  >
                    {project.status === "WORK_COMPLETED"
                      ? "WORK COMPLETED"
                      : project.status}
                  </span>

                </div>

                {/* ================= DESCRIPTION ================= */}

                <p className="professional-project-description">
                  {project.description}
                </p>

                {/* ================= INFO ROW ================= */}

                <div className="professional-project-info">

                  <div className="project-info-item">

                    <span>
                      BUDGET
                    </span>

                    <strong>
                      ₹{project.budget}
                    </strong>

                  </div>

                  <div className="project-info-item">

                    <span>
                      CATEGORY
                    </span>

                    <strong>
                      {project.category}
                    </strong>

                  </div>

                  <div className="project-info-item">

                    <span>
                      LOCATION
                    </span>

                    <strong>
                      📍 {project.location}
                    </strong>

                  </div>

                </div>

                {/* ================= PAYMENT DETAILS ================= */}

                {project.freelancerEmail &&
                  project.status !== "OPEN" &&
                  (() => {
                    const payment = paymentsByProject[project.id];

                    const isPaid =
                      payment?.status === "PAID" ||
                      payment?.status === "SUCCESS" ||
                      payment?.status === "COMPLETED";

                    return (

                      <div
                        style={{
                          marginTop: "16px",
                          padding: "18px",
                          borderRadius: "12px",
                          border: "1px solid var(--border-color, #dbe3ef)",
                          background:
                            "var(--card-secondary, rgba(100, 116, 139, 0.06))"
                        }}
                      >

                        {/* PAYMENT HEADER */}

                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            gap: "12px",
                            flexWrap: "wrap",
                            marginBottom: "18px"
                          }}
                        >

                          <h3
                            style={{
                              margin: 0,
                              fontSize: "17px"
                            }}
                          >
                            💳 Payment Details
                          </h3>

                          <span
                            style={{
                              padding: "5px 12px",
                              borderRadius: "20px",
                              background: isPaid
                                ? "#dcfce7"
                                : "#fef3c7",
                              color: isPaid
                                ? "#166534"
                                : "#92400e",
                              fontSize: "12px",
                              fontWeight: 700
                            }}
                          >
                            {payment?.status || "NOT INITIATED"}
                          </span>

                        </div>

                        {/* PAYMENT INFORMATION */}

                        {payment ? (

                          <div
                            style={{
                              display: "grid",
                              gridTemplateColumns:
                                "repeat(auto-fit, minmax(150px, 1fr))",
                              gap: "18px",
                              alignItems: "start",
                              width: "100%"
                            }}
                          >

                            <div>

                              <span
                                style={{
                                  display: "block",
                                  fontSize: "13px",
                                  opacity: 0.7
                                }}
                              >
                                Payment Amount
                              </span>

                              <strong
                                style={{
                                  display: "block",
                                  marginTop: "6px",
                                  fontSize: "19px"
                                }}
                              >
                                ₹{payment.amount}
                              </strong>

                            </div>

                            <div>

                              <span
                                style={{
                                  display: "block",
                                  fontSize: "13px",
                                  opacity: 0.7
                                }}
                              >
                                Payment Status
                              </span>

                              <strong
                                style={{
                                  display: "block",
                                  marginTop: "6px",
                                  color: isPaid
                                    ? "#15803d"
                                    : "#b45309"
                                }}
                              >
                                {isPaid
                                  ? "✓ Payment Received"
                                  : "Payment Pending"}
                              </strong>

                            </div>

                            <div>

                              <span
                                style={{
                                  display: "block",
                                  fontSize: "13px",
                                  opacity: 0.7
                                }}
                              >
                                Payment Date
                              </span>

                              <strong
                                style={{
                                  display: "block",
                                  marginTop: "6px",
                                  fontSize: "14px",
                                  overflowWrap: "anywhere"
                                }}
                              >
                                {formatPaymentDate(payment.paymentDate)}
                              </strong>

                            </div>

                          </div>

                        ) : (

                          <p
                            style={{
                              margin: 0,
                              fontSize: "14px",
                              opacity: 0.75
                            }}
                          >
                            Payment has not been initiated yet.
                          </p>

                        )}

                        {/* DEMO PAYMENT NOTICE */}

                        <p
                          style={{
                            margin: "18px 0 0",
                            paddingTop: "12px",
                            borderTop:
                              "1px solid var(--border-color, #dbe3ef)",
                            fontSize: "12px",
                            opacity: 0.75
                          }}
                        >
                          DEMO SIMULATION ONLY — No real money will be
                          charged or transferred.
                        </p>

                      </div>

                    );
                  })()}

                {/* ================= PROJECT PROGRESS ================= */}

                <div className="project-progress">

                  <div className="progress-header">

                    <span>
                      Project Progress
                    </span>

                    <span>
                      {project.status === "OPEN"
                        ? "Open"
                        : project.status === "IN_PROGRESS"
                          ? "In Progress"
                          : project.status === "WORK_COMPLETED"
                            ? "Awaiting Approval"
                            : "Completed"}
                    </span>

                  </div>

                  <div className="progress-track">

                    <div
                      className={`progress-fill progress-${project.status?.toLowerCase()}`}
                    ></div>

                  </div>

                </div>

                {/* ================= OPEN ================= */}

                {project.status === "OPEN" && (

                  <div className="project-card-action">

                    <div className="action-info">

                      <span className="action-dot open-dot"></span>

                      <span>
                        Waiting for freelancer applications
                      </span>

                    </div>

                    <button
                      className="blue-button project-main-button"
                      onClick={() => {
                        loadApplicants(project.id);
                        setPage("applicants");
                      }}
                    >
                      View Applicants →
                    </button>

                  </div>

                )}

                {/* ================= IN PROGRESS ================= */}

                {project.status === "IN_PROGRESS" && (

                  <div className="project-card-action">

                    <div className="action-info">

                      <span className="action-dot progress-dot"></span>

                      <span>
                        Freelancer is currently working
                      </span>

                    </div>

                    <div
                      className="project-action-buttons"
                      style={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "flex-end",
                        gap: "10px",
                        width: "100%",
                        marginTop: "18px"
                      }}
                    >

                      {[
                        "PAID",
                        "SUCCESS",
                        "COMPLETED"
                      ].includes(paymentsByProject[project.id]?.status) ? (

                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "42px",
                            boxSizing: "border-box",
                            padding: "10px 14px",
                            borderRadius: "9px",
                            background: "#e8f7ee",
                            color: "#187443",
                            border: "1px solid #bce8cc",
                            fontSize: "14px",
                            fontWeight: 600,
                            whiteSpace: "nowrap"
                          }}
                        >
                          ✓ Demo payment paid
                        </span>

                      ) : (

                        <button
                          className="blue-button project-main-button"
                          style={{
                            width: "auto",
                            minHeight: "42px",
                            boxSizing: "border-box",
                            padding: "10px 16px",
                            borderRadius: "9px",
                            fontSize: "14px",
                            whiteSpace: "nowrap"
                          }}
                          onClick={() => handleDemoPayment(project)}
                          disabled={processingPayment === project.id}
                        >
                          {processingPayment === project.id
                            ? "Processing..."
                            : "💳 Pay Now (Demo)"}
                        </button>

                      )}

                      <button
                        className="blue-button project-main-button"
                        style={{
                          width: "auto",
                          minHeight: "42px",
                          boxSizing: "border-box",
                          padding: "10px 16px",
                          borderRadius: "9px",
                          fontSize: "14px",
                          whiteSpace: "nowrap"
                        }}
                        onClick={() => setSelectedProject(project)}
                      >
                        View Project →
                      </button>

                      <button
                        className="secondary-modal-button project-chat-button"
                        style={{
                          width: "auto",
                          minHeight: "42px",
                          boxSizing: "border-box",
                          padding: "10px 16px",
                          borderRadius: "9px",
                          fontSize: "14px",
                          whiteSpace: "nowrap"
                        }}
                        onClick={() => setPage("chat")}
                      >
                        💬 Chat
                      </button>

                    </div>

                    {/* CONFIRMATION APPEARS HERE, UNDER THIS PROJECT'S BUTTONS */}

                    {renderPaymentConfirmation(project)}
                    {renderProjectPaymentMessage(project)}

                  </div>

                )}

                {/* ================= WORK COMPLETED ================= */}

                {project.status === "WORK_COMPLETED" && (

                  <div className="professional-completion-area">

                    <div className="completion-info">

                      <div className="completion-icon">
                        ✓
                      </div>

                      <div>

                        <strong>
                          Work Submitted
                        </strong>

                        <span>
                          Freelancer has submitted
                          the completed work for your approval.
                        </span>

                      </div>

                    </div>

                    <div className="project-action-buttons">

                      <button
                        className="secondary-modal-button"
                        onClick={() => handleViewSubmittedWork(project)}
                        disabled={loadingWork}
                      >
                        {loadingWork
                          ? "Loading..."
                          : "📎 View Submitted Work"}
                      </button>

                      <button
                        className="blue-button project-main-button"
                        onClick={() => handleApproveComplete(project)}
                      >
                        Approve & Complete
                      </button>

                    </div>

                  </div>

                )}

                {/* ================= COMPLETED ================= */}

                {project.status === "COMPLETED" && (

                  <div className="professional-completed-area">

                    <div className="completion-info">

                      <div className="completion-icon">
                        ✓
                      </div>

                      <div>

                        <strong>
                          Project Completed
                        </strong>

                        <span>
                          This project has been successfully completed.
                        </span>

                      </div>

                    </div>

                    <div className="project-action-buttons">

                      <button
                        className="secondary-modal-button"
                        onClick={() => handleViewSubmittedWork(project)}
                        disabled={loadingWork}
                      >
                        {loadingWork
                          ? "Loading..."
                          : "📎 View Submitted Work"}
                      </button>

                      {/* INITIATE DEMO PAYMENT */}

                      {[
                        "PAID",
                        "SUCCESS",
                        "COMPLETED"
                      ].includes(paymentsByProject[project.id]?.status) ? (

                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            minHeight: "42px",
                            boxSizing: "border-box",
                            padding: "10px 14px",
                            borderRadius: "9px",
                            background: "#e8f7ee",
                            color: "#187443",
                            border: "1px solid #bce8cc",
                            fontSize: "14px",
                            fontWeight: 600,
                            whiteSpace: "nowrap"
                          }}
                        >
                          ✓ Demo payment completed
                        </span>

                      ) : (

                        <button
                          className="blue-button project-main-button"
                          style={{
                            width: "auto",
                            minHeight: "42px",
                            boxSizing: "border-box",
                            padding: "10px 16px",
                            borderRadius: "9px",
                            fontSize: "14px",
                            whiteSpace: "nowrap"
                          }}
                          onClick={() => handleDemoPayment(project)}
                          disabled={processingPayment === project.id}
                        >
                          {processingPayment === project.id
                            ? "Processing..."
                            : "💳 Initiate Demo Payment"}
                        </button>

                      )}

                    </div>

                    {/* CONFIRMATION APPEARS HERE, UNDER THIS PROJECT'S BUTTONS */}

                    {renderPaymentConfirmation(project)}
                    {renderProjectPaymentMessage(project)}

                  </div>

                )}

              </div>

            ))}

          </div>

        )}

      </main>

      {/* ================= PROJECT DETAILS MODAL ================= */}

      {selectedProject && (

        <div
          className="project-details-overlay"
          onClick={() => setSelectedProject(null)}
        >

          <div
            className="professional-project-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="professional-modal-header">

              <div>

                <span className="project-label">
                  PROJECT DETAILS
                </span>

                <h2>
                  {selectedProject.title}
                </h2>

              </div>

              <button
                className="modal-close-button"
                onClick={() => setSelectedProject(null)}
                aria-label="Close project details"
              >
                ×
              </button>

            </div>

            <div className="modal-status-row">

              <span
                className={`status ${selectedProject.status?.toLowerCase()}`}
              >
                {selectedProject.status}
              </span>

              <span className="modal-project-id">
                Project #{selectedProject.id}
              </span>

            </div>

            <div className="modal-section">

              <h3>
                Project Description
              </h3>

              <p>
                {selectedProject.description}
              </p>

            </div>

            <div className="modal-details-grid">

              <div className="modal-detail-card">

                <span>
                  Budget
                </span>

                <strong>
                  ₹{selectedProject.budget}
                </strong>

              </div>

              <div className="modal-detail-card">

                <span>
                  Category
                </span>

                <strong>
                  {selectedProject.category}
                </strong>

              </div>

              <div className="modal-detail-card">

                <span>
                  Location
                </span>

                <strong>
                  {selectedProject.location}
                </strong>

              </div>

              <div className="modal-detail-card">

                <span>
                  Status
                </span>

                <strong>
                  {selectedProject.status}
                </strong>

              </div>

            </div>

            {selectedProject.freelancerEmail && (

              <div className="assigned-freelancer-box">

                <span>
                  ASSIGNED FREELANCER
                </span>

                <strong>
                  {selectedProject.freelancerEmail}
                </strong>

              </div>

            )}

            <div className="professional-modal-footer">

              <button
                className="secondary-modal-button"
                onClick={() => setSelectedProject(null)}
              >
                Close
              </button>

              <button
                className="blue-button"
                onClick={() => {
                  loadApplicants(selectedProject.id);
                  setSelectedProject(null);
                  setPage("applicants");
                }}
              >
                View Applicants
              </button>

            </div>

          </div>

        </div>

      )}

      {/* ================= SUBMITTED WORK MODAL ================= */}

      {showSubmittedWork && submittedWork && (

        <div
          className="project-details-overlay"
          onClick={() => setShowSubmittedWork(false)}
        >

          <div
            className="professional-project-modal"
            onClick={(event) => event.stopPropagation()}
          >

            <div className="professional-modal-header">

              <div>

                <span className="project-label">
                  SUBMITTED WORK
                </span>

                <h2>
                  Freelancer Submission
                </h2>

              </div>

              <button
                className="modal-close-button"
                onClick={() => setShowSubmittedWork(false)}
                aria-label="Close submitted work"
              >
                ×
              </button>

            </div>

            <div className="modal-section">

              <h3>
                Work Description
              </h3>

              <p>
                {submittedWork.description}
              </p>

            </div>

            <div className="modal-details-grid">

              <div className="modal-detail-card">

                <span>
                  File Name
                </span>

                <strong style={{ overflowWrap: "anywhere" }}>
                  📎 {submittedWork.fileName}
                </strong>

              </div>

              <div className="modal-detail-card">

                <span>
                  File Type
                </span>

                <strong>
                  {submittedWork.fileType || "File"}
                </strong>

              </div>

              <div className="modal-detail-card">

                <span>
                  Submission Status
                </span>

                <strong>
                  {submittedWork.status}
                </strong>

              </div>

            </div>

            <div className="professional-modal-footer">

              <button
                className="secondary-modal-button"
                onClick={() => setShowSubmittedWork(false)}
              >
                Close
              </button>

              <button
                className="blue-button"
                onClick={handleDownloadWork}
              >
                ⬇ Download Work
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default ClientProjects;