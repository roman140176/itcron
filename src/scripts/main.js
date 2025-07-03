
import 'virtual:svg-icons-register'
if (import.meta.hot) {
  import.meta.hot.accept()
}

const burger = document.querySelector('.hero__burger');
const menu = document.querySelector('.hero__menu');
if(burger && menu){
  burger.addEventListener('click', () => {
    burger.classList.toggle('active');
    menu.classList.toggle('active');
  });
}

const shapes = document.querySelectorAll('.shape');

const floatingShapes = [];

shapes.forEach((shape, i) => {
  floatingShapes.push({
    el: shape,
    amplitudeX: 20 + Math.random() * 30, // размер колебания
    amplitudeY: 20 + Math.random() * 30,
    speedX: 0.1 + Math.random() * 0.3,   // МЕДЛЕННО
    speedY: 0.1 + Math.random() * 0.3,
    phase: Math.random() * Math.PI * 2
  });
});

function animate() {
  const time = Date.now() * 0.001; // время в секундах

  floatingShapes.forEach(shape => {
    const x = Math.sin(time * shape.speedX + shape.phase) * shape.amplitudeX;
    const y = Math.cos(time * shape.speedY + shape.phase) * shape.amplitudeY;

    shape.el.style.transform = `translate(${x}px, ${y}px)`;
  });

  requestAnimationFrame(animate);
}

animate();
