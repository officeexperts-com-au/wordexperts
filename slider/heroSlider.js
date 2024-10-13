document.addEventListener('DOMContentLoaded', function () {
    console.log('Hero Slider Script Loaded');
    var slides = document.querySelectorAll(".photos .block");
    var i = 0;

    function showSlide(index) {
        slides[i].classList.remove("active");
        slides[i].querySelectorAll(".icon").forEach(icon => {
            icon.classList.remove("animate"); // Remove animation class
        });

        i = index;
        slides[i].classList.add("active");
        slides[i].querySelectorAll(".icon").forEach(icon => {
            setTimeout(() => icon.classList.add("animate"), 10); // Slight delay to trigger the animation
        });
    }

    function showNextSlide() {
        showSlide((i + 1) % slides.length);
    }

    function showPrevSlide() {
        showSlide((i - 1 + slides.length) % slides.length);
    }

    var slideInterval = setInterval(showNextSlide, 6000);

    var nextBtn = document.querySelector(".next");
    var prevBtn = document.querySelector(".prev");

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener("click", function () {
            clearInterval(slideInterval);
            showNextSlide();
            slideInterval = setInterval(showNextSlide, 6100);
        });

        prevBtn.addEventListener("click", function () {
            clearInterval(slideInterval);
            showPrevSlide();
            slideInterval = setInterval(showNextSlide, 6100);
        });
    } else {
        console.error("Buttons not found");
    }
});
