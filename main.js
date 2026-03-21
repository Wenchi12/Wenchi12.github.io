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

// Menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

// Close menu when link clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    }
});

