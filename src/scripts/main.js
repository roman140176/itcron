
import 'virtual:svg-icons-register'
if (import.meta.hot) {
  import.meta.hot.accept()
}
import IMask from 'imask';
import Swiper from 'swiper/bundle';
import 'swiper/css/bundle';

const swiper = new Swiper('.preview__slider', {
  // Optional parameters
  loop: false,
  slidesPerView:3,
  navigation: {
    nextEl: '.preview__slider-next',
    prevEl: '.preview__slider-prev',
  },  
  breakpoints:{
    0: {
      slidesPerView: 1.2,
    },
    479: {
      slidesPerView: 1.2,
    },
    480: {
      slidesPerView: 1.9,
    },
    639: {
      slidesPerView: 1.9,
    },
    640: {
      slidesPerView: 2.8,
    },
    959: {
      slidesPerView: 2.8,
    },
    960: {
      slidesPerView: 2.8,
    },
    1199: {
      slidesPerView: 2.8,
    },
    1200: {
      slidesPerView: 3.2,
    },
   },
  on: {
    init() {
      updateSlidesOpacity(this);
    },
    slideChangeTransitionStart() {
      updateSlidesOpacity(this);
    }
  }

});
function updateSlidesOpacity(sl) {
  const slides = sl.slides;
  const activeIndex = sl.activeIndex;

  slides.forEach((slide, index) => {
    if (index < activeIndex) {
      slide.classList.add('is-hidden');
    } else {
      slide.classList.remove('is-hidden');
    }
  });
}


const phoneInput = document.getElementById('phone');

const maskOptions = {
  mask: '+{7} (000) 000-00-00'
};

const mask = IMask(phoneInput, maskOptions);

document.addEventListener('DOMContentLoaded', () => {
  if(ymaps){
    ymaps.ready(init);

  }
});

  function init() {
    const myMap = new ymaps.Map("map", {
      center: [55.783480, 37.596317],
      zoom: 15,
      controls: ['zoomControl'] // добавь только нужные
    }, {
      suppressMapOpenBlock: true // убрать баннер "Открыть в Яндекс.Картах"
    });

    // Один кастомный маркер
    const myPlacemark = new ymaps.Placemark([55.783480, 37.596317], {
      balloonContent: 'Rocont'
    }, {
      iconLayout: 'default#image',
      iconImageHref: '/assets/images/pin.svg',
      iconImageSize: [40, 40],
      iconImageOffset: [-20, -40]
    });

    myMap.geoObjects.add(myPlacemark);

    // Ограничь поведение, если нужно
    myMap.behaviors.disable('scrollZoom'); // запрет колесика
  }

  document.addEventListener('click', (event) => {
    if (event.target.closest('.header__burger')) {
      document.querySelector('.header__menu').classList.toggle('active');
      document.querySelector('.header__burger').classList.toggle('active');
    }    
  });
  window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
  
    // Добавляем класс для плавного исчезновения
    preloader.classList.add('hide');
  
    // Ждём, пока завершится CSS-анимация, затем удаляем элемент
    setTimeout(() => {
      if (preloader && preloader.parentNode) {
        preloader.parentNode.removeChild(preloader);
      }
    }, 400); // чуть больше времени, чем transition в SCSS
  });

  
  document.addEventListener('DOMContentLoaded', () => {
    const ua = navigator.userAgent;
    const platform = navigator.platform;
  
    const isMac = /Macintosh/.test(ua) || /Mac/.test(platform);
    const isIOS = /iPhone|iPad|iPod/.test(ua);
    const isWindows = /Win/.test(platform) || /Windows/.test(ua);
  
    if (isMac || isIOS) {
      document.body.classList.add('is-apple');
    }
  
    if (isWindows) {
      document.body.classList.add('is-windows');
    }
  });
  
