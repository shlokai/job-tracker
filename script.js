// Get references to form and input elements
const form = document.getElementById("jobForm");
const jobList = document.getElementById("jobList");
const company = document.getElementById("company");
const role = document.getElementById("role");
const date = document.getElementById("date");
const status = document.getElementById("status");

// Load jobs from localStorage or start with empty array
let jobs = JSON.parse(localStorage.getItem("jobs")) || [];

// Add new job when form is submitted
form.addEventListener("submit", function (e) {
  e.preventDefault();

  const job = {
    company: company.value,
    role: role.value,
    date: date.value,
    status: status.value,
    followUpDays: 14
  };

  jobs.push(job);
  localStorage.setItem("jobs", JSON.stringify(jobs));

  form.reset();
  renderJobs();
});

// Function to render jobs in the list
function renderJobs() {
  jobList.innerHTML = "";

  jobs.forEach((job, index) => {
    const li = document.createElement("li");

    const followUpDate = new Date(job.date);
    followUpDate.setDate(followUpDate.getDate() + job.followUpDays);

    const today = new Date();
    const needsFollowUp = today >= followUpDate && job.status === "Applied";

    // Display company, role, and date
    li.innerHTML = `
      <strong>${job.company}</strong> — ${job.role}<br>
      Applied: ${job.date} | Status: 
    `;

    // Create status dropdown dynamically
    const statusSelect = document.createElement("select");
    ["Applied", "Interview", "Offer", "Rejected"].forEach((s) => {
      const option = document.createElement("option");
      option.value = s;
      option.text = s;
      if (job.status === s) option.selected = true;
      statusSelect.appendChild(option);
    });

    // Update job status when dropdown changes
    statusSelect.addEventListener("change", function () {
      jobs[index].status = this.value;
      localStorage.setItem("jobs", JSON.stringify(jobs));
      renderJobs();
    });

    li.appendChild(statusSelect);

    // Show follow-up warning if needed
    if (needsFollowUp) {
      const warning = document.createElement("div");
      warning.innerHTML = "<strong>⚠ Follow up!</strong>";
      li.appendChild(document.createElement("br"));
      li.appendChild(warning);
    }

    // Add delete button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", function () {
      deleteJob(index);
    });
    li.appendChild(document.createElement("br"));
    li.appendChild(deleteBtn);

    jobList.appendChild(li);
  });
}

// Function to delete a job
function deleteJob(index) {
  jobs.splice(index, 1);
  localStorage.setItem("jobs", JSON.stringify(jobs));
  renderJobs();
}

// Render jobs on page load
renderJobs();
