// === Авторизация администратора ===
async function login() {
  const username = document.getElementById("username")?.value.trim() || "";
  const password = document.getElementById("password")?.value.trim() || "";

  if (!username || !password) {
    alert("Введите логин и пароль!");
    return;
  }

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
    if (message) message.textContent = data.message || "Неверные данные";
    else alert(data.message || "Неверные данные");
  }
}

// === Единый обработчик после загрузки DOM ===
document.addEventListener("DOMContentLoaded", () => {

  // === 1. Блок отзывов ===
  const reviewForm = document.getElementById("reviewForm");
  const reviewsList = document.getElementById("reviewsList");

  if (reviewForm && reviewsList) {
    const stars = Array.from(document.querySelectorAll(".star-rating span"));
    let rating = 0;

    function updateStars(value) {
      stars.forEach((s, i) => s.classList.toggle("selected", i < value));
    }

    stars.forEach((star, index) => {
      star.addEventListener("mouseenter", () => updateStars(index + 1));
      star.addEventListener("mouseleave", () => updateStars(rating));
      star.addEventListener("click", () => {
        rating = index + 1;
        updateStars(rating);
      });
    });

    function loadReviews() {
      fetch("../api/reviews/get_reviews.php")
        .then(res => res.json())
        .then(reviews => {
          reviewsList.innerHTML = "";
          if (!reviews.length) {
            reviewsList.innerHTML = '<div class="no-reviews">Пока отзывов нет — будьте первым!</div>';
            return;
          }

          reviews.forEach(r => {
            const card = document.createElement("div");
            card.classList.add("review-card");
            card.innerHTML = `
              <h3>${r.name}</h3>
              <div class="stars">${"★".repeat(r.rating)}</div>
              <p>${r.review}</p>
              ${r.image ? `<img src="${r.image}" alt="Изображение отзыва">` : ""}
              <span class="review-date">${r.date}</span>
              <button class="delete-btn" data-id="${r.id}">Удалить</button>
            `;
            card.querySelector(".delete-btn").addEventListener("click", () => deleteReview(r.id));
            reviewsList.appendChild(card);
          });
        });
    }

    reviewForm.addEventListener("submit", e => {
      e.preventDefault();
      const name = document.getElementById("reviewName").value.trim();
      const text = document.getElementById("reviewText").value.trim();
      if (!name || !text || rating === 0) {
        alert("Пожалуйста, заполните все поля и выберите рейтинг!");
        return;
      }
      const formData = new FormData(reviewForm);
      formData.set("rating", rating);

      fetch("../api/reviews/add_review.php", { method: "POST", body: formData })
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

    function deleteReview(id) {
      if (!confirm("Удалить отзыв?")) return;
      fetch("../api/reviews/delete_review.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${id}`
      })
        .then(res => res.text())
        .then(r => {
          if (r.trim() === "success") loadReviews();
          else alert("Ошибка удаления: " + r);
        });
    }

    loadReviews();
  }

  // === 2. Блок услуг ===
document.addEventListener("DOMContentLoaded", () => {
  const servicesGrid = document.getElementById("servicesGrid");
  const serviceForm = document.getElementById("serviceForm");

  // === Загрузка услуг ===
  function loadServices() {
    fetch("../api/services/get_services.php")
      .then(res => res.json())
      .then(services => {
        servicesGrid.innerHTML = "";

        services.forEach(s => {
          const card = document.createElement("div");
          card.classList.add("hero", "glass");

          card.innerHTML = `
            <div class="hero-content">
              <h1 class="service-title" contenteditable="false">${s.title}</h1>
              <p class="service-desc" contenteditable="false">${s.description}</p>
              ${s.image ? `<img src="${s.image}" style="max-width:200px;border-radius:10px;margin-top:10px;">` : ""}
              <div style="margin-top:10px;">
                <input type="file" class="update-image" accept="image/*" style="display:none;">
                <button class="edit-btn" data-id="${s.id}">Редактировать</button>
                <button class="update-btn" data-id="${s.id}" style="display:none;">Сохранить</button>
                <button class="cancel-btn" style="display:none;">Отмена</button>
                <button class="delete-btn" data-id="${s.id}">Удалить</button>
              </div>
            </div>
          `;
          servicesGrid.appendChild(card);
        });

        // === Удаление ===
        document.querySelectorAll(".delete-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            if (!confirm("Удалить эту услугу?")) return;
            const id = btn.dataset.id;
            fetch("../api/services/delete_service.php", {
              method: "POST",
              headers: { "Content-Type": "application/x-www-form-urlencoded" },
              body: `id=${id}`
            }).then(() => loadServices());
          });
        });

        // === Редактирование ===
        document.querySelectorAll(".edit-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const card = btn.closest(".hero-content");
            const title = card.querySelector(".service-title");
            const desc = card.querySelector(".service-desc");
            const fileInput = card.querySelector(".update-image");
            const saveBtn = card.querySelector(".update-btn");
            const cancelBtn = card.querySelector(".cancel-btn");

            // Включаем режим редактирования
            title.contentEditable = "true";
            desc.contentEditable = "true";
            title.classList.add("editable");
            desc.classList.add("editable");
            fileInput.style.display = "inline-block";
            saveBtn.style.display = "inline-block";
            cancelBtn.style.display = "inline-block";
            btn.style.display = "none";
          });
        });

        // === Отмена редактирования ===
        document.querySelectorAll(".cancel-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            loadServices(); // просто перезагружаем список
          });
        });

        // === Сохранение изменений ===
        document.querySelectorAll(".update-btn").forEach(btn => {
          btn.addEventListener("click", () => {
            const id = btn.dataset.id;
            const card = btn.closest(".hero-content");
            const title = card.querySelector(".service-title").textContent.trim();
            const desc = card.querySelector(".service-desc").textContent.trim();
            const imageFile = card.querySelector(".update-image").files[0];

            const formData = new FormData();
            formData.append("id", id);
            formData.append("title", title);
            formData.append("description", desc);
            if (imageFile) formData.append("image", imageFile);

            fetch("../api/services/update_service.php", {
              method: "POST",
              body: formData
            })
              .then(res => res.text())
              .then(result => {
                if (result.trim() === "success") {
                  loadServices();
                } else {
                  alert("Ошибка: " + result);
                }
              });
          });
        });
      });
  }

  // === Добавление новой услуги ===
  serviceForm.addEventListener("submit", e => {
    e.preventDefault();

    const title = document.getElementById("serviceTitle").value.trim();
    const description = document.getElementById("serviceDescription").value.trim();
    const imageFile = document.getElementById("serviceImage").files[0];

    if (!title || !description) {
      alert("Заполните все поля!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (imageFile) formData.append("image", imageFile);

    fetch("../api/services/add_service.php", {
      method: "POST",
      body: formData
    })
      .then(res => res.text())
      .then(result => {
        if (result.trim() === "success") {
          serviceForm.reset();
          loadServices();
        } else {
          alert("Ошибка: " + result);
        }
      });
  });

  loadServices();
});


  // === 3. Блок ассортимента ===
  const assortmentForm = document.getElementById("assortmentForm");
  const assortmentGrid = document.getElementById("assortmentGrid");

  if (assortmentForm && assortmentGrid) {
    function loadAssortment() {
      fetch("../api/assortment/get_items.php")
        .then(res => res.json())
        .then(items => {
          assortmentGrid.innerHTML = "";
          items.forEach(item => {
            const card = document.createElement("div");
            card.classList.add("hero", "glass");
            card.innerHTML = `
              <div class="hero-content">
                <input type="text" class="item-title" value="${item.title}">
                <textarea class="item-desc">${item.description}</textarea>
                <input type="number" class="item-price" value="${item.price}" step="0.01">
                ${item.image ? `<img src="../${item.image}" class="service-img">` : ""}
                <input type="file" class="update-image" accept="image/*">
                <div class="buttons">
                  <button class="update-btn" data-id="${item.id}">Сохранить</button>
                  <button class="delete-btn" data-id="${item.id}">Удалить</button>
                </div>
              </div>
            `;
            assortmentGrid.appendChild(card);
          });

          assortmentGrid.querySelectorAll(".update-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              const card = btn.closest(".hero-content");
              const id = btn.dataset.id;
              const title = card.querySelector(".item-title").value.trim();
              const desc = card.querySelector(".item-desc").value.trim();
              const price = card.querySelector(".item-price").value.trim();
              const imageFile = card.querySelector(".update-image").files[0];

              if (!title || !desc || !price) {
                alert("Поля не могут быть пустыми!");
                return;
              }

              const formData = new FormData();
              formData.append("id", id);
              formData.append("title", title);
              formData.append("description", desc);
              formData.append("price", price);
              if (imageFile) formData.append("image", imageFile);

              fetch("../api/assortment/update_item.php", { method: "POST", body: formData })
                .then(res => res.text())
                .then(r => {
                  if (r.trim() === "success") loadAssortment();
                  else alert("Ошибка сохранения: " + r);
                });
            });
          });

          assortmentGrid.querySelectorAll(".delete-btn").forEach(btn => {
            btn.addEventListener("click", () => {
              if (!confirm("Удалить товар?")) return;
              fetch("../api/assortment/delete_item.php", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: `id=${btn.dataset.id}`
              })
                .then(res => res.text())
                .then(r => {
                  if (r.trim() === "success") loadAssortment();
                  else alert("Ошибка удаления: " + r);
                });
            });
          });
        });
    }

    assortmentForm.addEventListener("submit", e => {
      e.preventDefault();

      const title = document.getElementById("itemTitle").value.trim();
      const description = document.getElementById("itemDesc").value.trim();
      const price = document.getElementById("itemPrice").value.trim();
      const imageFile = document.getElementById("itemImage").files[0];

      if (!title || !description || !price) {
        alert("Заполните все поля!");
        return;
      }

      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("price", price);
      if (imageFile) formData.append("image", imageFile);

      fetch("../api/assortment/add_item.php", { method: "POST", body: formData })
        .then(res => res.text())
        .then(r => {
          if (r.trim() === "success") {
            assortmentForm.reset();
            loadAssortment();
          } else {
            alert("Ошибка добавления: " + r);
          }
        });
    });

    loadAssortment();
  }

});
