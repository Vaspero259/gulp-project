  document.addEventListener('DOMContentLoaded', () => {
    const banner = document.getElementById('home');
    const texts = banner.querySelectorAll('.banner-text > div');
    const subs = banner.querySelectorAll('.banner-subtext > div');
    const pictures = banner.querySelectorAll('picture');
    let currentIndex = 0;
    const total = texts.length;

    function showSlide(index) {
      texts.forEach((el, i) => el.classList.toggle('active', i === index));
      subs.forEach((el, i) => el.classList.toggle('active', i === index));
      pictures.forEach((pic, i) => {
        if(i === index) {
          pic.classList.add('active');
        } else {
          pic.classList.remove('active');
        }
      });
    }

    setInterval(() => {
      currentIndex = (currentIndex + 1) % total;
      showSlide(currentIndex);
    }, 8000);

    showSlide(currentIndex);
  });