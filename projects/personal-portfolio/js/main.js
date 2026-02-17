console.log("Portfolio Loaded Successfully");

// Fade-in animation for projects on scroll
const projects = document.querySelectorAll('.project');

// Initialize projects with animation state
projects.forEach(project => {
  project.style.opacity = '0';
  project.style.transform = 'translateY(30px)';
  project.style.transition = 'all 0.6s ease-in-out';
});

// Trigger animation on scroll
window.addEventListener('scroll', () => {
  projects.forEach(project => {
    const rect = project.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      project.style.opacity = '1';
      project.style.transform = 'translateY(0)';
    }
  });
});