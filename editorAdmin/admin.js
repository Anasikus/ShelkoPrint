async function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  const res = await fetch("../api/admin_login.php", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });

  const data = await res.json();
  const message = document.getElementById("message");

  if (data.success) {
    window.location.href = "dashboard.html";
  } else {
    message.textContent = data.message || "Неверные данные";
  }
}
document.addEventListener("DOMContentLoaded", function() {
    const reviewForm = document.getElementById("reviewForm");
    const reviewsList = document.getElementById("reviewsList");
    const stars = Array.from(document.querySelectorAll(".star-rating span"));
    let rating = 0;

    // Подсветка звезд
    stars.forEach((star, index) => {
        star.addEventListener("mouseenter", () => updateStars(index + 1));
        star.addEventListener("mouseleave", () => updateStars(rating));
        star.addEventListener("click", () => {
            rating = index + 1;
            updateStars(rating);
        });
    });

    function updateStars(value) {
        stars.forEach((s, i) => s.classList.toggle("selected", i < value));
    }

    // Загрузка отзывов с возможностью удаления
    function loadReviews() {
        fetch("../api/get_reviews.php")
            .then(res => res.json())
            .then(reviews => {
                reviewsList.innerHTML = "";
                if (reviews.length === 0) {
                    reviewsList.innerHTML = '<div class="no-reviews">Пока отзывов нет — будьте первым!</div>';
                    return;
                }

                reviews.forEach(r => {
                    const card = document.createElement("div");
                    card.classList.add("review-card");

                    const deleteBtn = document.createElement("button");
                    deleteBtn.textContent = "Удалить";
                    deleteBtn.dataset.id = r.id;

                    // Стили для кнопки удаления
                    deleteBtn.style.backgroundColor = "#ff4d4f";
                    deleteBtn.style.color = "#fff";
                    deleteBtn.style.border = "none";
                    deleteBtn.style.padding = "6px 12px";
                    deleteBtn.style.borderRadius = "6px";
                    deleteBtn.style.cursor = "pointer";
                    deleteBtn.style.fontSize = "0.9rem";
                    deleteBtn.style.transition = "background 0.3s";
                    deleteBtn.addEventListener("mouseenter", () => deleteBtn.style.backgroundColor = "#ff7875");
                    deleteBtn.addEventListener("mouseleave", () => deleteBtn.style.backgroundColor = "#ff4d4f");

                    deleteBtn.addEventListener("click", () => deleteReview(r.id));

                    card.innerHTML = `
                        <h3>${r.name}</h3>
                        <div class="stars">${"★".repeat(r.rating)}</div>
                        <p>${r.review}</p>
                        ${r.image ? `<img src="${r.image}" alt="Изображение отзыва">` : ""}
                        <span class="review-date">${r.date}</span>
                    `;

                    card.appendChild(deleteBtn);
                    reviewsList.appendChild(card);
                });
            });
    }

    // Добавление нового отзыва
    reviewForm.addEventListener("submit", e => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", document.getElementById("reviewName").value);
        formData.append("review", document.getElementById("reviewText").value);
        formData.append("rating", rating);
        const imageFile = document.getElementById("reviewImage").files[0];
        if (imageFile) formData.append("image", imageFile);

        fetch("../api/add_review.php", {
            method: "POST",
            body: formData
        })
        .then(res => res.text())
        .then(result => {
            if (result.trim() === "success") {
                alert("Отзыв успешно добавлен!");
                reviewForm.reset();
                rating = 0;
                updateStars(0);
                loadReviews();
            } else {
                alert("Ошибка: " + result);
            }
        });
    });

    // Удаление отзыва
    function deleteReview(id) {
        if (!confirm("Вы уверены, что хотите удалить этот отзыв?")) return;

        fetch("../api/delete_review.php", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `id=${id}`
        })
        .then(res => res.text())
        .then(result => {
            if (result.trim() === "success") {
                loadReviews();
            } else {
                alert("Ошибка при удалении: " + result);
            }
        });
    }

    loadReviews();
});
document.addEventListener("DOMContentLoaded", () => {
  const servicesGrid = document.getElementById("servicesGrid");
  const serviceForm = document.getElementById("serviceForm");

  // === ЗАГРУЗКА УСЛУГ ===
  function loadServices() {
    fetch("../api/get_services.php")
      .then(res => res.json())
      .then(services => {
        servicesGrid.innerHTML = "";
        services.forEach(s => renderServiceCard(s));
      });
  }

  // === РЕНДЕР КАРТОЧКИ ===
  function renderServiceCard(s) {
    const card = document.createElement("div");
    card.classList.add("hero", "glass");
    card.dataset.id = s.id;

    card.innerHTML = `
      <div class="hero-content view-mode">
        <h2>${s.title}</h2>
        <p>${s.description}</p>
        ${s.image ? `<img src="${s.image}" alt="${s.title}" class="service-img">` : ""}
        <div class="buttons">
          <button class="edit-btn">Редактировать</button>
          <button class="delete-btn">Удалить</button>
        </div>
      </div>

      <div class="hero-content edit-mode" style="display:none;">
        <input type="text" class="edit-title" value="${s.title}">
        <textarea class="edit-desc">${s.description}</textarea>
        <div class="edit-image">
          ${s.image ? `<img src="${s.image}" class="service-img-preview">` : ""}
          <input type="file" class="edit-file" accept="image/*">
        </div>
        <div class="buttons">
          <button class="save-btn">Сохранить</button>
          <button class="cancel-btn">Отмена</button>
        </div>
      </div>
    `;

    // === Обработчики ===
    const viewMode = card.querySelector(".view-mode");
    const editMode = card.querySelector(".edit-mode");

    // Удаление
    card.querySelector(".delete-btn").addEventListener("click", () => {
      if (!confirm("Удалить эту услугу?")) return;
      fetch("../api/delete_service.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${s.id}`
      }).then(() => loadServices());
    });

    // Переключение в режим редактирования
    card.querySelector(".edit-btn").addEventListener("click", () => {
      viewMode.style.display = "none";
      editMode.style.display = "block";
    });

    // Отмена редактирования
    card.querySelector(".cancel-btn").addEventListener("click", () => {
      editMode.style.display = "none";
      viewMode.style.display = "block";
    });

    // Сохранение изменений
    card.querySelector(".save-btn").addEventListener("click", () => {
      const title = card.querySelector(".edit-title").value.trim();
      const desc = card.querySelector(".edit-desc").value.trim();
      const file = card.querySelector(".edit-file").files[0];

      const formData = new FormData();
      formData.append("id", s.id);
      formData.append("title", title);
      formData.append("description", desc);
      if (file) formData.append("image", file);

      fetch("../api/update_service.php", { method: "POST", body: formData })
        .then(res => res.text())
        .then(result => {
          if (result.trim() === "success") {
            loadServices();
          } else alert("Ошибка: " + result);
        });
    });

    servicesGrid.appendChild(card);
  }

  // === ДОБАВЛЕНИЕ УСЛУГИ ===
  serviceForm.addEventListener("submit", e => {
    e.preventDefault();
    const formData = new FormData(serviceForm);

    fetch("../api/add_service.php", { method: "POST", body: formData })
      .then(res => res.text())
      .then(result => {
        if (result.trim() === "success") {
          serviceForm.reset();
          loadServices();
        } else alert("Ошибка: " + result);
      });
  });

  loadServices();
});
