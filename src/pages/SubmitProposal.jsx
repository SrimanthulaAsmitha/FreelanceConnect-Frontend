import { useState } from "react";
import NotificationBell from "../components/NotificationBell";

function SubmitProposal({
  darkMode,
  setDarkMode,
  handleLogout,
  selectedProject,
  bidAmount,
  setBidAmount,
  proposalMessage,
  setProposalMessage,
  submittingProposal,
  handleSubmitProposal,
  setPage
}) {
  const [formMessage, setFormMessage] = useState("");
  const [formMessageType, setFormMessageType] = useState("");

  const submitProposal = async (e) => {
    e.preventDefault();

    setFormMessage("");
    setFormMessageType("");

    if (!bidAmount || Number(bidAmount) < 5000) {
      setFormMessage("Your bid amount must be at least ₹5,000.");
      setFormMessageType("error");
      return;
    }

    if (!proposalMessage.trim()) {
      setFormMessage("Please enter your proposal message.");
      setFormMessageType("error");
      return;
    }

    try {
      const result = await handleSubmitProposal();

      // Display a message if the parent function returns one.
      if (result?.success === false) {
        setFormMessage(
          result.message || "Could not submit your proposal. Please try again."
        );
        setFormMessageType("error");
      } else if (result?.success === true) {
        setFormMessage(
          result.message || "Your proposal has been submitted successfully!"
        );
        setFormMessageType("success");
      }
    } catch (error) {
      setFormMessage(
        error?.message || "Could not submit your proposal. Please try again."
      );
      setFormMessageType("error");
    }
  };

  return (
    <div className="dashboard-page">

      {/* NAVBAR */}

      <header className="navbar">
        <div className="nav-brand">
          FreelanceConnect
        </div>

        <div className="nav-user">
          <span>
            Submit Proposal
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

      <main className="dashboard-container">

        {/* BACK */}

        <button
          className="back-button"
          onClick={() => setPage("browseProjects")}
        >
          ← Back to Projects
        </button>

        {/* PAGE HEADER */}

        <section className="welcome-section">
          <h1>
            Submit Proposal
          </h1>

          <p>
            Tell the client how you can help with this project.
          </p>
        </section>

        {/* INLINE SUCCESS / ERROR MESSAGE */}

        {formMessage && (
          <div
            role="status"
            aria-live="polite"
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "12px",
              padding: "14px 16px",
              marginBottom: "20px",
              borderRadius: "10px",
              background:
                formMessageType === "error" ? "#fee2e2" : "#dcfce7",
              color:
                formMessageType === "error" ? "#991b1b" : "#166534",
              border:
                formMessageType === "error"
                  ? "1px solid #fecaca"
                  : "1px solid #bbf7d0",
              lineHeight: 1.6,
              overflowWrap: "anywhere"
            }}
          >
            <span>
              {formMessageType === "error" ? "⚠️ " : "✓ "}
              {formMessage}
            </span>

            <button
              type="button"
              onClick={() => setFormMessage("")}
              aria-label="Dismiss message"
              style={{
                border: "none",
                background: "transparent",
                color: "inherit",
                cursor: "pointer",
                fontSize: "18px",
                flexShrink: 0
              }}
            >
              ×
            </button>
          </div>
        )}

        {/* SELECTED PROJECT */}

        {selectedProject && (
          <div className="professional-proposal-container">

            {/* PROJECT SUMMARY */}

            <div className="proposal-project-card">

              <div className="proposal-project-top">
                <div>
                  <div className="proposal-project-label">
                    PROJECT #{selectedProject.id}
                  </div>

                  <h2>
                    {selectedProject.title}
                  </h2>
                </div>

                <span className="proposal-project-status">
                  {selectedProject.status}
                </span>
              </div>

              <div className="proposal-category">
                {selectedProject.category}
              </div>

              <div className="proposal-description">
                <h3>
                  About this project
                </h3>

                <p>
                  {selectedProject.description}
                </p>
              </div>

              {/* PROJECT INFORMATION */}

              <div className="proposal-project-info">

                <div className="proposal-info-box">
                  <span>
                    CLIENT BUDGET
                  </span>

                  <strong>
                    ₹{selectedProject.budget}
                  </strong>
                </div>

                <div className="proposal-info-box">
                  <span>
                    CATEGORY
                  </span>

                  <strong>
                    {selectedProject.category}
                  </strong>
                </div>

                <div className="proposal-info-box">
                  <span>
                    LOCATION
                  </span>

                  <strong>
                    📍 {selectedProject.location}
                  </strong>
                </div>

              </div>
            </div>

            {/* PROPOSAL FORM */}

            <div className="professional-proposal-form">

              <div className="proposal-form-header">
                <div>
                  <div className="proposal-form-label">
                    YOUR PROPOSAL
                  </div>

                  <h2>
                    Send your offer
                  </h2>

                  <p>
                    Submit your bid and explain why you're a good fit.
                  </p>
                </div>
              </div>

              <form onSubmit={submitProposal}>

                {/* BID AMOUNT */}

                <div className="proposal-field">
                  <label htmlFor="bidAmount">
                    Your Bid Amount
                  </label>

                  <div className="proposal-input-wrapper">
                    <span>
                      ₹
                    </span>

                    <input
                      id="bidAmount"
                      type="number"
                      min="5000"
                      placeholder="Enter your bid amount"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      required
                    />
                  </div>

                  <small>
                    Minimum project bid: ₹5,000
                  </small>
                </div>

                {/* PROPOSAL MESSAGE */}

                <div className="proposal-field">
                  <label htmlFor="proposalMessage">
                    Proposal Message
                  </label>

                  <textarea
                    id="proposalMessage"
                    rows="6"
                    placeholder="Explain your experience, approach, and how you can complete this project..."
                    value={proposalMessage}
                    onChange={(e) => setProposalMessage(e.target.value)}
                    required
                  />

                  <small>
                    Give the client a clear reason to choose you.
                  </small>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className="professional-submit-proposal"
                  disabled={submittingProposal}
                >
                  {submittingProposal
                    ? "Submitting..."
                    : "Submit Proposal →"}
                </button>

              </form>
            </div>
          </div>
        )}

        {/* NO PROJECT */}

        {!selectedProject && (
          <div className="empty-state">
            <h2>
              No Project Selected
            </h2>

            <p>
              Please select a project before submitting a proposal.
            </p>

            <button
              className="blue-button"
              onClick={() => setPage("browseProjects")}
            >
              Browse Projects
            </button>
          </div>
        )}

      </main>
    </div>
  );
}

export default SubmitProposal;