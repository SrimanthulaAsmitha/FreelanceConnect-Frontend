import { useEffect, useState } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://freelanceconnect-backend.onrender.com"
).replace(/\/+$/, "");

function FreelancerDashboard({
  darkMode,
  setDarkMode,
  handleLogout,
  loadProjects,
  loadMyProposals,
  loadFreelancerProjects,
  loadFreelancerReviews,
  setPage
}) {
  const userName = localStorage.getItem("name") || "Freelancer";
  const API_URL = import.meta.env.VITE_API_URL;

  // ================= FREELANCER PAYMENTS =================

  const [freelancerPayments, setFreelancerPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(true);

  useEffect(() => {
    const loadFreelancerPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setFreelancerPayments([]);
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/payments/my-freelancer-payments`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setFreelancerPayments(response.data || []);
      } catch (error) {
        console.error("LOAD FREELANCER PAYMENTS ERROR:", error);
      } finally {
        setPaymentsLoading(false);
      }
    };

    loadFreelancerPayments();
  }, [API_URL]);

  // ================= EARNINGS CALCULATIONS =================

  const paidPayments = freelancerPayments.filter(
    (payment) => payment.status === "PAID"
  );

  const totalEarnings = paidPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  return (
    <div className="freelancer-dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="freelancer-sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">F</div>
          <span>FreelanceConnect</span>
        </div>

        <nav className="sidebar-menu">
          <button
            className="sidebar-item active"
            onClick={() => setPage("freelancerDashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              loadProjects();
              setPage("browseProjects");
            }}
          >
            <span>⌕</span>
            Browse Projects
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              loadMyProposals();
              setPage("myProposals");
            }}
          >
            <span>✉</span>
            My Proposals
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              loadFreelancerProjects();
              setPage("freelancerProjects");
            }}
          >
            <span>▣</span>
            My Projects
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              loadFreelancerReviews();
              setPage("freelancerReviews");
            }}
          >
            <span>★</span>
            Reviews
          </button>

          <button
            className="sidebar-item"
            onClick={() => setPage("freelancerProfile")}
          >
            <span>◯</span>
            My Profile
          </button>
        </nav>

        <div className="sidebar-bottom">
          <button
            className="sidebar-item"
            onClick={() => setDarkMode(!darkMode)}
          >
            <span>{darkMode ? "☀" : "☾"}</span>
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button
            className="sidebar-logout"
            onClick={handleLogout}
          >
            <span>↪</span>
            Logout
          </button>
        </div>
      </aside>

      {/* ================= MAIN ================= */}

      <div className="freelancer-main">

        {/* ================= TOPBAR ================= */}

        <header className="freelancer-topbar">
          <div className="topbar-title">
            <span className="topbar-small">Workspace</span>
            <h2>Freelancer Dashboard</h2>
          </div>

          <div className="topbar-right">
            <NotificationBell />

            <div className="client-profile">
              <div className="client-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div className="client-profile-info">
                <strong>{userName}</strong>
                <span>Freelancer</span>
              </div>
            </div>

            <button
              className="topbar-logout"
              onClick={handleLogout}
              title="Logout from your account"
            >
              <span>↪</span>
              Logout
            </button>
          </div>
        </header>

        {/* ================= CONTENT ================= */}

        <main className="freelancer-dashboard-content">

          {/* ================= WELCOME ================= */}

          <section className="client-welcome">
            <div>
              <span className="welcome-label">Welcome back 👋</span>
              <h1>Hello, {userName}</h1>
              <p>
                Find projects, submit proposals and grow your freelance career.
              </p>
            </div>

            <button
              className="primary-project-button"
              onClick={() => {
                loadProjects();
                setPage("browseProjects");
              }}
            >
              <span>⌕</span>
              Browse Projects
            </button>
          </section>

          {/* ================= OVERVIEW ================= */}

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>Overview</h2>
                <p>Manage your freelance activity</p>
              </div>
            </div>

            <div className="overview-grid">
              <div className="overview-card">
                <div className="overview-icon blue">🔍</div>
                <div className="overview-content">
                  <span>Projects</span>
                  <h3>Browse Projects</h3>
                  <p>Find new projects that match your skills.</p>
                </div>
                <button
                  onClick={() => {
                    loadProjects();
                    setPage("browseProjects");
                  }}
                >
                  →
                </button>
              </div>

              <div className="overview-card">
                <div className="overview-icon purple">📄</div>
                <div className="overview-content">
                  <span>Applications</span>
                  <h3>My Proposals</h3>
                  <p>Track the proposals you have submitted.</p>
                </div>
                <button
                  onClick={() => {
                    loadMyProposals();
                    setPage("myProposals");
                  }}
                >
                  →
                </button>
              </div>

              <div className="overview-card">
                <div className="overview-icon blue">💼</div>
                <div className="overview-content">
                  <span>Work</span>
                  <h3>My Projects</h3>
                  <p>View your current and completed projects.</p>
                </div>
                <button
                  onClick={() => {
                    loadFreelancerProjects();
                    setPage("freelancerProjects");
                  }}
                >
                  →
                </button>
              </div>

              <div className="overview-card">
                <div className="overview-icon yellow">★</div>
                <div className="overview-content">
                  <span>Feedback</span>
                  <h3>My Reviews</h3>
                  <p>See ratings and feedback from clients.</p>
                </div>
                <button
                  onClick={() => {
                    loadFreelancerReviews();
                    setPage("freelancerReviews");
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </section>

          {/* ================= MY EARNINGS ================= */}

          <section className="dashboard-section earnings-section">
            <div className="section-heading earnings-heading">
              <div>
                <span className="earnings-eyebrow">FINANCIAL OVERVIEW</span>
                <h2>My Earnings</h2>
                <p>
                  Track your freelance income and payment history.
                </p>
              </div>

              <div className="earnings-live-badge">
                <span className="earnings-live-dot"></span>
                Payment Overview
              </div>
            </div>

            {/* EARNINGS SUMMARY */}

            <div className="earnings-summary-grid">
              <div className="earnings-summary-card earnings-total-card">
                <div className="earnings-card-top">
                  <span>Total Earnings</span>
                  <div className="earnings-icon earnings-icon-blue">₹</div>
                </div>

                <h3>
                  {paymentsLoading
                    ? "Loading..."
                    : `₹${totalEarnings.toLocaleString("en-IN")}`}
                </h3>

                <p>Successfully paid demo transactions</p>

                <div className="earnings-card-bottom">
                  <span className="earnings-mini-check">✓</span>
                  Earnings from paid projects
                </div>
              </div>

              <div className="earnings-summary-card">
                <div className="earnings-card-top">
                  <span>Paid Projects</span>
                  <div className="earnings-icon earnings-icon-green">✓</div>
                </div>

                <h3>
                  {paymentsLoading ? "—" : paidPayments.length}
                </h3>

                <p>Projects with successful demo payments</p>

                <div className="earnings-card-bottom">
                  <span className="earnings-status-pill">PAID</span>
                  Payment status confirmed
                </div>
              </div>

              <div className="earnings-summary-card">
                <div className="earnings-card-top">
                  <span>Pending Payments</span>
                  <div className="earnings-icon earnings-icon-orange">◷</div>
                </div>

                <h3>
                  {paymentsLoading
                    ? "—"
                    : freelancerPayments.filter(
                        (payment) => payment.status === "PENDING"
                      ).length}
                </h3>

                <p>Payments awaiting confirmation</p>

                <div className="earnings-card-bottom">
                  <span className="earnings-pending-pill">PENDING</span>
                  Awaiting payment
                </div>
              </div>
            </div>

            {/* PAYMENT HISTORY */}

            <div className="earnings-history-card">
              <div className="earnings-history-header">
                <div>
                  <h3>Payment History</h3>
                  <p>Review payments associated with your projects.</p>
                </div>

                <span className="earnings-record-count">
                  {paymentsLoading
                    ? "Loading..."
                    : `${freelancerPayments.length} records`}
                </span>
              </div>

              {paymentsLoading ? (
                <div className="earnings-empty-state">
                  <div className="earnings-loading-spinner"></div>
                  <p>Loading your payment history...</p>
                </div>
              ) : freelancerPayments.length === 0 ? (
                <div className="earnings-empty-state">
                  <div className="earnings-empty-icon">₹</div>
                  <h4>No payments yet</h4>
                  <p>Your project payments will appear here.</p>
                </div>
              ) : (
                <div className="earnings-table-wrapper">
                  <table className="earnings-table">
                    <thead>
                      <tr>
                        <th>PROJECT</th>
                        <th>AMOUNT</th>
                        <th>PAYMENT DATE</th>
                        <th>STATUS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {freelancerPayments.map((payment) => (
                        <tr key={payment.id}>
                          <td>
                            <div className="earnings-project-cell">
                              <div className="earnings-project-icon">↗</div>
                              <div>
                                <strong>Project #{payment.projectId}</strong>
                                <span>Payment ID #{payment.id}</span>
                              </div>
                            </div>
                          </td>

                          <td>
                            <strong className="earnings-amount">
                              ₹
                              {Number(payment.amount || 0).toLocaleString(
                                "en-IN"
                              )}
                            </strong>
                          </td>

                          <td>
                            <span className="earnings-date">
                              {payment.paymentDate
                                ? new Date(
                                    payment.paymentDate
                                  ).toLocaleString("en-IN", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric"
                                  })
                                : "Not paid yet"}
                            </span>
                          </td>

                          <td>
                            <span
                              className={`earnings-payment-status ${
                                payment.status === "PAID"
                                  ? "earnings-status-paid"
                                  : "earnings-status-pending"
                              }`}
                            >
                              <span className="earnings-status-dot"></span>
                              {payment.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="earnings-history-footer">
                <span>Showing all payment records</span>
                <span>Demo transactions · No real money transferred</span>
              </div>
            </div>
          </section>

          {/* ================= QUICK ACTIONS ================= */}

          <section className="dashboard-section">
            <div className="section-heading">
              <div>
                <h2>Quick Actions</h2>
                <p>Get things done faster</p>
              </div>
            </div>

            <div className="quick-actions">
              <button
                className="quick-action-card"
                onClick={() => {
                  loadProjects();
                  setPage("browseProjects");
                }}
              >
                <div className="quick-action-icon">🔍</div>
                <div>
                  <h3>Find Projects</h3>
                  <p>Discover projects that match your skills.</p>
                </div>
                <span>→</span>
              </button>

              <button
                className="quick-action-card"
                onClick={() => {
                  loadMyProposals();
                  setPage("myProposals");
                }}
              >
                <div className="quick-action-icon">📄</div>
                <div>
                  <h3>Track Proposals</h3>
                  <p>Check the status of your submitted proposals.</p>
                </div>
                <span>→</span>
              </button>

              <button
                className="quick-action-card"
                onClick={() => {
                  loadFreelancerProjects();
                  setPage("freelancerProjects");
                }}
              >
                <div className="quick-action-icon">💼</div>
                <div>
                  <h3>Manage Work</h3>
                  <p>View and manage your ongoing projects.</p>
                </div>
                <span>→</span>
              </button>

              <button
                className="quick-action-card"
                onClick={() => setPage("freelancerProfile")}
              >
                <div className="quick-action-icon">👤</div>
                <div>
                  <h3>Update Profile</h3>
                  <p>Manage your skills and freelancer profile.</p>
                </div>
                <span>→</span>
              </button>
            </div>
          </section>

          {/* ================= INFORMATION CARD ================= */}

          <section className="dashboard-info">
            <div className="info-icon">✨</div>

            <div>
              <h3>Grow your freelance career</h3>
              <p>
                Discover local projects, submit proposals and build your
                reputation through successful work.
              </p>
            </div>

            <button
              onClick={() => {
                loadProjects();
                setPage("browseProjects");
              }}
            >
              Find Projects
            </button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default FreelancerDashboard;