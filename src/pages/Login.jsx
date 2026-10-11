import axios from "axios";

function Login({
  email,
  setEmail,
  password,
  setPassword,
  setPage
}) {

  const handleLogin = async () => {

    if (!email || !password) {

      alert(
        "Please enter email and password"
      );

      return;
    }

    try {

      const response = await axios.post(
        "http://localhost:8080/api/auth/login", 
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
 
      if ( 
        response.data.role === "FREELANCER" 
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
 
        alert( 
          "Invalid email or password" 
        ); 
 
      } else { 
 
        alert( 
          "Backend is not reachable" 
        ); 
      } 
    } 
  }; 
 
 
  return ( 
 
    <div className="screen"> 
 
      <div className="card login-card"> 
 
        <div className="brand"> 
          FreelanceConnect 
        </div> 
 
        <div className="tagline"> 
          Connect. Work. Grow. 
        </div> 
 
        <h1> 
          Welcome back 
        </h1> 
 
        <p className="description"> 
          Login to continue to FreelanceConnect 
        </p> 
 
        <div className="form"> 
 
          <label> 
            Email 
          </label> 
 
          <input 
            type="email" 
            placeholder="Enter email" 
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
 
          <button 
            className="blue-button" 
            onClick={ 
              handleLogin 
            } 
          > 
            Login 
          </button> 
 
          <p className="switch"> 
 
            Don't have an account? 
            {" "} 
 
            <span 
              onClick={() => 
                setPage("register") 
              } 
            > 
              Create Account 
            </span> 
 
          </p> 
 
        </div> 
 
      </div> 
 
    </div> 
  ); 
} 
 
export default Login;