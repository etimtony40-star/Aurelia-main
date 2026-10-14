
"use strict";

// --------------------------------------------------
// AURELIA — HOTEL WEBSITE INTERACTIONS
// --------------------------------------------------

const rooms = [
  {
    id: 1,
    name: "The Signature Suite",
    category: "suite",
    label: "SIGNATURE COLLECTION",
    price: 285000,
    rating: 4.98,
    reviews: 124,
    guests: 2,
    size: "65 m²",
    badge: "MOST LOVED",
    description: "A serene retreat with sculptural interiors, a private lounge, and considered details.",
    amenities: ["King bed", "Private lounge", "Rain shower"],
    image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 2,
    name: "The Grand Residence",
    category: "suite",
    label: "GRAND COLLECTION",
    price: 420000,
    rating: 4.96,
    reviews: 89,
    guests: 4,
    size: "110 m²",
    badge: "EXTRA SPACE",
    description: "Generous living, beautifully layered textures, and room to settle in together.",
    amenities: ["2 bedrooms", "Living room", "Bathtub"],
    image: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 3,
    name: "The Garden Villa",
    category: "villa",
    label: "PRIVATE COLLECTION",
    price: 560000,
    rating: 5.0,
    reviews: 57,
    guests: 4,
    size: "145 m²",
    badge: "PRIVATE ESCAPE",
    description: "A secluded hideaway with lush surroundings and a seamless indoor-outdoor feel.",
    amenities: ["Private terrace", "2 bedrooms", "Garden"],
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 4,
    name: "The Deluxe Room",
    category: "deluxe",
    label: "ESSENTIAL COLLECTION",
    price: 165000,
    rating: 4.85,
    reviews: 206,
    guests: 2,
    size: "38 m²",
    badge: "",
    description: "Understated elegance, a restful king bed, and everything you need to unwind.",
    amenities: ["King bed", "Work desk", "Rain shower"],
    image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 5,
    name: "The Premier Suite",
    category: "suite",
    label: "PREMIER COLLECTION",
    price: 345000,
    rating: 4.94,
    reviews: 103,
    guests: 3,
    size: "82 m²",
    badge: "",
    description: "A generous suite with elegant finishes, a quiet sitting area, and a deep-soaking tub.",
    amenities: ["King bed", "Sitting area", "Soaking tub"],
    image: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85"
  },
  {
    id: 6,
    name: "The Horizon Villa",
    category: "villa",
    label: "EXCLUSIVE COLLECTION",
    price: 680000,
    rating: 4.99,
    reviews: 42,
    guests: 6,
    size: "180 m²",
    badge: "ULTIMATE ESCAPE",
    description: "A spacious private retreat designed for unhurried mornings and memorable evenings.",
    amenities: ["3 bedrooms", "Private pool", "Outdoor lounge"],
    image: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1000&q=85"
  }
];

// --------------------------------------------------
// ELEMENTS AND STATE
// --------------------------------------------------

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];

const roomsGrid = $("#roomsGrid");
const emptyState = $("#emptyState");
const savedCount = $("#savedCount");
const favoritesToggle = $("#favoritesToggle");
const sortRooms = $("#sortRooms");
const filterTabs = $("#filterTabs");

let activeFilter = "all";
let showingFavorites = false;
let currentRoomId = null;
let currentGalleryIndex = 0;
let toastTimer;
const savedRooms = new Set();

const money = amount =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0
  }).format(amount);

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function getRoom(id) {
  return rooms.find(room => room.id === Number(id));
}

// --------------------------------------------------
// ROOM CARDS
// --------------------------------------------------

function renderRooms() {
  let visibleRooms = rooms.filter(room => {
    const matchesCategory =
      activeFilter === "all" || room.category === activeFilter;

    const matchesFavorites =
      !showingFavorites || savedRooms.has(room.id);

    return matchesCategory && matchesFavorites;
  });

  switch (sortRooms.value) {
    case "low":
      visibleRooms.sort((a, b) => a.price - b.price);
      break;
    case "high":
      visibleRooms.sort((a, b) => b.price - a.price);
      break;
    case "rating":
      visibleRooms.sort((a, b) => b.rating - a.rating);
      break;
    default:
      visibleRooms.sort((a, b) => a.id - b.id);
  }

  roomsGrid.innerHTML = visibleRooms.map((room, index) => `
    <article class="room-card" style="animation-delay:${index * 60}ms">
      <div class="room-photo">
        <img
          src="${room.image}"
          alt="${escapeHTML(room.name)}"
          loading="lazy"
        >

        ${room.badge ? `
          <span class="room-badge">${escapeHTML(room.badge)}</span>
        ` : ""}

        <button
          class="room-gallery"
          data-gallery="${room.id}"
          aria-label="View ${escapeHTML(room.name)} image"
          title="View image"
        >⤢</button>

        <button
          class="room-heart ${savedRooms.has(room.id) ? "saved" : ""}"
          data-favorite="${room.id}"
          aria-label="${savedRooms.has(room.id) ? "Remove from" : "Add to"} saved rooms"
          aria-pressed="${savedRooms.has(room.id)}"
          title="Save room"
        >${savedRooms.has(room.id) ? "♥" : "♡"}</button>
      </div>

      <div class="room-info">
        <span class="room-category">${escapeHTML(room.label)}</span>
        <h3>${escapeHTML(room.name)}</h3>

        <div class="room-rating">
          ★★★★★ <span>${room.rating.toFixed(2)} (${room.reviews} reviews)</span>
        </div>

        <p class="room-description">${escapeHTML(room.description)}</p>

        <div class="room-amenities">
          <span class="amenity">♧ ${room.size}</span>
          <span class="amenity">♙ Up to ${room.guests} guests</span>
          ${room.amenities.slice(0, 2).map(item => `
            <span class="amenity">${escapeHTML(item)}</span>
          `).join("")}
        </div>

        <div class="room-footer">
          <div class="room-price">
            <small>Starting from</small>
            <strong>${money(room.price)} <span>/ night</span></strong>
          </div>

          <button class="btn btn-outline room-book" data-book="${room.id}">
            View & book <span>→</span>
          </button>
        </div>
      </div>
    </article>
  `).join("");

  emptyState.hidden = visibleRooms.length > 0;
  roomsGrid.hidden = visibleRooms.length === 0;

  savedCount.textContent = savedRooms.size;
  favoritesToggle.setAttribute("aria-pressed", String(showingFavorites));
  favoritesToggle.classList.toggle("active", showingFavorites);
}

// Category filtering
filterTabs.addEventListener("click", event => {
  const button = event.target.closest("[data-filter]");
  if (!button) return;

  activeFilter = button.dataset.filter;

  $$(".filter-btn", filterTabs).forEach(item => {
    item.classList.toggle("active", item === button);
  });

  renderRooms();
});

// Sorting
sortRooms.addEventListener("change", renderRooms);

// Favorites
favoritesToggle.addEventListener("click", () => {
  showingFavorites = !showingFavorites;

  if (showingFavorites && savedRooms.size === 0) {
    showToast("You haven't saved any rooms yet. Tap ♡ on a room to save it.");
  }

  favoritesToggle.querySelector("span").textContent =
    showingFavorites ? "All rooms" : "Saved";

  renderRooms();
});

// Room card actions
roomsGrid.addEventListener("click", event => {
  const favoriteButton = event.target.closest("[data-favorite]");
  const bookingButton = event.target.closest("[data-book]");
  const galleryButton = event.target.closest("[data-gallery]");

  if (favoriteButton) {
    const id = Number(favoriteButton.dataset.favorite);

    if (savedRooms.has(id)) {
      savedRooms.delete(id);
      showToast("Room removed from your saved list.");
    } else {
      savedRooms.add(id);
      showToast("Room added to your saved list.");
    }

    renderRooms();
    return;
  }

  if (bookingButton) {
    openBooking(bookingButton.dataset.book);
    return;
  }

  if (galleryButton) {
    openGallery(galleryButton.dataset.gallery);
  }
});

$("#resetFilters").addEventListener("click", () => {
  activeFilter = "all";
  showingFavorites = false;

  $$(".filter-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  favoritesToggle.querySelector("span").textContent = "Saved";
  renderRooms();
});

// --------------------------------------------------
// DATE HELPERS AND SEARCH
// --------------------------------------------------

function localDateString(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDays(dateString, days) {
  const date = new Date(`${dateString}T12:00:00`);
  date.setDate(date.getDate() + days);
  return localDateString(date);
}

function numberOfNights(checkIn, checkOut) {
  if (!checkIn || !checkOut) return 0;

  const start = new Date(`${checkIn}T12:00:00`);
  const end = new Date(`${checkOut}T12:00:00`);

  return Math.round((end - start) / 86400000);
}

function validateDates(checkIn, checkOut) {
  const today = localDateString();

  if (!checkIn || !checkOut) {
    return "Please select both check-in and check-out dates.";
  }

  if (checkIn < today) {
    return "Check-in cannot be in the past.";
  }

  if (checkOut <= checkIn) {
    return "Check-out must be after check-in.";
  }

  return "";
}

const searchCheckIn = $("#searchCheckIn");
const searchCheckOut = $("#searchCheckOut");

function setDefaultDates() {
  const today = localDateString();
  const tomorrow = addDays(today, 1);

  searchCheckIn.min = today;
  searchCheckIn.value = today;
  searchCheckOut.min = tomorrow;
  searchCheckOut.value = tomorrow;

  $("#bookingCheckIn").min = today;
  $("#bookingCheckOut").min = tomorrow;
}

searchCheckIn.addEventListener("change", () => {
  const nextDay = addDays(searchCheckIn.value || localDateString(), 1);
  searchCheckOut.min = nextDay;

  if (!searchCheckOut.value || searchCheckOut.value <= searchCheckIn.value) {
    searchCheckOut.value = nextDay;
  }
});

searchCheckOut.addEventListener("change", () => {
  searchCheckIn.max = searchCheckOut.value || "";
});

$("#searchForm").addEventListener("submit", event => {
  event.preventDefault();

  const error = validateDates(searchCheckIn.value, searchCheckOut.value);

  if (error) {
    showToast(error);
    return;
  }

  const guests = Number($("#searchGuests").value);
  const suitableRoom = rooms.find(room => room.guests >= guests);

  if (!suitableRoom) {
    showToast("No room currently accommodates that number of guests.");
    return;
  }

  activeFilter = "all";
  showingFavorites = false;

  $$(".filter-btn").forEach(button => {
    button.classList.toggle("active", button.dataset.filter === "all");
  });

  renderRooms();

  $("#rooms").scrollIntoView({ behavior: "smooth" });

  openBooking(suitableRoom.id, {
    checkIn: searchCheckIn.value,
    checkOut: searchCheckOut.value,
    guests
  });
});

// --------------------------------------------------
// BOOKING MODAL
// --------------------------------------------------

const bookingModal = $("#bookingModal");
const bookingForm = $("#bookingForm");
const bookingCheckIn = $("#bookingCheckIn");
const bookingCheckOut = $("#bookingCheckOut");
const bookingGuests = $("#bookingGuests");
const bookingError = $("#bookingError");

function openBooking(id, options = {}) {
  const room = getRoom(id);
  if (!room) return;

  currentRoomId = room.id;

  $("#bookingRoomId").value = room.id;
  $("#modalTitle").textContent = "Reserve your stay.";
  $("#modalRoomName").textContent =
    `${room.name} · ${money(room.price)} per night`;
  $("#modalImage").style.backgroundImage = `url("${room.image}")`;

  const today = localDateString();

  bookingCheckIn.value = options.checkIn || today;
  bookingCheckOut.value =
    options.checkOut || addDays(bookingCheckIn.value, 1);

  bookingCheckIn.min = today;
  bookingCheckOut.min = addDays(bookingCheckIn.value, 1);
  bookingGuests.value = String(
    Math.min(options.guests || 2, room.guests)
  );

  $("#bookingName").value = "";
  $("#bookingEmail").value = "";
  bookingError.textContent = "";

  updateBookingTotal();

  bookingModal.classList.add("open");
  bookingModal.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");

  setTimeout(() => $("#bookingName").focus(), 100);
}

function closeBooking() {
  bookingModal.classList.remove("open");
  bookingModal.setAttribute("aria-hidden", "true");
  document.body.classList.remove("modal-open");
  currentRoomId = null;
}

$("#closeModal").addEventListener("click", closeBooking);

bookingModal.addEventListener("click", event => {
  if (event.target.matches("[data-close-modal]")) closeBooking();
});

bookingCheckIn.addEventListener("change", () => {
  const nextDay = addDays(bookingCheckIn.value || localDateString(), 1);
  bookingCheckOut.min = nextDay;

  if (!bookingCheckOut.value || bookingCheckOut.value <= bookingCheckIn.value) {
    bookingCheckOut.value = nextDay;
  }

  updateBookingTotal();
});

bookingCheckOut.addEventListener("change", updateBookingTotal);

function updateBookingTotal() {
  const room = getRoom(currentRoomId);
  const nights = numberOfNights(
    bookingCheckIn.value,
    bookingCheckOut.value
  );

  $("#nightCount").textContent = Math.max(0, nights);
  $("#nightRate").textContent = room ? money(room.price) : money(0);
  $("#bookingTotal").textContent =
    room && nights > 0 ? money(room.price * nights) : money(0);
}

bookingForm.addEventListener("submit", event => {
  event.preventDefault();

  const room = getRoom($("#bookingRoomId").value);
  if (!room) {
    bookingError.textContent = "Please choose a room first.";
    return;
  }

  const dateError = validateDates(
    bookingCheckIn.value,
    bookingCheckOut.value
  );

  if (dateError) {
    bookingError.textContent = dateError;
    return;
  }

  const guests = Number(bookingGuests.value);

  if (guests > room.guests) {
    bookingError.textContent =
      `This room accommodates up to ${room.guests} guests. Please select another room or reduce the guest count.`;
    return;
  }

  const nights = numberOfNights(
    bookingCheckIn.value,
    bookingCheckOut.value
  );

  const name = $("#bookingName").value.trim();
  const email = $("#bookingEmail").value.trim();

  if (name.length < 2 || !email) {
    bookingError.textContent = "Please enter your name and email address.";
    return;
  }

  // This is a front-end demonstration. No reservation is sent to a server.
  const reference = `AUR-${Date.now().toString().slice(-8)}`;

  closeBooking();

  showToast(
    `Demo request ${reference}: ${room.name}, ${nights} night(s), ${money(room.price * nights)}. Your request has been submitted.`
  );
});

// --------------------------------------------------
// ROOM IMAGE GALLERY
// --------------------------------------------------

const lightbox = $("#lightbox");
const lightboxImage = $("#lightboxImage");
const lightboxCaption = $("#lightboxCaption");

function openGallery(id) {
  const index = rooms.findIndex(room => room.id === Number(id));
  if (index < 0) return;

  currentGalleryIndex = index;
  updateGalleryImage();

  lightbox.classList.add("open");
  lightbox.setAttribute("aria-hidden", "false");
}

function updateGalleryImage() {
  const room = rooms[currentGalleryIndex];

  lightboxImage.src = room.image;
  lightboxImage.alt = room.name;
  lightboxCaption.textContent = `${room.name} · ${room.size}`;
}

function closeGallery() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
}

function moveGallery(direction) {
  currentGalleryIndex =
    (currentGalleryIndex + direction + rooms.length) % rooms.length;

  updateGalleryImage();
}

$("#closeLightbox").addEventListener("click", closeGallery);
$("#prevImage").addEventListener("click", () => moveGallery(-1));
$("#nextImage").addEventListener("click", () => moveGallery(1));

lightbox.addEventListener("click", event => {
  if (event.target === lightbox) closeGallery();
});

// --------------------------------------------------
// THEME TOGGLE
// --------------------------------------------------

const themeToggle = $("#themeToggle");

themeToggle.addEventListener("click", () => {
  const isLight = document.documentElement.classList.toggle("light-theme");

  document.documentElement.classList.toggle("dark-theme", !isLight);
  themeToggle.textContent = isLight ? "☾" : "☼";
  themeToggle.setAttribute(
    "aria-label",
    isLight ? "Switch to dark theme" : "Switch to light theme"
  );
});

// --------------------------------------------------
// MOBILE NAVIGATION
// --------------------------------------------------

const menuToggle = $("#menuToggle");
const nav = $("#nav");

function closeMenu() {
  nav.classList.remove("open");
  menuToggle.setAttribute("aria-expanded", "false");
  menuToggle.setAttribute("aria-label", "Open navigation");
}

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");

  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
});

$$(".nav-link, .main-nav > .btn").forEach(link => {
  link.addEventListener("click", closeMenu);
});

// --------------------------------------------------
// HEADER, PROGRESS BAR, AND ACTIVE NAV
// --------------------------------------------------

const header = $("#header");
const progress = $("#progress");
const navLinks = $$(".nav-link");

function updateScrollUI() {
  const scrollable =
    document.documentElement.scrollHeight - window.innerHeight;

  const percentage = scrollable > 0
    ? (window.scrollY / scrollable) * 100
    : 0;

  progress.style.width = `${percentage}%`;
  header.classList.toggle("scrolled", window.scrollY > 30);
}

window.addEventListener("scroll", updateScrollUI, { passive: true });
updateScrollUI();

const sections = $$("main section[id]");

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      navLinks.forEach(link => {
        link.classList.toggle(
          "active",
          link.getAttribute("href") === `#${entry.target.id}`
        );
      });
    });
  }, { rootMargin: "-35% 0px -55% 0px" });

  sections.forEach(section => sectionObserver.observe(section));
}

// --------------------------------------------------
// NEWSLETTER DEMO
// --------------------------------------------------

$("#newsletterForm").addEventListener("submit", event => {
  event.preventDefault();

  const email = $("#newsletterEmail").value.trim();

  if (!email) {
    showToast("Please enter your email address.");
    return;
  }

  // Connect a newsletter provider or backend to save real subscriptions.
  showToast("Thank you for your interest in Aurelia. Newsletter signup is a demo.");
  event.currentTarget.reset();
});

// --------------------------------------------------
// TOAST NOTIFICATIONS AND KEYBOARD SUPPORT
// --------------------------------------------------

function showToast(message) {
  const toast = $("#toast");

  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 4500);
}

document.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    closeBooking();
    closeGallery();
    closeMenu();
  }

  if (lightbox.classList.contains("open")) {
    if (event.key === "ArrowLeft") moveGallery(-1);
    if (event.key === "ArrowRight") moveGallery(1);
  }
});


$("#year").textContent = new Date().getFullYear();

setDefaultDates();
renderRooms();


/* =========================================
   AURELIA — PREMIUM SCROLL REVEALS
   Safe addition: keeps existing interactions
   ========================================= */

(() => {
  "use strict";

  // Respect accessibility preferences.
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    return;
  }

  const revealGroups = [
    {
      selector: [
        ".section-top",
        ".story-copy",
        ".contact-intro",
        ".newsletter-inner > div",
        ".quote-section blockquote"
      ].join(","),
      effect: "reveal-from-left"
    },
    {
      selector: [
        ".section-description",
        ".experience-content",
        ".contact-details",
        ".quote-section > p"
      ].join(","),
      effect: "reveal-from-right"
    },
    {
      selector: [
        ".story-visual",
        ".experience-image",
        ".contact-visual",
        ".contact-section .contact-details > *"
      ].join(","),
      effect: "reveal-zoom"
    },
    {
      selector: [
        ".booking-strip",
        ".story-caption",
        ".experience-list > div",
        ".contact-section .eyebrow",
        ".newsletter-form",
        ".quote-section .quote-mark"
      ].join(","),
      effect: "reveal-from-bottom"
    }
  ];

  // Hero heading and fixed header are deliberately excluded.
  // This prevents the hero text from blinking during theme changes.
  const excluded = [
    ".hero",
    ".hero-content",
    ".hero h1",
    ".site-header",
    ".booking-modal",
    ".lightbox",
    ".toast"
  ].join(",");

  const observedElements = new WeakSet();

  const revealObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -45px 0px"
    }
  );

  function prepareReveals(root = document) {
    revealGroups.forEach(group => {
      root.querySelectorAll(group.selector).forEach(element => {
        if (
          element.matches(excluded) ||
          element.closest(excluded) ||
          observedElements.has(element)
        ) {
          return;
        }

        observedElements.add(element);
        element.classList.add("reveal-on-scroll", group.effect);
        revealObserver.observe(element);
      });
    });
  }

  // Apply effects to existing page sections.
  document.documentElement.classList.add("motion-ready");
  prepareReveals();

  // Room cards are generated dynamically by renderRooms().
  // Observe newly created content without changing room filtering,
  // sorting, favourites, booking or gallery logic.
  const roomGrid = document.querySelector("#roomsGrid");

  if (roomGrid && "MutationObserver" in window) {
    const roomObserver = new MutationObserver(() => {
      prepareReveals(roomGrid);
    });

    roomObserver.observe(roomGrid, {
      childList: true,
      subtree: true
    });
  }
})();


/* =========================================
   AURELIA — IMAGE REVEAL ON SCROLL
   ========================================= */

(() => {
  "use strict";

  if (
    window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
    !("IntersectionObserver" in window)
  ) {
    return;
  }

  const imageSelectors = [
    ".room-photo img",
    ".story-visual img",
    ".experience-image",
    ".contact-visual img",
    ".quote-section"
  ];

  const imageEffects = [
    "reveal-image-zoom",
    "reveal-image-left",
    "reveal-image-right"
  ];

  const preparedImages = new WeakSet();

  const imageObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      entry.target.classList.add("is-image-visible");
      imageObserver.unobserve(entry.target);
    });
  }, {
    threshold: 0.12,
    rootMargin: "0px 0px -35px 0px"
  });

  function prepareImages(root = document) {
    imageSelectors.forEach((selector, selectorIndex) => {
      root.querySelectorAll(selector).forEach((element, index) => {
        if (preparedImages.has(element)) return;

        // Don't animate the full-page hero or header.
        if (element.closest(".hero, .site-header")) return;

        preparedImages.add(element);

        // Alternate effects to give the page visual variety.
        const effectIndex = (index + selectorIndex) % imageEffects.length;

        element.classList.add(imageEffects[effectIndex]);
        imageObserver.observe(element);
      });
    });
  }

  prepareImages();

  // Support room cards created later by filtering or sorting.
  const roomGrid = document.querySelector("#roomsGrid");

  if (roomGrid && "MutationObserver" in window) {
    const roomMutationObserver = new MutationObserver(() => {
      prepareImages(roomGrid);
    });

    roomMutationObserver.observe(roomGrid, {
      childList: true,
      subtree: true
    });
  }
})();


/* AURELIA — PRELOADER TIMER */
(() => {
  const loader = document.getElementById("aureliaLoader");
  if (!loader || loader.dataset.initialized === "true") return;

  loader.dataset.initialized = "true";

  const progress = document.getElementById("loaderProgress");
  const percent = document.getElementById("loaderPercent");
  const startedAt = performance.now();
  const duration = 2000;
  let animationFrame;

  function animate(now) {
    const elapsed = Math.min(now - startedAt, duration);
    const ratio = elapsed / duration;

    if (progress) progress.style.width = `${ratio * 100}%`;
    if (percent) {
      percent.textContent = String(Math.round(ratio * 100))
        .padStart(2, "0");
    }

    if (elapsed < duration) {
      animationFrame = requestAnimationFrame(animate);
    } else {
      loader.classList.add("is-leaving");

      window.setTimeout(() => {
        loader.remove();
      }, 700);
    }
  }

  animationFrame = requestAnimationFrame(animate);
})();


