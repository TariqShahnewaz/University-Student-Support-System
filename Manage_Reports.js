

let tableBody;         
let pagination;         
let noResults;       
let currentPage = 1;   
let perPage = 6;       



// Turns "In Progress" into "in-progress" (used for CSS class names)
function toClass(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-");
}

// Shows a short message in the bottom-right corner
function showMessage(text) {
  let box = document.createElement("div");
  box.className = "message";
  box.textContent = text;
  document.body.appendChild(box);
  setTimeout(function () { box.remove(); }, 2500);
}

// Creates a pop-up window. Returns the overlay so we can use it.
function makeModal(title, bodyHtml) {
  let overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML =
    '<div class="modal">' +
    '<div class="modal-head"><h3>' + title + '</h3>' +
    '<button type="button" class="modal-x">&times;</button></div>' +
    '<form class="modal-body">' + bodyHtml + '</form></div>';
  document.body.appendChild(overlay);
  overlay.querySelector(".modal-x").onclick = function () { overlay.remove(); };
  return overlay;
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

      let span = document.createElement("span");
      span.className = "fallback-img";
      span.textContent = emoji;
      span.style.width = size + "px";
      span.style.fontSize = size * 0.6 + "px";
      img.replaceWith(span);
    }
  }
}

// ---------- Icons ----------
function addIcons() {
  let links = document.querySelectorAll("body > aside nav a");
  for (let i = 0; i < links.length; i++) {
    let href = links[i].getAttribute("href");
    let icon = "📄";
    if (href.indexOf("dashboard") >= 0) icon = "🏠";
    if (href.indexOf("profile") >= 0) icon = "👤";
    links[i].innerHTML = '<span class="icon">' + icon + '</span>' + links[i].textContent;
  }
  let logout = document.querySelector('a[href*="logout"]');
  logout.innerHTML = '<span class="icon">🚪</span>' + logout.textContent;

  document.querySelector("main > section:first-child")
    .insertAdjacentHTML("afterbegin", '<span class="page-icon">📄</span>');

  document.getElementById("reports-title").insertAdjacentHTML("afterbegin", "📄 ");
  document.querySelector('form[role="search"] button').innerHTML = "⛛ Filter";
}

// ---------- Top bar: bell and account menu ----------
function setupTopBar() {
  let bell = document.querySelector('button[aria-label^="Notifications"]');
  let account = document.querySelector('button[aria-label="Account menu"]');

  bell.innerHTML = "🔔";
  bell.classList.add("has-new");
  bell.onclick = function () {
    bell.classList.remove("has-new");
    alert("You have no new notifications.");
  };

  let menu = document.createElement("div");
  menu.className = "account-menu";
  menu.innerHTML = '<a href="admin-profile.html">👤 My Profile</a>' +
                   '<a href="logout.html">🚪 Logout</a>';
  account.parentNode.appendChild(menu);

  account.onclick = function (event) {
    event.stopPropagation();
    menu.classList.toggle("open");
  };
  document.onclick = function () {
    menu.classList.remove("open");
  };
}

// ---------- Adding reports to the table ----------
function addReport(number, title, category, location, status, date) {
  let row = tableBody.insertRow();
  row.innerHTML =
    "<td>" + number + "</td>" +
    "<td>" + title + "</td>" +
    '<td><span class="pill cat-' + toClass(category) + '">' + category + "</span></td>" +
    "<td>" + location + "</td>" +
    '<td><span class="pill st-' + toClass(status) + '">' + status + "</span></td>" +
    "<td>" + date + "</td>" +
    '<td><button type="button" class="btn-view">View</button>' +
    '<button type="button" class="btn-edit" title="Update status">▾</button></td>';
  row.dataset.comment = ""; // admin comment (empty at the start)
}

function addAllReports() {
  addReport(1, "Broken Classroom Fan", "Classroom", "Building A", "Pending", "Apr 12, 2025");
  addReport(2, "Parking Space Issue", "Parking", "Main Gate", "In Progress", "Apr 10, 2025");
  addReport(3, "Road Pothole", "Roads", "Campus Road", "Resolved", "Apr 8, 2025");
  addReport(4, "Sports Equipment", "Sports", "Sports Complex", "Pending", "Apr 6, 2025");
  addReport(5, "Library AC Not Working", "Library", "Library Building", "In Progress", "Apr 5, 2025");
  addReport(6, "Water Leakage", "Other", "Dormitory", "Resolved", "Apr 2, 2025");
  addReport(7, "Projector Not Working", "Classroom", "Building B", "Pending", "Apr 1, 2025");
  addReport(8, "Broken Bench", "Other", "Central Field", "In Progress", "Mar 30, 2025");
  addReport(9, "Wi-Fi Down in Reading Room", "Library", "Library Building", "Resolved", "Mar 28, 2025");
  addReport(10, "Flickering Lights", "Classroom", "Building C", "Pending", "Mar 26, 2025");
  addReport(11, "Car Park Flooding", "Parking", "North Lot", "In Progress", "Mar 25, 2025");
  addReport(12, "Damaged Football Goalpost", "Sports", "Sports Complex", "Resolved", "Mar 23, 2025");
  addReport(13, "Street Light Out", "Roads", "Campus Road", "Pending", "Mar 21, 2025");
  addReport(14, "Dirty Washroom", "Other", "Building D", "Resolved", "Mar 20, 2025");
  addReport(15, "Missing Library Books", "Library", "Library Building", "Pending", "Mar 18, 2025");
  addReport(16, "Broken Door Lock", "Classroom", "Building A", "In Progress", "Mar 16, 2025");
  addReport(17, "No Parking Signs", "Parking", "Main Gate", "Resolved", "Mar 14, 2025");
  addReport(18, "Cracked Pavement", "Roads", "Near Cafeteria", "In Progress", "Mar 12, 2025");
  addReport(19, "Gym Equipment Broken", "Sports", "Gym Hall", "Pending", "Mar 10, 2025");
  addReport(20, "Noisy Construction", "Other", "Annex-3", "Resolved", "Mar 8, 2025");
  addReport(21, "Whiteboard Damaged", "Classroom", "Building B", "Resolved", "Mar 6, 2025");
  addReport(22, "Bike Rack Missing", "Parking", "Back Gate", "Pending", "Mar 4, 2025");
  addReport(23, "Library AC Noise", "Library", "Library Building", "In Progress", "Mar 2, 2025");
  addReport(24, "Basketball Court Lighting", "Sports", "Sports Complex", "Resolved", "Feb 28, 2025");
}

// ---------- Four number cards (counted from the table) ----------
function makeCard(type, icon, title, number) {
  return '<article class="stat-card">' +
         '<span class="stat-icon ' + type + '">' + icon + '</span>' +
         '<div><h2>' + title + '</h2><p class="stat-number">' + number + '</p></div>' +
         '</article>';
}

function showStats() {
  let pending = 0;
  let progress = 0;
  let resolved = 0;

  let rows = tableBody.rows;
  for (let i = 0; i < rows.length; i++) {
    let status = rows[i].cells[4].textContent;
    if (status === "Pending") pending++;
    if (status === "In Progress") progress++;
    if (status === "Resolved") resolved++;
  }

  document.querySelector('section[aria-label="Report statistics"]').innerHTML =
    makeCard("total", "📄", "Total Reports", rows.length) +
    makeCard("pending", "🕒", "Pending", pending) +
    makeCard("progress", "🔄", "In Progress", progress) +
    makeCard("resolved", "✅", "Resolved", resolved);
}

// ---------- Search, filter and pages ----------
function showReports() {
  let search = document.getElementById("search").value.toLowerCase().trim();
  let category = document.getElementById("category").value;
  let status = document.getElementById("status").value;

  let rows = tableBody.rows;
  let matches = 0;

  for (let i = 0; i < rows.length; i++) {
    let cells = rows[i].cells;
    let ok = true;

    // 1. search box (title, location or category)
    let text = (cells[1].textContent + " " + cells[2].textContent + " " + cells[3].textContent).toLowerCase();
    if (search !== "" && text.indexOf(search) < 0) ok = false;

    // 2. category drop-down
    if (category !== "" && toClass(cells[2].textContent) !== category) ok = false;

    // 3. status drop-down
    if (status !== "" && toClass(cells[4].textContent) !== status) ok = false;

    // 4. show only the rows that belong to the current page
    if (ok) {
      matches++;
      let first = (currentPage - 1) * perPage;
      let last = currentPage * perPage;
      if (matches > first && matches <= last) {
        rows[i].style.display = "";
      } else {
        rows[i].style.display = "none";
      }
    } else {
      rows[i].style.display = "none";
    }
  }

  let pages = Math.ceil(matches / perPage);
  if (pages < 1) pages = 1;

  // if we are on a page that no longer exists, go to the last one
  if (currentPage > pages) {
    currentPage = pages;
    showReports();
    return;
  }

  noResults.style.display = (matches === 0) ? "block" : "none";
  showPageButtons(pages);
}

function showPageButtons(pages) {
  pagination.innerHTML = "";

  // previous button
  let prev = document.createElement("button");
  prev.type = "button";
  prev.textContent = "‹";
  prev.disabled = (currentPage === 1);
  prev.onclick = function () { currentPage--; showReports(); };
  pagination.appendChild(prev);

  // number buttons
  for (let p = 1; p <= pages; p++) {
    let button = document.createElement("button");
    button.type = "button";
    button.textContent = p;
    if (p === currentPage) button.className = "active";
    button.onclick = function () { currentPage = p; showReports(); };
    pagination.appendChild(button);
  }

  // next button
  let next = document.createElement("button");
  next.type = "button";
  next.textContent = "›";
  next.disabled = (currentPage === pages);
  next.onclick = function () { currentPage++; showReports(); };
  pagination.appendChild(next);
}

// ---------- View details ----------
function viewReport(row) {
  let cells = row.cells;
  let comment = row.dataset.comment;
  if (comment === "") comment = "No comment yet";

  let overlay = makeModal("Report #" + cells[0].textContent,
    '<div class="detail-row"><span>Title</span><span>' + cells[1].textContent + '</span></div>' +
    '<div class="detail-row"><span>Category</span><span>' + cells[2].innerHTML + '</span></div>' +
    '<div class="detail-row"><span>Location</span><span>' + cells[3].textContent + '</span></div>' +
    '<div class="detail-row"><span>Status</span><span>' + cells[4].innerHTML + '</span></div>' +
    '<div class="detail-row"><span>Date</span><span>' + cells[5].textContent + '</span></div>' +
    '<div class="detail-row"><span>Admin comment</span><span class="comment-text"></span></div>' +
    '<div class="modal-foot"><button type="button" class="btn-primary close-btn">Close</button></div>');

  overlay.querySelector(".comment-text").textContent = comment; // textContent keeps it safe
  overlay.querySelector(".close-btn").onclick = function () { overlay.remove(); };
}

// ---------- Update status and add a comment ----------
function editReport(row) {
  let cells = row.cells;

  let overlay = makeModal("Update Report #" + cells[0].textContent,
    '<p class="report-name"></p>' +
    '<label>Status<select name="status">' +
    '<option>Pending</option><option>In Progress</option><option>Resolved</option>' +
    '</select></label>' +
    '<label>Admin comment<textarea name="comment" maxlength="300" placeholder="Write a note about this report"></textarea></label>' +
    '<div class="modal-foot">' +
    '<button type="button" class="btn-ghost cancel-btn">Cancel</button>' +
    '<button type="submit" class="btn-primary">Save</button></div>');

  let form = overlay.querySelector("form");
  overlay.querySelector(".report-name").textContent = cells[1].textContent;
  form.elements["status"].value = cells[4].textContent;
  form.elements["comment"].value = row.dataset.comment;
  overlay.querySelector(".cancel-btn").onclick = function () { overlay.remove(); };

  form.onsubmit = function (event) {
    event.preventDefault();
    let newStatus = form.elements["status"].value;

    cells[4].innerHTML = '<span class="pill st-' + toClass(newStatus) + '">' + newStatus + '</span>';
    row.dataset.comment = form.elements["comment"].value.trim();

    showStats();    // numbers in the cards change
    showReports();  // in case a filter is active
    showMessage("Report updated");
    overlay.remove();
  };
}

// ---------- Start everything when the page is ready ----------
document.addEventListener("DOMContentLoaded", function () {
  fixMissingImages();
  addIcons();
  setupTopBar();

  // table body
  let table = document.querySelector('section[aria-labelledby="reports-title"] table');
  tableBody = table.createTBody();
  addAllReports();

  // message and page buttons under the table
  let section = document.querySelector('section[aria-labelledby="reports-title"]');
  noResults = document.createElement("p");
  noResults.className = "no-results";
  noResults.textContent = "No reports found. Try a different search or filter.";
  section.appendChild(noResults);

  pagination = document.createElement("div");
  pagination.className = "pagination";
  section.appendChild(pagination);

  // buttons inside the table (View and ▾)
  tableBody.onclick = function (event) {
    let row = event.target.parentNode.parentNode;
    if (event.target.classList.contains("btn-view")) viewReport(row);
    if (event.target.classList.contains("btn-edit")) editReport(row);
  };

  // search box, drop-downs and Filter button
  let form = document.querySelector('form[role="search"]');
  form.onsubmit = function (event) {
    event.preventDefault();
    currentPage = 1;
    showReports();
  };
  document.getElementById("search").oninput = function () { currentPage = 1; showReports(); };
  document.getElementById("category").onchange = function () { currentPage = 1; showReports(); };
  document.getElementById("status").onchange = function () { currentPage = 1; showReports(); };

  showStats();
  showReports();
});
