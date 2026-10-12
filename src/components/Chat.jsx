import { useEffect, useState } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";

const API_URL = import.meta.env.VITE_API_URL || "https://freelanceconnect-backend.onrender.com";

function Chat({
  project,
  setPage
}) {

  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([]);

  const currentUserEmail =
    localStorage.getItem("email");

  const projectId =
    project?.id;


  // ================= LOAD MESSAGES =================

  const loadMessages = async () => {

    if (!projectId) {
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

const response = await axios.get(
  `${API_URL}/api/messages/project/${projectId}`,
  {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setMessages(response.data);

    } catch (error) {

      console.log(
        "LOAD MESSAGES ERROR:",
        error
      );

    }
  };


  // ================= LOAD WHEN PAGE OPENS =================

  useEffect(() => {

    loadMessages();

  }, [projectId]);


  // ================= SEND MESSAGE =================

  const handleSend = async (event) => {

    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      const receiverEmail =
        currentUserEmail === project.clientEmail
          ? project.freelancerEmail
          : project.clientEmail;

      const newMessage = {

        projectId: projectId,

        senderEmail:
          currentUserEmail,

        receiverEmail:
          receiverEmail,

        message:
          message.trim()

      };

const response = await axios.post(
  `${API_URL}/api/messages`,
  newMessage,

        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );

      setMessages([
        ...messages,
        response.data
      ]);

      setMessage("");

    } catch (error) {

      console.log(
        "SEND MESSAGE ERROR:",
        error
      );

      alert(
        "Could not send message"
      );

    }
  };


  // ================= NO PROJECT =================

  if (!project) {

    return (
      <div className="dashboard-page">

        <main className="dashboard-container">

          <div className="empty-projects">

            <h3>
              No Project Selected
            </h3>

            <p>
              Please select a project before opening chat.
            </p>

            <button
              className="blue-button"
              onClick={() =>
                setPage("freelancerProjects")
              }
            >
              Back to My Projects
            </button>

          </div>

        </main>

      </div>
    );

  }


  const isClient =
    currentUserEmail === project.clientEmail;


  return (
    <div className="chat-page">

      {/* ================= NAVBAR ================= */}

      <header className="navbar">

        <div className="nav-brand">
          FreelanceConnect
        </div>

        <div className="nav-user">

          <div className="nav-page-title">
            Project Chat
          </div>

          <NotificationBell />

        </div>

      </header>


      {/* ================= MAIN ================= */}

      <main className="chat-container">

        {/* BACK */}

        <button
          className="back-button"
          onClick={() =>
            setPage(
              isClient
                ? "myProjects"
                : "freelancerProjects"
            )
          }
        >
          ← Back to My Projects
        </button>


        {/* ================= CHAT HEADER ================= */}

        <div className="professional-chat-header">

          <div className="chat-project-information">

            <span className="chat-project-label">
              PROJECT #{projectId}
            </span>

            <h1>
              {project.title}
            </h1>

            <p>
              {project.category}
              <span>•</span>
              📍 {project.location}
            </p>

          </div>

          <div className="professional-chat-status">
            <span></span>
            {project.status}
          </div>

        </div>


        {/* ================= PARTICIPANT ================= */}

        <div className="professional-chat-participant">

          <div className="chat-participant-avatar">

            {isClient
              ? project.freelancerEmail
                  ?.charAt(0)
                  ?.toUpperCase()
              : project.clientEmail
                  ?.charAt(0)
                  ?.toUpperCase()}

          </div>

          <div>

            <span>
              {isClient
                ? "FREELANCER"
                : "CLIENT"}
            </span>

            <strong>
              {isClient
                ? project.freelancerEmail
                : project.clientEmail}
            </strong>

          </div>

        </div>


        {/* ================= MESSAGES ================= */}

        <div className="professional-chat-messages">

          {messages.length === 0 ? (

            <div className="professional-chat-empty">

              <div className="professional-chat-empty-icon">
                💬
              </div>

              <h3>
                Start a conversation
              </h3>

              <p>
                Discuss project requirements,
                updates and delivery details here.
              </p>

            </div>

          ) : (

            messages.map(
              (msg) => {

                const isOwnMessage =
                  msg.senderEmail ===
                  currentUserEmail;

                return (
                  <div
                    key={msg.id}
                    className={
                      isOwnMessage
                        ? "professional-message own-message"
                        : "professional-message received-message"
                    }
                  >

                    <div className="professional-message-name">

                      {isOwnMessage
                        ? "You"
                        : isClient
                          ? "Freelancer"
                          : "Client"}

                    </div>

                    <div className="professional-message-bubble">

                      {msg.message}

                    </div>

                  </div>
                );

              }
            )

          )}

        </div>


        {/* ================= INPUT ================= */}

        <form
          className="professional-chat-input"
          onSubmit={handleSend}
        >

          <input
            type="text"
            placeholder="Write a message..."
            value={message}
            onChange={(event) =>
              setMessage(event.target.value)
            }
          />

          <button
            type="submit"
            disabled={!message.trim()}
          >
            Send
          </button>

        </form>

      </main>

    </div>
  );
}

export default Chat;