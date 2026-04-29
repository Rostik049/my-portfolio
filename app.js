// app.js — отримує дані про студента та його навички з Azure Functions API

async function loadApiData() {
  const box = document.getElementById("api-result");
  box.textContent = "Завантаження...";

  try {
    // Запит до Azure Functions (папка /api/about)
    const response = await fetch("/api/about");

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const data = await response.json();

    // Відображаємо дані у вигляді красивої картки
    renderStudentCard(box, data);
  } catch (error) {
    box.textContent = "Помилка: " + error.message;
    box.style.color = "#e74c3c";
  }
}

// Завантажуємо дані про студента автоматично при відкритті сторінки
loadApiData();

// Завантажує дані про навички з Azure Functions API
async function loadSkillsData() {
  const box = document.getElementById("skills-result");
  box.textContent = "Завантаження...";

  try {
    // Запит до Azure Functions (папка /api/skills)
    const response = await fetch("/api/skills");

    if (!response.ok) {
      throw new Error("HTTP " + response.status);
    }

    const skills = await response.json();

    // Відображаємо дані у вигляді progress bar
    renderSkillsProgressBars(box, skills);
  } catch (error) {
    box.textContent = "Помилка: " + error.message;
    box.style.color = "#e74c3c";
  }
}

// Завантажуємо дані про навички автоматично при відкритті сторінки
loadSkillsData();

// Відображає дані про навички у вигляді progress bar
function renderSkillsProgressBars(container, skills) {
  let html = "";

  skills.forEach((skill) => {
    const level = Math.min(100, Math.max(0, skill.level)); // 0-100
    let levelClass = "level-low";
    if (level >= 70) levelClass = "level-high";
    else if (level >= 50) levelClass = "level-medium";

    html += `
    <div class="skill-item">
      <div class="skill-header">
        <span class="skill-name">${skill.name}</span>
        <span class="skill-level">${level}%</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar-fill ${levelClass}" style="width: ${level}%">
        </div>
      </div>
    </div>
    `;
  });

  container.innerHTML = html;
}

// Відображає дані з API у вигляді структурованої картки
function renderStudentCard(container, data) {
  const fields = [
    { key: "name", label: "👤 Name" },
    { key: "email", label: "📧 Email" },
    { key: "specialty", label: "🎓 Speciality" },
    { key: "labs_done", label: "✅ Labs" },
    { key: "platform", label: "☁️ Platform" },
  ];
  const skillsHtml = (data.skills || [])
    .map((s) => `<span class="api-tag">${s}</span>`)
    .join("");
  let html = fields
    .map(
      (f) => `
    <div class="info-row">
      <span class="label">${f.label}</span>
      <span class="value">${data[f.key]}</span>
      </div>`,
    )
    .join("");
  html += `<div class="info-row"><span class="label">💪 Skills</span><div class="skills-tags">${skillsHtml}</div></div>`;
  html += `<p class="api-timestamp">🕑 Оновлено: ${data.deployed_at}</p>`;
  container.innerHTML = html;
}
