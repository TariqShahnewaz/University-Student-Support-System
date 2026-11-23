
// Elements we change later (filled in when the page loads)
let profileName;   // the big name in the profile card
let details;       // the <dd> values (email, full name, university, joined date)
let aboutText;     // the bio paragraph
let bioLink;       // the "Add Bio" link

// Notification choices (sample, kept while the page is open)
let notifyNewReports = true;
let notifyStatusChange = true;
let notifyEmail = false;

// ---------- Small helper functions ----------

// Shows a short message in the bottom-right corner
function showMessage(text) {
  let box = document.createElement("div");
  box.className = "message";
  box.textContent = text;
  document.body.appendChild(box);
  setTimeout(function () { box.remove(); }, 2500);
}

// Shows a pop-up form.
// onSave(form) must return "" when OK, or an error text to show.
function showForm(title, fieldsHtml, onSave) {
  let overlay = document.createElement("div");
  overlay.className = "overlay";
  overlay.innerHTML =
    '<div class="modal">' +
    '<div class="modal-head"><h3>' + title + '</h3>' +
    '<button type="button" class="modal-x">&times;</button></div>' +
    '<form class="modal-body">' + fieldsHtml +
    '<p class="form-error"></p>' +
    '<div class="modal-foot">' +
    '<button type="button" class="btn-ghost cancel-btn">Cancel</button>' +
    '<button type="submit" class="btn-primary">Save</button>' +
    '</div></form></div>';
  document.body.appendChild(overlay);

  let form = overlay.querySelector("form");
  overlay.querySelector(".modal-x").onclick = function () { overlay.remove(); };
  overlay.querySelector(".cancel-btn").onclick = function () { overlay.remove(); };

  form.onsubmit = function (event) {
    event.preventDefault(); // stop the page from reloading
    let error = onSave(form);
    if (error !== "") {
      overlay.querySelector(".form-error").textContent = error;
    } else {
      overlay.remove();
    }
  };
  return form;
}

// If an image file is missing, show an emoji instead
function fixMissingImages() {
  let images = document.getElementsByTagName("img");
  for (let i = images.length - 1; i >= 0; i--) {
    let img = images[i];
    if (img.complete && img.naturalWidth === 0) {
      let size = img.getAttribute("width") || 40;
      let emoji = "🏛️";
      if (img.closest("button") || img.closest("figure")) emoji = "👤";
      if (img.closest("main") && !img.closest("figure")) emoji = "📝";

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
  // sidebar links
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

  // page title icon
  let heading = document.querySelector("main > section:first-child");
  heading.insertAdjacentHTML("afterbegin", '<span class="page-icon">👤</span>');

  // icon in front of each profile detail (email, name, university, date)
  let labels = document.querySelectorAll("article dt");
  labels[0].insertAdjacentHTML("afterbegin", '<span class="icon">📧</span>');
  labels[1].insertAdjacentHTML("afterbegin", '<span class="icon">👤</span>');
  labels[2].insertAdjacentHTML("afterbegin", '<span class="icon">🏛️</span>');
  labels[3].insertAdjacentHTML("afterbegin", '<span class="icon">📅</span>');

  // Edit Profile and Add Bio buttons
  let editLink = document.querySelector('a[href="edit-profile.html"]');
  editLink.innerHTML = "✏️ Edit Profile";
  bioLink.innerHTML = "✏️ Add Bio";

  // card titles
  document.getElementById("actions-title").insertAdjacentHTML("afterbegin", '<span class="h-icon">⚡</span>');
  document.getElementById("about-title").insertAdjacentHTML("afterbegin", '<span class="h-icon">ℹ️</span>');

  // Quick action icons
  let actions = document.querySelectorAll("#actions-title ~ ul li a");
  actions[0].insertAdjacentHTML("afterbegin", '<span class="icon">🔒</span>');
  actions[1].insertAdjacentHTML("afterbegin", '<span class="icon">🔔</span>');
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

// ---------- Edit Profile ----------
function editProfile() {
  let form = showForm(
    "Edit Profile",
    '<label>Full name<input type="text" name="fullname"></label>' +
    '<label>Email address<input type="email" name="email"></label>',
    function (form) {
      let name = form.elements["fullname"].value.trim();
      let email = form.elements["email"].value.trim();

      if (name.length < 3) {
        return "Please enter your full name (at least 3 characters).";
      }
      if (email.indexOf("@") < 1 || email.lastIndexOf(".") < email.indexOf("@") + 2) {
        return "Please enter a valid email, like name@example.com.";
      }

      // show the new values on the page
      profileName.textContent = name;
      details[1].textContent = name;
      let emailLink = details[0].querySelector("a");
      emailLink.textContent = email;
      emailLink.href = "mailto:" + email;
      showMessage("Profile updated");
      return "";
    }
  );

  // put the current values into the form
  form.elements["fullname"].value = profileName.textContent;
  form.elements["email"].value = details[0].textContent.trim();
}

// ---------- Add / Edit Bio ----------
function editBio() {
  let form = showForm(
    "About Me",
    '<label>Write a short bio<textarea name="bio" maxlength="300"></textarea></label>',
    function (form) {
      let bio = form.elements["bio"].value.trim();
      if (bio === "") {
        return "Please write something before saving.";
      }
      aboutText.textContent = bio;
      bioLink.innerHTML = "✏️ Edit Bio";
      showMessage("Bio saved");
      return "";
    }
  );
  form.elements["bio"].value = aboutText.textContent.trim();
}

// ---------- Change Password ----------
function changePassword() {
  showForm(
    "Change Password",
    '<label>Current password<input type="password" name="oldpw"></label>' +
    '<label>New password<input type="password" name="newpw"></label>' +
    '<label>Confirm new password<input type="password" name="confirmpw"></label>',
    function (form) {
      let oldPw = form.elements["oldpw"].value;
      let newPw = form.elements["newpw"].value;
      let confirmPw = form.elements["confirmpw"].value;

      if (oldPw === "") {
        return "Please enter your current password.";
      }
      if (newPw.length < 8) {
        return "The new password must have at least 8 characters.";
      }
      if (!/[0-9]/.test(newPw) || !/[a-zA-Z]/.test(newPw)) {
        return "The new password needs at least one letter and one number.";
      }
      if (newPw !== confirmPw) {
        return "The two new passwords do not match.";
      }
      // Real password checking will be done with PHP + database later.
      showMessage("Password updated");
      return "";
    }
  );
}

// ---------- Notification Settings ----------
function notificationSettings() {
  let form = showForm(
    "Notification Settings",
    '<label class="check-row">New report submitted <input type="checkbox" name="newreports"></label>' +
    '<label class="check-row">Report status changes <input type="checkbox" name="statuschange"></label>' +
    '<label class="check-row">Email notifications <input type="checkbox" name="email"></label>',
    function (form) {
      notifyNewReports = form.elements["newreports"].checked;
      notifyStatusChange = form.elements["statuschange"].checked;
      notifyEmail = form.elements["email"].checked;
      showMessage("Notification settings saved");
      return "";
    }
  );
  form.elements["newreports"].checked = notifyNewReports;
  form.elements["statuschange"].checked = notifyStatusChange;
  form.elements["email"].checked = notifyEmail;
}

// ---------- Change profile photo ----------
function setupPhotoButton() {
  let figure = document.querySelector("figure");
  let button = figure.querySelector("button");
  button.innerHTML = "📷";

  let fileInput = document.createElement("input");
  fileInput.type = "file";
  fileInput.accept = "image/*";
  fileInput.style.display = "none";
  figure.appendChild(fileInput);

  button.onclick = function () { fileInput.click(); };

  fileInput.onchange = function () {
    let file = fileInput.files[0];
    if (!file) return;
    if (file.type.indexOf("image") !== 0) {
      showMessage("Please choose an image file.");
      return;
    }
    let reader = new FileReader();
    reader.onload = function () {
      let newPhoto = document.createElement("img");
      newPhoto.src = reader.result;
      newPhoto.alt = "Profile photo";
      let oldPhoto = figure.querySelector("img, .fallback-img");
      oldPhoto.replaceWith(newPhoto);
      showMessage("Profile photo updated");
    };
    reader.readAsDataURL(file);
  };
}

// ---------- Start everything when the page is ready ----------
document.addEventListener("DOMContentLoaded", function () {
  profileName = document.getElementById("profile-name");
  details = document.querySelectorAll("article dd");
  aboutText = document.querySelector('section[aria-labelledby="about-title"] p');
  bioLink = document.querySelector('a[href="edit-bio.html"]');

  fixMissingImages();
  addIcons();
  setupTopBar();
  setupPhotoButton();

  // These links point to pages that do not exist yet,
  // so we open a pop-up form instead.
  document.querySelector('a[href="edit-profile.html"]').onclick = function (e) {
    e.preventDefault();
    editProfile();
  };
  bioLink.onclick = function (e) {
    e.preventDefault();
    editBio();
  };
  document.querySelector('a[href="change-password.html"]').onclick = function (e) {
    e.preventDefault();
    changePassword();
  };
  document.querySelector('a[href="notification-settings.html"]').onclick = function (e) {
    e.preventDefault();
    notificationSettings();
  };
});
