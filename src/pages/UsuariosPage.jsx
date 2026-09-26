import { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  ShieldCheck,
  Package,
  ShoppingCart,
  Pencil,
  Trash2,
  X,
  Save,
} from "lucide-react";

const usuariosIniciales = [
  {
    id: 1,
    nombre: "Carlos Ramírez",
    usuario: "admin",
    password: "admin123",
    rol: "Administrador",
    estado: "Activo",
  },
  {
    id: 2,
    nombre: "Luis Mendoza",
    usuario: "almacen",
    password: "almacen123",
    rol: "Almacenero",
    estado: "Activo",
  },
  {
    id: 3,
    nombre: "María López",
    usuario: "vendedor",
    password: "vendedor123",
    rol: "Vendedor",
    estado: "Activo",
  },
];

function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const [formulario, setFormulario] = useState({
    nombre: "",
    usuario: "",
    password: "",
    rol: "Vendedor",
    estado: "Activo",
  });

  // Cargar usuarios
  useEffect(() => {
    const guardados = localStorage.getItem("usuarios");

    if (guardados) {
      setUsuarios(JSON.parse(guardados));
    } else {
      setUsuarios(usuariosIniciales);
      localStorage.setItem(
        "usuarios",
        JSON.stringify(usuariosIniciales)
      );
    }
  }, []);

  // Guardar usuarios
  const guardarUsuarios = (nuevosUsuarios) => {
    setUsuarios(nuevosUsuarios);

    localStorage.setItem(
      "usuarios",
      JSON.stringify(nuevosUsuarios)
    );

    window.dispatchEvent(new Event("usuariosActualizados"));
  };

  // Abrir formulario nuevo
  const nuevoUsuario = () => {
    setModoEdicion(false);
    setUsuarioEditando(null);

    setFormulario({
      nombre: "",
      usuario: "",
      password: "",
      rol: "Vendedor",
      estado: "Activo",
    });

    setMostrarModal(true);
  };

  // Abrir formulario editar
  const editarUsuario = (usuario) => {
    setModoEdicion(true);
    setUsuarioEditando(usuario);

    setFormulario({
      nombre: usuario.nombre,
      usuario: usuario.usuario,
      password: usuario.password,
      rol: usuario.rol,
      estado: usuario.estado,
    });

    setMostrarModal(true);
  };

  // Guardar formulario
  const guardarFormulario = (e) => {
    e.preventDefault();

    if (
      !formulario.nombre.trim() ||
      !formulario.usuario.trim() ||
      !formulario.password.trim()
    ) {
      alert("Completa todos los campos.");
      return;
    }

    if (modoEdicion) {
      const actualizados = usuarios.map((usuario) =>
        usuario.id === usuarioEditando.id
          ? {
              ...usuario,
              ...formulario,
            }
          : usuario
      );

      guardarUsuarios(actualizados);
    } else {
      const usuarioExistente = usuarios.some(
        (usuario) =>
          usuario.usuario.toLowerCase() ===
          formulario.usuario.toLowerCase()
      );

      if (usuarioExistente) {
        alert("Ese nombre de usuario ya existe.");
        return;
      }

      const nuevoUsuario = {
        id: Date.now(),
        ...formulario,
      };

      guardarUsuarios([
        ...usuarios,
        nuevoUsuario,
      ]);
    }

    setMostrarModal(false);
  };

  // Eliminar usuario
  const eliminarUsuario = (id) => {
    const confirmar = window.confirm(
      "¿Estás seguro de eliminar este usuario?"
    );

    if (!confirmar) {
      return;
    }

    const actualizados = usuarios.filter(
      (usuario) => usuario.id !== id
    );

    guardarUsuarios(actualizados);
  };

  // Icono según rol
  const obtenerIconoRol = (rol) => {
    if (rol === "Administrador") {
      return <ShieldCheck size={18} />;
    }

    if (rol === "Almacenero") {
      return <Package size={18} />;
    }

    return <ShoppingCart size={18} />;
  };

  return (
    <div className="usuarios-page">

      {/* ENCABEZADO */}

      <div className="page-heading">

        <div>
          <span className="eyebrow">
            ADMINISTRACIÓN
          </span>

          <h1>Usuarios</h1>

          <p>
            Administra los usuarios y sus permisos de acceso.
          </p>
        </div>

        <button
          type="button"
          className="primary-button"
          onClick={nuevoUsuario}
        >
          <UserPlus size={18} />
          Nuevo usuario
        </button>

      </div>

      {/* RESUMEN */}

      <div className="user-summary">

        <div className="summary-card">

          <div className="summary-icon blue">
            <Users size={22} />
          </div>

          <div>
            <span>Usuarios</span>
            <strong>{usuarios.length}</strong>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon green">
            <ShieldCheck size={22} />
          </div>

          <div>
            <span>Administradores</span>

            <strong>
              {
                usuarios.filter(
                  (u) => u.rol === "Administrador"
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon orange">
            <Package size={22} />
          </div>

          <div>
            <span>Almaceneros</span>

            <strong>
              {
                usuarios.filter(
                  (u) => u.rol === "Almacenero"
                ).length
              }
            </strong>
          </div>

        </div>

        <div className="summary-card">

          <div className="summary-icon purple">
            <ShoppingCart size={22} />
          </div>

          <div>
            <span>Vendedores</span>

            <strong>
              {
                usuarios.filter(
                  (u) => u.rol === "Vendedor"
                ).length
              }
            </strong>
          </div>

        </div>

      </div>

      {/* TABLA */}

      <div className="users-table-card">

        <div className="table-header">

          <div>
            <h2>Usuarios registrados</h2>

            <p>
              Gestiona las cuentas que pueden ingresar al sistema.
            </p>
          </div>

        </div>

        <div className="table-container">

          <table>

            <thead>

              <tr>
                <th>Usuario</th>
                <th>Nombre</th>
                <th>Rol</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>

            </thead>

            <tbody>

              {usuarios.map((usuario) => (

                <tr key={usuario.id}>

                  <td>

                    <div className="user-cell">

                      <div className="user-avatar">
                        {usuario.nombre
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <strong>
                        {usuario.usuario}
                      </strong>

                    </div>

                  </td>

                  <td>
                    {usuario.nombre}
                  </td>

                  <td>

                    <span
                      className={`role-badge ${usuario.rol
                        .toLowerCase()
                        .replace("í", "i")}`}
                    >
                      {obtenerIconoRol(usuario.rol)}

                      {usuario.rol}
                    </span>

                  </td>

                  <td>

                    <span className="status-badge">
                      <span className="status-dot"></span>
                      {usuario.estado}
                    </span>

                  </td>

                  <td>

                    <div className="action-buttons">

                      <button
                        type="button"
                        className="edit-button"
                        onClick={() =>
                          editarUsuario(usuario)
                        }
                        title="Editar"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="delete-button"
                        onClick={() =>
                          eliminarUsuario(usuario.id)
                        }
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      {/* MODAL */}

      {mostrarModal && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <div>

                <h2>
                  {modoEdicion
                    ? "Editar usuario"
                    : "Nuevo usuario"}
                </h2>

                <p>
                  Configura los datos y permisos de la cuenta.
                </p>

              </div>

              <button
                type="button"
                className="close-modal"
                onClick={() =>
                  setMostrarModal(false)
                }
              >
                <X size={20} />
              </button>

            </div>

            <form onSubmit={guardarFormulario}>

              <div className="form-group">

                <label>
                  Nombre completo
                </label>

                <input
                  type="text"
                  placeholder="Ej. Juan Pérez"
                  value={formulario.nombre}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      nombre: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Usuario
                </label>

                <input
                  type="text"
                  placeholder="Ej. jperez"
                  value={formulario.usuario}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      usuario: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-group">

                <label>
                  Contraseña
                </label>

                <input
                  type="password"
                  placeholder="Contraseña"
                  value={formulario.password}
                  onChange={(e) =>
                    setFormulario({
                      ...formulario,
                      password: e.target.value,
                    })
                  }
                />

              </div>

              <div className="form-row">

                <div className="form-group">

                  <label>
                    Rol
                  </label>

                  <select
                    value={formulario.rol}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        rol: e.target.value,
                      })
                    }
                  >
                    <option value="Administrador">
                      Administrador
                    </option>

                    <option value="Almacenero">
                      Almacenero
                    </option>

                    <option value="Vendedor">
                      Vendedor
                    </option>
                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Estado
                  </label>

                  <select
                    value={formulario.estado}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        estado: e.target.value,
                      })
                    }
                  >
                    <option value="Activo">
                      Activo
                    </option>

                    <option value="Inactivo">
                      Inactivo
                    </option>
                  </select>

                </div>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-button"
                  onClick={() =>
                    setMostrarModal(false)
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="primary-button"
                >
                  <Save size={17} />

                  {modoEdicion
                    ? "Guardar cambios"
                    : "Crear usuario"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default UsuariosPage;