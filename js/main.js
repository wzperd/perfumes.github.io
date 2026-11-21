// Portafolio de Emanuel Jimenez Sanchez

const NUMERO_WHATSAPP = '18092184692';
const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.documentElement.classList.add('js');
document.getElementById('anio').textContent = new Date().getFullYear();


// ----- Nombre de la cabecera: cada letra se ilumina en cadena -----
(function () {
  const logo = document.querySelector('.logo');
  if (!logo || reducirMovimiento) return;

  const nombre = logo.textContent.trim();
  logo.setAttribute('aria-label', nombre);
  logo.textContent = '';

  [...nombre].forEach((c, i) => {
    const span = document.createElement('span');
    span.setAttribute('aria-hidden', 'true');
    if (c === ' ') {
      span.className = 'espacio';
    } else {
      span.className = 'letra';
      span.textContent = c;
      span.style.setProperty('--i', i);
    }
    logo.appendChild(span);
  });
})();


// ----- Frases que se escriben solas -----
(function () {
  const el = document.getElementById('escribiendo');
  if (!el || reducirMovimiento) return;

  const frases = el.dataset.frases.split('|').map(f => f.trim()).filter(Boolean);
  if (frases.length < 2) return;

  let frase = 0;
  let letras = frases[0].length;
  let borrando = true;

  function paso() {
    if (borrando) {
      letras--;
      el.textContent = frases[frase].slice(0, letras);
      if (letras <= 0) {
        borrando = false;
        frase = (frase + 1) % frases.length;
        return setTimeout(paso, 350);
      }
      return setTimeout(paso, 35);
    }

    letras++;
    el.textContent = frases[frase].slice(0, letras);
    if (letras >= frases[frase].length) {
      borrando = true;
      return setTimeout(paso, 1600);
    }
    setTimeout(paso, 75);
  }

  setTimeout(paso, 1800);
})();


// ----- Elementos que aparecen al hacer scroll -----
(function () {
  const elementos = document.querySelectorAll('.aparecer');

  if (!('IntersectionObserver' in window)) {
    elementos.forEach(el => el.classList.add('visto'));
    return;
  }

  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        entrada.target.classList.add('visto');
        observador.unobserve(entrada.target);
      }
    });
  }, { threshold: 0.12 });

  elementos.forEach(el => observador.observe(el));
})();


// ----- Contador de la sección Sobre Mí -----
(function () {
  if (reducirMovimiento || !('IntersectionObserver' in window)) return;

  document.querySelectorAll('[data-contar]').forEach(el => {
    const meta = parseInt(el.dataset.contar, 10);
    if (isNaN(meta)) return;

    el.textContent = '0';
    const observador = new IntersectionObserver((entradas) => {
      if (!entradas[0].isIntersecting) return;
      observador.disconnect();

      let n = 0;
      const timer = setInterval(() => {
        n++;
        el.textContent = n;
        if (n >= meta) clearInterval(timer);
      }, 120);
    }, { threshold: 0.6 });

    observador.observe(el);
  });
})();


// ----- Menú móvil y botón de subir -----
(function () {
  const menu = document.getElementById('enlaces');
  document.querySelectorAll('#enlaces .nav-link').forEach(enlace => {
    enlace.addEventListener('click', () => {
      if (menu.classList.contains('show')) {
        bootstrap.Collapse.getOrCreateInstance(menu).hide();
      }
    });
  });

  const btnSubir = document.getElementById('btnSubir');
  window.addEventListener('scroll', () => {
    btnSubir.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btnSubir.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reducirMovimiento ? 'auto' : 'smooth' });
  });
})();


// ----- Estrellas del inicio -----
(function () {
  const inicio = document.getElementById('inicio');
  const canvas = document.getElementById('estrellas');
  if (!inicio || !canvas || !canvas.getContext) return;

  const ctx = canvas.getContext('2d');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const colores = ['255,255,255', '255,255,255', '255,255,255', '180,200,255', '200,220,255'];

  let ancho = 0, alto = 0;
  let estrellas = [];
  let fugaces = [];
  let mx = 0, my = 0, objetivoX = 0, objetivoY = 0;
  let corriendo = false;
  let frame = 0;
  let anterior = 0;
  let proxima = 6000;

  function medir() {
    const r = inicio.getBoundingClientRect();
    ancho = Math.max(1, r.width);
    alto = Math.max(1, r.height);
    canvas.width = Math.round(ancho * dpr);
    canvas.height = Math.round(alto * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const cantidad = Math.min(Math.max(Math.round(ancho * alto / 5600), 55), 150);
    estrellas = [];
    for (let i = 0; i < cantidad; i++) {
      const z = Math.random() * 0.85 + 0.15;
      estrellas.push({
        x: Math.random() * ancho,
        y: Math.random() * alto,
        z: z,
        r: z * (Math.random() * 1.3 + 0.35),
        fase: Math.random() * 6.283,
        vel: Math.random() * 1.6 + 0.5,
        color: colores[Math.floor(Math.random() * colores.length)]
      });
    }
  }

  function dibujar(t, dt) {
    ctx.clearRect(0, 0, ancho, alto);

    mx += (objetivoX - mx) * 0.05;
    my += (objetivoY - my) * 0.05;
    inicio.style.setProperty('--mx', mx.toFixed(3));
    inicio.style.setProperty('--my', my.toFixed(3));

    estrellas.forEach(e => {
      if (dt) {
        e.x -= 0.012 * e.z * dt;
        if (e.x < -2) {
          e.x = ancho + 2;
          e.y = Math.random() * alto;
        }
      }
      const brillo = 0.5 + 0.5 * Math.sin(t * 0.0016 * e.vel + e.fase);
      const x = e.x + mx * 14 * e.z;
      const y = e.y + my * 10 * e.z;

      ctx.fillStyle = 'rgb(' + e.color + ')';
      ctx.globalAlpha = 0.18 + 0.6 * brillo;
      ctx.beginPath();
      ctx.arc(x, y, e.r, 0, 6.283);
      ctx.fill();

      if (e.r > 1.15) {
        ctx.globalAlpha = 0.12 * brillo;
        ctx.beginPath();
        ctx.arc(x, y, e.r * 3.2, 0, 6.283);
        ctx.fill();
      }
    });

    for (let i = fugaces.length - 1; i >= 0; i--) {
      const f = fugaces[i];
      f.vida -= dt;
      f.x += f.vx * dt;
      f.y += f.vy * dt;
      if (f.vida <= 0) {
        fugaces.splice(i, 1);
        continue;
      }
      const alfa = f.vida / f.total;
      const grad = ctx.createLinearGradient(f.x, f.y, f.x - f.vx * 120, f.y - f.vy * 120);
      grad.addColorStop(0, 'rgba(255,255,255,' + (0.7 * alfa) + ')');
      grad.addColorStop(1, 'rgba(200,215,240,0)');
      ctx.globalAlpha = 1;
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(f.x, f.y);
      ctx.lineTo(f.x - f.vx * 120, f.y - f.vy * 120);
      ctx.stroke();
    }
    ctx.globalAlpha = 1;
  }

  function animar(ahora) {
    if (!corriendo) return;
    const dt = Math.min(ahora - (anterior || ahora), 50);
    anterior = ahora;

    proxima -= dt;
    if (proxima <= 0) {
      const v = 0.55 + Math.random() * 0.45;
      fugaces.push({
        x: ancho * (0.35 + Math.random() * 0.6),
        y: Math.random() * alto * 0.35,
        vx: -v,
        vy: v * 0.45,
        vida: 900,
        total: 900
      });
      proxima = 9000 + Math.random() * 8000;
    }

    dibujar(ahora, dt);
    frame = requestAnimationFrame(animar);
  }

  function iniciar() {
    if (corriendo || reducirMovimiento) return;
    corriendo = true;
    anterior = 0;
    frame = requestAnimationFrame(animar);
  }

  function parar() {
    corriendo = false;
    cancelAnimationFrame(frame);
  }

  medir();
  dibujar(0, 0);
  if (reducirMovimiento) {
    window.addEventListener('resize', () => { medir(); dibujar(0, 0); });
    return;
  }

  let timerResize;
  window.addEventListener('resize', () => {
    clearTimeout(timerResize);
    timerResize = setTimeout(medir, 150);
  });

  inicio.addEventListener('pointermove', (e) => {
    const r = inicio.getBoundingClientRect();
    objetivoX = ((e.clientX - r.left) / r.width - 0.5) * 2;
    objetivoY = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }, { passive: true });
  inicio.addEventListener('pointerleave', () => { objetivoX = 0; objetivoY = 0; });

  // solo se anima mientras el inicio está a la vista
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entradas) => {
      entradas[0].isIntersecting ? iniciar() : parar();
    }).observe(inicio);
  } else {
    iniciar();
  }
  document.addEventListener('visibilitychange', () => {
    document.hidden ? parar() : iniciar();
  });
})();


// ----- Tarjetas de servicios: se inclinan hacia el cursor -----
(function () {
  if (reducirMovimiento) return;
  const INCLINACION = 9; // grados máximos

  document.querySelectorAll('.tarjeta').forEach(tarjeta => {
    let pendiente = 0;
    let px = 0, py = 0;

    function actualizar() {
      pendiente = 0;
      const r = tarjeta.getBoundingClientRect();
      const x = (px - r.left) / r.width;
      const y = (py - r.top) / r.height;
      tarjeta.style.setProperty('--ry', ((x - 0.5) * 2 * INCLINACION).toFixed(2) + 'deg');
      tarjeta.style.setProperty('--rx', ((0.5 - y) * 2 * INCLINACION).toFixed(2) + 'deg');
      tarjeta.style.setProperty('--gx', (x * 100).toFixed(1) + '%');
      tarjeta.style.setProperty('--gy', (y * 100).toFixed(1) + '%');
    }

    function salir() {
      tarjeta.classList.remove('activa');
      tarjeta.style.removeProperty('--rx');
      tarjeta.style.removeProperty('--ry');
    }

    tarjeta.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX;
      py = e.clientY;
      tarjeta.classList.add('activa');
      if (!pendiente) pendiente = requestAnimationFrame(actualizar);
    });
    tarjeta.addEventListener('pointerleave', salir);
    tarjeta.addEventListener('pointercancel', salir);
  });
})();


// ----- Formulario de contacto -----
(function () {
  const form = document.getElementById('formulario');
  if (!form) return;

  const caja = document.getElementById('formCaja');
  const barra = document.getElementById('progresoBarra');
  const boton = document.getElementById('btnEnviar');
  const nota = document.getElementById('formNota');
  const sub = document.getElementById('formSub');
  const contador = document.getElementById('contador');
  const nombre = document.getElementById('nombre');
  const correo = document.getElementById('correo');
  const mensaje = document.getElementById('mensaje');

  const NOTA = 'Se abrirá WhatsApp con tu mensaje listo para enviar.';
  const AVISO = 'Revisa los campos marcados.';
  let tocados = {};

  function esValido(campo) {
    if (campo === nombre) return campo.value.trim().length >= 2;
    if (campo === mensaje) return campo.value.trim().length >= 10;
    if (campo === correo) return campo.value.trim() === '' || campo.validity.valid;
    return true;
  }

  function pintar(campo) {
    const contenedor = campo.closest('.campo');
    const lleno = campo.value.trim() !== '';
    const bien = esValido(campo);
    contenedor.classList.toggle('valido', lleno && bien);
    contenedor.classList.toggle('invalido', !!tocados[campo.id] && !bien);
  }

  function actualizarProgreso() {
    let pct = 0;
    if (nombre.value.trim() !== '' && esValido(nombre)) pct += 45;
    if (mensaje.value.trim() !== '' && esValido(mensaje)) pct += 55;

    barra.style.width = pct + '%';
    caja.classList.toggle('listo', pct === 100);
    sub.textContent = pct === 100 ? 'Todo listo. Puedes enviarlo.' : 'Completa los campos y te respondo por WhatsApp.';
    if (pct === 100 && nota.textContent === AVISO) nota.textContent = NOTA;
  }

  [nombre, correo, mensaje].forEach(campo => {
    campo.addEventListener('input', () => {
      pintar(campo);
      actualizarProgreso();
      if (campo === mensaje) contador.textContent = campo.value.length + ' / 500';
    });
    campo.addEventListener('blur', () => {
      tocados[campo.id] = true;
      pintar(campo);
    });
  });

  // luz que sigue al cursor dentro de la tarjeta
  if (!reducirMovimiento) {
    caja.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = caja.getBoundingClientRect();
      caja.style.setProperty('--fx', (e.clientX - r.left).toFixed(0) + 'px');
      caja.style.setProperty('--fy', (e.clientY - r.top).toFixed(0) + 'px');
    });

    // onda al hacer click en el botón
    boton.addEventListener('pointerdown', (e) => {
      if (boton.dataset.estado !== 'normal') return;
      const r = boton.getBoundingClientRect();
      const onda = document.createElement('i');
      onda.className = 'onda';
      onda.style.left = (e.clientX - r.left) + 'px';
      onda.style.top = (e.clientY - r.top) + 'px';
      boton.appendChild(onda);
      setTimeout(() => onda.remove(), 700);
    });
  }

  function estado(nuevo) {
    boton.dataset.estado = nuevo;
    boton.disabled = nuevo !== 'normal';
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    tocados = { nombre: true, correo: true, mensaje: true };
    [nombre, correo, mensaje].forEach(pintar);

    const malo = [nombre, mensaje, correo].find(c => !esValido(c));
    if (malo) {
      caja.classList.remove('vibrar');
      void caja.offsetWidth; // reinicia la animación
      caja.classList.add('vibrar');
      malo.focus();
      nota.textContent = AVISO;
      return;
    }

    const temas = [...form.querySelectorAll('input[name="interes"]:checked')].map(c => c.value);
    let texto = 'Hola Emanuel, soy ' + nombre.value.trim() + '.';
    if (temas.length) texto += ' Me interesa: ' + temas.join(', ') + '.';
    texto += ' ' + mensaje.value.trim();
    if (correo.value.trim()) texto += ' Mi correo: ' + correo.value.trim();

    const url = 'https://wa.me/' + NUMERO_WHATSAPP + '?text=' + encodeURIComponent(texto);

    estado('cargando');
    nota.textContent = 'Preparando tu mensaje…';

    setTimeout(() => {
      estado('listo');
      caja.classList.add('enviado');
      nota.innerHTML = 'Mensaje listo. Si WhatsApp no se abrió, <a href="' + url + '" target="_blank" rel="noopener">toca aquí</a>.';
      window.open(url, '_blank', 'noopener');

      // limpia el formulario unos segundos después
      setTimeout(() => {
        form.reset();
        tocados = {};
        form.querySelectorAll('.campo').forEach(c => c.classList.remove('valido', 'invalido'));
        contador.textContent = '0 / 500';
        actualizarProgreso();
        caja.classList.remove('enviado');
        estado('normal');
        nota.textContent = NOTA;
      }, 4500);
    }, reducirMovimiento ? 0 : 900);
  });
})();
