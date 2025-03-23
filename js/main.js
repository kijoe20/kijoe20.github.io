document.addEventListener("DOMContentLoaded", function () {
  // Update copyright year
  document.getElementById("current-year").innerText = new Date().getFullYear();

  // Initialize smooth scroll for anchor links
  initSmoothScroll();

  // Add scroll animation for elements
  initScrollAnimations();

  // Enable sticky header
  initStickyHeader();

  // Initialize mobile navigation
  initMobileNav();

  // Contact form handling
  initContactForm();
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth",
        });
      }
    });
  });
}

/**
 * Initialize scroll animations for elements
 */
function initScrollAnimations() {
  const sections = document.querySelectorAll("section");

  // Function to check if element is in viewport
  const isInViewport = function (element) {
    const rect = element.getBoundingClientRect();
    return (
      rect.top <=
      (window.innerHeight || document.documentElement.clientHeight) * 0.8
    );
  };

  // Add fade-in class to visible sections
  const handleScroll = function () {
    sections.forEach((section) => {
      if (isInViewport(section) && !section.classList.contains("appear")) {
        section.classList.add("appear");
      }
    });
  };

  // Add initial appear class to visible sections
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Check on initial load

  // Add CSS class for animation
  const style = document.createElement("style");
  style.textContent = `
    section {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    section.appear {
      opacity: 1;
      transform: translateY(0);
    }
  `;
  document.head.appendChild(style);
}

/**
 * Initialize contact form handling
 */
function initContactForm() {
  const contactForm = document.getElementById("contactForm");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();

      // In a real application, you would send the form data to a server
      const formData = {
        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        subject: document.getElementById("subject").value,
        message: document.getElementById("message").value,
      };

      console.log("Form submission:", formData);

      // Show success message (in a real app, this would happen after server response)
      alert(
        "Thank you for your message! This is a demo form and does not actually send messages yet."
      );

      // Reset form
      this.reset();
    });
  }
}

/**
 * Initialize a sticky header on scroll
 */
function initStickyHeader() {
  const header = document.querySelector("header");
  const mainContent = document.querySelector("main");
  const headerHeight = header.offsetHeight;
  let isSticky = false;

  window.addEventListener("scroll", function () {
    if (window.scrollY > headerHeight / 2 && !isSticky) {
      // Becoming sticky
      header.classList.add("sticky");
      mainContent.style.paddingTop = headerHeight + "px";
      isSticky = true;
    } else if (window.scrollY <= headerHeight / 2 && isSticky) {
      // Removing sticky
      header.classList.remove("sticky");
      mainContent.style.paddingTop = "0px";
      isSticky = false;
    }
  });

  // Handle initial state on page load
  if (window.scrollY > headerHeight / 2) {
    header.classList.add("sticky");
    mainContent.style.paddingTop = headerHeight + "px";
    isSticky = true;
  }
}

/**
 * Initialize mobile navigation
 */
function initMobileNav() {
  const mobileNavToggle = document.querySelector(".mobile-nav-toggle");
  const mainNav = document.querySelector(".main-nav");
  const body = document.body;
  const navLinks = document.querySelectorAll(".main-nav a");

  if (!mobileNavToggle) return;

  // Toggle navigation when the button is clicked
  mobileNavToggle.addEventListener("click", function () {
    mainNav.classList.toggle("show");
    body.classList.toggle("nav-open");

    // Change the icon based on state
    const icon = this.querySelector("i");
    if (mainNav.classList.contains("show")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close navigation when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", function () {
      if (window.innerWidth <= 768) {
        mainNav.classList.remove("show");
        body.classList.remove("nav-open");

        const icon = mobileNavToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");
      }
    });
  });

  // Close navigation when clicking outside
  document.addEventListener("click", function (e) {
    if (
      window.innerWidth <= 768 &&
      mainNav.classList.contains("show") &&
      !mainNav.contains(e.target) &&
      !mobileNavToggle.contains(e.target)
    ) {
      mainNav.classList.remove("show");
      body.classList.remove("nav-open");

      const icon = mobileNavToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });
}
