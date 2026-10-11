import { useEffect, useState } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";

const API_URL = import.meta.env.VITE_API_URL;

function ClientDashboard({
  darkMode,
  setDarkMode,
  handleLogout,
  loadMyProjects,
  loadClientProposals,
  loadMyProjectsForReviews,
  setPage
}) {
  const userName =
    localStorage.getItem("name") || "Client";

  // ================= PAYMENT DETAILS =================

  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    const loadPayments = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setPaymentError("Please login to view payment details.");
          return;
        }

        const response = await axios.get(
          `${API_URL}/api/payments/my-client-payments`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        setPayments(
          Array.isArray(response.data) ? response.data : []
        );
      } catch (error) {
        console.error("LOAD DASHBOARD PAYMENTS ERROR:", error);

        setPaymentError(
          "Unable to load payment details. Please try again."
        );
      } finally {
        setLoadingPayments(false);
      }
    };

    loadPayments();
  }, []);

  const paidPayments = payments.filter(
    (payment) => payment.status === "PAID"
  );

  const pendingPayments = payments.filter(
    (payment) => payment.status === "PENDING"
  );

  const totalPaid = paidPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const totalPending = pendingPayments.reduce(
    (total, payment) => total + Number(payment.amount || 0),
    0
  );

  const recentPayments = [...payments].sort(
    (a, b) => Number(b.id || 0) - Number(a.id || 0)
  );

  return (
    <div className="client-dashboard-page">

      {/* ================= SIDEBAR ================= */}

      <aside className="client-sidebar">

        <div className="sidebar-brand">
          <div className="sidebar-logo">
            F
          </div>

          <span>
            FreelanceConnect
          </span>
        </div>

        <nav className="sidebar-menu">

          <button
            className="sidebar-item active"
            onClick={() => setPage("clientDashboard")}
          >
            <span>⌂</span>
            Dashboard
          </button>

          <button
            className="sidebar-item"
            onClick={() => setPage("postProject")}
          >
            <span>＋</span>
            Post Project
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              loadMyProjects();
              setPage("myProjects");
            }}
          >
            <span>▣</span>
            My Projects
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              loadClientProposals();
              setPage("clientProposals");
            }}
          >
            <span>✉</span>
            Proposals
          </button>

          <button
            className="sidebar-item"
            onClick={() => {
              loadMyProjectsForReviews();
              setPage("clientReviews");
            }}
          >
            <span>★</span>
            Reviews
          </button>

        </nav>

        <div className="sidebar-bottom">

          <button
            className="sidebar-item"
            onClick={() => setDarkMode(!darkMode)}
          >
            <span>
              {darkMode ? "☀" : "☾"}
            </span>

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

      {/* ================= MAIN AREA ================= */}

      <div className="client-main">

        {/* ================= TOP NAVBAR ================= */}

        <header className="client-topbar">

          <div className="topbar-title">

            <span className="topbar-small">
              Workspace
            </span>

            <h2>
              Client Dashboard
            </h2>

          </div>

          <div className="topbar-right">

            <NotificationBell />

            <div className="client-profile">

              <div className="client-avatar">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div className="client-profile-info">

                <strong>
                  {userName}
                </strong>

                <span>
                  Client
                </span>

              </div>

            </div>

            {/* TOP-RIGHT LOGOUT BUTTON */}

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

        <main className="client-dashboard-content">

          {/* ================= WELCOME ================= */}

          <section className="client-welcome">

            <div>

              <span className="welcome-label">
                Welcome back 👋
              </span>

              <h1>
                Hello, {userName}
              </h1>

              <p>
                Manage your projects, review proposals
                and work with talented local freelancers.
              </p>

            </div>

            <button
              className="primary-project-button"
              onClick={() => setPage("postProject")}
            >
              <span>＋</span>
              Post a Project
            </button>

          </section>

          {/* ================= OVERVIEW ================= */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <h2>
                  Overview
                </h2>

                <p>
                  Manage your freelance activity
                </p>

              </div>

            </div>

            <div className="overview-grid">

              {/* PROJECTS */}

              <div className="overview-card">

                <div className="overview-icon blue">
                  💼
                </div>

                <div className="overview-content">

                  <span>
                    Projects
                  </span>

                  <h3>
                    Manage Projects
                  </h3>

                  <p>
                    View and track your posted projects.
                  </p>

                </div>

                <button
                  onClick={() => {
                    loadMyProjects();
                    setPage("myProjects");
                  }}
                >
                  →
                </button>

              </div>

              {/* PROPOSALS */}

              <div className="overview-card">

                <div className="overview-icon purple">
                  ✉
                </div>

                <div className="overview-content">

                  <span>
                    Proposals
                  </span>

                  <h3>
                    Review Proposals
                  </h3>

                  <p>
                    Check freelancer applications.
                  </p>

                </div>

                <button
                  onClick={() => {
                    loadClientProposals();
                    setPage("clientProposals");
                  }}
                >
                  →
                </button>

              </div>

              {/* REVIEWS */}

              <div className="overview-card">

                <div className="overview-icon yellow">
                  ★
                </div>

                <div className="overview-content">

                  <span>
                    Reviews
                  </span>

                  <h3>
                    Review Work
                  </h3>

                  <p>
                    Review completed freelancer work.
                  </p>

                </div>

                <button
                  onClick={() => {
                    loadMyProjectsForReviews();
                    setPage("clientReviews");
                  }}
                >
                  →
                </button>

              </div>

            </div>

          </section>

          {/* ================= PAYMENT OVERVIEW ================= */}

          <section className="dashboard-section client-payment-overview">

            <div className="section-heading">

              <div>

                <h2>
                  💳 Payment Overview
                </h2>

                <p>
                  Track your project payments in one place.
                </p>

              </div>

              <button
                className="payment-view-projects-button"
                onClick={() => {
                  loadMyProjects();
                  setPage("myProjects");
                }}
              >
                View My Projects →
              </button>

            </div>

            {loadingPayments ? (

              <div className="payment-loading">
                <div className="loading-spinner"></div>
                <p>Loading payment details...</p>
              </div>

            ) : paymentError ? (

              <div className="payment-message payment-error">
                <span>⚠️</span>
                <p>{paymentError}</p>

                <button
                  onClick={() => window.location.reload()}
                >
                  Try Again
                </button>
              </div>

            ) : (

              <>

                {/* PAYMENT SUMMARY CARDS */}

                <div className="client-payment-summary-grid">

                  <div className="client-payment-summary-card payment-total-card">

                    <div className="client-payment-summary-top">
                      <span>Total Paid</span>

                      <div className="client-payment-icon paid-icon">
                        ✓
                      </div>
                    </div>

                    <h3>
                      ₹{totalPaid.toLocaleString("en-IN")}
                    </h3>

                    <p>
                      {paidPayments.length} payment
                      {paidPayments.length !== 1 ? "s" : ""} completed
                    </p>

                  </div>

                  <div className="client-payment-summary-card payment-pending-card">

                    <div className="client-payment-summary-top">
                      <span>Pending Payments</span>

                      <div className="client-payment-icon pending-icon">
                        ◷
                      </div>
                    </div>

                    <h3>
                      ₹{totalPending.toLocaleString("en-IN")}
                    </h3>

                    <p>
                      {pendingPayments.length} payment
                      {pendingPayments.length !== 1 ? "s" : ""} pending
                    </p>

                  </div>

                  <div className="client-payment-summary-card payment-count-card">

                    <div className="client-payment-summary-top">
                      <span>Total Transactions</span>

                      <div className="client-payment-icon transaction-icon">
                        ⇄
                      </div>
                    </div>

                    <h3>
                      {payments.length}
                    </h3>

                    <p>
                      Payment records created
                    </p>

                  </div>

                </div>

                {/* RECENT PAYMENTS */}

                <div className="client-recent-payments">

                  <div className="client-recent-payments-header">

                    <div>
                      <h3>
                        Recent Payments
                      </h3>

                      <p>
                        Your latest project payment records
                      </p>
                    </div>

                    <span className="client-payment-record-count">
                      {payments.length} records
                    </span>

                  </div>

                  {recentPayments.length === 0 ? (

                    <div className="client-no-payments">

                      <div className="client-no-payments-icon">
                        💳
                      </div>

                      <h3>
                        No Payments Yet
                      </h3>

                      <p>
                        Payment records will appear here when
                        you initiate a payment for an assigned project.
                      </p>

                      <button
                        className="primary-project-button"
                        onClick={() => {
                          loadMyProjects();
                          setPage("myProjects");
                        }}
                      >
                        View My Projects →
                      </button>

                    </div>

                  ) : (

                    <div className="client-payment-table-wrapper">

                      <table className="client-payment-table">

                        <thead>
                          <tr>
                            <th>Project ID</th>
                            <th>Amount</th>
                            <th>Status</th>
                            <th>Payment Date</th>
                          </tr>
                        </thead>

                        <tbody>

                          {recentPayments.slice(0, 5).map((payment) => (

                            <tr key={payment.id}>

                              <td>
                                <span className="payment-project-id">
                                  #{payment.projectId}
                                </span>
                              </td>

                              <td>
                                <strong className="payment-amount">
                                  ₹{Number(payment.amount || 0).toLocaleString("en-IN")}
                                </strong>
                              </td>

                              <td>
                                <span
                                  className={
                                    payment.status === "PAID"
                                      ? "client-payment-status paid"
                                      : "client-payment-status pending"
                                  }
                                >
                                  <span className="payment-status-dot"></span>

                                  {payment.status === "PAID"
                                    ? "Paid"
                                    : "Pending"}
                                </span>
                              </td>

                              <td>
                                {payment.paymentDate
                                  ? new Date(
                                      payment.paymentDate
                                    ).toLocaleDateString("en-IN")
                                  : "Not paid yet"}
                              </td>

                            </tr>

                          ))}

                        </tbody>

                      </table>

                      <p className="client-demo-payment-note">
                        ℹ️ These are demo payment records.
                        No real money is transferred by the demo confirmation.
                      </p>

                    </div>

                  )}

                </div>

              </>

            )}

          </section>

          {/* ================= QUICK ACTIONS ================= */}

          <section className="dashboard-section">

            <div className="section-heading">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Get things done faster
                </p>

              </div>

            </div>

            <div className="quick-actions">

              {/* POST PROJECT */}

              <button
                className="quick-action-card"
                onClick={() => setPage("postProject")}
              >

                <div className="quick-action-icon">
                  📝
                </div>

                <div>

                  <h3>
                    Post a Project
                  </h3>

                  <p>
                    Find the right freelancer
                    for your project.
                  </p>

                </div>

                <span>
                  →
                </span>

              </button>

              {/* TRACK PROJECTS */}

              <button
                className="quick-action-card"
                onClick={() => {
                  loadMyProjects();
                  setPage("myProjects");
                }}
              >

                <div className="quick-action-icon">
                  📊
                </div>

                <div>

                  <h3>
                    Track Projects
                  </h3>

                  <p>
                    Monitor the progress of
                    your projects.
                  </p>

                </div>

                <span>
                  →
                </span>

              </button>

              {/* FIND FREELANCERS */}

              <button
                className="quick-action-card"
                onClick={() => {
                  loadClientProposals();
                  setPage("clientProposals");
                }}
              >

                <div className="quick-action-icon">
                  👥
                </div>

                <div>

                  <h3>
                    Find Freelancers
                  </h3>

                  <p>
                    Compare proposals and
                    choose the best freelancer.
                  </p>

                </div>

                <span>
                  →
                </span>

              </button>

            </div>

          </section>

          {/* ================= INFORMATION CARD ================= */}

          <section className="dashboard-info">

            <div className="info-icon">
              ✨
            </div>

            <div>

              <h3>
                Build your next project with local talent
              </h3>

              <p>
                Post your requirements and connect with
                skilled freelancers starting from ₹5,000.
              </p>

            </div>

            <button
              onClick={() => setPage("postProject")}
            >
              Get Started
            </button>

          </section>

        </main>

      </div>

    </div>
  );
}

export default ClientDashboard;