
import NotificationBell from "../components/NotificationBell";

function MyProposals({
  darkMode,
  setDarkMode,
  handleLogout,
  myProposals,
  setPage
}) {
  return (
    <div className="dashboard-page">

      <header className="navbar">

        <div className="nav-brand">
          FreelanceConnect
        </div>

        <div className="nav-user">

          <span>
            My Proposals ({myProposals.length})
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

        <button
          className="proposals-back-button"
          onClick={() => setPage("freelancerDashboard")}
        >
          <span>←</span>
          Back to Dashboard
        </button>

        <section className="proposals-header-content">

          <span className="proposals-eyebrow">
            FREELANCER WORKSPACE
          </span>

          <h1>
            My Proposals
          </h1>

          <p>
            Track the proposals you have submitted to clients.
            Monitor their status, review project details, and
            stay updated on your freelance opportunities.
          </p>

          <p>
            Total Proposals: <strong>{myProposals.length}</strong>
          </p>

        </section>

        {myProposals.length === 0 ? (

          <div className="empty-projects">
            <h3>No Proposals Yet</h3>

            <p>
              You have not submitted any proposals yet.
            </p>
          </div>

        ) : (

          <div className="proposal-list">

            {myProposals.map((proposal, index) => (

              <div
                className="professional-proposal-card"
                key={proposal.id}
              >

                <div className="proposal-card-top">

                  <div>
                    <span className="proposal-project-label">
                      PROJECT #{proposal.projectId}
                    </span>

                    <h2>
                      Proposal #{index + 1}
                    </h2>
                  </div>

                  <span
                    className={`proposal-status ${proposal.status?.toLowerCase()}`}
                  >
                    {proposal.status}
                  </span>

                </div>

                <div className="proposal-divider"></div>

                <div className="proposal-details">

                  <div className="proposal-detail">
                    <span>💰 Your Bid</span>

                    <strong>
                      ₹{proposal.bidAmount}
                    </strong>
                  </div>

                  <div className="proposal-detail">
                    <span>👤 Freelancer</span>

                    <strong>
                      {proposal.freelancerEmail}
                    </strong>
                  </div>

                </div>

                <div className="proposal-message-box">

                  <span>
                    Proposal Message
                  </span>

                  <p>
                    {proposal.message}
                  </p>

                </div>

                {proposal.status === "PENDING" && (
                  <div className="proposal-footer">
                    <span>
                      ⏳ Waiting for client response
                    </span>
                  </div>
                )}

                {proposal.status === "ACCEPTED" && (
                  <div className="proposal-footer accepted">
                    <span>
                      ✓ Your proposal was accepted
                    </span>
                  </div>
                )}

                {proposal.status === "REJECTED" && (
                  <div className="proposal-footer rejected">
                    <span>
                      ✕ Proposal was not accepted
                    </span>
                  </div>
                )}

              </div>

            ))}

          </div>

        )}

      </main>

    </div>
  );
}

export default MyProposals;