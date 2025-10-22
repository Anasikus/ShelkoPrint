let currentPage = 'home';

        function showPage(pageId) {
            // Hide all pages
            document.querySelectorAll('.page').forEach(page => {
                page.classList.remove('active');
            });
            
            // Show selected page
            document.getElementById(pageId).classList.add('active');
            
            // Update navigation
            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('onclick') === `showPage('${pageId}')`) {
                    link.classList.add('active');
                }
            });
            
            currentPage = pageId;
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Add interactive parallax effect to background shapes
        document.addEventListener('mousemove', (e) => {
            const shapes = document.querySelectorAll('.shape');
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;
            
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const xPos = (x - 0.5) * speed * 20;
                const yPos = (y - 0.5) * speed * 20;
                shape.style.transform = `translate(${xPos}px, ${yPos}px)`;
            });
        });

        // Add scroll-based animations
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = document.querySelector('.bg-shapes');
            const speed = scrolled * 0.5;
            parallax.style.transform = `translateY(${speed}px)`;
        });

        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);

        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const successMsg = document.createElement('div');
            successMsg.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(46, 204, 113, 0.9);
                color: white;
                padding: 20px 40px;
                border-radius: 10px;
                backdrop-filter: blur(20px);
                z-index: 10000;
                animation: fadeIn 0.3s ease;
            `;
            successMsg.textContent = 'Сообщение успешно отправлено!';
            
            document.body.appendChild(successMsg);
            
            // Remove message after 3 seconds
            setTimeout(() => {
                successMsg.remove();
            }, 3000);
            
            // Reset form
            this.reset();
        });

        // Add fade in animation
        const fadeStyle = document.createElement('style');
        fadeStyle.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
            }
        `;
        document.head.appendChild(fadeStyle);

        document.addEventListener("DOMContentLoaded", function() {
            const reviewForm = document.getElementById("reviewForm");
            const reviewsList = document.getElementById("reviewsList");
            const stars = Array.from(document.querySelectorAll(".star-rating span"));
            let rating = 0;

            // Подсветка звёзд
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

            // Загрузка отзывов из БД
            function loadReviews() {
                fetch("api/reviews/get_reviews.php")
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
                            card.innerHTML = `
                                <h3>${r.name}</h3>
                                <div class="stars">${"★".repeat(r.rating)}</div>
                                <p>${r.review}</p>
                                ${r.image ? `<img src="${r.image}" alt="Изображение отзыва">` : ""}
                                <span class="review-date">${r.date}</span>
                            `;
                            reviewsList.appendChild(card);
                        });
                    });
            }

            reviewForm.addEventListener("submit", e => {
                e.preventDefault();

                const formData = new FormData();
                formData.append("name", document.getElementById("reviewName").value);
                formData.append("review", document.getElementById("reviewText").value);
                formData.append("rating", rating);
                const imageFile = document.getElementById("reviewImage").files[0];
                if (imageFile) formData.append("image", imageFile);

                fetch("api/reviews/add_review.php", {
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

            loadReviews();
        });
        
document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.querySelector('.nav-links');
    const navHeight = document.querySelector('header').offsetHeight;

    // Гамбургер
    if(navToggle && navLinks){
        navToggle.addEventListener('click', () => {
            navLinks.classList.toggle('show');
        });
    }

    // Плавный скролл с отступом 5px
    const links = document.querySelectorAll('nav .nav-links a, .footer-links a');
    links.forEach(link => {
        link.addEventListener('click', function(e){
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const target = document.getElementById(targetId);
            if(target){
                const topPosition = target.offsetTop - navHeight - 1; // 5px отступ
                window.scrollTo({
                    top: topPosition,
                    behavior: 'smooth'
                });

                // Закрываем мобильное меню после клика
                if(navLinks.classList.contains('show')){
                    navLinks.classList.remove('show');
                }
            }
        });
    });
});

document.getElementById('contactForm').addEventListener('submit', async function (e) {
e.preventDefault();

const form = e.target;
const formData = new FormData(form);
const status = document.getElementById('formStatus');
status.textContent = "Отправка...";

try {
    const response = await fetch(form.action, {
    method: 'POST',
    body: formData
    });

    const result = await response.text();

    if (response.ok) {
    status.style.color = "green";
    status.textContent = "Сообщение успешно отправлено!";
    form.reset();
    } else {
    throw new Error(result || "Ошибка при отправке");
    }
} catch (error) {
    status.style.color = "red";
    status.textContent = "Ошибка: " + error.message;
}
});

document.addEventListener("DOMContentLoaded", () => {

  const services = {
    pvd: { name: "ПВД пакеты с печатью" },
    maika: { name: "Пакет «Майка»" },
  };

  const availableColors = [
    "Белый", "Черный", "Красный", "Синий", "Зеленый", "Желтый", "Оранжевый", "Фиолетовый"
  ];

  // Категории размеров
  const sizeGroupsPVD = {
    "Маленький": { base: 19.18 },
    "Средний": { base: 28.09 },
    "Большой": { base: 28.09 }
  };

  const sizeGroupsMaika = {
    "Маленький": { base: 18.24 },
    "Большой": { base: 23.24 }
  };

  const qtyValues = [100, 200, 300, 500, 1000, 2000];

  const extraOptions = [
    { id: "over30", label: "Запечатка более 30% ( +20% )", factor: 0.20 },
    { id: "alignment", label: "Точное совмещение ( +10% )", factor: 0.10 },
    { id: "pantone", label: "Печать по Pantone ( +10% )", factor: 0.10 },
    { id: "gold", label: "Печать золотом/серебром ( +15% )", factor: 0.15 },
    { id: "clientMaterial", label: "Печать на продукции клиента ( +20% )", factor: 0.20 },
  ];

  let selectedService = "pvd";
  let selectedColorNames = [];

  const tbody = document.getElementById("tableBody");
  const serviceBtns = document.querySelectorAll(".service-btn");
  const sizeSelect = document.getElementById("sizeSelect");
  const colorSelector = document.getElementById("colorSelector");
  const colorSelectContainer = document.getElementById("colorSelectContainer");
  const optionsContainer = document.getElementById("extraOptions");

  // Рендер чекбоксов опций
  optionsContainer.innerHTML = "";
  extraOptions.forEach(opt => {
    const div = document.createElement("div");
    div.innerHTML = `<label><input type="checkbox" id="${opt.id}"> ${opt.label}</label>`;
    optionsContainer.appendChild(div);
  });

  serviceBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      serviceBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      selectedService = btn.dataset.service;
      updateSelectors();
      renderTable();
    });
  });

  [...optionsContainer.querySelectorAll("input"), sizeSelect].forEach(el =>
    el.addEventListener("change", renderTable)
  );

  function updateSelectors() {
    sizeSelect.innerHTML = "";
    const sizes = selectedService === "pvd" ? sizeGroupsPVD : sizeGroupsMaika;
    Object.keys(sizes).forEach(size => {
      sizeSelect.innerHTML += `<option value="${size}">${size}</option>`;
    });
  }

  function calculatePrice(service, size, colors, qty) {
    const baseGroup = service === "pvd" ? sizeGroupsPVD[size] : sizeGroupsMaika[size];
    if (!baseGroup) return 0;

    // Формулы для расчета
    const baseCost = 2000 * colors + baseGroup.base * qty;

    // Применяем доп. опции
    let total = baseCost;
    optionsContainer.querySelectorAll("input:checked").forEach(opt => {
      const option = extraOptions.find(o => o.id === opt.id);
      total *= 1 + option.factor;
    });

    return total / qty; // цена за штуку
  }

  function renderTable() {
    tbody.innerHTML = "";
    colorSelector.style.display = "none";

    qtyValues.forEach(qty => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${qty}</td>`;

      for (let colors = 1; colors <= 4; colors++) {
        const price = calculatePrice(selectedService, sizeSelect.value, colors, qty);
        tr.innerHTML += `<td data-qty="${qty}" data-colors="${colors}">${price.toFixed(2)} ₽</td>`;
      }

      tbody.appendChild(tr);
    });

    document.querySelectorAll("#priceTable td[data-qty]").forEach(cell => {
      cell.addEventListener("click", () => {
        document.querySelectorAll("#priceTable td.selected").forEach(td => td.classList.remove("selected"));
        cell.classList.add("selected");

        const qty = cell.dataset.qty;
        const colors = parseInt(cell.dataset.colors);
        const price = parseFloat(cell.textContent);
        updateSummary(qty, colors, price);
        showColorSelector(colors);
      });
    });
  }

  function showColorSelector(count) {
    colorSelector.style.display = "block";
    colorSelectContainer.innerHTML = "";

    for (let i = 1; i <= count; i++) {
      const select = document.createElement("select");
      select.className = "colorSelect";
      select.innerHTML = `<option disabled selected>Цвет ${i}</option>` +
        availableColors.map(c => `<option value="${c}">${c}</option>`).join("");
      colorSelectContainer.appendChild(select);
      select.addEventListener("change", updateSelectedColors);
    }
  }

  function updateSelectedColors() {
    selectedColorNames = [...document.querySelectorAll(".colorSelect")].map(s => s.value).filter(Boolean);
    document.getElementById("sumSelectedColors").textContent = selectedColorNames.join(", ") || "—";
  }

  function updateSummary(qty, colors, unitPrice) {
    const total = (unitPrice * qty).toFixed(2);
    const sizeText = sizeSelect.value;

    document.getElementById("sumType").textContent = services[selectedService].name;
    document.getElementById("sumSize").textContent = sizeText;
    document.getElementById("sumColors").textContent = `${colors} цвета`;
    document.getElementById("sumQty").textContent = `${qty} шт`;
    document.getElementById("sumUnit").textContent = `${unitPrice.toFixed(2)} ₽`;
    document.getElementById("sumTotal").textContent = `${total} ₽`;
  }

  updateSelectors();
  renderTable();
});
