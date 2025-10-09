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

        // Add click ripple effect to glass elements
        document.querySelectorAll('.glass').forEach(element => {
            element.addEventListener('click', function(e) {
                const ripple = document.createElement('div');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    z-index: 1000;
                `;
                
                this.style.position = 'relative';
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation keyframes
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

        // Form submission handling
        document.querySelector('form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Create success message
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
            successMsg.textContent = 'Message sent successfully! We\'ll get back to you soon.';
            
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
                fetch("api/get_reviews.php")
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

                fetch("api/add_review.php", {
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
