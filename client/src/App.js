import './App.css';
import { useState, useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import axios from "axios";

function App() {
  const [projects, setProjects] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  const [newProject, setNewProject] = useState({
    title: "",
    tech: "",
    description: "",
    github: "",
    image: "",
  });

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    AOS.init({
      duration: 300,
      once: false,
      offset: 120,
      easing: "ease-in-out",
    });

    fetchProjects();

    const token = localStorage.getItem("token");
    if (token === "secret123") {
      setIsAdmin(true);
    }
  }, []);

  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const res = await axios.post("http://localhost:5000/api/login", loginData);

    localStorage.setItem("token", res.data.token);
    setIsAdmin(true);
    setShowLogin(false);
    alert("Login success ✅");
  } catch (err) {
    alert("Wrong username or password ❌");
  }
};
  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAdmin(false);
    alert("Logged out ✅");
  };

  const handleProjectChange = (e) => {
    setNewProject({ ...newProject, [e.target.name]: e.target.value });
  };

  const handleAddProject = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "http://localhost:5000/api/projects",
        newProject,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Project added ✅");

      setNewProject({
        title: "",
        tech: "",
        description: "",
        github: "",
        image: "",
      });

      fetchProjects();
    } catch (err) {
      console.log(err);
      alert("Unauthorized or server error ❌");
    }
  };

  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");

    try {
      await axios.delete(
        `http://localhost:5000/api/projects/${id}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );

      alert("Deleted ✅");
      setProjects(projects.filter((p) => p._id !== id));
    } catch (err) {
      console.log(err);
      alert("Unauthorized or delete error ❌");
    }
  };

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = -(y - centerY) / 10;
    const rotateY = (x - centerX) / 10;

    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    card.style.boxShadow = `${rotateY * 2}px ${-rotateX * 2}px 30px #6ee7ff`;
  };

  const handleMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = "rotateX(0) rotateY(0) scale(1)";
    card.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";
  };

  return (
    <div>
      {/* HERO */}
      <section className="hero" id="home">
        <nav className="top-nav">
          <div className="socials">
            <a href="https://github.com/raji" target="_blank" rel="noopener noreferrer">
              GH
            </a>

            <a href="https://linkedin.com/in/raji" target="_blank" rel="noopener noreferrer">
              IN
            </a>

            <a href="mailto:raji@gmail.com">
              ✉
            </a>
          </div>

          <div className="menu">
            <a href="#about">About</a>
            <a href="#projects">Projects</a>
            <a href="#skills">Skills</a>
          </div>
        </nav>

        <div className="hero-content">
          <h3>Hi, I'm</h3>
          <h1>Rajalakshmi</h1>
          <p>MERN Stack Developer</p>
        </div>
      </section>

      <a href="#home" className="top-link">Back to top</a>

      {/* ABOUT */}
      <section id="about" className="about-section" data-aos="fade-up">
        <div className="about-card" data-aos="fade-right">
          <div className="profile-img">R</div>
          <p>
            Hi, I'm Rajalakshmi, a B.Tech IT student passionate about
            web development, Java, MERN stack and problem solving.
          </p>
        </div>

        <div className="timeline" data-aos="fade-left">
          <div className="timeline-item">
            <h3>B.Tech IT</h3>
            <p>Pre-final year student</p>
          </div>

          <div className="timeline-item">
            <h3>MERN Stack</h3>
            <p>Portfolio Website Project</p>
          </div>

          <div className="timeline-item">
            <h3>Java</h3>
            <p>OOP, DSA, Spring Boot basics</p>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="projects-section" data-aos="fade-up">
        {projects.map((p, index) => (
          <div
            className="premium-card"
            key={p._id || index}
            data-aos="zoom-in"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="card-top">
              <h2>{p.title}</h2>
            </div>

            <div className="card-image">
              {p.image ? (
                <img src={p.image} alt="project" />
              ) : (
                <div className="no-img">{p.tech}</div>
              )}
            </div>

            {isAdmin && (
              <button
                onClick={() => handleDelete(p._id)}
                className="delete-btn"
              >
                Delete
              </button>
            )}

            <div className="card-overlay">
              <p>{p.description}</p>

              {p.github && (
                <a href={p.github} target="_blank" rel="noreferrer">
                  <button>View Code</button>
                </a>
              )}
            </div>
          </div>
        ))}
      </section>

      {/* ADMIN LOGIN */}
      {!isAdmin ? (
  <button className="admin-login-icon" onClick={() => setShowLogin(true)}>
    🔐 Admin
  </button>
) : (
  <button className="admin-login-icon logout-small" onClick={handleLogout}>
    Logout
  </button>
)}

{showLogin && !isAdmin && (
  <div className="login-popup">
    <form onSubmit={handleLogin} className="login-modal">
      <button
        type="button"
        className="close-btn"
        onClick={() => setShowLogin(false)}
      >
        ×
      </button>

      <h2>Admin Login</h2>

     
      <input
        name="username"
        placeholder="Username"
        value={loginData.username}
        onChange={handleLoginChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={loginData.password}
        onChange={handleLoginChange}
        required
      />

      <button type="submit">Login</button>
    </form>
  </div>
)}


      {/* ADMIN PANEL */}
      {isAdmin && (
        <section className="admin-section" data-aos="fade-up">
          <div
            className="admin-container"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <h2>Add New Project 🚀</h2>

            <form onSubmit={handleAddProject} className="admin-form">
              <div className="input-group">
                <input
                  name="title"
                  placeholder=" "
                  value={newProject.title}
                  onChange={handleProjectChange}
                  required
                />
                <label>Project Title</label>
              </div>

              <div className="input-group">
                <input
                  name="tech"
                  placeholder=" "
                  value={newProject.tech}
                  onChange={handleProjectChange}
                  required
                />
                <label>Technology Used</label>
              </div>

              <div className="input-group">
                <input
                  name="image"
                  placeholder=" "
                  value={newProject.image}
                  onChange={handleProjectChange}
                />
                <label>Image URL</label>
              </div>

              <div className="input-group">
                <textarea
                  name="description"
                  placeholder=" "
                  value={newProject.description}
                  onChange={handleProjectChange}
                  required
                />
                <label>Description</label>
              </div>

              <div className="input-group">
                <input
                  name="github"
                  placeholder=" "
                  value={newProject.github}
                  onChange={handleProjectChange}
                />
                <label>GitHub Link</label>
              </div>

              <button type="submit" className="add-btn">
                ➕ Add Project
              </button>

              <button type="button" onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </form>
          </div>
        </section>
      )}

      {/* SKILLS */}
      <section id="skills" className="skills-section" data-aos="fade-up">
        <div className="skills-grid">
          <div className="skill-box">
            <h3>Frontend</h3>
            <p>⚛ React</p>
            <p>🌐 HTML</p>
            <p>🎨 CSS</p>
            <p>🟨 JavaScript</p>
          </div>

          <div className="skill-box">
            <h3>Backend</h3>
            <p>🌱 Spring Boot</p>
            <p>🟢 Node.js</p>
            <p>🚀 Express.js</p>
            <p>🍃 MongoDB</p>
          </div>

          <div className="skill-box">
            <h3>Object-Oriented</h3>
            <p>☕ Java</p>
            <p>📘 OOP</p>
            <p>🧠 DSA</p>
          </div>

          <div className="skill-box">
            <h3>Tools</h3>
            <p>🔧 Git</p>
            <p>💻 VS Code</p>
            <p>🐧 Linux</p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="contact-section" data-aos="fade-up">
        <h2>Contact Me</h2>

        <div className="contact-card" data-aos="zoom-in">
          <div className="contact-item">
            <span>📧</span>
            <a href="mailto:rajalakshmi@gmail.com">
              rajalakshmi@gmail.com
            </a>
          </div>

          <div className="contact-item">
            <span>📞</span>
            <a href="tel:+919876543210">
              +91 98765 43210
            </a>
          </div>

          <div className="contact-socials">
            <a href="https://github.com/raji" target="_blank" rel="noreferrer">GH</a>
            <a href="https://linkedin.com/in/raji" target="_blank" rel="noreferrer">IN</a>
          </div>
        </div>
      </section>

      <footer>
        <h3>Rajalakshmi</h3>
      </footer>
    </div>
  );
}

export default App;