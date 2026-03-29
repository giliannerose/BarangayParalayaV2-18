async function createProject() {
  const title = document.getElementById("projectTitle").value;
  const description = document.getElementById("projectDescription").value;
  const status = document.getElementById("projectStatus").value;
  const progress = document.getElementById("projectProgress").value;
  const image = document.getElementById("projectImage").value;
  const startDate = document.getElementById("projectStartDate").value;
  const endDate = document.getElementById("projectEndDate").value;
  const budget = document.getElementById("projectBudget").value;
  const location = document.getElementById("projectLocation").value;
  const ledBy = document.getElementById("projectLedBy").value;
  const impact = document.getElementById("projectImpact").value;
  const year = document.getElementById("projectYear").value;

  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: {
        ...getAuthHeaders(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title,
        description,
        status,
        progress: Number(progress),
        image,
        startDate,
        endDate,
        budget,
        location,
        ledBy,
        impact,
        year
      })
    });

    const data = await res.json();
    console.log("CREATE PROJECT RESPONSE:", res.status, data);

    if (!res.ok) {
      alert(data.message || data.error || "Failed to create project");
      return;
    }

    alert("Project created");
    loadProjects();

  } catch (err) {
    console.error("Create project error:", err);
    alert("Something went wrong while creating project");
  }
}

async function loadProjects(){

const res=await fetch("/api/projects")
const projects=await res.json()

const container=document.getElementById("projectList")

container.innerHTML=""

projects.forEach(p=>{

const div=document.createElement("div")

div.innerHTML=`

<b>${p.title}</b>

<p>${p.description}</p>

<p>Status: ${p.status}</p>

<p>Progress: ${p.progress}%</p>

<button onclick="deleteProject('${p._id}')">Delete</button>

<hr>

`

container.appendChild(div)

})

}

//delete

async function deleteProject(id) {
  try {
    const res = await fetch("/api/projects/" + id, {
      method: "DELETE",
      headers: getAuthHeaders()
    });

    const data = await res.json();
    console.log("DELETE PROJECT RESPONSE:", res.status, data);

    if (!res.ok) {
      alert(data.message || data.error || "Failed to delete project");
      return;
    }

    alert("Project deleted");
    loadProjects();

  } catch (err) {
    console.error("Delete project error:", err);
    alert("Something went wrong while deleting project");
  }
}