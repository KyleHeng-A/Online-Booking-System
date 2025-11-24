/************************************
 * Utility Helpers
 ************************************/
const $ = (id) => document.getElementById(id);

function showGlobalMessage(text, type = "success") {
  const box = $("global-message");
  if (!box) return;
  box.textContent = text;
  box.className = `alert show ${type}`;

  setTimeout(() => {
    box.className = "alert";
  }, 3000);
}

/************************************
 STORAGE HELPERS
************************************/
function readStorage(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function saveStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

/************************************
 GLOBAL STORAGE KEYS
************************************/
const STORAGE = {
  users: "users",
  announcements: "announcements",
  bookings: "bookings"
};

/************************************
 LOAD DATA
************************************/
let users = readStorage(STORAGE.users);
let announcements = readStorage(STORAGE.announcements);
let bookings = readStorage(STORAGE.bookings);

// 初始 Booking demo 数据（如果为空）
if (bookings.length === 0) {
  bookings = [
    { id: Date.now(), user: "Alice Green", time: "2025-11-25 10:00", resource: "Lab 1", status: "pending", reason: "" },
    { id: Date.now() + 1, user: "Bob Smith", time: "2025-11-26 14:00", resource: "Projector A", status: "pending", reason: "" }
  ];
  saveStorage(STORAGE.bookings, bookings);
}

/************************************
 * 1. Add Student Account
 ************************************/
document.addEventListener("DOMContentLoaded", () => {

  const formAddStudent = $("form-add-student");
  if (formAddStudent) {
    formAddStudent.addEventListener("submit", (e) => {
      e.preventDefault();

      const firstName = $("firstName").value.trim();
      const lastName = $("lastName").value.trim();
      const email = $("collegeEmail").value.trim();
      const studentId = $("studentId").value.trim();
      const password = $("studentPassword").value.trim();

      // Clear errors
      ["firstName", "lastName", "collegeEmail", "studentId", "studentPassword"].forEach(f => {
        $(`err-${f}`).textContent = "";
      });

      // Validation
      let error = false;
      if (!firstName) { $("err-firstName").textContent = "First name required."; error = true; }
      if (!lastName) { $("err-lastName").textContent = "Last name required."; error = true; }
      if (!email.endsWith("@student.tus.ie")) { $("err-collegeEmail").textContent = "Must end with @student.tus.ie"; error = true; }
      if (!studentId) { $("err-studentId").textContent = "Student ID required."; error = true; }
      if (!password) { $("err-studentPassword").textContent = "Password required."; error = true; }

      if (error) return;

      const newStudent = {
        id: Date.now(),
        name: `${firstName} ${lastName}`,
        email,
        role: "Student",
        password,
        status: "active"
      };

      users.push(newStudent);
      saveStorage(STORAGE.users, users);

      formAddStudent.reset();
      showGlobalMessage("Student account created successfully!", "success");

      // Refresh user list if you're on /users.html
      renderUsers();
    });
  }
});

/************************************
 * 2. User Management
 ************************************/
let userSortField = "name";
let userSortAsc = true;

function renderUsers() {
  const userTable = $("user-table-body");
  if (!userTable) return;

  users = readStorage(STORAGE.users);

  const searchVal = $("user-search") ? $("user-search").value.trim().toLowerCase() : "";
  const filterRole = $("filter-role") ? $("filter-role").value : "";
  const filterStatus = $("filter-status") ? $("filter-status").value : "";

  let filtered = users.filter(u => {
    const matchSearch =
      u.name.toLowerCase().includes(searchVal) ||
      u.email.toLowerCase().includes(searchVal);

    const matchRole = filterRole ? u.role === filterRole : true;
    const matchStatus = filterStatus ? u.status === filterStatus : true;

    return matchSearch && matchRole && matchStatus;
  });

  filtered.sort((a, b) => {
    let va = a[userSortField].toLowerCase();
    let vb = b[userSortField].toLowerCase();
    if (va < vb) return userSortAsc ? -1 : 1;
    if (va > vb) return userSortAsc ? 1 : -1;
    return 0;
  });

  userTable.innerHTML = "";

  filtered.forEach(u => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${u.name}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td><span class="badge ${u.status}">${u.status}</span></td>
      <td>
        <button class="btn-small edit" data-id="${u.id}">Edit</button>
        <button class="btn-small toggle" data-id="${u.id}">
          ${u.status === "active" ? "Deactivate" : "Activate"}
        </button>
        <button class="btn-small delete" data-id="${u.id}">Delete</button>
      </td>
    `;
    userTable.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const userTable = $("user-table-body");
  if (!userTable) return;

  renderUsers();

  $("user-search").addEventListener("input", renderUsers);
  $("filter-role").addEventListener("change", renderUsers);
  $("filter-status").addEventListener("change", renderUsers);

  document.querySelectorAll("th[data-sort]").forEach(th => {
    th.addEventListener("click", () => {
      const field = th.dataset.sort;
      if (userSortField === field) userSortAsc = !userSortAsc;
      else { userSortField = field; userSortAsc = true; }
      renderUsers();
    });
  });

  userTable.addEventListener("click", (e) => {
    const btn = e.target;
    const id = Number(btn.dataset.id);
    let user = users.find(u => u.id === id);

    if (!user) return;

    if (btn.classList.contains("edit")) {
      const newName = prompt("Edit name:", user.name);
      if (newName) user.name = newName;

      const newRole = prompt("Edit role:", user.role);
      if (newRole) user.role = newRole;

      saveStorage(STORAGE.users, users);
      showGlobalMessage("User updated.", "success");
      renderUsers();
    }

    if (btn.classList.contains("toggle")) {
      user.status = user.status === "active" ? "inactive" : "active";
      saveStorage(STORAGE.users, users);
      renderUsers();
    }

    if (btn.classList.contains("delete")) {
      if (confirm("Delete this user?")) {
        users = users.filter(u => u.id !== id);
        saveStorage(STORAGE.users, users);
        renderUsers();
      }
    }
  });
});

/************************************
 * 3. Announcements (with localStorage)
 ************************************/
function renderAnnouncements() {
  const annTable = $("ann-table-body");
  if (!annTable) return;

  announcements = readStorage(STORAGE.announcements);

  annTable.innerHTML = "";
  announcements.forEach(a => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${a.title}</td>
      <td>${a.recipient}</td>
      <td>${a.schedule || "Immediate"}</td>
      <td><span class="badge ${a.status === "Scheduled" ? "scheduled" : "sent"}">${a.status}</span></td>
    `;
    annTable.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const formAnn = $("form-announcement");
  if (!formAnn) return;

  formAnn.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = $("ann-title").value.trim();
    const message = $("ann-message").value.trim();
    const recipient = $("ann-recipient").value;
    const schedule = $("ann-schedule").value;

    $("err-ann-title").textContent = "";
    $("err-ann-message").textContent = "";

    if (!title) { $("err-ann-title").textContent = "Title required."; return; }
    if (!message) { $("err-ann-message").textContent = "Message required."; return; }

    const status = schedule ? "Scheduled" : "Sent";

    const newAnn = {
      id: Date.now(),
      title,
      message,
      recipient,
      schedule,
      status
    };

    announcements.push(newAnn);
    saveStorage(STORAGE.announcements, announcements);

    formAnn.reset();
    $("ann-recipient").value = "all";

    showGlobalMessage("Announcement created.", "success");
    renderAnnouncements();
  });

  renderAnnouncements();
});

/************************************
 * 4. Booking Management
 ************************************/
function renderBookings() {
  const bookingTable = $("booking-table-body");
  if (!bookingTable) return;

  bookings = readStorage(STORAGE.bookings);

  bookingTable.innerHTML = "";

  bookings.forEach(b => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${b.user}</td>
      <td>${b.time}</td>
      <td>${b.resource}</td>
      <td><span class="badge ${b.status}">${b.status}</span></td>
      <td>
        <button class="btn-small approve" data-id="${b.id}">Approve</button>
        <button class="btn-small reject" data-id="${b.id}">Reject</button>
      </td>
    `;
    bookingTable.appendChild(tr);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const bookingTable = $("booking-table-body");
  if (!bookingTable) return;

  renderBookings();

  bookingTable.addEventListener("click", (e) => {
    const btn = e.target;
    const id = Number(btn.dataset.id);
    let booking = bookings.find(b => b.id === id);

    if (!booking) return;

    if (btn.classList.contains("approve")) {
      booking.status = "approved";
      saveStorage(STORAGE.bookings, bookings);
      showGlobalMessage("Booking approved", "success");
      renderBookings();
    }

    if (btn.classList.contains("reject")) {
      const reason = prompt("Rejection reason:", "") || "No reason provided.";
      booking.status = "rejected";
      booking.reason = reason;
      saveStorage(STORAGE.bookings, bookings);
      showGlobalMessage("Booking rejected", "error");
      renderBookings();
    }
  });
});


/************************************
 * 5. Top Search Bar (Search apps + users)
 ************************************/
document.addEventListener("DOMContentLoaded", () => {
  const searchInput = $("top-search");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    let key = searchInput.value.toLowerCase();

    // Search users
    let resultUsers = users.filter(u => 
      u.name.toLowerCase().includes(key) ||
      u.email.toLowerCase().includes(key)
    );

    console.log("Search:", key);
    console.log("Found users:", resultUsers);

    // (你可以加入 dropdown 列表显示结果)
  });
});
