

let tableBody; 

// ---------- Numbers shown in the four cards (sample data) ----------
let totalReports = 12;
let pendingReports = 4;
let progressReports = 5;
let resolvedReports = 3;

// ---------- Small helper functions ----------

// Turns "In Progress" into "in-progress" (used for CSS class names)
function toClass(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// Shows a pop-up window with some details
function showModal(title, bodyHtml) {
  let overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML =
    '<div class="modal">' +
    '<div class="modal-head"><h3>' + title + '</h3>' +
    '<button type="button" class="modal-x">&times;</button></div>' +
    '<div class="modal-body">' + bodyHtml +
    '<div class="modal-foot"><button type="button" class="btn-primary modal-close">Close</button></div>' +
    '</div></div>';
  document.body.appendChild(overlay);

  overlay.querySelector(".modal-x").onclick = function () { overlay.remove(); };
  overlay.querySelector(".modal-close").onclick = function () { overlay.remove(); };
}

// If an image file is missing, show an emoji instead
function fixMissingImages() {
  let images = document.getElementsByTagName("img");
  for (let i = images.length - 1; i >= 0; i--) {
    let img = images[i];
    if (img.complete && img.naturalWidth === 0) {
      let size = img.getAttribute("width") || 40;
      let emoji = "🏛️";
      if (img.closest("button")) emoji = "👤";
      if (img.closest("main")) emoji = "🏫";

      let span = document.createElement("span");
      span.className = "fallback-img";
      span.textContent = emoji;
      span.style.width = size + "px";
      span.style.fontSize = size * 0.75 + "px";
      img.replaceWith(span);
    }
  }
}

// ---------- Sidebar and quick action icons ----------
function addIcons() {
  // sidebar links
  let links = document.querySelectorAll("body > aside nav a");
  for (let i = 0; i < links.length; i++) {
    let href = links[i].getAttribute("href");
    let icon = "📄";
    if (href.indexOf("dashboard") >= 0) icon = "🏠";
    if (href.indexOf("manage") >= 0) icon = "⚙️";
    if (href.indexOf("users") >= 0) icon = "👥";
    if (href.indexOf("universities") >= 0) icon = "🏛️";
    if (href.indexOf("settings") >= 0) icon = "⚙️";
    links[i].innerHTML = '<span class="icon">' + icon + '</span>' + links[i].textContent;
  }

  // logout link
  let logout = document.querySelector('a[href*="logout"]');
  logout.innerHTML = '<span class="icon">🚪</span>' + logout.textContent;

  // quick actions
  let actions = document.querySelectorAll('aside[aria-labelledby="actions-title"] li a');
  actions[0].insertAdjacentHTML("afterbegin", '<span class="icon">📄</span>');
  actions[1].insertAdjacentHTML("afterbegin", '<span class="icon">👥</span>');

  // university label
  let label = document.querySelector('label[for="university"]');
  label.insertAdjacentHTML("afterbegin", "🏛️ ");
}

// ---------- Top bar: bell and account menu ----------
function setupTopBar() {
  let bell = document.querySelector('button[aria-label^="Notifications"]');
  let account = document.querySelector('button[aria-label="Account menu"]');

  // bell
  bell.innerHTML = "🔔";
  bell.classList.add("has-new");
  bell.onclick = function () {
    bell.classList.remove("has-new");
    alert("You have no new notifications.");
  };

  // account menu
  let menu = document.createElement("div");
  menu.className = "account-menu";
  menu.innerHTML = '<a href="admin-profile.html">👤 My Profile</a>' +
                   '<a href="logout.html">🚪 Logout</a>';
  account.parentNode.appendChild(menu);

  account.onclick = function (event) {
    event.stopPropagation();
    menu.classList.toggle("open");
  };

  // click anywhere else closes the menu
  document.onclick = function () {
    menu.classList.remove("open");
  };
}

// ---------- Four number cards ----------
function makeCard(type, icon, title, number, text) {
  return '<article class="stat-card">' +
         '<span class="stat-icon ' + type + '">' + icon + '</span>' +
         '<div><h2>' + title + '</h2>' +
         '<p class="stat-number">' + number + '</p>' +
         '<p class="stat-text">' + text + '</p></div>' +
         '</article>';
}

function showStats() {
  let section = document.querySelector('section[aria-label="Report statistics"]');
  section.innerHTML =
    makeCard("total", "📄", "Total Reports", totalReports, "All submitted reports") +
    makeCard("pending", "🕒", "Pending", pendingReports, "Waiting for review") +
    makeCard("progress", "🔄", "In Progress", progressReports, "Being processed") +
    makeCard("resolved", "✅", "Resolved", resolvedReports, "Successfully solved");
}

// ---------- Recent Reports table ----------
function addRow(number, title, category, status, date) {
  let row = tableBody.insertRow();
  row.innerHTML =
    "<td>" + number + "</td>" +
    "<td>" + title + "</td>" +
    '<td><span class="pill cat-' + toClass(category) + '">' + category + "</span></td>" +
    '<td><span class="pill st-' + toClass(status) + '">' + status + "</span></td>" +
    "<td>" + date + "</td>" +
    '<td><button type="button" class="btn-view">View</button></td>';
}

function showRecentReports() {
  let table = document.querySelector('section[aria-labelledby="recent-title"] table');
  tableBody = table.createTBody();

  addRow(1, "Broken light in D building", "Infrastructure", "In Progress", "Oct 10, 2026");
  addRow(2, "Water leakage in C building", "Maintenance", "Resolved", "Oct 5, 2026");
  addRow(3, "Canteen food quality issue", "Food & Dining", "Pending", "Oct 2, 2026");
  addRow(4, "Wi-Fi not working in Annex-3", "IT & Network", "In Progress", "Sep 28, 2026");
  addRow(5, "Noisy classroom (C-201)", "Classroom", "Resolved", "Sep 25, 2026");

  // When a View button is clicked, show the report details
  tableBody.onclick = function (event) {
    if (event.target.className === "btn-view") {
      let cells = event.target.parentNode.parentNode.cells;
      showModal("Report Details",
        '<div class="detail-row"><span>Title</span><span>' + cells[1].textContent + '</span></div>' +
        '<div class="detail-row"><span>Category</span><span>' + cells[2].innerHTML + '</span></div>' +
        '<div class="detail-row"><span>Status</span><span>' + cells[3].innerHTML + '</span></div>' +
        '<div class="detail-row"><span>Date submitted</span><span>' + cells[4].textContent + '</span></div>');
    }
  };
}

// ---------- Start everything when the page is ready ----------
document.addEventListener("DOMContentLoaded", function () {
  fixMissingImages();
  addIcons();
  setupTopBar();
  showStats();
  showRecentReports();
});
