// Espera a que todo el contenido del DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", () => {

  // === Selección de elementos generales con manejo de errores ===
  const catalogo = document.querySelector(".catalogo");
  const items = document.querySelectorAll(".item");
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const navLogo = document.querySelector('#nav-logo');
  const backToTop = document.getElementById('backToTop');

  // =========================================================================
  // EFECTO DE APARICIÓN EN CASCADA AL HACER SCROLL CON MANEJO DE ERRORES
  // =========================================================================
  if (catalogo && items.length > 0) {
    try {
      const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.item');
            items.forEach((item, index) => {
              setTimeout(() => {
                item.classList.add("appear");
              }, 200 * (index + 1));
            });
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      observer.observe(catalogo);
    } catch (error) {
      console.warn('Error al inicializar el observer:', error);
      // Fallback: mostrar todos los items si el observer falla
      items.forEach(item => item.classList.add("appear"));
    }
  }

  // =========================================================================
  // MENÚ RESPONSIVE CON MANEJO DE ERRORES
  // =========================================================================
  if (navToggle && navMenu && navLogo) {
    try {
      navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        navLogo.classList.toggle('active');
        navLogo.classList.toggle('pulsing');
      });

      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
          navMenu.classList.remove('active');
          navToggle.classList.remove('active');
          navLogo.classList.remove('active');
          navLogo.classList.remove('pulsing');
        });
      });
    } catch (error) {
      console.warn('Error en la funcionalidad del menú:', error);
    }
  }

  // =========================================================================
  // CAMBIO DE COLOR DEL MENÚ AL HACER SCROLL CON MANEJO DE ERRORES
  // =========================================================================
  try {
    window.addEventListener("scroll", () => {
      const navbar = document.querySelector(".navbar");
      if (navbar) {
        if (window.scrollY > 80) {
          navbar.style.background = "rgba(30, 30, 30, 0.98)";
          navbar.style.boxShadow = "0 4px 20px rgba(0, 0, 0, 0.2)";
        } else {
          navbar.style.background = "rgba(30, 30, 30, 0.95)";
          navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
        }
      }

      // Mostrar/ocultar botón "Volver arriba"
      if (backToTop) {
        if (window.pageYOffset > 500) {
          backToTop.classList.add('visible');
        } else {
          backToTop.classList.remove('visible');
        }
      }
    });
  } catch (error) {
    console.warn('Error en la funcionalidad de scroll:', error);
  }

  // =========================================================================
  // BOTÓN "VOLVER ARRIBA" CON MANEJO DE ERRORES
  // =========================================================================
  if (backToTop) {
    try {
      backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    } catch (error) {
      console.warn('Error en el botón volver arriba:', error);
      // Fallback básico
      backToTop.addEventListener('click', () => {
        window.scrollTo(0, 0);
      });
    }
  }

  // =========================================================================
  // CARRUSEL DE IMÁGENES CON DESLIZAMIENTO (SLIDE) CON MANEJO DE ERRORES
  // =========================================================================
  try {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');

    if (slides.length > 0) {
      let currentSlide = 0;
      let isTransitioning = false;

      // Función principal: muestra un slide con animación de deslizamiento
      function showSlide(index, direction = 0) {
        if (isTransitioning) return;
        
        isTransitioning = true;

        // Validar rango
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;

        // Aplicar clases de animación según dirección
        if (direction === 1) {
          slides[currentSlide].className = 'carousel-slide prev';
          slides[index].className = 'carousel-slide next';
        } else if (direction === -1) {
          slides[currentSlide].className = 'carousel-slide next';
          slides[index].className = 'carousel-slide prev';
        }

        // Después de la transición, activar el nuevo slide
        setTimeout(() => {
          slides.forEach(slide => {
            slide.className = 'carousel-slide'; // reset
          });
          slides[index].classList.add('active');
          
          // Actualizar dots si existen
          if (dots.length > 0) {
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[index]) dots[index].classList.add('active');
          }
          
          isTransitioning = false;
        }, 600);

        currentSlide = index;
      }

      // Mover al siguiente o anterior (función global para onclick en HTML)
      window.moveSlide = function(direction) {
        if (isTransitioning) return;
        const nextIndex = direction === 1 ? currentSlide + 1 : currentSlide - 1;
        showSlide(nextIndex, direction);
      };

      // Ir a un slide específico
      function moveSlideTo(index) {
        if (index === currentSlide || isTransitioning) return;
        const direction = index > currentSlide ? 1 : -1;
        showSlide(index, direction);
      }

      // Eventos en los puntos (indicadores) si existen
      if (dots.length > 0) {
        dots.forEach((dot, index) => {
          dot.addEventListener('click', () => {
            moveSlideTo(index);
          });
        });
      }

      // Inicializar
      showSlide(currentSlide, 0);
    }
  } catch (error) {
    console.warn('Error en la funcionalidad del carrusel:', error);
  }

  // =========================================================================
  // LIGHTBOX: Imagen ampliada al hacer clic CON MANEJO DE ERRORES
  // =========================================================================
  try {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeLightbox = document.getElementById('close-lightbox');

    if (lightbox && lightboxImg && closeLightbox) {
      // Abrir lightbox al hacer clic en imagen del carrusel
      document.querySelectorAll('.carousel-slide img').forEach(img => {
        img.addEventListener('click', function () {
          try {
            const slide = this.closest('.carousel-slide');
            const caption = slide ? slide.querySelector('.carousel-text') : null;

            lightboxImg.src = this.src;
            lightboxCaption.innerHTML = caption ? caption.innerHTML : '';
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
          } catch (error) {
            console.warn('Error al abrir lightbox:', error);
          }
        });
      });

      // Cerrar con botón X
      closeLightbox.addEventListener('click', () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
      });

      // Cerrar al hacer clic fuera de la imagen
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Cerrar con tecla ESC
      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
          lightbox.classList.remove('active');
          document.body.style.overflow = '';
        }
      });
    }
  } catch (error) {
    console.warn('Error en la funcionalidad del lightbox:', error);
  }

  // =========================================================================
  // DETECCIÓN DE SWIPE EN MÓVILES CON MANEJO DE ERRORES
  // =========================================================================
  try {
    let touchStartX = 0;
    let touchEndX = 0;
    const threshold = 50; // Mínimo deslizamiento en px

    const carouselContainer = document.querySelector('.carousel-container');
    if (carouselContainer) {
      carouselContainer.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
      }, { passive: true });

      carouselContainer.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      }, { passive: true });
    }

    function handleSwipe() {
      if (touchStartX - touchEndX > threshold) {
        // Desliz izquierda → siguiente
        if (typeof window.moveSlide === 'function') {
          window.moveSlide(1);
        }
      } else if (touchEndX - touchStartX > threshold) {
        // Desliz derecha → anterior
        if (typeof window.moveSlide === 'function') {
          window.moveSlide(-1);
        }
      }
    }
  } catch (error) {
    console.warn('Error en la detección de swipe:', error);
  }
});

// =========================================================================
// PRELOADER: Ocultar cuando la página carga completamente CON MANEJO DE ERRORES
// =========================================================================
try {
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });
} catch (error) {
  console.warn('Error en la funcionalidad del preloader:', error);
  // Fallback: ocultar preloader después de 3 segundos
  setTimeout(() => {
    if (document.body) {
      document.body.classList.add("loaded");
    }
  }, 3000);
}