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
  participacionesPonentes: [],
  currentFilter: "todos",
  editingId: null,
  currentTable: "internos",
};
let currentPhotoFile = null;

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
      <tr onclick="abrirExpedienteCompleto('${interno.id}')" style="cursor:pointer;">
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
          <div class="acciones-cell" onclick="event.stopPropagation();">
            <button class="btn-edit btn-sm" onclick="editarInterno('${interno.id}')">
              <i class="fas fa-pen"></i>
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
      <div class="form-group">
        <label>Nombre Completo *</label>
        <input type="text" id="f_nombre" placeholder="Nombre completo" required autofocus />
      </div>
      <div class="form-group">
        <label>Universidad *</label>
        <input type="text" id="f_universidad" placeholder="Universidad" required />
      </div>
      <div class="form-group">
        <label>Carrera *</label>
        <input type="text" id="f_carrera" placeholder="Carrera" required />
      </div>
      <div class="form-group">
        <label>Semestre *</label>
        <input type="text" id="f_semestre" placeholder="8° Semestre" required />
      </div>
      <div class="form-group">
        <label>Generación *</label>
        <input type="text" id="f_generacion" placeholder="2020-2025" required />
      </div>
      <div class="form-group">
        <label>Correo *</label>
        <input type="email" id="f_correo" placeholder="correo@ejemplo.com" required />
      </div>
      <div class="form-group">
        <label>CURP</label>
        <input type="text" id="f_curp" placeholder="CURP" />
      </div>
      <div class="form-group">
        <label>RFC</label>
        <input type="text" id="f_rfc" placeholder="RFC" />
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input type="text" id="f_telefono" placeholder="(55) 1234-5678" />
      </div>
      <div class="form-group">
        <label>Tipo Sanguíneo</label>
        <select id="f_tipo_sanguineo">
          <option value="">Seleccionar</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
        </select>
      </div>
      <div class="form-group">
        <label>Alergias</label>
        <input type="text" id="f_alergias" placeholder="Ej: Penicilina, Polen" />
      </div>
      <div class="form-group">
        <label>Contacto de Emergencia</label>
        <input type="text" id="f_contacto" placeholder="Nombre del contacto" />
      </div>
      <div class="form-group">
        <label>Teléfono de Emergencia</label>
        <input type="text" id="f_telefono_emergencia" placeholder="(55) 1234-5678" />
      </div>

      <div class="form-group photo-group">
        <label>Foto</label>
        <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
          <div id="previewFoto" style="width: 80px; height: 80px; border-radius: 50%; background: #f1f4f9; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px dashed var(--border); flex-shrink: 0;">
            <i class="fas fa-user-circle" style="font-size: 40px; color: #94a3b8;"></i>
          </div>
          <div>
            <input type="file" id="f_foto" accept="image/jpeg,image/png,image/webp" onchange="previsualizarFoto(event)" style="display: none;" />
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button type="button" onclick="document.getElementById('f_foto').click()" style="background: var(--primary-gradient); color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-upload"></i> Subir
              </button>
              <button type="button" onclick="abrirCamara()" style="background: linear-gradient(135deg, #059669, #10b981); color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-camera"></i> Cámara
              </button>
              <button type="button" onclick="eliminarFoto()" style="background: #fee2e2; color: #dc2626; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                <i class="fas fa-trash"></i> Eliminar
              </button>
            </div>
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

  const formData = {
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
    estatus: document.getElementById("f_estatus")?.value || "activo",
  };

  try {
    let result;

    let foto_url = null;
    if (currentPhotoFile) {
      const fileExt = currentPhotoFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `internos/${fileName}`;

      const { error: uploadError } = await supabaseClient.storage
        .from("fotos-internos")
        .upload(filePath, currentPhotoFile, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabaseClient.storage
        .from("fotos-internos")
        .getPublicUrl(filePath);

      foto_url = urlData.publicUrl;
    }

    formData.foto_url = foto_url;

    if (state.editingId) {
      const { data, error } = await supabaseClient
        .from("internos")
        .update(formData)
        .eq("id", state.editingId)
        .select()
        .single();
      if (error) throw error;
      result = data;
      showToast("Interno actualizado correctamente", "success");
    } else {
      formData.matricula = await generarMatricula();
      const { data, error } = await supabaseClient
        .from("internos")
        .insert([formData])
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

        <div class="form-group photo-group">
          <label>Foto</label>
          <div style="display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
            <div id="previewFoto" style="width: 80px; height: 80px; border-radius: 50%; background: #f1f4f9; display: flex; align-items: center; justify-content: center; overflow: hidden; border: 2px dashed var(--border); flex-shrink: 0;">
              ${
                tieneFoto
                  ? `<img src="${data.foto_url}" style="width: 100%; height: 100%; object-fit: cover;" />`
                  : `<i class="fas fa-user-circle" style="font-size: 40px; color: #94a3b8;"></i>`
              }
            </div>
            <div>
              <input type="file" id="f_foto" accept="image/jpeg,image/png,image/webp" onchange="previsualizarFoto(event)" style="display: none;" />
              <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                <button type="button" onclick="document.getElementById('f_foto').click()" style="background: var(--primary-gradient); color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                  <i class="fas fa-upload"></i> Subir
                </button>
                <button type="button" onclick="abrirCamara()" style="background: linear-gradient(135deg, #059669, #10b981); color: white; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                  <i class="fas fa-camera"></i> Cámara
                </button>
                <button type="button" onclick="eliminarFoto()" style="background: #fee2e2; color: #dc2626; border: none; padding: 8px 20px; border-radius: 8px; cursor: pointer; font-weight: 600;">
                  <i class="fas fa-trash"></i> Eliminar
                </button>
              </div>
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
// CRUD - PARTICIPACIONES DE INTERNOS
// ============================================================
async function cargarParticipaciones() {
  try {
    const tbody = document.getElementById("tbodyParticipaciones");
    if (!tbody) {
      console.warn("⚠️ Elemento #tbodyParticipaciones no encontrado en el DOM");
      return;
    }

    const { data, error } = await supabaseClient
      .from("participaciones_internos")
      .select(
        `
        *,
        internos:interno_id (id, nombre, matricula),
        eventos:evento_id (id, nombre, tipo, fecha_inicio, horas, lugar)
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
  }
}

function renderParticipaciones(participaciones) {
  const tbody = document.getElementById("tbodyParticipaciones");
  if (!tbody) {
    console.warn("⚠️ #tbodyParticipaciones no encontrado");
    return;
  }

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
// GENERAR RECONOCIMIENTO PARA INTERNO (USA DATOS DE LA BD)
// ============================================================
async function generarReconocimiento(internoId) {
  try {
    const interno = state.internos.find((i) => i.id === internoId);
    if (!interno) {
      showToast("Interno no encontrado", "error");
      return;
    }

    // Obtener participaciones del interno con datos del evento
    const { data: participaciones, error } = await supabaseClient
      .from("participaciones_internos")
      .select(
        `
        *,
        eventos:evento_id (*)
      `,
      )
      .eq("interno_id", internoId)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!participaciones || participaciones.length === 0) {
      showToast("Este interno no tiene eventos registrados", "warning");
      return;
    }

    // Mostrar selector de eventos
    let eventosList = participaciones
      .map((p, i) => {
        const evento = p.eventos || {};
        return `${i + 1}. ${evento.nombre || "Sin nombre"} - ${evento.fecha_inicio ? new Date(evento.fecha_inicio).toLocaleDateString("es-MX") : "Sin fecha"}`;
      })
      .join("\n");

    const eventoIndex = prompt(
      `Selecciona el evento para el reconocimiento:\n\n${eventosList}\n\nNúmero del evento (1-${participaciones.length}):`,
    );

    if (!eventoIndex) return;

    const idx = parseInt(eventoIndex) - 1;
    if (isNaN(idx) || idx < 0 || idx >= participaciones.length) {
      showToast("Selección inválida", "error");
      return;
    }

    const seleccion = participaciones[idx];
    const evento = seleccion.eventos || {};

    // Obtener el ponente asociado a este evento (si existe)
    let ponenteNombre = "Ponente no asignado";
    if (evento.ponente_id) {
      const { data: ponenteData } = await supabaseClient
        .from("ponentes")
        .select("nombre")
        .eq("id", evento.ponente_id)
        .single();
      if (ponenteData) ponenteNombre = ponenteData.nombre;
    }

    // Datos del evento
    const nombreEvento = evento.nombre || "Evento sin nombre";
    const fecha = evento.fecha_inicio
      ? new Date(evento.fecha_inicio).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Fecha no especificada";
    const horas = seleccion.horas_impartidas || evento.horas || 0;
    const lugar = evento.lugar || "Hospital Regional Puerto Vallarta";
    const tipoEvento = evento.tipo || "evento";

    const contenido = `
      <div class="reconocimiento-container" style="max-width: 650px; margin: 0 auto; padding: 40px 30px; border: 3px solid #1a56db; border-radius: 16px; background: white; text-align: center;">
        <div style="font-size: 64px; color: #f59e0b; margin-bottom: 10px;">
          <i class="fas fa-award"></i>
        </div>
        <h2 style="font-size: 28px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">Reconocimiento</h2>
        <p style="color: #475569; font-size: 15px; margin: 16px 0 8px 0;">Se otorga el presente reconocimiento a:</p>
        <h3 style="font-size: 26px; font-weight: 700; color: #1a56db; text-transform: uppercase; margin: 8px 0 4px 0;">${interno.nombre}</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">
          <i class="fas fa-id-card"></i> ${interno.matricula} &nbsp;|&nbsp; ${interno.universidad}
        </p>
        <p style="color: #475569; font-size: 15px; margin: 8px 0;">Por su valiosa participación como <strong>INTERNO</strong> en el ${tipoEvento}:</p>
        <h4 style="font-size: 22px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin: 8px 0;">${nombreEvento}</h4>
        <div style="margin: 16px auto; padding: 14px 20px; background: #f8fafc; border-radius: 12px; max-width: 450px; font-size: 14px; color: #475569; text-align: left; border: 1px solid #e2e8f0;">
          <p style="margin: 4px 0;"><i class="fas fa-calendar-alt" style="width: 24px; color: #1a56db;"></i> <strong>Fecha:</strong> ${fecha}</p>
          <p style="margin: 4px 0;"><i class="fas fa-clock" style="width: 24px; color: #1a56db;"></i> <strong>Duración:</strong> ${horas} horas</p>
          <p style="margin: 4px 0;"><i class="fas fa-map-marker-alt" style="width: 24px; color: #1a56db;"></i> <strong>Lugar:</strong> ${lugar}</p>
          <p style="margin: 4px 0;"><i class="fas fa-chalkboard-teacher" style="width: 24px; color: #1a56db;"></i> <strong>Ponente:</strong> ${ponenteNombre}</p>
        </div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #e2e8f0;">
          <p style="font-size: 14px; font-weight: 600; color: #0f172a;">Hospital Regional Puerto Vallarta</p>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Documento generado electrónicamente</p>
        </div>
      </div>
      <div class="form-actions" style="margin-top: 20px; justify-content: center;">
        <button onclick="window.print()" class="btn-save"><i class="fas fa-print"></i> Imprimir</button>
        <button onclick="closeModal()" class="btn-cancel">Cerrar</button>
      </div>
    `;

    closeModal();
    openModal(contenido);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al generar reconocimiento: " + error.message, "error");
  }
}

// ============================================================
// GENERAR RECONOCIMIENTO PARA PONENTE (USA DATOS DE LA BD)
// ============================================================
async function generarReconocimientoPonente(id) {
  try {
    const ponente = state.ponentes.find((p) => p.id === id);
    if (!ponente) {
      showToast("Ponente no encontrado", "error");
      return;
    }

    // Obtener eventos del ponente desde la tabla participaciones_ponentes
    const { data: participaciones, error } = await supabaseClient
      .from("participaciones_ponentes")
      .select(
        `
        *,
        eventos:evento_id (*)
      `,
      )
      .eq("ponente_id", id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    if (!participaciones || participaciones.length === 0) {
      showToast("Este ponente no tiene eventos registrados", "warning");
      return;
    }

    // Mostrar selector de eventos
    let eventosList = participaciones
      .map((p, i) => {
        const evento = p.eventos || {};
        return `${i + 1}. ${evento.nombre || "Sin nombre"} - ${evento.fecha_inicio ? new Date(evento.fecha_inicio).toLocaleDateString("es-MX") : "Sin fecha"} (${p.rol || "ponente"})`;
      })
      .join("\n");

    const eventoIndex = prompt(
      `Selecciona el evento para el reconocimiento:\n\n${eventosList}\n\nNúmero del evento (1-${participaciones.length}):`,
    );

    if (!eventoIndex) return;

    const idx = parseInt(eventoIndex) - 1;
    if (isNaN(idx) || idx < 0 || idx >= participaciones.length) {
      showToast("Selección inválida", "error");
      return;
    }

    const seleccion = participaciones[idx];
    const evento = seleccion.eventos || {};

    const nombreEvento = evento.nombre || "Evento sin nombre";
    const fecha = evento.fecha_inicio
      ? new Date(evento.fecha_inicio).toLocaleDateString("es-MX", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })
      : "Fecha no especificada";
    const horas = seleccion.horas_impartidas || evento.horas || 0;
    const lugar = evento.lugar || "Hospital Regional Puerto Vallarta";
    const rol = seleccion.rol || "PONENTE";
    const tipoEvento = evento.tipo || "evento";

    const contenido = `
      <div class="reconocimiento-container" style="max-width: 650px; margin: 0 auto; padding: 40px 30px; border: 3px solid #1a56db; border-radius: 16px; background: white; text-align: center;">
        <div style="font-size: 64px; color: #f59e0b; margin-bottom: 10px;">
          <i class="fas fa-award"></i>
        </div>
        <h2 style="font-size: 28px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 1px;">Reconocimiento</h2>
        <p style="color: #475569; font-size: 15px; margin: 16px 0 8px 0;">Se otorga el presente reconocimiento a:</p>
        <h3 style="font-size: 26px; font-weight: 700; color: #1a56db; text-transform: uppercase; margin: 8px 0 4px 0;">${ponente.nombre}</h3>
        <p style="font-size: 13px; color: #64748b; margin-bottom: 16px;">
          ${ponente.especialidad ? `<i class="fas fa-stethoscope"></i> ${ponente.especialidad} &nbsp;|&nbsp;` : ""}
          ${ponente.institucion ? ponente.institucion : ""}
        </p>
        <p style="color: #475569; font-size: 15px; margin: 8px 0;">Por su valiosa participación como <strong>${rol.toUpperCase()}</strong> en el ${tipoEvento}:</p>
        <h4 style="font-size: 22px; font-weight: 700; color: #0f172a; text-transform: uppercase; margin: 8px 0;">${nombreEvento}</h4>
        <div style="margin: 16px auto; padding: 14px 20px; background: #f8fafc; border-radius: 12px; max-width: 450px; font-size: 14px; color: #475569; text-align: left; border: 1px solid #e2e8f0;">
          <p style="margin: 4px 0;"><i class="fas fa-calendar-alt" style="width: 24px; color: #1a56db;"></i> <strong>Fecha:</strong> ${fecha}</p>
          <p style="margin: 4px 0;"><i class="fas fa-clock" style="width: 24px; color: #1a56db;"></i> <strong>Horas impartidas:</strong> ${horas}</p>
          <p style="margin: 4px 0;"><i class="fas fa-map-marker-alt" style="width: 24px; color: #1a56db;"></i> <strong>Lugar:</strong> ${lugar}</p>
        </div>
        <div style="margin-top: 24px; padding-top: 16px; border-top: 2px solid #e2e8f0;">
          <p style="font-size: 14px; font-weight: 600; color: #0f172a;">Hospital Regional Puerto Vallarta</p>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 4px;">Documento generado electrónicamente</p>
        </div>
      </div>
      <div class="form-actions" style="margin-top: 20px; justify-content: center;">
        <button onclick="window.print()" class="btn-save"><i class="fas fa-print"></i> Imprimir</button>
        <button onclick="closeModal()" class="btn-cancel">Cerrar</button>
      </div>
    `;

    closeModal();
    openModal(contenido);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al generar reconocimiento: " + error.message, "error");
  }
}

// ============================================================
// IMPRIMIR CREDENCIALES - TAMAÑO FIJO
// ============================================================
async function imprimirMultiplesCredenciales() {
  try {
    const internos = state.internos.filter((i) => i.estatus === "activo");
    if (!internos || internos.length === 0) {
      showToast("No hay internos activos para imprimir", "warning");
      return;
    }

    const chunkSize = 6;
    const chunks = [];
    for (let i = 0; i < internos.length; i += chunkSize) {
      chunks.push(internos.slice(i, i + chunkSize));
    }

    let printContent = `
      <style>
        /* Estilos ya definidos en el CSS principal */
        /* Solo estilos adicionales para el contenedor del modal */
        .cred-modal-header {
          text-align: center;
          margin-bottom: 16px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .cred-modal-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }
        .cred-modal-header p {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #64748b;
        }
        .cred-contador {
          text-align: center;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 12px;
        }
        .cred-contador strong {
          color: #0f172a;
        }
        .print-buttons {
          text-align: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }
        .print-buttons button {
          padding: 10px 32px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          margin: 0 8px;
        }
        .print-buttons .btn-print {
          background: #2563eb;
          color: white;
        }
        .print-buttons .btn-print:hover {
          background: #1d4ed8;
        }
        .print-buttons .btn-cerrar {
          background: #f1f4f9;
          color: #475569;
        }
        .print-buttons .btn-cerrar:hover {
          background: #e2e8f0;
        }
        @media print {
          .no-print { display: none !important; }
          .modal-close { display: none !important; }
          .credenciales-grid { max-height: none !important; overflow: visible !important; }
          .cred-modal-header { background: #f8fafc !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .credencial-print .footer .status.activo { background: #dcfce7 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .credencial-print .footer .status.inactivo { background: #fee2e2 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: Letter portrait; margin: 4mm; }
          .credencial-print { page-break-inside: avoid !important; break-inside: avoid !important; }
        }
      </style>
      
      <div class="cred-modal-header no-print">
        <h3><i class="fas fa-id-card"></i> Credenciales de Internos Activos</h3>
        <p>Total: <strong>${internos.length}</strong> internos activos · ${Math.ceil(internos.length / chunkSize)} páginas</p>
      </div>
      
      <div class="cred-contador no-print">
        <i class="fas fa-print"></i> Vista previa - <strong>${internos.length}</strong> credenciales
      </div>
    `;

    chunks.forEach((chunk, pageIndex) => {
      if (pageIndex > 0) {
        printContent += `<div style="page-break-after: always;"></div>`;
      }
      printContent += `<div class="credenciales-grid">`;
      chunk.forEach((interno) => {
        const iniciales = interno.nombre
          .split(" ")
          .filter((p) => p.length > 0)
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        const qrId = `qr-${Math.random().toString(36).substr(2, 6)}`;

        printContent += `
          <div class="credencial-print">
            <div class="header">
              <h3>🏥 Hospital Regional PV</h3>
              <p>Credencial de Interno</p>
            </div>
            <div class="body">
              <div class="foto">
                ${interno.foto_url ? `<img src="${interno.foto_url}" />` : iniciales}
              </div>
              <div class="info">
                <div class="nombre">${interno.nombre}</div>
                <div class="detail"><i class="fas fa-id-card"></i> ${interno.matricula}</div>
                <div class="detail"><i class="fas fa-university"></i> ${interno.universidad}</div>
                <div class="detail"><i class="fas fa-graduation-cap"></i> ${interno.carrera}</div>
              </div>
            </div>
            <div class="footer">
              <div class="qr" id="${qrId}"></div>
              <span class="status ${interno.estatus}">${interno.estatus}</span>
            </div>
          </div>
        `;
      });
      printContent += `</div>`;
    });

    printContent += `
      <div class="print-buttons no-print">
        <button class="btn-print" onclick="window.print()"><i class="fas fa-print"></i> Imprimir (${internos.length} credenciales)</button>
        <button class="btn-cerrar" onclick="closeModal()"><i class="fas fa-times"></i> Cerrar</button>
      </div>
    `;

    openModal(printContent);

    // Generar QR después de renderizar
    setTimeout(() => {
      document
        .querySelectorAll(".credencial-print .qr")
        .forEach((container) => {
          try {
            const credencial = container.closest(".credencial-print");
            const nombre =
              credencial?.querySelector(".nombre")?.textContent || "";
            const matriculaEl =
              credencial?.querySelector(".detail")?.textContent || "";
            const matricula =
              matriculaEl.replace(/[^0-9]/g, "").trim() || "000000";
            const texto = `HRPV|${matricula}|${nombre.substring(0, 15)}`;
            new QRCode(container, {
              text: texto,
              width: 36,
              height: 36,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.L,
            });
          } catch (e) {
            console.warn("Error generando QR:", e);
          }
        });
    }, 300);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al generar credenciales: " + error.message, "error");
  }
}

function imprimirCredencialIndividual(id) {
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

  const html = `
    <style>
      /* Credencial individual - tamaño fijo */
      .credencial-individual {
        max-width: 340px;
        margin: 0 auto;
        background: linear-gradient(145deg, #0f2b5e, #1a56db);
        border-radius: 16px;
        padding: 20px;
        color: white;
        height: 440px;
        min-height: 440px;
        max-height: 440px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .credencial-individual .header {
        text-align: center;
        border-bottom: 1px solid rgba(255,255,255,0.15);
        padding-bottom: 10px;
        margin-bottom: 14px;
        flex-shrink: 0;
      }
      .credencial-individual .header h3 {
        font-size: 16px;
        font-weight: 800;
        margin: 0;
      }
      .credencial-individual .header p {
        font-size: 11px;
        opacity: 0.7;
        margin: 0;
      }
      .credencial-individual .body {
        display: flex;
        gap: 14px;
        align-items: center;
        flex: 1;
        padding: 8px 0;
      }
      .credencial-individual .foto {
        width: 75px;
        height: 75px;
        min-width: 75px;
        min-height: 75px;
        max-width: 75px;
        max-height: 75px;
        border-radius: 50%;
        border: 3px solid rgba(255,255,255,0.3);
        flex-shrink: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.1);
        font-size: 30px;
        font-weight: 700;
      }
      .credencial-individual .foto img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
      .credencial-individual .info {
        flex: 1;
        min-width: 0;
      }
      .credencial-individual .info .nombre {
        font-size: 16px;
        font-weight: 800;
        text-transform: uppercase;
        line-height: 1.2;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        max-height: 58px;
      }
      .credencial-individual .info .detail {
        font-size: 12px;
        opacity: 0.85;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .credencial-individual .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 14px;
        padding-top: 14px;
        border-top: 1px solid rgba(255,255,255,0.12);
        flex-shrink: 0;
        height: 60px;
        min-height: 60px;
        max-height: 60px;
      }
      .credencial-individual .footer .qr {
        background: white;
        padding: 4px;
        border-radius: 8px;
        width: 50px;
        height: 50px;
        min-width: 50px;
        min-height: 50px;
        max-width: 50px;
        max-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .credencial-individual .footer .qr canvas {
        width: 42px !important;
        height: 42px !important;
      }
      .credencial-individual .footer .status {
        font-size: 11px;
        font-weight: 700;
        padding: 4px 16px;
        border-radius: 20px;
        text-transform: uppercase;
      }
      .credencial-individual .footer .status.activo {
        background: #dcfce7;
        color: #166534;
      }
      .credencial-individual .footer .status.inactivo {
        background: #fee2e2;
        color: #991b1b;
      }
      @media print {
        .no-print { display: none !important; }
        .modal-close { display: none !important; }
        .credencial-individual { 
          border: 2px solid #1a56db !important;
          box-shadow: none !important;
          border-radius: 12px !important;
          height: 380px !important;
          min-height: 380px !important;
          max-height: 380px !important;
          padding: 14px !important;
        }
        .credencial-individual .foto {
          width: 60px !important;
          height: 60px !important;
          min-width: 60px !important;
          min-height: 60px !important;
          max-width: 60px !important;
          max-height: 60px !important;
          font-size: 24px !important;
        }
        .credencial-individual .info .nombre {
          font-size: 13px !important;
          max-height: 48px !important;
        }
        .credencial-individual .info .detail {
          font-size: 10px !important;
        }
        .credencial-individual .footer .status {
          font-size: 9px !important;
          padding: 2px 12px !important;
        }
        .credencial-individual .footer .qr {
          width: 40px !important;
          height: 40px !important;
          min-width: 40px !important;
          min-height: 40px !important;
          max-width: 40px !important;
          max-height: 40px !important;
        }
        .credencial-individual .footer .qr canvas {
          width: 32px !important;
          height: 32px !important;
        }
        @page { size: A6 portrait; margin: 5mm; }
      }
    </style>
    <h3 style="text-align:center; margin-bottom:16px;" class="no-print"><i class="fas fa-id-card"></i> Credencial Individual</h3>
    <div class="credencial-individual">
      <div class="header">
        <h3>🏥 Hospital Regional PV</h3>
        <p>Credencial de Interno</p>
      </div>
      <div class="body">
        <div class="foto">
          ${interno.foto_url ? `<img src="${interno.foto_url}" />` : iniciales}
        </div>
        <div class="info">
          <div class="nombre">${interno.nombre}</div>
          <div class="detail"><i class="fas fa-id-card" style="width:16px;"></i> ${interno.matricula}</div>
          <div class="detail"><i class="fas fa-university" style="width:16px;"></i> ${interno.universidad}</div>
          <div class="detail"><i class="fas fa-graduation-cap" style="width:16px;"></i> ${interno.carrera}</div>
        </div>
      </div>
      <div class="footer">
        <div class="qr" id="qr-individual"></div>
        <span class="status ${interno.estatus}">${interno.estatus}</span>
      </div>
    </div>
    <div class="form-actions no-print" style="margin-top:20px; justify-content:center;">
      <button onclick="window.print()" class="btn-save"><i class="fas fa-print"></i> Imprimir</button>
      <button onclick="closeModal()" class="btn-cancel">Cerrar</button>
    </div>
  `;

  openModal(html);

  setTimeout(() => {
    const container = document.getElementById("qr-individual");
    if (container) {
      try {
        const texto = `HRPV|${interno.matricula}|${interno.nombre.substring(0, 15)}`;
        new QRCode(container, {
          text: texto,
          width: 42,
          height: 42,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.L,
        });
      } catch (e) {
        console.warn("Error generando QR:", e);
      }
    }
  }, 150);
}

// ============================================================
// ABRIR EXPEDIENTE COMPLETO (CLICK EN FILA)
// ============================================================
async function abrirExpedienteCompleto(id) {
  try {
    const { data: interno, error: errorInterno } = await supabaseClient
      .from("internos")
      .select("*")
      .eq("id", id)
      .single();

    if (errorInterno) throw errorInterno;

    let participaciones = [];
    try {
      const { data, error } = await supabaseClient
        .from("participaciones_internos")
        .select(
          `
          *,
          eventos:evento_id (*)
        `,
        )
        .eq("interno_id", id)
        .order("created_at", { ascending: false });

      if (!error) participaciones = data || [];
    } catch (e) {
      console.warn("No se pudieron cargar participaciones:", e);
    }

    const iniciales = interno.nombre
      .split(" ")
      .filter((p) => p.length > 0)
      .map((p) => p[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();

    let eventosHTML = "";
    if (participaciones && participaciones.length > 0) {
      eventosHTML = participaciones
        .map((part) => {
          const evento = part.eventos || {};
          const tipoClass = evento.tipo || "otro";
          const desempenioColor = getColorDesempenio(part.desempenio);
          return `
          <tr>
            <td><strong>${evento.nombre || "Sin nombre"}</strong></td>
            <td>${evento.fecha_inicio ? new Date(evento.fecha_inicio).toLocaleDateString("es-MX") : "-"}</td>
            <td><span class="tipo-badge ${tipoClass}">${evento.tipo || "otro"}</span></td>
            <td style="text-align:center;">${evento.horas || "-"}</td>
            <td style="text-align:center; font-weight:600; color:${desempenioColor};">
              ${part.calificacion ? part.calificacion + "%" : "-"}
              <br><span style="font-size:10px; color:#94a3b8;">${part.desempenio || "Pendiente"}</span>
            </td>
          </tr>
        `;
        })
        .join("");
    } else {
      eventosHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:30px; color:#94a3b8;">
            <i class="fas fa-book-open" style="font-size:32px; display:block; margin-bottom:12px; opacity:0.4;"></i>
            No hay eventos registrados
          </td>
        </tr>
      `;
    }

    const content = `
      <div class="expediente-container">
        <div class="expediente-card">
          <div class="expediente-header">
            <div>
              <h2><i class="fas fa-id-card"></i> Expediente del Interno</h2>
              <p>Hospital Regional Puerto Vallarta</p>
            </div>
            <div class="matricula-badge">
              <i class="fas fa-id-card"></i> ${interno.matricula}
            </div>
          </div>

          <div class="expediente-body">
            <div class="expediente-perfil">
              <div class="avatar-large">
                ${interno.foto_url ? `<img src="${interno.foto_url}" />` : iniciales}
              </div>
              <div class="info">
                <div class="nombre">${interno.nombre}</div>
                <div class="detalles">
                  <div><i class="fas fa-university"></i> ${interno.universidad || "No registrada"}</div>
                  <div><i class="fas fa-graduation-cap"></i> ${interno.carrera || "No registrada"}</div>
                  <div><i class="fas fa-layer-group"></i> ${interno.semestre || "No registrado"}</div>
                  <div><i class="fas fa-calendar"></i> ${interno.generacion || "No registrada"}</div>
                  <div><i class="fas fa-envelope"></i> ${interno.correo || "No registrado"}</div>
                  <div><i class="fas fa-phone"></i> ${interno.telefono || "No registrado"}</div>
                  ${interno.curp ? `<div><i class="fas fa-id-card"></i> CURP: ${interno.curp}</div>` : ""}
                  ${interno.rfc ? `<div><i class="fas fa-file-invoice"></i> RFC: ${interno.rfc}</div>` : ""}
                </div>
              </div>
              <div>
                <span class="status-badge-large ${interno.estatus}">${interno.estatus}</span>
              </div>
            </div>

            <div class="expediente-eventos">
              <div class="eventos-header">
                <h3><i class="fas fa-calendar-alt"></i> Eventos y Cursos</h3>
                <span class="badge-eventos">
                  <i class="fas fa-star"></i> ${participaciones ? participaciones.length : 0} eventos
                </span>
              </div>
              <div style="overflow-x:auto;">
                <table>
                  <thead>
                    <tr>
                      <th>Evento</th>
                      <th>Fecha</th>
                      <th>Tipo</th>
                      <th style="text-align:center;">Horas</th>
                      <th style="text-align:center;">Desempeño</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${eventosHTML}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div class="expediente-footer">
            <div class="qr-section">
              <div class="qr-container" id="modalQR"></div>
              <span class="qr-label"><i class="fas fa-qrcode"></i> Código QR</span>
            </div>
            <div class="acciones-footer">
              <button class="btn-reconocimiento" onclick="generarReconocimiento('${interno.id}')">
                <i class="fas fa-award"></i> Reconocimiento
              </button>
              <button class="btn-credencial" onclick="imprimirCredencialIndividual('${interno.id}')">
                <i class="fas fa-id-card"></i> Credencial
              </button>
            </div>
          </div>
        </div>

        <div class="expediente-modal-actions no-print">
          <button class="btn-print-exp" onclick="window.print()">
            <i class="fas fa-print"></i> Imprimir Expediente
          </button>
          <button class="btn-cerrar-exp" onclick="closeModal()">
            <i class="fas fa-times"></i> Cerrar
          </button>
        </div>
      </div>
    `;

    openModal(content);

    setTimeout(() => {
      const qrContainer = document.getElementById("modalQR");
      if (qrContainer) {
        try {
          const texto = `HRPV|${interno.matricula}|${interno.nombre.substring(0, 15)}`;
          new QRCode(qrContainer, {
            text: texto,
            width: 55,
            height: 55,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.L,
          });
        } catch (e) {
          console.warn("Error generando QR:", e);
        }
      }
    }, 150);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al cargar el expediente: " + error.message, "error");
  }
}

// ============================================================
// FUNCIONES DE CÁMARA
// ============================================================
let stream = null;

async function abrirCamara() {
  try {
    const overlay = document.getElementById("cameraOverlay");
    const video = document.getElementById("video");
    const status = document.getElementById("cameraStatus");
    const btnCapture = document.getElementById("btnCapture");

    overlay.classList.add("active");
    status.textContent = "📷 Solicitando acceso a la cámara...";
    btnCapture.disabled = true;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = "❌ Tu navegador no soporta la cámara";
      return;
    }

    try {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
    } catch (e) {
      stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      });
    }

    video.srcObject = stream;
    await video.play();

    status.textContent = "📸 Listo para capturar";
    btnCapture.disabled = false;
  } catch (error) {
    console.error("Error al abrir cámara:", error);
    const status = document.getElementById("cameraStatus");
    status.textContent = "❌ No se pudo acceder a la cámara: " + error.message;
    showToast(
      "No se pudo acceder a la cámara. Verifica los permisos.",
      "error",
    );
  }
}

function cerrarCamara() {
  const overlay = document.getElementById("cameraOverlay");
  const video = document.getElementById("video");
  const btnCapture = document.getElementById("btnCapture");

  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
    stream = null;
  }
  video.srcObject = null;
  overlay.classList.remove("active");
  btnCapture.disabled = true;
}

function capturarFoto() {
  const video = document.getElementById("video");
  const status = document.getElementById("cameraStatus");

  if (!stream) {
    showToast("La cámara no está activa", "error");
    return;
  }

  try {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    const videoWidth = video.videoWidth || 640;
    const videoHeight = video.videoHeight || 480;
    const maxSize = 800;

    let width = videoWidth;
    let height = videoHeight;

    if (width > maxSize) {
      height = (height * maxSize) / width;
      width = maxSize;
    }
    if (height > maxSize) {
      width = (width * maxSize) / height;
      height = maxSize;
    }

    canvas.width = width;
    canvas.height = height;
    context.drawImage(video, 0, 0, width, height);

    canvas.toBlob(
      function (blob) {
        if (!blob) {
          showToast("Error al capturar la foto", "error");
          return;
        }

        const file = new File([blob], `foto-camara-${Date.now()}.jpg`, {
          type: "image/jpeg",
        });

        const input = document.getElementById("f_foto");
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        input.files = dataTransfer.files;

        const event = new Event("change", { bubbles: true });
        input.dispatchEvent(event);

        cerrarCamara();
        showToast("✅ Foto capturada correctamente", "success");
      },
      "image/jpeg",
      0.85,
    );
  } catch (error) {
    console.error("Error al capturar:", error);
    showToast("Error al capturar la foto: " + error.message, "error");
  }
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    const overlay = document.getElementById("cameraOverlay");
    if (overlay.classList.contains("active")) {
      cerrarCamara();
    }
  }
});

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

  currentPhotoFile = file;

  const reader = new FileReader();
  reader.onload = function (e) {
    const preview = document.getElementById("previewFoto");
    preview.innerHTML = `<img src="${e.target.result}" style="width: 100%; height: 100%; object-fit: cover;" />`;
    preview.style.border = "2px solid #22c55e";
  };
  reader.readAsDataURL(file);
}

function eliminarFoto() {
  currentPhotoFile = null;
  const preview = document.getElementById("previewFoto");
  preview.innerHTML = `<i class="fas fa-user-circle" style="font-size: 40px; color: #94a3b8;"></i>`;
  preview.style.border = "2px dashed var(--border)";
  document.getElementById("f_foto").value = "";
}

// ============================================================
// IMPRIMIR CREDENCIALES - VERSIÓN MEJORADA CON SCROLL
// ============================================================
async function imprimirMultiplesCredenciales() {
  try {
    const internos = state.internos.filter((i) => i.estatus === "activo");
    if (!internos || internos.length === 0) {
      showToast("No hay internos activos para imprimir", "warning");
      return;
    }

    const chunkSize = 6;
    const chunks = [];
    for (let i = 0; i < internos.length; i += chunkSize) {
      chunks.push(internos.slice(i, i + chunkSize));
    }

    let printContent = `
      <style>
        .credenciales-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          padding: 16px;
          max-width: 1000px;
          margin: 0 auto;
          max-height: 65vh;
          overflow-y: auto;
        }
        .credenciales-grid::-webkit-scrollbar {
          width: 8px;
        }
        .credenciales-grid::-webkit-scrollbar-track {
          background: #f1f4f9;
          border-radius: 4px;
        }
        .credenciales-grid::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
        .credenciales-grid::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        .credencial-print {
          border: 2px solid #1a56db;
          border-radius: 12px;
          padding: 16px;
          background: white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          page-break-inside: avoid;
          break-inside: avoid;
        }
        .credencial-print .header {
          text-align: center;
          border-bottom: 2px solid #1a56db;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }
        .credencial-print .header h3 {
          font-size: 14px;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }
        .credencial-print .header p {
          font-size: 10px;
          color: #64748b;
          margin: 0;
        }
        .credencial-print .body {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .credencial-print .foto {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #e2e8f0;
          flex-shrink: 0;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f1f4f9;
          font-weight: 700;
          font-size: 22px;
        }
        .credencial-print .foto img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .credencial-print .info {
          flex: 1;
          min-width: 0;
        }
        .credencial-print .info .nombre {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: #0f172a;
          line-height: 1.2;
        }
        .credencial-print .info .detail {
          font-size: 10px;
          color: #475569;
          line-height: 1.3;
        }
        .credencial-print .footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
          padding-top: 10px;
          border-top: 1px solid #e2e8f0;
        }
        .credencial-print .footer .qr {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .credencial-print .footer .qr canvas {
          width: 36px !important;
          height: 36px !important;
        }
        .credencial-print .footer .status {
          font-size: 9px;
          font-weight: 700;
          padding: 3px 12px;
          border-radius: 12px;
          text-transform: uppercase;
        }
        .credencial-print .footer .status.activo {
          background: #dcfce7;
          color: #166534;
        }
        .credencial-print .footer .status.inactivo {
          background: #fee2e2;
          color: #991b1b;
        }
        .print-header {
          text-align: center;
          margin-bottom: 16px;
          padding: 12px;
          background: #f8fafc;
          border-radius: 12px;
          border: 1px solid #e2e8f0;
        }
        .print-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 800;
          color: #0f172a;
        }
        .print-header p {
          margin: 4px 0 0 0;
          font-size: 13px;
          color: #64748b;
        }
        .print-buttons {
          text-align: center;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
        }
        .print-buttons button {
          padding: 10px 32px;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          font-size: 14px;
          margin: 0 8px;
        }
        .print-buttons .btn-print {
          background: #2563eb;
          color: white;
        }
        .print-buttons .btn-print:hover {
          background: #1d4ed8;
        }
        .print-buttons .btn-cerrar {
          background: #f1f4f9;
          color: #475569;
        }
        .print-buttons .btn-cerrar:hover {
          background: #e2e8f0;
        }
        .contador-credenciales {
          text-align: center;
          font-size: 13px;
          color: #64748b;
          margin-bottom: 12px;
        }
        .contador-credenciales strong {
          color: #0f172a;
        }
        @media print {
          .no-print { display: none !important; }
          .modal-close { display: none !important; }
          .credenciales-grid { max-height: none !important; overflow: visible !important; }
          .credencial-print { box-shadow: none !important; page-break-inside: avoid !important; break-inside: avoid !important; }
          .print-header { background: #f8fafc !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .credencial-print .footer .status.activo { background: #dcfce7 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          .credencial-print .footer .status.inactivo { background: #fee2e2 !important; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: Letter portrait; margin: 5mm; }
          .credencial-print { page-break-inside: avoid !important; break-inside: avoid !important; }
        }
      </style>
      
      <div class="print-header no-print">
        <h3><i class="fas fa-id-card"></i> Credenciales de Internos Activos</h3>
        <p>Total: <strong>${internos.length}</strong> internos activos · ${Math.ceil(internos.length / chunkSize)} páginas</p>
      </div>
      
      <div class="contador-credenciales no-print">
        <i class="fas fa-print"></i> Vista previa de impresión - <strong>${internos.length}</strong> credenciales
      </div>
    `;

    chunks.forEach((chunk, pageIndex) => {
      if (pageIndex > 0) {
        printContent += `<div style="page-break-after: always;"></div>`;
      }
      printContent += `<div class="credenciales-grid">`;
      chunk.forEach((interno) => {
        const iniciales = interno.nombre
          .split(" ")
          .filter((p) => p.length > 0)
          .map((p) => p[0])
          .join("")
          .slice(0, 2)
          .toUpperCase();

        const qrId = `qr-${Math.random().toString(36).substr(2, 6)}`;

        printContent += `
          <div class="credencial-print">
            <div class="header">
              <h3>Hospital Regional PV</h3>
              <p>Credencial de Interno</p>
            </div>
            <div class="body">
              <div class="foto">
                ${interno.foto_url ? `<img src="${interno.foto_url}" />` : iniciales}
              </div>
              <div class="info">
                <div class="nombre">${interno.nombre}</div>
                <div class="detail"><i class="fas fa-id-card" style="width:14px;"></i> ${interno.matricula}</div>
                <div class="detail"><i class="fas fa-university" style="width:14px;"></i> ${interno.universidad}</div>
                <div class="detail"><i class="fas fa-graduation-cap" style="width:14px;"></i> ${interno.carrera}</div>
              </div>
            </div>
            <div class="footer">
              <div class="qr" id="${qrId}"></div>
              <span class="status ${interno.estatus}">${interno.estatus}</span>
            </div>
          </div>
        `;
      });
      printContent += `</div>`;
    });

    printContent += `
      <div class="print-buttons no-print">
        <button class="btn-print" onclick="window.print()"><i class="fas fa-print"></i> Imprimir (${internos.length} credenciales)</button>
        <button class="btn-cerrar" onclick="closeModal()"><i class="fas fa-times"></i> Cerrar</button>
      </div>
    `;

    openModal(printContent);

    // Generar QR después de renderizar
    setTimeout(() => {
      document
        .querySelectorAll(".credencial-print .qr")
        .forEach((container) => {
          try {
            const credencial = container.closest(".credencial-print");
            const nombre =
              credencial?.querySelector(".nombre")?.textContent || "";
            const matriculaEl =
              credencial?.querySelector(".detail")?.textContent || "";
            const matricula =
              matriculaEl.replace(/[^0-9]/g, "").trim() || "000000";
            const texto = `HRPV|${matricula}|${nombre.substring(0, 15)}`;
            new QRCode(container, {
              text: texto,
              width: 36,
              height: 36,
              colorDark: "#000000",
              colorLight: "#ffffff",
              correctLevel: QRCode.CorrectLevel.L,
            });
          } catch (e) {
            console.warn("Error generando QR:", e);
          }
        });
    }, 300);
  } catch (error) {
    console.error("Error:", error);
    showToast("Error al generar credenciales: " + error.message, "error");
  }
}
