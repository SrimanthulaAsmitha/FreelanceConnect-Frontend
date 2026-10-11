import { useEffect, useState } from "react";
import axios from "axios";
import NotificationBell from "../components/NotificationBell";

function FreelancerProfile({ onBack }) {

const [profile, setProfile] = useState({
name: "",
bio: "",
skills: "",
experience: "",
education: "",
location: "",
hoursToWork: ""
});

const [loading, setLoading] = useState(true);
const [saving, setSaving] = useState(false);

useEffect(() => {
loadProfile();
}, []);

const loadProfile = async () => {

try {

  const token =
    localStorage.getItem("token");

  if (!token) {
    alert("Please login again");
    return;
  }

  const response = await axios.get(
    "http://localhost:8080/api/profile",
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  setProfile({
    name: response.data.name || "",
    bio: response.data.bio || "",
    skills: response.data.skills || "",
    experience:
      response.data.experience || "",
    education:
      response.data.education || "",
    location:
      response.data.location || "",
    hoursToWork:
      response.data.hoursToWork || ""
  });

} catch (error) {

  console.log(
    "PROFILE LOAD ERROR:",
    error
  );

  if (
    error.response?.status === 401 ||
    error.response?.status === 403
  ) {
    alert(
      "Session expired. Please login again."
    );
  }

} finally {

  setLoading(false);

}

};

const handleChange = (event) => {

setProfile({
  ...profile,
  [event.target.name]:
    event.target.value
});

};

const handleSave = async (event) => {

event.preventDefault();

try {

  const token =
    localStorage.getItem("token");

  if (!token) {
    alert("Please login again");
    return;
  }

  setSaving(true);

  await axios.put(
    "http://localhost:8080/api/profile",
    profile,
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  // Reload the saved profile details
  const response = await axios.get(
    "http://localhost:8080/api/profile",
    {
      headers: {
        Authorization:
          `Bearer ${token}`
      }
    }
  );

  setProfile({
    name: response.data.name || "",
    bio: response.data.bio || "",
    skills: response.data.skills || "",
    experience:
      response.data.experience || "",
    education:
      response.data.education || "",
    location:
      response.data.location || "",
    hoursToWork:
      response.data.hoursToWork || ""
  });

  alert(
    "Profile saved successfully!"
  );

} catch (error) {

  console.log(
    "PROFILE SAVE ERROR:",
    error
  );

  if (
    error.response?.status === 401 ||
    error.response?.status === 403
  ) {
    alert(
      "Session expired. Please login again."
    );
  } else {
    alert(
      "Could not save profile."
    );
  }

} finally {

  setSaving(false);

}

};

if (loading) {
return ( <div className="dashboard-page">

    <main className="dashboard-container">

      <h2>
        Loading Profile...
      </h2>

    </main>

  </div>
);

}

return (

<div className="dashboard-page">

  {/* ================= NAVBAR ================= */}

  <header className="navbar">

    <div className="nav-brand">
      FreelanceConnect
    </div>

    <div className="nav-user">

      <span>
        Freelancer Profile
      </span>

      <NotificationBell />

    </div>

  </header>


  {/* ================= MAIN ================= */}

  <main className="dashboard-container">

    {/* ================= PROFESSIONAL BACK BUTTON ================= */}

    <button
      className="freelancer-profile-back-button"
      onClick={onBack}
    >
      <span>←</span>
      Back to Dashboard
    </button>


    {/* ================= PROFESSIONAL HEADER ================= */}

    <section className="freelancer-profile-header-content">

      <span className="freelancer-profile-eyebrow">
        FREELANCER WORKSPACE
      </span>

      <h1>
        My Profile
      </h1>

      <p>
        Build your professional freelancer profile
        and help clients understand your skills.
        Highlight your experience, showcase your strengths,
        and make your profile stand out to potential clients.
      </p>

    </section>


    {/* ================= PROFILE CARD ================= */}

    <div className="professional-profile-card">

      <div className="profile-card-header">

        <div className="profile-avatar">

          {profile.name
            ? profile.name
                .charAt(0)
                .toUpperCase()
            : "F"}

        </div>

        <div>

          <span className="profile-label">
            FREELANCER PROFILE
          </span>

          <h2>
            {profile.name || "Your Name"}
          </h2>

          <p>
            {profile.location ||
              "Add your location"}
          </p>

        </div>

      </div>


      <div className="profile-divider"></div>


      {/* ================= FORM ================= */}

      <form
        className="professional-profile-form"
        onSubmit={handleSave}
      >

        <div className="profile-section-title">
          <h3>
            Personal Information
          </h3>

          <p>
            Tell clients a little about yourself.
          </p>
        </div>


        <div className="profile-form-grid">

          <div className="profile-field">

            <label>
              Full Name
            </label>

            <input
              type="text"
              name="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />

          </div>


          <div className="profile-field">

            <label>
              Location
            </label>

            <input
              type="text"
              name="location"
              value={profile.location}
              onChange={handleChange}
              placeholder="Hyderabad"
            />

          </div>

        </div>


        <div className="profile-field">

          <label>
            Professional Bio
          </label>

          <textarea
            name="bio"
            value={profile.bio}
            onChange={handleChange}
            placeholder="Tell clients about yourself, your strengths and the type of work you do."
            rows="5"
          />

        </div>


        <div className="profile-divider"></div>


        <div className="profile-section-title">

          <h3>
            Skills & Experience
          </h3>

          <p>
            Highlight your professional background.
          </p>

        </div>


        <div className="profile-field">

          <label>
            Skills
          </label>

          <input
            type="text"
            name="skills"
            value={profile.skills}
            onChange={handleChange}
            placeholder="Java, React, SQL"
          />

        </div>


        <div className="profile-form-grid">

          <div className="profile-field">

            <label>
              Experience
            </label>

            <input
              type="text"
              name="experience"
              value={profile.experience}
              onChange={handleChange}
              placeholder="Example: 1 year"
            />

          </div>


          <div className="profile-field">

            <label>
              Education
            </label>

            <input
              type="text"
              name="education"
              value={profile.education}
              onChange={handleChange}
              placeholder="B.Tech CSE"
            />

          </div>

        </div>


        <div className="profile-divider"></div>


        <div className="profile-section-title">

          <h3>
            Work Preferences
          </h3>

          <p>
            Let clients know your preferred working hours.
          </p>

        </div>


        <div className="profile-field">

          <label>
            Hours to Work
          </label>

          <input
            type="text"
            name="hoursToWork"
            value={profile.hoursToWork}
            onChange={handleChange}
            placeholder="Example: 4-6 hours per day"
          />

        </div>


        {/* ================= SAVE ================= */}

        <div className="profile-save-area">

          <button
            type="submit"
            className="post-project-button"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </div>

      </form>

    </div>

  </main>
</div>

);
}

export default FreelancerProfile;
