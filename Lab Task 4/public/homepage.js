document.addEventListener('DOMContentLoaded', function () {
    var myCarousel = document.getElementById('carouselExampleFade');
    var carousel = new bootstrap.Carousel(myCarousel, {
      interval: 5000, 
      pause: false 
    });
  });
  document.addEventListener('DOMContentLoaded', function () {
    var myCarousel = document.getElementById('carouselExampleFade');
    var carousel = new bootstrap.Carousel(myCarousel, {
      interval: 1000, 
      pause: false
    });
  
    setOpacity();
  
    myCarousel.addEventListener('slid.bs.carousel', function () {
      setOpacity(); 
    });
  
  
    function setOpacity() {
      var items = myCarousel.querySelectorAll('.carousel-item');
      items.forEach(function (item) {
        if (item.classList.contains('active')) {
          item.style.opacity = '1'; 
        } else {
          item.style.opacity = '0'; 
        }
      });
    }
  });
  
  