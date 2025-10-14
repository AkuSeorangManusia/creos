export function AboutMe() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">About Me</h2>
      <div className="space-y-4">
        <p>
          <strong>Name:</strong> Muhammad Ahsan Sanadi
        </p>
        <p>
          Welcome to my interactive portfolio! This retro-styled operating system
          interface showcases my work and passion for creative web development.
        </p>
        <p>
          I enjoy building unique, engaging experiences that blend functionality
          with creativity. This portfolio is a testament to that philosophy.
        </p>
        <p>
          Feel free to explore the other windows to learn more about my projects
          and get in touch!
        </p>
      </div>
    </div>
  );
}

export function Projects() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Projects</h2>
      <div className="space-y-6">
        <div className="border-l-4 border-blue-500 pl-4">
          <h3 className="font-bold text-lg">Project 1</h3>
          <p className="text-gray-600 mt-1">
            An innovative web application showcasing modern design principles
            and cutting-edge technology.
          </p>
        </div>
        <div className="border-l-4 border-green-500 pl-4">
          <h3 className="font-bold text-lg">Project 2</h3>
          <p className="text-gray-600 mt-1">
            A creative solution to a complex problem, built with passion and attention to detail.
          </p>
        </div>
        <div className="border-l-4 border-purple-500 pl-4">
          <h3 className="font-bold text-lg">Project 3</h3>
          <p className="text-gray-600 mt-1">
            An experimental project exploring new technologies and interaction patterns.
          </p>
        </div>
      </div>
    </div>
  );
}

export function Contacts() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Contacts</h2>
      <div className="space-y-4">
        <p>
          I'd love to hear from you! Feel free to reach out through any of these channels:
        </p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">📧</span>
            <div>
              <strong>Email:</strong>
              <br />
              <span className="text-blue-600">your.email@example.com</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">💼</span>
            <div>
              <strong>LinkedIn:</strong>
              <br />
              <span className="text-blue-600">linkedin.com/in/yourprofile</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xl">🐙</span>
            <div>
              <strong>GitHub:</strong>
              <br />
              <span className="text-blue-600">github.com/yourusername</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
