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
});

/**
 * Initialize smooth scrolling for anchor links
 */
function initSmoothScroll() {
  // Get all anchor links except those in the mobile navigation menu
  // This prevents conflicts with the special mobile navigation handling
  const anchors = Array.from(document.querySelectorAll('a[href^="#"]')).filter(
    (link) => !link.closest(".main-nav")
  );

  anchors.forEach((anchor) => {
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

  // Footer links should work the same way as well
  document.querySelectorAll('.footer-links a[href^="#"]').forEach((link) => {
    link.addEventListener("click", function (e) {
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

  // Ensure menu is hidden on page load
  mainNav.classList.remove("show");

  // Console log to debug
  console.log("Mobile nav initialized. Toggle button:", mobileNavToggle);

  // Toggle navigation when the button is clicked
  mobileNavToggle.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    // Force visibility before toggling class to ensure transitions work
    if (!mainNav.classList.contains("show")) {
      mainNav.style.visibility = "visible";
    }

    mainNav.classList.toggle("show");
    body.classList.toggle("nav-open");

    console.log(
      "Toggle clicked. Menu visible:",
      mainNav.classList.contains("show"),
      "Sticky header:",
      document.querySelector("header").classList.contains("sticky")
    );

    // Change the icon based on state
    const icon = this.querySelector("i");
    if (mainNav.classList.contains("show")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");

      // Add a small delay before hiding the menu completely
      setTimeout(() => {
        if (!mainNav.classList.contains("show")) {
          mainNav.style.visibility = "";
        }
      }, 300); // Match this with the CSS transition time
    }
  });

  // Helper function for closing the navigation
  const closeNavigation = function () {
    mainNav.classList.remove("show");
    body.classList.remove("nav-open");

    const icon = mobileNavToggle.querySelector("i");
    icon.classList.remove("fa-times");
    icon.classList.add("fa-bars");

    // Add a small delay before hiding the menu completely
    setTimeout(() => {
      if (!mainNav.classList.contains("show")) {
        mainNav.style.visibility = "";
      }
    }, 300); // Match this with the CSS transition time
  };

  // Close navigation when a link is clicked
  navLinks.forEach((link) => {
    // Remove any existing click handlers to prevent duplicates
    link.removeEventListener("click", navLinkHandler);

    // Add the click handler
    link.addEventListener("click", navLinkHandler);
  });

  // Handler function for navigation links
  function navLinkHandler(e) {
    if (window.innerWidth <= 768) {
      // Prevent the default scroll behavior
      e.preventDefault();
      e.stopPropagation();

      console.log("Nav link clicked in mobile view");

      // Get the target section
      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (!targetElement) {
        console.warn("Target element not found:", targetId);
        return;
      }

      // Close the menu first with a very short delay
      setTimeout(() => {
        closeNavigation();
        console.log("Navigation closed");

        // Then scroll to the section after the menu starts closing
        setTimeout(() => {
          console.log("Scrolling to:", targetId);
          window.scrollTo({
            top: targetElement.offsetTop - 80,
            behavior: "smooth",
          });
        }, 300);
      }, 50);
    }
  }

  // Close navigation when clicking outside
  document.addEventListener("click", function (e) {
    if (
      window.innerWidth <= 768 &&
      mainNav.classList.contains("show") &&
      !mainNav.contains(e.target) &&
      !mobileNavToggle.contains(e.target)
    ) {
      closeNavigation();
    }
  });
}
