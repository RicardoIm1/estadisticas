// ============================================================
// CONFIGURACIÓN SUPABASE
// ============================================================
const SUPABASE_URL = "https://njtlruvhcatklccdxpla.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5qdGxydXZoY2F0a2xjY2R4cGxhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUzMzIwOTIsImV4cCI6MjEwMDkwODA5Mn0.MzVwk4OWvahcUfP1KF_kHbLlIXWIbZ-wljce1i2Q1sc";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ============================================================
// ESTADO GLOBAL
// ============================================================
let state = {
  internos: [],
  eventos: [],
  participaciones: [],
  ponentes: [],
  currentFilter: "todos",
  editingId: null,
  currentTable: "internos",
};

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================
function showToast(message, type = "info", duration = 4000) {
  const container = document.getElementById("toastContainer");

  const configs = {
    success: {
      icon: "fa-check-circle",
      title: "¡Éxito!",
      className: "toast-success",
    },
    error: {
      icon: "fa-exclamation-circle",
      title: "¡Error!",
      className: "toast-error",
    },
    info: {
      icon: "fa-info-circle",
      title: "Información",
      className: "toast-info",
    },
    warning: {
      icon: "fa-exclamation-triangle",
      title: "Atención",
      className: "toast-warning",
    },
  };

  const config = configs[type] || configs.info;

  const toast = document.createElement("div");
  toast.className = `toast ${config.className}`;
  toast.innerHTML = `
    <i class="fas ${config.icon}"></i>
    <div class="toast-content">
      <div class="toast-title">${config.title}</div>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="this.closest('.toast').remove()">
      <i class="fas fa-times"></i>
    </button>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.classList.add("toast-exit");
      setTimeout(() => toast.remove(), 500);
    }
  }, duration);

  return toast;
}

// ============================================================
// NAVEGACIÓN
// ============================================================
function showSection(section) {
  document
    .querySelectorAll(".section")
    .forEach((el) => el.classList.remove("active"));

  const target = document.getElementById(`section-${section}`);
  if (target) target.classList.add("active");

  document
    .querySelectorAll(".nav-btn")
    .forEach((btn) => btn.classList.remove("active"));
  document
    .querySelector(`.nav-btn[data-section="${section}"]`)
    ?.classList.add("active");

  state.currentTable = section;
  switch (section) {
    case "internos":
      cargarInternos();
      break;
    case "eventos":
      cargarEventos();
      break;
    case "participaciones":
      cargarParticipaciones();
      break;
    case "ponentes":
      cargarPonentes();
      break;
  }
}

// ============================================================
// MODAL
// ============================================================
function openModal(content) {
  document.getElementById("modalContent").innerHTML = content;
  document.getElementById("modal").classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("modal").classList.remove("active");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

document.getElementById("modal").addEventListener("click", (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// ============================================================
// CRUD - INTERNOS
// ============================================================
async function cargarInternos() {
  try {
    const { data, error } = await supabaseClient
      .from("internos")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) throw error;

    state.internos = data;
    renderInternos(data);
    actualizarContadores(data);
  } catch (error) {
    console.error("Error cargando internos:", error);
    showToast("Error al cargar internos: " + error.message, "error");
  }
}

function renderInternos(internos) {
  const tbody = document.getElementById("tbodyInternos");

  if (!internos || internos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" class="empty-state">No hay internos registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = internos
    .map((interno) => {
      const iniciales = interno.nombre
        .split(" ")
        .filter((p) => p.length > 0)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      return `
      <tr>
        <td>
          <div class="avatar">
            ${interno.foto_url ? `<img src="${interno.foto_url}" />` : iniciales}
          </div>
        </td>
        <td><strong>${interno.matricula}</strong></td>
        <td>${interno.nombre}</td>
        <td>${interno.universidad}</td>
        <td>${interno.carrera}</td>
        <td>${interno.semestre}</td>
        <td><span class="status-badge ${interno.estatus}">${interno.estatus}</span></td>
        <td>
          <div class="acciones-cell">
            <button class="btn-edit btn-sm" onclick="editarInterno('${interno.id}')">
              <i class="fas fa-pen"></i>
            </button>
            <button class="btn-view btn-sm" onclick="verExpediente('${interno.id}')">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-delete btn-sm" onclick="eliminarInterno('${interno.id}')">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}

function actualizarContadores(internos) {
  const total = internos.length;
  const activos = internos.filter((i) => i.estatus === "activo").length;
  const inactivos = internos.filter((i) => i.estatus === "inactivo").length;

  document.getElementById("countTodos").textContent = total;
  document.getElementById("countActivos").textContent = activos;
  document.getElementById("countInactivos").textContent = inactivos;
  document.getElementById("navCountInternos").textContent = total;
}

function setFilter(filter) {
  state.currentFilter = filter;
  document.querySelectorAll(".filter-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.filter === filter);
  });
  filterInternos();
}

function filterInternos() {
  const search = document
    .getElementById("searchInput")
    .value.toLowerCase()
    .trim();
  let filtered = state.internos;

  if (state.currentFilter !== "todos") {
    filtered = filtered.filter((i) => i.estatus === state.currentFilter);
  }

  if (search) {
    filtered = filtered.filter(
      (i) =>
        i.nombre.toLowerCase().includes(search) ||
        i.matricula.includes(search) ||
        i.carrera.toLowerCase().includes(search),
    );
  }

  renderInternos(filtered);
}

function openFormInterno() {
  const content = `
    <h3><i class="fas fa-user-plus"></i> Nuevo Interno</h3>
    <form id="formInterno" onsubmit="guardarInterno(event)">
      <!-- ... campos existentes ... -->
      
      <!-- 👇 AGREGAR CAMPO DE FOTO -->
      <div class="form-group photo-group">
        <label>Foto</label>
        <div style="display: flex; align-items: center; gap: 16px;">
          <div id="previewFoto" style="width: 80px; height: 80px; border-radius: 50%; background: #f1f4f9; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px dashed var(--border);">
            <i class="fas fa-user-circle" style="font-size: 40px; color: #94a3b8;"></i>
          </div>
          <div>
            <input type="file" id="f_foto" accept="image/jpeg,image/png,image/webp" onchange="previsualizarFoto(event)" style="display: none;" />
            <button type="button" onclick="document.getElementById('f_foto').click()" style="background: var(--primary-gradient); color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
              <i class="fas fa-upload"></i> Subir Foto
            </button>
            <button type="button" onclick="eliminarFoto()" style="background: #fee2e2; color: #dc2626; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; margin-left: 8px;">
              <i class="fas fa-trash"></i> Eliminar
            </button>
            <p style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Formatos: JPG, PNG, WEBP · Max: 5MB</p>
          </div>
        </div>
      </div>
      
      <div class="form-actions">
        <button type="submit" class="btn-save"><i class="fas fa-save"></i> Guardar</button>
        <button type="button" class="btn-cancel" onclick="closeModal()">Cancelar</button>
      </div>
    </form>
  `;
  openModal(content);
  state.editingId = null;
}

async function guardarInterno(event) {
  event.preventDefault();

  const data = {
    nombre: document.getElementById("f_nombre").value.trim().toUpperCase(),
    universidad: document
      .getElementById("f_universidad")
      .value.trim()
      .toUpperCase(),
    carrera: document.getElementById("f_carrera").value.trim().toUpperCase(),
    semestre: document.getElementById("f_semestre").value.trim().toUpperCase(),
    generacion: document
      .getElementById("f_generacion")
      .value.trim()
      .toUpperCase(),
    correo: document.getElementById("f_correo").value.trim().toLowerCase(),
    curp: document.getElementById("f_curp").value.trim().toUpperCase() || null,
    rfc: document.getElementById("f_rfc").value.trim().toUpperCase() || null,
    telefono:
      document.getElementById("f_telefono").value.trim().toUpperCase() || null,
    tipo_sanguineo: document.getElementById("f_tipo_sanguineo").value || null,
    alergias:
      document.getElementById("f_alergias").value.trim().toUpperCase() || null,
    contacto_emergencia:
      document.getElementById("f_contacto").value.trim().toUpperCase() || null,
    telefono_emergencia:
      document
        .getElementById("f_telefono_emergencia")
        .value.trim()
        .toUpperCase() || null,
    estatus: "activo",
  };

  try {
    let result;
    if (state.editingId) {
      const { data, error } = await supabaseClient
        .from("internos")
        .update(data)
        .eq("id", state.editingId)
        .select()
        .single();
      if (error) throw error;
      result = data;
      showToast("Interno actualizado correctamente", "success");
    } else {
      data.matricula = await generarMatricula();
      const { data, error } = await supabaseClient
        .from("internos")
        .insert([data])
        .select()
        .single();
      if (error) throw error;
      result = data;
      showToast(
        `✅ Interno registrado. Matrícula: ${result.matricula}`,
        "success",
      );
    }

    closeModal();
    cargarInternos();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al guardar: " + error.message, "error");
  }
}

async function generarMatricula() {
  let intentos = 0;
  while (intentos < 100) {
    const matricula = Math.floor(100000 + Math.random() * 900000).toString();
    const { data } = await supabaseClient
      .from("internos")
      .select("matricula")
      .eq("matricula", matricula)
      .maybeSingle();
    if (!data) return matricula;
    intentos++;
  }
  throw new Error("No se pudo generar una matrícula única");
}

async function editarInterno(id) {
  try {
    const { data, error } = await supabaseClient
      .from("internos")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;

    state.editingId = id;

    // Determinar si tiene foto para mostrarla
    const tieneFoto = data.foto_url && data.foto_url.length > 0;

    const content = `
      <h3><i class="fas fa-user-edit"></i> Editar Interno</h3>
      <form id="formInterno" onsubmit="guardarInterno(event)">
        <div class="form-group">
          <label>Nombre Completo *</label>
          <input type="text" id="f_nombre" value="${data.nombre}" required autofocus />
        </div>
        <div class="form-group">
          <label>Universidad *</label>
          <input type="text" id="f_universidad" value="${data.universidad}" required />
        </div>
        <div class="form-group">
          <label>Carrera *</label>
          <input type="text" id="f_carrera" value="${data.carrera}" required />
        </div>
        <div class="form-group">
          <label>Semestre *</label>
          <input type="text" id="f_semestre" value="${data.semestre}" required />
        </div>
        <div class="form-group">
          <label>Generación *</label>
          <input type="text" id="f_generacion" value="${data.generacion}" required />
        </div>
        <div class="form-group">
          <label>Correo *</label>
          <input type="email" id="f_correo" value="${data.correo}" required />
        </div>
        <div class="form-group">
          <label>CURP</label>
          <input type="text" id="f_curp" value="${data.curp || ""}" />
        </div>
        <div class="form-group">
          <label>RFC</label>
          <input type="text" id="f_rfc" value="${data.rfc || ""}" />
        </div>
        <div class="form-group">
          <label>Teléfono</label>
          <input type="text" id="f_telefono" value="${data.telefono || ""}" />
        </div>
        <div class="form-group">
          <label>Tipo Sanguíneo</label>
          <select id="f_tipo_sanguineo">
            <option value="">Seleccionar</option>
            ${["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
              .map(
                (t) =>
                  `<option value="${t}" ${data.tipo_sanguineo === t ? "selected" : ""}>${t}</option>`,
              )
              .join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Alergias</label>
          <input type="text" id="f_alergias" value="${data.alergias || ""}" />
        </div>
        <div class="form-group">
          <label>Contacto de Emergencia</label>
          <input type="text" id="f_contacto" value="${data.contacto_emergencia || ""}" />
        </div>
        <div class="form-group">
          <label>Teléfono de Emergencia</label>
          <input type="text" id="f_telefono_emergencia" value="${data.telefono_emergencia || ""}" />
        </div>
        <div class="form-group">
          <label>Estatus</label>
          <select id="f_estatus">
            <option value="activo" ${data.estatus === "activo" ? "selected" : ""}>ACTIVO</option>
            <option value="inactivo" ${data.estatus === "inactivo" ? "selected" : ""}>INACTIVO</option>
          </select>
        </div>

        <!-- 👇 CAMPO DE FOTO AGREGADO -->
        <div class="form-group photo-group">
          <label>Foto</label>
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
            <div id="previewFoto" style="width: 80px; height: 80px; border-radius: 50%; background: #f1f4f9; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px dashed var(--border);">
              ${
                tieneFoto
                  ? `<img src="${data.foto_url}" style="width: 100%; height: 100%; object-fit: cover;" />`
                  : `<i class="fas fa-user-circle" style="font-size: 40px; color: #94a3b8;"></i>`
              }
            </div>
            <div>
              <input type="file" id="f_foto" accept="image/jpeg,image/png,image/webp" onchange="previsualizarFoto(event)" style="display: none;" />
              <button type="button" onclick="document.getElementById('f_foto').click()" style="background: var(--primary-gradient); color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-upload"></i> Subir Foto
              </button>
              <button type="button" onclick="eliminarFoto()" style="background: #fee2e2; color: #dc2626; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600; margin-left: 8px;">
                <i class="fas fa-trash"></i> Eliminar
              </button>
              <p style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Formatos: JPG, PNG, WEBP · Max: 5MB</p>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-save"><i class="fas fa-save"></i> Actualizar</button>
          <button type="button" class="btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    `;
    openModal(content);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al cargar: " + error.message, "error");
  }
}

async function eliminarInterno(id) {
  if (!confirm("¿Estás seguro de eliminar este interno?")) return;
  try {
    const { error } = await supabaseClient
      .from("internos")
      .delete()
      .eq("id", id);
    if (error) throw error;
    showToast("Interno eliminado correctamente", "success");
    cargarInternos();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al eliminar: " + error.message, "error");
  }
}

function verExpediente(id) {
  const interno = state.internos.find((i) => i.id === id);
  if (!interno) {
    showToast("Interno no encontrado", "error");
    return;
  }

  const iniciales = interno.nombre
    .split(" ")
    .filter((p) => p.length > 0)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const content = `
    <h3><i class="fas fa-id-card"></i> Expediente</h3>
    <div style="background: linear-gradient(145deg, #0f2b5e, #1a56db); border-radius: 12px; padding: 20px; color: white;">
      <div style="display: flex; gap: 16px; align-items: center;">
        <div style="width: 64px; height: 64px; border-radius: 50%; background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; flex-shrink: 0;">
          ${interno.foto_url ? `<img src="${interno.foto_url}" style="width:64px;height:64px;border-radius:50%;object-fit:cover;" />` : iniciales}
        </div>
        <div>
          <div style="font-size: 18px; font-weight: 800; text-transform: uppercase;">${interno.nombre}</div>
          <div style="font-size: 13px; opacity: 0.8;"><i class="fas fa-id-card"></i> ${interno.matricula}</div>
          <div style="font-size: 13px; opacity: 0.8;"><i class="fas fa-university"></i> ${interno.universidad}</div>
          <div style="font-size: 13px; opacity: 0.8;"><i class="fas fa-graduation-cap"></i> ${interno.carrera}</div>
          <div style="margin-top: 6px;"><span class="status-badge ${interno.estatus}">${interno.estatus}</span></div>
        </div>
      </div>
      <div style="margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); display: flex; gap: 10px;">
        <button onclick="closeModal(); generarReconocimiento('${interno.id}')" style="background: #059669; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
          <i class="fas fa-award"></i> Reconocimiento
        </button>
        <button onclick="closeModal(); imprimirCredencialIndividual('${interno.id}')" style="background: #2563eb; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer; font-weight: 600;">
          <i class="fas fa-print"></i> Credencial
        </button>
      </div>
    </div>
  `;
  openModal(content);
}

// ============================================================
// CRUD - EVENTOS
// ============================================================
async function cargarEventos() {
  try {
    const { data, error } = await supabaseClient
      .from("eventos")
      .select("*")
      .order("fecha_inicio", { ascending: false });

    if (error) throw error;
    state.eventos = data;
    renderEventos(data);
    document.getElementById("navCountEventos").textContent = data.length;
  } catch (error) {
    console.error("Error cargando eventos:", error);
    showToast("Error al cargar eventos: " + error.message, "error");
  }
}

function renderEventos(eventos) {
  const tbody = document.getElementById("tbodyEventos");
  if (!eventos || eventos.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No hay eventos registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = eventos
    .map(
      (evento) => `
    <tr>
      <td><strong>${evento.nombre}</strong></td>
      <td><span style="background: ${evento.tipo === "curso" ? "#dbeafe" : evento.tipo === "taller" ? "#dcfce7" : "#fef3c7"}; padding: 2px 10px; border-radius: 12px; font-size: 11px; font-weight: 600;">${evento.tipo || "otro"}</span></td>
      <td>${evento.fecha_inicio ? new Date(evento.fecha_inicio).toLocaleDateString("es-MX") : "-"}</td>
      <td>${evento.horas || "-"}</td>
      <td>
        <div class="acciones-cell">
          <button class="btn-edit btn-sm" onclick="editarEvento('${evento.id}')"><i class="fas fa-pen"></i></button>
          <button class="btn-delete btn-sm" onclick="eliminarEvento('${evento.id}')"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

function filterEventos() {
  const search = document
    .getElementById("searchEventos")
    .value.toLowerCase()
    .trim();
  const filtered = state.eventos.filter((e) =>
    e.nombre.toLowerCase().includes(search),
  );
  renderEventos(filtered);
}

function openFormEvento() {
  const content = `
    <h3><i class="fas fa-calendar-plus"></i> Nuevo Evento</h3>
    <form id="formEvento" onsubmit="guardarEvento(event)">
      <div class="form-group">
        <label>Nombre del Evento *</label>
        <input type="text" id="f_evento_nombre" placeholder="Nombre del evento" required autofocus />
      </div>
      <div class="form-group">
        <label>Tipo</label>
        <select id="f_evento_tipo">
          <option value="curso">Curso</option>
          <option value="taller">Taller</option>
          <option value="conferencia">Conferencia</option>
          <option value="seminario">Seminario</option>
          <option value="otro">Otro</option>
        </select>
      </div>
      <div class="form-group">
        <label>Fecha de Inicio</label>
        <input type="date" id="f_evento_fecha" />
      </div>
      <div class="form-group">
        <label>Horas</label>
        <input type="number" id="f_evento_horas" placeholder="0" min="0" />
      </div>
      <div class="form-group">
        <label>Lugar</label>
        <input type="text" id="f_evento_lugar" placeholder="Lugar del evento" />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-save"><i class="fas fa-save"></i> Guardar</button>
        <button type="button" class="btn-cancel" onclick="closeModal()">Cancelar</button>
      </div>
    </form>
  `;
  openModal(content);
  state.editingId = null;
}

async function guardarEvento(event) {
  event.preventDefault();
  const data = {
    nombre: document
      .getElementById("f_evento_nombre")
      .value.trim()
      .toUpperCase(),
    tipo: document.getElementById("f_evento_tipo").value,
    fecha_inicio: document.getElementById("f_evento_fecha").value || null,
    horas: parseInt(document.getElementById("f_evento_horas").value) || 0,
    lugar:
      document.getElementById("f_evento_lugar").value.trim().toUpperCase() ||
      null,
  };

  try {
    if (state.editingId) {
      const { error } = await supabaseClient
        .from("eventos")
        .update(data)
        .eq("id", state.editingId);
      if (error) throw error;
      showToast("Evento actualizado correctamente", "success");
    } else {
      const { error } = await supabaseClient.from("eventos").insert([data]);
      if (error) throw error;
      showToast("Evento creado correctamente", "success");
    }
    closeModal();
    cargarEventos();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al guardar: " + error.message, "error");
  }
}

async function editarEvento(id) {
  try {
    const { data, error } = await supabaseClient
      .from("eventos")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;

    state.editingId = id;
    const content = `
      <h3><i class="fas fa-calendar-edit"></i> Editar Evento</h3>
      <form id="formEvento" onsubmit="guardarEvento(event)">
        <div class="form-group">
          <label>Nombre del Evento *</label>
          <input type="text" id="f_evento_nombre" value="${data.nombre}" required autofocus />
        </div>
        <div class="form-group">
          <label>Tipo</label>
          <select id="f_evento_tipo">
            ${["curso", "taller", "conferencia", "seminario", "otro"]
              .map(
                (t) =>
                  `<option value="${t}" ${data.tipo === t ? "selected" : ""}>${t.charAt(0).toUpperCase() + t.slice(1)}</option>`,
              )
              .join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Fecha de Inicio</label>
          <input type="date" id="f_evento_fecha" value="${data.fecha_inicio || ""}" />
        </div>
        <div class="form-group">
          <label>Horas</label>
          <input type="number" id="f_evento_horas" value="${data.horas || 0}" min="0" />
        </div>
        <div class="form-group">
          <label>Lugar</label>
          <input type="text" id="f_evento_lugar" value="${data.lugar || ""}" placeholder="Lugar del evento" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-save"><i class="fas fa-save"></i> Actualizar</button>
          <button type="button" class="btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    `;
    openModal(content);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al cargar: " + error.message, "error");
  }
}

async function eliminarEvento(id) {
  if (!confirm("¿Estás seguro de eliminar este evento?")) return;
  try {
    const { error } = await supabaseClient
      .from("eventos")
      .delete()
      .eq("id", id);
    if (error) throw error;
    showToast("Evento eliminado correctamente", "success");
    cargarEventos();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al eliminar: " + error.message, "error");
  }
}

// ============================================================
// CRUD - PARTICIPACIONES
// ============================================================
async function cargarParticipaciones() {
  try {
    const { data, error } = await supabaseClient
      .from("participaciones_internos")
      .select(
        `
        *,
        internos:interno_id (id, nombre, matricula),
        eventos:evento_id (id, nombre, tipo)
      `,
      )
      .order("created_at", { ascending: false });

    if (error) throw error;
    state.participaciones = data;
    renderParticipaciones(data);
    document.getElementById("navCountParticipaciones").textContent =
      data.length;
  } catch (error) {
    console.error("Error cargando participaciones:", error);
    showToast("Error al cargar participaciones: " + error.message, "error");
  }
}

function renderParticipaciones(participaciones) {
  const tbody = document.getElementById("tbodyParticipaciones");
  if (!participaciones || participaciones.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="empty-state">No hay participaciones registradas</td></tr>`;
    return;
  }

  tbody.innerHTML = participaciones
    .map((p) => {
      const interno = p.internos || {};
      const evento = p.eventos || {};
      return `
      <tr>
        <td>${interno.nombre || "N/A"}</td>
        <td>${evento.nombre || "N/A"}</td>
        <td><span style="color: ${getColorDesempenio(p.desempenio)}; font-weight: 600;">${p.desempenio || "Pendiente"}</span></td>
        <td>${p.calificacion ? p.calificacion + "%" : "-"}</td>
        <td>${p.certificado_url ? "✅" : "❌"}</td>
        <td>
          <div class="acciones-cell">
            <button class="btn-edit btn-sm" onclick="editarParticipacion('${p.id}')"><i class="fas fa-pen"></i></button>
            <button class="btn-delete btn-sm" onclick="eliminarParticipacion('${p.id}')"><i class="fas fa-trash"></i></button>
          </div>
        </td>
      </tr>
    `;
    })
    .join("");
}

function getColorDesempenio(desempenio) {
  const colores = {
    Excelente: "#22c55e",
    Bueno: "#3b82f6",
    Regular: "#f59e0b",
    Deficiente: "#ef4444",
    Pendiente: "#94a3b8",
  };
  return colores[desempenio] || "#94a3b8";
}

function openFormParticipacion() {
  const internosOptions = state.internos
    .map((i) => `<option value="${i.id}">${i.nombre} (${i.matricula})</option>`)
    .join("");

  const eventosOptions = state.eventos
    .map((e) => `<option value="${e.id}">${e.nombre}</option>`)
    .join("");

  const content = `
    <h3><i class="fas fa-link"></i> Nueva Participación</h3>
    <form id="formParticipacion" onsubmit="guardarParticipacion(event)">
      <div class="form-group">
        <label>Interno *</label>
        <select id="f_part_interno" required>
          <option value="">Seleccionar Interno</option>
          ${internosOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Evento *</label>
        <select id="f_part_evento" required>
          <option value="">Seleccionar Evento</option>
          ${eventosOptions}
        </select>
      </div>
      <div class="form-group">
        <label>Desempeño</label>
        <select id="f_part_desempenio">
          <option value="Pendiente">Pendiente</option>
          <option value="Excelente">Excelente</option>
          <option value="Bueno">Bueno</option>
          <option value="Regular">Regular</option>
          <option value="Deficiente">Deficiente</option>
        </select>
      </div>
      <div class="form-group">
        <label>Calificación (%)</label>
        <input type="number" id="f_part_calificacion" placeholder="0-100" min="0" max="100" />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-save"><i class="fas fa-save"></i> Guardar</button>
        <button type="button" class="btn-cancel" onclick="closeModal()">Cancelar</button>
      </div>
    </form>
  `;
  openModal(content);
}

async function guardarParticipacion(event) {
  event.preventDefault();
  const data = {
    interno_id: document.getElementById("f_part_interno").value,
    evento_id: document.getElementById("f_part_evento").value,
    desempenio: document.getElementById("f_part_desempenio").value,
    calificacion:
      parseFloat(document.getElementById("f_part_calificacion").value) || null,
  };

  if (!data.interno_id || !data.evento_id) {
    showToast("Selecciona un interno y un evento", "warning");
    return;
  }

  try {
    const { error } = await supabaseClient
      .from("participaciones_internos")
      .insert([data]);
    if (error) throw error;
    showToast("Participación registrada correctamente", "success");
    closeModal();
    cargarParticipaciones();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al guardar: " + error.message, "error");
  }
}

async function editarParticipacion(id) {
  try {
    const { data, error } = await supabaseClient
      .from("participaciones_internos")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;

    const internosOptions = state.internos
      .map(
        (i) =>
          `<option value="${i.id}" ${i.id === data.interno_id ? "selected" : ""}>${i.nombre} (${i.matricula})</option>`,
      )
      .join("");

    const eventosOptions = state.eventos
      .map(
        (e) =>
          `<option value="${e.id}" ${e.id === data.evento_id ? "selected" : ""}>${e.nombre}</option>`,
      )
      .join("");

    const content = `
      <h3><i class="fas fa-link"></i> Editar Participación</h3>
      <form id="formParticipacion" onsubmit="actualizarParticipacion(event, '${id}')">
        <div class="form-group">
          <label>Interno *</label>
          <select id="f_part_interno" required>${internosOptions}</select>
        </div>
        <div class="form-group">
          <label>Evento *</label>
          <select id="f_part_evento" required>${eventosOptions}</select>
        </div>
        <div class="form-group">
          <label>Desempeño</label>
          <select id="f_part_desempenio">
            ${["Pendiente", "Excelente", "Bueno", "Regular", "Deficiente"]
              .map(
                (d) =>
                  `<option value="${d}" ${d === data.desempenio ? "selected" : ""}>${d}</option>`,
              )
              .join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Calificación (%)</label>
          <input type="number" id="f_part_calificacion" value="${data.calificacion || ""}" placeholder="0-100" min="0" max="100" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-save"><i class="fas fa-save"></i> Actualizar</button>
          <button type="button" class="btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    `;
    openModal(content);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al cargar: " + error.message, "error");
  }
}

async function actualizarParticipacion(event, id) {
  event.preventDefault();
  const data = {
    interno_id: document.getElementById("f_part_interno").value,
    evento_id: document.getElementById("f_part_evento").value,
    desempenio: document.getElementById("f_part_desempenio").value,
    calificacion:
      parseFloat(document.getElementById("f_part_calificacion").value) || null,
  };

  try {
    const { error } = await supabaseClient
      .from("participaciones_internos")
      .update(data)
      .eq("id", id);
    if (error) throw error;
    showToast("Participación actualizada correctamente", "success");
    closeModal();
    cargarParticipaciones();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al actualizar: " + error.message, "error");
  }
}

async function eliminarParticipacion(id) {
  if (!confirm("¿Estás seguro de eliminar esta participación?")) return;
  try {
    const { error } = await supabaseClient
      .from("participaciones_internos")
      .delete()
      .eq("id", id);
    if (error) throw error;
    showToast("Participación eliminada correctamente", "success");
    cargarParticipaciones();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al eliminar: " + error.message, "error");
  }
}

// ============================================================
// CRUD - PONENTES
// ============================================================
async function cargarPonentes() {
  try {
    const { data, error } = await supabaseClient
      .from("ponentes")
      .select("*")
      .order("nombre", { ascending: true });

    if (error) throw error;
    state.ponentes = data;
    renderPonentes(data);
    document.getElementById("navCountPonentes").textContent = data.length;
  } catch (error) {
    console.error("Error cargando ponentes:", error);
    if (
      error.message.includes("relation") &&
      error.message.includes("does not exist")
    ) {
      document.getElementById("tbodyPonentes").innerHTML = `
        <tr><td colspan="5" class="empty-state">
          <i class="fas fa-database" style="font-size: 32px; display: block; margin-bottom: 8px; opacity: 0.4;"></i>
          Tabla "ponentes" no encontrada. Créala en Supabase.
        </td></tr>
      `;
    } else {
      showToast("Error al cargar ponentes: " + error.message, "error");
    }
  }
}

function renderPonentes(ponentes) {
  const tbody = document.getElementById("tbodyPonentes");
  if (!ponentes || ponentes.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5" class="empty-state">No hay ponentes registrados</td></tr>`;
    return;
  }

  tbody.innerHTML = ponentes
    .map(
      (p) => `
    <tr>
      <td><strong>${p.nombre}</strong></td>
      <td>${p.especialidad || "-"}</td>
      <td>${p.institucion || "-"}</td>
      <td>${p.correo || "-"}</td>
      <td>
        <div class="acciones-cell">
          <button class="btn-edit btn-sm" onclick="editarPonente('${p.id}')"><i class="fas fa-pen"></i></button>
          <button class="btn-delete btn-sm" onclick="eliminarPonente('${p.id}')"><i class="fas fa-trash"></i></button>
          <button class="btn-view btn-sm" onclick="generarReconocimientoPonente('${p.id}')"><i class="fas fa-award"></i></button>
        </div>
      </td>
    </tr>
  `,
    )
    .join("");
}

function filterPonentes() {
  const search = document
    .getElementById("searchPonentes")
    .value.toLowerCase()
    .trim();
  const filtered = state.ponentes.filter((p) =>
    p.nombre.toLowerCase().includes(search),
  );
  renderPonentes(filtered);
}

function openFormPonente() {
  const content = `
    <h3><i class="fas fa-chalkboard-teacher"></i> Nuevo Ponente</h3>
    <form id="formPonente" onsubmit="guardarPonente(event)">
      <div class="form-group">
        <label>Nombre *</label>
        <input type="text" id="f_ponente_nombre" placeholder="Nombre completo" required autofocus />
      </div>
      <div class="form-group">
        <label>Especialidad</label>
        <input type="text" id="f_ponente_especialidad" placeholder="Especialidad" />
      </div>
      <div class="form-group">
        <label>Institución</label>
        <input type="text" id="f_ponente_institucion" placeholder="Institución" />
      </div>
      <div class="form-group">
        <label>Correo</label>
        <input type="email" id="f_ponente_correo" placeholder="correo@ejemplo.com" />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn-save"><i class="fas fa-save"></i> Guardar</button>
        <button type="button" class="btn-cancel" onclick="closeModal()">Cancelar</button>
      </div>
    </form>
  `;
  openModal(content);
}

async function guardarPonente(event) {
  event.preventDefault();
  const data = {
    nombre: document
      .getElementById("f_ponente_nombre")
      .value.trim()
      .toUpperCase(),
    especialidad:
      document
        .getElementById("f_ponente_especialidad")
        .value.trim()
        .toUpperCase() || null,
    institucion:
      document
        .getElementById("f_ponente_institucion")
        .value.trim()
        .toUpperCase() || null,
    correo:
      document.getElementById("f_ponente_correo").value.trim().toLowerCase() ||
      null,
  };

  try {
    const { error } = await supabaseClient.from("ponentes").insert([data]);
    if (error) throw error;
    showToast("Ponente registrado correctamente", "success");
    closeModal();
    cargarPonentes();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al guardar: " + error.message, "error");
  }
}

async function editarPonente(id) {
  try {
    const { data, error } = await supabaseClient
      .from("ponentes")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;

    const content = `
      <h3><i class="fas fa-user-edit"></i> Editar Ponente</h3>
      <form id="formPonente" onsubmit="actualizarPonente(event, '${id}')">
        <div class="form-group">
          <label>Nombre *</label>
          <input type="text" id="f_ponente_nombre" value="${data.nombre}" required autofocus />
        </div>
        <div class="form-group">
          <label>Especialidad</label>
          <input type="text" id="f_ponente_especialidad" value="${data.especialidad || ""}" />
        </div>
        <div class="form-group">
          <label>Institución</label>
          <input type="text" id="f_ponente_institucion" value="${data.institucion || ""}" />
        </div>
        <div class="form-group">
          <label>Correo</label>
          <input type="email" id="f_ponente_correo" value="${data.correo || ""}" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-save"><i class="fas fa-save"></i> Actualizar</button>
          <button type="button" class="btn-cancel" onclick="closeModal()">Cancelar</button>
        </div>
      </form>
    `;
    openModal(content);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al cargar: " + error.message, "error");
  }
}

async function actualizarPonente(event, id) {
  event.preventDefault();
  const data = {
    nombre: document
      .getElementById("f_ponente_nombre")
      .value.trim()
      .toUpperCase(),
    especialidad:
      document
        .getElementById("f_ponente_especialidad")
        .value.trim()
        .toUpperCase() || null,
    institucion:
      document
        .getElementById("f_ponente_institucion")
        .value.trim()
        .toUpperCase() || null,
    correo:
      document.getElementById("f_ponente_correo").value.trim().toLowerCase() ||
      null,
  };

  try {
    const { error } = await supabaseClient
      .from("ponentes")
      .update(data)
      .eq("id", id);
    if (error) throw error;
    showToast("Ponente actualizado correctamente", "success");
    closeModal();
    cargarPonentes();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al actualizar: " + error.message, "error");
  }
}

async function eliminarPonente(id) {
  if (!confirm("¿Estás seguro de eliminar este ponente?")) return;
  try {
    const { error } = await supabaseClient
      .from("ponentes")
      .delete()
      .eq("id", id);
    if (error) throw error;
    showToast("Ponente eliminado correctamente", "success");
    cargarPonentes();
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al eliminar: " + error.message, "error");
  }
}

// ============================================================
// GENERAR RECONOCIMIENTO
// ============================================================
function generarReconocimiento(internoId) {
  const interno = state.internos.find((i) => i.id === internoId);
  if (!interno) return;

  const nombrePonente = prompt("Nombre del ponente:");
  if (!nombrePonente) return;

  const evento = prompt("Nombre del evento:");
  if (!evento) return;

  const fecha = prompt("Fecha del evento (DD/MM/AAAA):");
  if (!fecha) return;

  const horas = prompt("Horas impartidas:");
  if (!horas) return;

  const contenido = `
    <div style="text-align: center; padding: 30px; border: 3px solid #1a56db; border-radius: 16px; max-width: 600px; margin: 0 auto; background: white;">
      <div style="font-size: 56px; color: #f59e0b; margin-bottom: 10px;"><i class="fas fa-award"></i></div>
      <h2 style="font-size: 28px; font-weight: 800; color: #0f172a; text-transform: uppercase;">Reconocimiento</h2>
      <p style="color: #475569; font-size: 14px; margin: 12px 0;">Se otorga el presente reconocimiento a:</p>
      <h3 style="font-size: 24px; font-weight: 700; color: #1a56db; text-transform: uppercase; margin: 12px 0;">${nombrePonente}</h3>
      <p style="color: #475569; font-size: 14px; margin: 8px 0;">Por su valiosa participación como <strong>PONENTE</strong> en el evento:</p>
      <h4 style="font-size: 20px; font-weight: 700; color: #0f172a; text-transform: uppercase;">${evento}</h4>
      <p style="color: #475569; font-size: 13px; margin: 8px 0;">Impartiendo <strong>${horas} horas</strong> de formación académica.</p>
      <p style="color: #475569; font-size: 13px; margin: 8px 0;">Fecha: ${fecha}</p>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #e2e8f0;">
        <p style="font-size: 12px; color: #94a3b8;">Hospital Regional Puerto Vallarta</p>
      </div>
    </div>
  `;

  openModal(contenido);
  document.querySelector(".modal .modal-actions")?.remove();
  const actions = document.createElement("div");
  actions.className = "form-actions";
  actions.innerHTML = `
    <button onclick="window.print()" class="btn-save"><i class="fas fa-print"></i> Imprimir</button>
    <button onclick="closeModal()" class="btn-cancel">Cerrar</button>
  `;
  document.querySelector(".modal").appendChild(actions);
}

function generarReconocimientoPonente(id) {
  const ponente = state.ponentes.find((p) => p.id === id);
  if (!ponente) {
    showToast("Ponente no encontrado", "error");
    return;
  }

  const evento = prompt("Nombre del evento:");
  if (!evento) return;

  const fecha = prompt("Fecha del evento (DD/MM/AAAA):");
  if (!fecha) return;

  const horas = prompt("Horas impartidas:");
  if (!horas) return;

  const contenido = `
    <div style="text-align: center; padding: 30px; border: 3px solid #1a56db; border-radius: 16px; max-width: 600px; margin: 0 auto; background: white;">
      <div style="font-size: 56px; color: #f59e0b; margin-bottom: 10px;"><i class="fas fa-award"></i></div>
      <h2 style="font-size: 28px; font-weight: 800; color: #0f172a; text-transform: uppercase;">Reconocimiento</h2>
      <p style="color: #475569; font-size: 14px; margin: 12px 0;">Se otorga el presente reconocimiento a:</p>
      <h3 style="font-size: 24px; font-weight: 700; color: #1a56db; text-transform: uppercase; margin: 12px 0;">${ponente.nombre}</h3>
      <p style="color: #475569; font-size: 14px; margin: 8px 0;">Por su valiosa participación como <strong>PONENTE</strong> en el evento:</p>
      <h4 style="font-size: 20px; font-weight: 700; color: #0f172a; text-transform: uppercase;">${evento}</h4>
      <p style="color: #475569; font-size: 13px; margin: 8px 0;">Impartiendo <strong>${horas} horas</strong> de formación académica.</p>
      <p style="color: #475569; font-size: 13px; margin: 8px 0;">Fecha: ${fecha}</p>
      <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #e2e8f0;">
        <p style="font-size: 12px; color: #94a3b8;">Hospital Regional Puerto Vallarta</p>
      </div>
    </div>
  `;

  openModal(contenido);
  document.querySelector(".modal .modal-actions")?.remove();
  const actions = document.createElement("div");
  actions.className = "form-actions";
  actions.innerHTML = `
    <button onclick="window.print()" class="btn-save"><i class="fas fa-print"></i> Imprimir</button>
    <button onclick="closeModal()" class="btn-cancel">Cerrar</button>
  `;
  document.querySelector(".modal").appendChild(actions);
}

// ============================================================
// IMPRIMIR CREDENCIALES
// ============================================================
async function imprimirMultiplesCredenciales() {
  try {
    const internos = state.internos.filter((i) => i.estatus === "activo");
    if (!internos || internos.length === 0) {
      showToast("No hay internos activos para imprimir", "warning");
      return;
    }

    let html = `
      <h3><i class="fas fa-print"></i> Credenciales (${internos.length} activos)</h3>
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; padding: 10px 0;">
    `;

    internos.forEach((interno, index) => {
      const iniciales = interno.nombre
        .split(" ")
        .filter((p) => p.length > 0)
        .map((p) => p[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

      html += `
        <div style="background: linear-gradient(145deg, #0f2b5e, #1a56db); border-radius: 12px; padding: 16px; color: white; border: 2px solid #1a56db; height: 350px; display: flex; flex-direction: column; overflow: hidden;">
          <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 6px; margin-bottom: 8px; flex-shrink: 0;">
            <h3 style="font-size: 12px; font-weight: 800;">Hospital Regional PV</h3>
            <p style="font-size: 8px; opacity: 0.7;">Credencial de Interno</p>
          </div>
          <div style="display: flex; gap: 10px; align-items: center; flex: 1; min-height: 0; overflow: hidden;">
            ${
              interno.foto_url
                ? `<img src="${interno.foto_url}" style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.25); flex-shrink: 0; object-fit: cover;" />`
                : `<div style="width: 52px; height: 52px; border-radius: 50%; border: 2px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: 700; flex-shrink: 0;">${iniciales}</div>`
            }
            <div style="flex: 1; min-width: 0; overflow: hidden;">
              <div style="font-size: 11px; font-weight: 800; text-transform: uppercase; white-space: normal; word-wrap: break-word; word-break: break-word; max-height: 28px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;">${interno.nombre}</div>
              <div style="font-size: 8.5px; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><i class="fas fa-id-card" style="width: 14px; font-size: 8px;"></i> ${interno.matricula}</div>
              <div style="font-size: 8.5px; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><i class="fas fa-university" style="width: 14px; font-size: 8px;"></i> ${interno.universidad}</div>
              <div style="font-size: 8.5px; opacity: 0.8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;"><i class="fas fa-graduation-cap" style="width: 14px; font-size: 8px;"></i> ${interno.carrera}</div>
            </div>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 6px; padding-top: 6px; border-top: 1px solid rgba(255,255,255,0.12); flex-shrink: 0; height: 44px; overflow: hidden;">
            <div style="background: white; padding: 3px; border-radius: 6px; flex-shrink: 0;">
              <div id="qr-${index}" style="width: 38px; height: 38px;"></div>
            </div>
            <span style="font-size: 7px; padding: 2px 10px; border-radius: 20px; font-weight: 800; text-transform: uppercase; background: rgba(34,197,94,0.25); color: #86efac; border: 1px solid rgba(34,197,94,0.2);">ACTIVO</span>
          </div>
        </div>
      `;
    });

    html += `</div>`;
    html += `
      <div class="form-actions">
        <button onclick="window.print()" class="btn-save"><i class="fas fa-print"></i> Imprimir</button>
        <button onclick="closeModal()" class="btn-cancel">Cerrar</button>
      </div>
    `;

    openModal(html);

    setTimeout(() => {
      internos.forEach((interno, index) => {
        const container = document.getElementById(`qr-${index}`);
        if (container) {
          container.innerHTML = "";
          generarQR(container, interno, 60);
        }
      });
    }, 100);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al generar credenciales: " + error.message, "error");
  }
}

function generarQR(container, interno, size) {
  try {
    const texto = `HRPV|${interno.matricula}|${interno.nombre.substring(0, 15)}`;
    const qr = new QRCode(container, {
      text: texto,
      width: size,
      height: size,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.L,
    });
    return qr;
  } catch (e) {
    console.warn("Error generando QR:", e);
  }
}

function imprimirCredencialIndividual(id) {
  const interno = state.internos.find((i) => i.id === id);
  if (!interno) return;

  const iniciales = interno.nombre
    .split(" ")
    .filter((p) => p.length > 0)
    .map((p) => p[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const html = `
    <h3><i class="fas fa-id-card"></i> Credencial</h3>
    <div style="background: linear-gradient(145deg, #0f2b5e, #1a56db); border-radius: 12px; padding: 20px; color: white; max-width: 340px; margin: 0 auto;">
      <div style="text-align: center; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 10px; margin-bottom: 12px;">
        <h3 style="font-size: 16px; font-weight: 800;">Hospital Regional PV</h3>
        <p style="font-size: 11px; opacity: 0.7;">Credencial de Interno</p>
      </div>
      <div style="display: flex; gap: 14px; align-items: center;">
        ${
          interno.foto_url
            ? `<img src="${interno.foto_url}" style="width: 68px; height: 68px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3); object-fit: cover; flex-shrink: 0;" />`
            : `<div style="width: 68px; height: 68px; border-radius: 50%; border: 3px solid rgba(255,255,255,0.3); background: rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; font-size: 28px; font-weight: 700; flex-shrink: 0;">${iniciales}</div>`
        }
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 16px; font-weight: 800; text-transform: uppercase;">${interno.nombre}</div>
          <div style="font-size: 12px; opacity: 0.8;"><i class="fas fa-id-card" style="width: 16px;"></i> ${interno.matricula}</div>
          <div style="font-size: 12px; opacity: 0.8;"><i class="fas fa-university" style="width: 16px;"></i> ${interno.universidad}</div>
          <div style="font-size: 12px; opacity: 0.8;"><i class="fas fa-graduation-cap" style="width: 16px;"></i> ${interno.carrera}</div>
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 12px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.12);">
        <div style="background: white; padding: 4px; border-radius: 8px;">
          <div id="qr-individual" style="width: 55px; height: 55px;"></div>
        </div>
        <span class="status-badge ${interno.estatus}">${interno.estatus}</span>
      </div>
    </div>
    <div class="form-actions">
      <button onclick="window.print()" class="btn-save"><i class="fas fa-print"></i> Imprimir</button>
      <button onclick="closeModal()" class="btn-cancel">Cerrar</button>
    </div>
  `;

  openModal(html);

  setTimeout(() => {
    const container = document.getElementById("qr-individual");
    if (container) {
      container.innerHTML = "";
      generarQR(container, interno, 60);
    }
  }, 100);
}

// ============================================================
// INICIALIZAR
// ============================================================
document.addEventListener("DOMContentLoaded", async function () {
  await Promise.all([
    cargarInternos(),
    cargarEventos(),
    cargarParticipaciones(),
    cargarPonentes(),
  ]);

  console.log("🔍 Panel de Control conectado a Supabase");
  console.log(
    `📊 ${state.internos.length} internos, ${state.eventos.length} eventos, ${state.participaciones.length} participaciones, ${state.ponentes.length} ponentes`,
  );
});

// Previsualizar foto seleccionada
function previsualizarFoto(event) {
  const file = event.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast("La imagen no debe exceder los 5MB", "error");
    event.target.value = "";
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const preview = document.getElementById("previewFoto");
    preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;" />`;
    preview.style.border = "2px solid #22c55e";
  };
  reader.readAsDataURL(file);
}

// Eliminar foto seleccionada
function eliminarFoto() {
  const preview = document.getElementById("previewFoto");
  preview.innerHTML = `<i class="fas fa-user-circle" style="font-size: 40px; color: #94a3b8;"></i>`;
  preview.style.border = "2px dashed var(--border)";
  document.getElementById("f_foto").value = "";
}
