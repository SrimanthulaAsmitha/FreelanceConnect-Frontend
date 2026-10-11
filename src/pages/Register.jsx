function Register({
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  role,
  setRole,
  setPage,
  handleRegister
}) {

  return (

    <div className="screen">

      <div className="card register-card">

        <div className="brand">
          FreelanceConnect
        </div>

        <div className="tagline">
          Connect. Work. Grow.
        </div>


        <h1>
          Create your account
        </h1>

        <p className="description">
          Join our local freelance community
        </p>


        <div className="form">

          <label>
            Full Name
          </label>

          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) =>
              setName(
                e.target.value
              )
            }
          />


          <label>
            Email
          </label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
          />


          <label>
            Password
          </label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
          />


          <div className="iam">
            I am a
          </div>


          <div className="roles">

            <div
              className={`role ${
                role === "business"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setRole(
                  "business"
                )
              }
            >

              <div className="emoji">
                💼
              </div>

              <div>

                <strong>
                  Business
                  <br />
                  Owner
                </strong>

                <small>
                  Post projects & hire
                </small>

              </div>

            </div>


            <div
              className={`role ${
                role === "freelancer"
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                setRole(
                  "freelancer"
                )
              }
            >

              <div className="emoji">
                👨‍💻
              </div>

              <div>

                <strong>
                  Freelancer
                </strong>

                <small>
                  Find projects & work
                </small>

              </div>

            </div>

          </div>


          <button
            className="blue-button"
            onClick={
              handleRegister
            }
          >
            Create Account
          </button>


          <p className="switch">

            Already have an account?
            {" "}

            <span
              onClick={() =>
                setPage("login")
              }
            >
              Login
            </span>

          </p>

        </div>

      </div>

    </div>
  );
}

export default Register;