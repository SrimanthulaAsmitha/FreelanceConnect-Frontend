import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import Chat from "./components/Chat";
import Login from "./pages/Login";
import Register from "./pages/Register";

import FreelancerDashboard from "./pages/FreelancerDashboard";
import FreelancerProfile from "./pages/FreelancerProfile";
import BrowseProjects from "./pages/BrowseProjects";
import SubmitProposal from "./pages/SubmitProposal";
import MyProposals from "./pages/MyProposals";
import FreelancerProjects from "./pages/FreelancerProjects";
import FreelancerReviews from "./pages/FreelancerReviews";

import ClientDashboard from "./pages/ClientDashboard";
import PostProject from "./pages/PostProject";
import ClientProjects from "./pages/ClientProjects";
import ClientProposals from "./pages/ClientProposals";
import Applicants from "./pages/Applicants";
import ClientReviews from "./pages/ClientReviews";

/* ================= API CONFIGURATION ================= */

const API_URL =
  import.meta.env.VITE_API_URL || "https://freelanceconnect-backend.onrender.com";

axios.defaults.baseURL = API_URL;

function App() {

  const [page, setPage] = useState("login");

  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  const [role, setRole] = useState("freelancer");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [projects, setProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [freelancerProjects, setFreelancerProjects] = useState([]);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");

  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedMyProject, setSelectedMyProject] = useState(null);
  const [selectedChatProject, setSelectedChatProject] = useState(null);
  const [loading, setLoading] = useState(false);

  const [applicants, setApplicants] = useState([]);
  const [clientProposals, setClientProposals] = useState([]);
  const [myProposals, setMyProposals] = useState([]);

  const [bidAmount, setBidAmount] = useState("");
  const [proposalMessage, setProposalMessage] = useState("");
  const [submittingProposal, setSubmittingProposal] = useState(false);

  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectBudget, setProjectBudget] = useState("");
  const [projectCategory, setProjectCategory] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
  const [projectDeadline, setProjectDeadline] = useState("");

  const [postingProject, setPostingProject] = useState(false);

  const [reviews, setReviews] = useState([]);

  const [reviewProject, setReviewProject] = useState(null);
  const [reviewRating, setReviewRating] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // Displays messages inside the page instead of browser popups.
  const [appMessage, setAppMessage] = useState("");
  const [appMessageType, setAppMessageType] = useState("error");

  const showMessage = (message, type = "error") => {
    setAppMessage(message);
    setAppMessageType(type);
  };

  const clearMessage = () => {
    setAppMessage("");
  };

  useEffect(() => {
    setAppMessage("");
  }, [page]);


  /* ================= DARK MODE ================= */

  useEffect(() => {

    localStorage.setItem(
      "darkMode",
      darkMode
    );

    document.body.className =
      darkMode
        ? "dark-mode"
        : "light-mode";

  }, [darkMode]);

  /* ================= LOAD PAGE PROJECTS ================= */

  useEffect(() => {

    if (page === "freelancerProjects") {
      loadFreelancerProjects();
    }

    if (page === "myProjects") {
      loadMyProjects();
    }

    if (page === "myProposals") {
      loadMyProposals();
    }

  }, [page]);


  /* ================= REGISTER ================= */

  const handleRegister = async () => {

    clearMessage();

    if (!name || !email || !password) {

      showMessage("Please fill all fields");
      return;
    }

    try {

      await axios.post(
        "/api/users/register",
        {
          name,
          email,
          password,
          role:
            role === "business"
              ? "CLIENT"
              : "FREELANCER"
        }
      );

      setName("");
      setEmail("");
      setPassword("");

      showMessage(
        "Registration successful! Please log in.",
        "success"
      );

      setPage("login");

    } catch (error) {

      console.log(error);

      showMessage(
        error.response?.data ||
        "Registration failed"
      );
    }
  };


  /* ================= LOGIN ================= */

  const handleLogin = async () => {

    clearMessage();

    if (!email || !password) {

      showMessage(
        "Please enter email and password"
      );

      return;
    }

    try {

      const response =
        await axios.post(
          "/api/auth/login",
          {
            email,
            password
          }
        );

      localStorage.setItem(
        "token",
        response.data.token
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "name",
        response.data.name
      );

      localStorage.setItem(
        "email",
        email
      );

      setRole(
        response.data.role === "CLIENT"
          ? "business"
          : "freelancer"
      );

      clearMessage();

      if (
        response.data.role ===
        "FREELANCER"
      ) {

        setPage(
          "freelancerDashboard"
        );

      } else {

        setPage(
          "clientDashboard"
        );
      }

    } catch (error) {

      console.log(error);

      if (error.response) {

        showMessage(
          "Invalid email or password"
        );

      } else {

        showMessage(
          "Backend is not reachable"
        );
      }
    }
  };


  /* ================= LOGOUT ================= */

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    clearMessage();

    setPage("login");

    setName("");
    setEmail("");
    setPassword("");
  };


  /* ================= LOAD ALL PROJECTS ================= */

  const loadProjects = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "/api/projects",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setProjects(response.data);

    } catch (error) {

      console.log(
        "PROJECT LOAD ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  /* ================= LOAD CLIENT PROPOSALS ================= */

  const loadClientProposals = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "/api/proposals",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setClientProposals(
        response.data
      );

    } catch (error) {

      console.log(
        "CLIENT PROPOSALS ERROR:",
        error
      );
    }
  };


  /* ================= LOAD CLIENT PROJECTS ================= */

  const loadMyProjects = async () => {

    console.log("LOAD MY PROJECTS CALLED");

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "/api/projects/client-projects",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      console.log(
        "MY PROJECTS RESPONSE:",
        response.data
      );

      setMyProjects(
        response.data
      );

    } catch (error) {

      console.log(
        "MY PROJECTS ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  /* ================= LOAD FREELANCER PROJECTS ================= */

  const loadFreelancerProjects = async () => {

    try {

      setLoading(true);

      const token =
        localStorage.getItem("token");

      const freelancerEmail =
        localStorage.getItem("email");

      const response =
        await axios.get(
          "/api/projects/my-projects",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      console.log(
        "LOGGED IN FREELANCER:",
        freelancerEmail
      );

      console.log(
        "ALL PROJECTS:",
        response.data
      );

      const filtered =
        response.data.filter(
          (project) =>
            project.freelancerEmail?.trim().toLowerCase() ===
            freelancerEmail?.trim().toLowerCase()
        );

      console.log(
        "FILTERED PROJECTS:",
        filtered
      );

      filtered.forEach((project) => {
        console.log(
          "MY PROJECT:",
          project.id,
          project.title,
          project.status,
          project.freelancerEmail
        );
      });

      setFreelancerProjects(
        filtered
      );

    } catch (error) {

      console.log(
        "FREELANCER PROJECTS ERROR:",
        error
      );

    } finally {

      setLoading(false);
    }
  };


  /* ================= LOAD FREELANCER REVIEWS ================= */

  const loadFreelancerReviews = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const freelancerEmail =
        localStorage.getItem("email");

      const response =
        await axios.get(
          "/api/reviews",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      const filtered =
        response.data.filter(
          (review) =>
            review.freelancerEmail ===
            freelancerEmail
        );

      setReviews(filtered);

    } catch (error) {

      console.log(
        "FREELANCER REVIEWS ERROR:",
        error
      );
    }
  };


  /* ================= LOAD REVIEWS PAGE ================= */

  const loadMyProjectsForReviews = async () => {

    try {

      await loadMyProjects();
      await loadReviews();

    } catch (error) {

      console.log(error);
    }
  };
  /* ================= LOAD MY PROPOSALS ================= */

const loadMyProposals = async () => {
  try {
    const token = localStorage.getItem("token");
    const freelancerEmail = localStorage.getItem("email");

    if (!token || !freelancerEmail) {
      console.error("Missing login token or freelancer email.");
      setMyProposals([]);
      return;
    }

    const response = await axios.get(
      `/api/proposals/freelancer/${encodeURIComponent(freelancerEmail)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const proposals = Array.isArray(response.data)
      ? response.data
      : [];

    console.log("Total proposals received:", proposals.length);
    console.log("Proposal IDs:", proposals.map((proposal) => proposal.id));
    console.log("Proposals received:", proposals);

    setMyProposals(proposals);
  } catch (error) {
    console.error(
      "MY PROPOSALS ERROR:",
      error.response?.data || error.message
    );
  }
};

  /* ================= LOAD APPLICANTS ================= */

  const loadApplicants = async (projectId) => {

    clearMessage();

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          `/api/proposals/project/${projectId}`,
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setApplicants(
        response.data
      );

      const project =
        myProjects.find(
          (item) =>
            item.id === projectId
        );

      setSelectedMyProject(
        project
      );

      setPage("applicants");

    } catch (error) {

      console.log(
        "APPLICANTS ERROR:",
        error
      );

      showMessage(
        "Could not load applicants"
      );
    }
  };


  /* ================= ACCEPT PROPOSAL ================= */

  const handleAcceptProposal = async (proposal) => {

    clearMessage();

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        clearMessage();
        setPage("login");

        return;
      }

      await axios.put(
        `/api/proposals/${proposal.id}/accept`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      await loadMyProjects();
      await loadClientProposals();

      // Do not display a success message.
      clearMessage();

    } catch (error) {

      console.log(
        "ACCEPT PROPOSAL ERROR:",
        error
      );

      showMessage(
        "Could not accept proposal"
      );
    }
  };


  /* ================= MARK WORK COMPLETED ================= */

  const handleMarkWorkCompleted = async (projectId) => {

    clearMessage();

    try {

      const token =
        localStorage.getItem("token");

      await axios.put(
        `/api/projects/${projectId}/work-completed`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      await loadFreelancerProjects();

      showMessage(
        "Work marked as completed!",
        "success"
      );

    } catch (error) {

      console.log(
        "WORK COMPLETED ERROR:",
        error
      );

      showMessage(
        "Could not mark work as completed"
      );
    }
  };


  /* ================= APPROVE COMPLETE ================= */

  const handleApproveComplete = async (project) => {

    clearMessage();

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        showMessage("Please login again");

        setPage("login");

        return;
      }

      await axios.put(
        `/api/projects/${project.id}/complete`,
        {},
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      await loadMyProjects();

      showMessage(
        "Project completed successfully!",
        "success"
      );

    } catch (error) {

      console.log(
        "COMPLETE PROJECT ERROR:",
        error
      );

      showMessage(
        "Could not complete project"
      );
    }
  };


  /* ================= LOAD REVIEWS ================= */

  const loadReviews = async () => {

    try {

      const token =
        localStorage.getItem("token");

      const response =
        await axios.get(
          "/api/reviews",
          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setReviews(
        response.data
      );

    } catch (error) {

      console.log(
        "LOAD REVIEWS ERROR:",
        error
      );
    }
  };


  /* ================= SUBMIT REVIEW ================= */

  const handleSubmitReview = async () => {

    clearMessage();

    if (!reviewProject) {
      return;
    }

    if (!reviewRating) {

      showMessage(
        "Please select a rating"
      );

      return;
    }

    if (!reviewComment) {

      showMessage(
        "Please enter a comment"
      );

      return;
    }

    try {

      setSubmittingReview(true);

      const token =
        localStorage.getItem("token");

      const clientEmail =
        localStorage.getItem("email");

      await axios.post(
        "/api/reviews",
        {
          projectId:
            reviewProject.id,

          clientEmail:
            clientEmail,

          freelancerEmail:
            reviewProject.freelancerEmail,

          rating:
            Number(reviewRating),

          comment:
            reviewComment
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setReviewProject(null);
      setReviewRating("");
      setReviewComment("");

      await loadReviews();

      showMessage(
        "Review submitted successfully!",
        "success"
      );

    } catch (error) {

      console.log(
        "REVIEW ERROR:",
        error
      );

      showMessage(
        "Could not submit review"
      );

    } finally {

      setSubmittingReview(false);
    }
  };


  /* ================= VIEW PROJECT ================= */

  const handleViewProject = (project) => {

    clearMessage();

    setSelectedProject(
      project
    );
  };


  /* ================= FILTER PROJECTS ================= */

  const filteredProjects =
    projects.filter(
      (project) => {

        const matchesSearch =
          project.title
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          project.description
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesCategory =
          category === "ALL" ||
          project.category ===
          category;

        return (
          matchesSearch &&
          matchesCategory
        );
      }
    );


  /* ================= SUBMIT PROPOSAL ================= */

  const handleSubmitProposal = async (event) => {

    event?.preventDefault();

    clearMessage();

    if (!selectedProject) {
      return;
    }

    if (
      !bidAmount ||
      Number(bidAmount) < 5000
    ) {

      showMessage(
        "Minimum bid amount is ₹5,000"
      );

      return;
    }

    if (!proposalMessage) {

      showMessage(
        "Please enter a proposal message"
      );

      return;
    }

    try {

      setSubmittingProposal(true);

      const token =
        localStorage.getItem("token");

      const freelancerEmail =
        localStorage.getItem("email");

      await axios.post(
        "/api/proposals",
        {
          projectId:
            selectedProject.id,

          freelancerEmail:
            freelancerEmail,

          bidAmount:
            Number(bidAmount),

          message:
            proposalMessage,

          status:
            "PENDING"
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setBidAmount("");
      setProposalMessage("");
      setSelectedProject(null);

      setPage(
        "browseProjects"
      );

      showMessage(
        "Proposal submitted successfully!",
        "success"
      );

    } catch (error) {

      console.log(
        "PROPOSAL ERROR:",
        error
      );

      showMessage(
        "Could not submit proposal"
      );

    } finally {

      setSubmittingProposal(false);
    }
  };


  /* ================= POST PROJECT ================= */

  const handlePostProject = async (event) => {

    event?.preventDefault();

    clearMessage();

    if (
      !projectTitle ||
      !projectDescription ||
      !projectBudget ||
      !projectCategory ||
      !projectLocation ||
      !projectDeadline
    ) {

      showMessage(
        "Please fill all fields"
      );

      return;
    }

    if (
      Number(projectBudget) < 5000
    ) {

      showMessage(
        "Minimum project budget is ₹5,000"
      );

      return;
    }

    try {

      setPostingProject(true);

      const token =
        localStorage.getItem("token");

      await axios.post(
        "/api/projects",
        {
          title:
            projectTitle,

          description:
            projectDescription,

          budget:
            Number(projectBudget),

          category:
            projectCategory,

          location:
            projectLocation,

          deadline:
            projectDeadline,

          status:
            "OPEN"
        },
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setProjectTitle("");
      setProjectDescription("");
      setProjectBudget("");
      setProjectCategory("");
      setProjectLocation("");
      setProjectDeadline("");

      setPage(
        "clientDashboard"
      );

      showMessage(
        "Project posted successfully!",
        "success"
      );

    } catch (error) {

      console.log(
        "POST PROJECT ERROR:",
        error
      );

      showMessage(
        "Could not post project"
      );

    } finally {

      setPostingProject(false);
    }
  };


  /* ================= LOGIN PAGE ================= */

  if (page === "login") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <Login
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= REGISTER PAGE ================= */

  if (page === "register") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <Register
          name={name}
          setName={setName}
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
          setPage={setPage}
          handleRegister={handleRegister}
        />
      </>
    );
  }


  /* ================= FREELANCER DASHBOARD ================= */

  if (page === "freelancerDashboard") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <FreelancerDashboard
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          loadProjects={loadProjects}
          loadMyProposals={loadMyProposals}
          loadFreelancerProjects={
            loadFreelancerProjects
          }
          loadFreelancerReviews={
            loadFreelancerReviews
          }
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= FREELANCER PROFILE ================= */

  if (page === "freelancerProfile") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <FreelancerProfile
          onBack={() =>
            setPage(
              "freelancerDashboard"
            )
          }
        />
      </>
    );
  }


  /* ================= BROWSE PROJECTS ================= */

  if (page === "browseProjects") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <BrowseProjects
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          loading={loading}
          filteredProjects={
            filteredProjects
          }
          selectedProject={
            selectedProject
          }
          setSelectedProject={
            setSelectedProject
          }
          handleViewProject={
            handleViewProject
          }
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= SUBMIT PROPOSAL ================= */

  if (page === "submitProposal") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <SubmitProposal
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          selectedProject={
            selectedProject
          }
          bidAmount={bidAmount}
          setBidAmount={setBidAmount}
          proposalMessage={
            proposalMessage
          }
          setProposalMessage={
            setProposalMessage
          }
          submittingProposal={
            submittingProposal
          }
          handleSubmitProposal={
            handleSubmitProposal
          }
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= MY PROPOSALS ================= */

  if (page === "myProposals") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <MyProposals
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          myProposals={
            myProposals
          }
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= FREELANCER PROJECTS ================= */

  if (page === "freelancerProjects") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <FreelancerProjects
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          freelancerProjects={
            freelancerProjects
          }
          loading={loading}
          handleMarkWorkCompleted={
            handleMarkWorkCompleted
          }
          setPage={setPage}
          setSelectedChatProject={
            setSelectedChatProject
          }
        />
      </>
    );
  }


  /* ================= FREELANCER REVIEWS ================= */

  if (page === "freelancerReviews") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <FreelancerReviews
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          reviews={reviews}
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= CLIENT DASHBOARD ================= */

  if (page === "clientDashboard") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <ClientDashboard
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          loadMyProjects={
            loadMyProjects
          }
          loadClientProposals={
            loadClientProposals
          }
          loadMyProjectsForReviews={
            loadMyProjectsForReviews
          }
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= POST PROJECT ================= */

  if (page === "postProject") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <PostProject
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          setPage={setPage}
          projectTitle={
            projectTitle
          }
          setProjectTitle={
            setProjectTitle
          }
          projectDescription={
            projectDescription
          }
          setProjectDescription={
            setProjectDescription
          }
          projectBudget={
            projectBudget
          }
          setProjectBudget={
            setProjectBudget
          }
          projectCategory={
            projectCategory
          }
          setProjectCategory={
            setProjectCategory
          }
          projectLocation={
            projectLocation
          }
          setProjectLocation={
            setProjectLocation
          }
          projectDeadline={
            projectDeadline
          }
          setProjectDeadline={
            setProjectDeadline
          }
          handlePostProject={
            handlePostProject
          }
          postingProject={
            postingProject
          }
        />
      </>
    );
  }


  /* ================= CHAT ================= */

  if (page === "chat") {

    return (
      <Chat
        project={selectedChatProject}
        setPage={setPage}
      />
    );
  }


  /* ================= CLIENT PROJECTS ================= */

  if (page === "myProjects") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <ClientProjects
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          myProjects={myProjects}
          loading={loading}
          loadApplicants={
            loadApplicants
          }
          handleApproveComplete={
            handleApproveComplete
          }
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= CLIENT PROPOSALS ================= */

  if (page === "clientProposals") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <ClientProposals
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          clientProposals={
            clientProposals
          }
          handleAcceptProposal={
            handleAcceptProposal
          }
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= APPLICANTS ================= */

  if (page === "applicants") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <Applicants
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          selectedMyProject={
            selectedMyProject
          }
          applicants={
            applicants
          }
          handleAcceptProposal={
            handleAcceptProposal
          }
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= CLIENT REVIEWS ================= */

  if (page === "clientReviews") {

    return (
      <>
        {appMessage && (
          <div
            className={`app-message ${appMessageType}`}
            role="status"
          >
            {appMessage}
          </div>
        )}

        <ClientReviews
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          handleLogout={handleLogout}
          myProjects={
            myProjects
          }
          reviews={
            reviews
          }
          reviewProject={
            reviewProject
          }
          setReviewProject={
            setReviewProject
          }
          reviewRating={
            reviewRating
          }
          setReviewRating={
            setReviewRating
          }
          reviewComment={
            reviewComment
          }
          setReviewComment={
            setReviewComment
          }
          handleSubmitReview={
            handleSubmitReview
          }
          submittingReview={
            submittingReview
          }
          setPage={setPage}
        />
      </>
    );
  }


  /* ================= DEFAULT ================= */

  return (
    <>
      {appMessage && (
        <div
          className={`app-message ${appMessageType}`}
          role="status"
        >
          {appMessage}
        </div>
      )}

      <Login
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        setPage={setPage}
      />
    </>
  );
}

export default App;