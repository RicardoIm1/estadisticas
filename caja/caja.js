// 📸 Inicializa el escáner QR
function iniciarEscanerQR() {
  const qrScanner = new Html5Qrcode("qr-reader");
  const config = { fps: 10, qrbox: 250 };

  qrScanner.start(
    { facingMode: "environment" },
    config,
    (textoQR) => {
      document.getElementById("curp").value = textoQR;
      qrScanner.stop(); // Detiene escaneo tras lectura
    },
    (error) => {
      console.warn("Error escaneando:", error);
    }
  );
}

// Función para formatear hora hh:mm (FRONTEND)
function formatearHora(valor) {
  if (!valor) return "";
  
  // Si ya está en formato hh:mm, devolverlo tal cual
  if (typeof valor === 'string' && /^\d{2}:\d{2}$/.test(valor)) {
    return valor;
  }
  
  // Si es un objeto Date o timestamp
  const fecha = new Date(valor);
  if (!isNaN(fecha)) {
    return fecha.toLocaleTimeString("es-MX", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false // Formato 24 horas
    });
  }
  
  // Si es string con formato "8:42:52 p.m."
  if (typeof valor === 'string') {
    try {
      if (valor.includes('p.m.') || valor.includes('a.m.')) {
        const [horaPart] = valor.split(' ');
        const [horas, minutos] = horaPart.split(':');
        
        let horas24 = parseInt(horas);
        if (valor.includes('p.m.') && horas24 < 12) {
          horas24 += 12;
        } else if (valor.includes('a.m.') && horas24 === 12) {
          horas24 = 0;
        }
        
        return horas24.toString().padStart(2, '0') + ':' + minutos.padStart(2, '0');
      }
    } catch (e) {
      console.warn("Error formateando hora:", valor, e);
    }
  }
  
  return valor; // Devolver original si no se puede formatear
}

// 📋 Carga registros desde Google Sheets
function cargarTabla() {
  //fetch("https://script.google.com/macros/s/AKfycbzBL9Ms9YkkB_M8xnMepCSQ7zT3wXHTJXiM82GojntZy25bddXiQBp3QjxCrCEldNb6_g/exec")
  fetch("https://script.google.com/macros/s/AKfycbwEgr4ICW8Rx8aPf5JPCUEoGKF3fOs8Cz9aUv69q5Jpiwd0vhoE950niuuWegpgqq7i0g/exec")
    .then(res => res.json())
    .then(registros => {
      const cuerpoTabla = document.getElementById("tabla-pacientes");
      cuerpoTabla.innerHTML = "";

      registros.reverse().forEach(registro => {
        const fila = document.createElement("tr");
        [
          "FOLIO", "FECHA", "HORA", "CURP", "PATERNO", "MATERNO", "NOMBRE(S)",
          "FECHA DE NACIMIENTO", "SEXO", "ENTIDAD", "HOMOCLAVE", "MOTIVO", "EDAD", "CAJERA",
          "NUMERO DE REFERENCIA", "OBSERVACIONES"
        ].forEach(campo => {
          const celda = document.createElement("td");
          celda.textContent = registro[campo] || "";
          fila.appendChild(celda);
        });
        cuerpoTabla.appendChild(fila);
      });
    })
    .catch(err => {
      mostrarMensaje("❌ Error al cargar registros");
      console.error(err);
    });
}

// 🧾 Muestra mensajes al usuario
function mostrarMensaje(texto) {
  const msg = document.getElementById("mensaje");
  msg.textContent = texto;
  msg.style.display = "block";
  setTimeout(() => msg.style.display = "none", 3000);
}

// 🚀 Inicializa todo al cargar
window.onload = () => {
  iniciarEscanerQR();
  cargarTabla();
  document.getElementById("btn-enviar").addEventListener("click", enviarDatos);
};
// 🚀 Función para enviar datos al backend (AGREGA ESTOS LOGS)
function enviarDatos() {
  // Obtener datos del formulario
  const datos = {
    curp: document.getElementById("curp").value,
    paterno: document.getElementById("paterno").value,
    materno: document.getElementById("materno").value,
    nombres: document.getElementById("nombres").value,
    sexo: document.getElementById("sexo").value,
    entidad: document.getElementById("entidad").value,
    homoclave: document.getElementById("homoclave").value,
    motivo: document.getElementById("motivo").value,
    cajera: document.getElementById("cajera").value,
    referencia: document.getElementById("referencia").value,
    observaciones: document.getElementById("observaciones").value
  };

  // ✅ AGREGAR ESTOS LOGS:
  console.log("📤 DATOS A ENVIAR:", datos);

  //fetch("https://script.google.com/macros/s/AKfycbzBL9Ms9YkkB_M8xnMepCSQ7zT3wXHTJXiM82GojntZy25bddXiQBp3QjxCrCEldNb6_g/exec", {
  fetch("https://script.google.com/macros/s/AKfycbwEgr4ICW8Rx8aPf5JPCUEoGKF3fOs8Cz9aUv69q5Jpiwd0vhoE950niuuWegpgqq7i0g/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(datos)
  })
  .then(response => {
    console.log("📥 STATUS de respuesta:", response.status, response.statusText);
    return response.json();
  })
  .then(data => {
    console.log("✅ RESPUESTA del backend:", data);
    
    if (data.success) {
      console.log("🎉 Folio generado:", data.folio);
      mostrarMensaje("✅ " + data.message);
      cargarTabla(); // Recargar tabla
    } else {
      console.error("❌ Error:", data.error);
      mostrarMensaje("❌ Error: " + (data.error || "Error desconocido"));
    }
  })
  .catch(error => {
    console.error("💥 ERROR en fetch:", error);
    mostrarMensaje("❌ Error de conexión");
  });
}












