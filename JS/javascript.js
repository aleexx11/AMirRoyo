 // Java de las preguntas frecuentes
document.addEventListener('DOMContentLoaded', function() {
    const preguntas = document.querySelectorAll('.pregunta-item');

    preguntas.forEach(item => {
        const pregunta = item.querySelector('.pregunta');
        
        pregunta.addEventListener('click', () => {

            preguntas.forEach(otraPregunta => {
                if (otraPregunta !== item && otraPregunta.classList.contains('activo')) {
                    otraPregunta.classList.remove('activo');
                }
            });

            item.classList.toggle('activo');
        });
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const precioPorPersonaPorNoche = 300;
    const fechaEntrada = document.getElementById('fecha-entrada');
    const fechaSalida = document.getElementById('fecha-salida');
    const adultos = document.getElementById('adultos');
    const ninos = document.getElementById('ninos');
    const precioTotal = document.getElementById('precio-total');
    const formularioReserva = document.getElementById('formulario-reserva');

    // Configuración del calendario 
    const configCalendario = {
        dateFormat: "d/m/Y",
        minDate: "today",
        locale: {
            firstDayOfWeek: 1,
            weekdays: {
                shorthand: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
                longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
            },
            months: {
                shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
                longhand: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
            },
            rangeSeparator: ' a ',
            weekAbbreviation: 'Sem',
            scrollTitle: 'Desplázate para cambiar',
            toggleTitle: 'Haz clic para alternar',
            time_24hr: true
        },
        onChange: calcularPrecio
    };

    flatpickr(fechaEntrada, configCalendario);
    flatpickr(fechaSalida, configCalendario);

    // Calcular el precio del viaje
    function calcularPrecio() {
        const fechaInicio = flatpickr.parseDate(fechaEntrada.value, "d/m/Y");
        const fechaFin = flatpickr.parseDate(fechaSalida.value, "d/m/Y");
        const numPersonas = (parseInt(adultos.value) || 0) + (parseInt(ninos.value) || 0);

        if (fechaInicio && fechaFin && fechaFin >= fechaInicio) {
            const unDiaEnMs = 1000 * 60 * 60 * 24;
            const noches = Math.ceil((fechaFin - fechaInicio) / unDiaEnMs) + 1;
            const precioTotalCalculado = precioPorPersonaPorNoche * numPersonas * noches;

            precioTotal.textContent = `Precio Total: ${precioTotalCalculado}€`;
            return precioTotalCalculado;
        } else {
            precioTotal.textContent = 'Precio Total: 0€';
            return 0;
        }
    }

    // Para cambiar el precio automaticamente
    adultos.addEventListener('change', calcularPrecio);
    ninos.addEventListener('change', calcularPrecio);

    // Pop Enviar Formulario
    formularioReserva.addEventListener('submit', function(e) {
        e.preventDefault();
        const precio = calcularPrecio();
        if (precio === 0) {
            alert('Por favor, seleccione fechas válidas para la reserva.');
            return;
        }

        const datosReserva = {
            fechaEntrada: fechaEntrada.value,
            fechaSalida: fechaSalida.value,
            numAdultos: adultos.value,
            numNinos: ninos.value,
            precioTotal: precio
        };

        localStorage.setItem('datosReserva', JSON.stringify(datosReserva));

        window.location.href = 'confirmacion-compra.html';
    });
});

// Popup Enviar consulta

document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencia al formulario
    const formulario = document.getElementById('formulario-contacto');
    
    // Agregar evento de envío al formulario
    formulario.addEventListener('submit', function(event) {
        // Prevenir el comportamiento predeterminado del formulario
        event.preventDefault();
        
        // Crear el elemento de popup
        const popup = document.createElement('div');
        popup.className = 'popup-mensaje';
        popup.innerHTML = `
            <div class="popup-contenido">
                <h3>¡Consulta enviada!</h3>
                <p>Tu consulta ha sido enviada correctamente. Nos pondremos en contacto contigo lo antes posible.</p>
                <button id="cerrar-popup">Aceptar</button>
            </div>
        `;
        
        // Agregar estilos al popup
        popup.style.position = 'fixed';
        popup.style.top = '0';
        popup.style.left = '0';
        popup.style.width = '100%';
        popup.style.height = '100%';
        popup.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        popup.style.display = 'flex';
        popup.style.justifyContent = 'center';
        popup.style.alignItems = 'center';
        popup.style.zIndex = '1000';
        
        // Estilos para el contenido del popup
        const popupContenido = popup.querySelector('.popup-contenido');
        popupContenido.style.backgroundColor = 'white';
        popupContenido.style.padding = '20px';
        popupContenido.style.borderRadius = '5px';
        popupContenido.style.textAlign = 'center';
        popupContenido.style.maxWidth = '400px';
        popupContenido.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)';
        
        // Estilos para el botón
        const botonCerrar = popup.querySelector('#cerrar-popup');
        botonCerrar.style.backgroundColor = '#4CAF50';
        botonCerrar.style.color = 'white';
        botonCerrar.style.border = 'none';
        botonCerrar.style.padding = '10px 20px';
        botonCerrar.style.margin = '10px 0';
        botonCerrar.style.borderRadius = '4px';
        botonCerrar.style.cursor = 'pointer';
        
        // Agregar el popup al body
        document.body.appendChild(popup);
        
        // Función para cerrar el popup
        botonCerrar.addEventListener('click', function() {
            document.body.removeChild(popup);
            // Opcional: Resetear el formulario después de enviar
            formulario.reset();
        });
    });
});

// Sistema de autenticación simplificado para A MirRoyo
document.addEventListener("DOMContentLoaded", () => {
    const currentPage = window.location.pathname.split("/").pop()
  
    // Funciones básicas de autenticación
    function isLoggedIn() {
      return localStorage.getItem("currentUser") !== null
    }
  
    function getCurrentUser() {
      return isLoggedIn() ? JSON.parse(localStorage.getItem("currentUser")) : null
    }
  
    // Actualizar la interfaz según el estado de inicio de sesión
    function updateUI() {
      const userLoggedIn = isLoggedIn()
      const user = getCurrentUser()
  
      // Actualizar el header
      const loginLink = document.querySelector('.linksheader a[href*="iniciarsesion.html"]')
      if (loginLink) {
        if (userLoggedIn) {
          loginLink.textContent = `Hola, ${user.username}`
          loginLink.href = "#"
  
          if (!document.getElementById("logout-link")) {
            const logoutLink = document.createElement("a")
            logoutLink.id = "logout-link"
            logoutLink.href = "#"
            logoutLink.textContent = "Cerrar Sesión"
            logoutLink.onclick = (e) => {
              e.preventDefault()
              localStorage.removeItem("currentUser")
              alert("Has cerrado sesión correctamente")
              window.location.href = "../HTML/index.html"
            }
            loginLink.parentNode.appendChild(logoutLink)
          }
        } else {
          loginLink.textContent = "Iniciar Sesión"
          loginLink.href = "../HTML/iniciarsesion.html"
          const logoutLink = document.getElementById("logout-link")
          if (logoutLink) logoutLink.remove()
        }
      }
  
      // Proteger enlaces de reserva
      const reservaLinks = document.querySelectorAll(".boton-paquetes a, .boton-enviar a")
      reservaLinks.forEach((link) => {
        if (!userLoggedIn) {
          if (!link.getAttribute("data-original-href")) {
            link.setAttribute("data-original-href", link.href)
          }
          link.href = "#"
          link.onclick = (e) => {
            e.preventDefault()
            alert("Debes iniciar sesión para realizar una reserva")
            window.location.href = "../HTML/iniciarsesion.html"
          }
        } else {
          const originalHref = link.getAttribute("data-original-href")
          if (originalHref) link.href = originalHref
        }
      })
    }
  
    // Configurar página de inicio de sesión
    if (currentPage === "iniciarsesion.html") {
      const loginButton = document.getElementById("boton-enviar")
      if (loginButton) {
        loginButton.onclick = (e) => {
          e.preventDefault()
          const username = document.querySelector('.cuadrado input[type="text"]').value
          const password = document.querySelector('.cuadrado input[type="password"]').value
  
          if (!username || !password) {
            alert("Por favor, completa todos los campos")
            return
          }
  
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          const user = users.find((u) => u.username === username && u.password === password)
  
          if (user) {
            localStorage.setItem("currentUser", JSON.stringify(user))
            alert("¡Inicio de sesión exitoso!")
            window.location.href = "../HTML/index.html"
          } else {
            alert("Usuario o contraseña incorrectos")
          }
        }
      }
    }
  
    // Configurar página de registro
    if (currentPage === "registrarse.html") {
      const registerButton = document.querySelector(".cuadrado .boton")
      if (registerButton) {
        registerButton.onclick = (e) => {
          e.preventDefault()
          const inputs = document.querySelectorAll(".cuadrado input")
          const fullname = inputs[0].value
          const email = inputs[1].value
          const password = inputs[2].value
          const phone = inputs[3].value
  
          if (!fullname || !email || !password || !phone) {
            alert("Por favor, completa todos los campos")
            return
          }
  
          const users = JSON.parse(localStorage.getItem("users") || "[]")
          if (users.some((u) => u.username === fullname)) {
            alert("El nombre de usuario ya existe")
            return
          }
  
          const newUser = { username: fullname, email, password, phone }
          users.push(newUser)
          localStorage.setItem("users", JSON.stringify(users))
          localStorage.setItem("currentUser", JSON.stringify(newUser))
  
          alert("¡Registro exitoso!")
          window.location.href = "../HTML/index.html"
        }
      }
    }
  
    // Inicializar la interfaz
    updateUI()
  })
  
  