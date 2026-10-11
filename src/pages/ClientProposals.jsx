
import NotificationBell from "../components/NotificationBell";

function ClientProposals({
  darkMode,
  setDarkMode,
  handleLogout,
  clientProposals,
  handleAcceptProposal,
  setPage
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
            Proposals
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
          className="client-proposals-back-button"
          onClick={() =>
            setPage("clientDashboard")
          }
        >
          <span>←</span>
          Back to Dashboard
        </button>


        {/* ================= PAGE HEADER ================= */}

        <section className="client-proposals-page-header">

          <span className="client-proposals-label">
            PROJECT MANAGEMENT
          </span>

          <h1>
            Freelancer Proposals
          </h1>

          <p>
            Review proposals submitted by freelancers and choose the right person for your project.
          </p>

        </section>


        {/* ================= EMPTY STATE ================= */}

        {clientProposals.length === 0 ? (

          <div className="professional-proposals-empty">

            <div className="proposals-empty-icon">
              📄
            </div>

            <h2>
              No Proposals Yet
            </h2>

            <p>
              No freelancers have applied to your
              projects yet. New proposals will appear
              here when freelancers apply.
            </p>

          </div>

        ) : (

          /* ================= PROPOSALS ================= */

          <div className="professional-client-proposals">

            {clientProposals.map(
              (proposal) => (

                <div
                  className="professional-client-proposal-card"
                  key={proposal.id}
                >

                  {/* ================= CARD HEADER ================= */}

                  <div className="client-proposal-header">

                    <div>

                      <span className="proposal-project-label">
                        PROJECT #{proposal.projectId}
                      </span>

                      <h2>
                        Freelancer Proposal
                      </h2>

                    </div>

                    <span
                      className={`status ${proposal.status?.toLowerCase()}`}
                    >
                      {proposal.status}
                    </span>

                  </div>


                  {/* ================= FREELANCER ================= */}

                  <div className="client-freelancer-section">

                    <div className="client-freelancer-avatar">
                      {proposal.freelancerEmail
                        ?.charAt(0)
                        ?.toUpperCase()}
                    </div>

                    <div>

                      <span>
                        FREELANCER
                      </span>

                      <strong>
                        {proposal.freelancerEmail}
                      </strong>

                    </div>

                  </div>


                  {/* ================= PROPOSAL DETAILS ================= */}

                  <div className="client-proposal-details">

                    <div className="client-proposal-detail">

                      <span>
                        PROPOSED BUDGET
                      </span>

                      <strong>
                        ₹{proposal.bidAmount}
                      </strong>

                    </div>


                    <div className="client-proposal-detail">

                      <span>
                        PROJECT ID
                      </span>

                      <strong>
                        #{proposal.projectId}
                      </strong>

                    </div>


                    <div className="client-proposal-detail">

                      <span>
                        STATUS
                      </span>

                      <strong>
                        {proposal.status}
                      </strong>

                    </div>

                  </div>


                  {/* ================= MESSAGE ================= */}

                  <div className="client-proposal-message">

                    <span>
                      PROPOSAL MESSAGE
                    </span>

                    <p>
                      {proposal.message}
                    </p>

                  </div>


                  {/* ================= ACTION ================= */}

                  {proposal.status ===
                    "PENDING" && (

                    <div className="client-proposal-action">

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

                    </div>

                  )}


                  {/* ================= ACCEPTED ================= */}

                  {proposal.status ===
                    "ACCEPTED" && (

                    <div className="professional-proposal-accepted">

                      <div className="accepted-icon">
                        ✓
                      </div>

                      <div>

                        <strong>
                          Freelancer Accepted
                        </strong>

                        <p>
                          This freelancer has been
                          selected and the project is
                          now in progress.
                        </p>

                      </div>

                    </div>

                  )}

                </div>

              )
            )}

          </div>

        )}

      </main>

    </div>
  );
}

export default ClientProposals;
