import { useEffect, useState } from "react";

import {
  LogIn,
  Store,
  ShieldCheck,
  Package,
  ShoppingCart,
  Eye,
  EyeOff,
  Warehouse,
  Users,
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import ProductosPage from "./pages/ProductosPage";
import InventarioPage from "./pages/InventarioPage";
import PuntoVentaPage from "./pages/PuntoVentaPage";
import UsuariosPage from "./pages/UsuariosPage";
import logo from "./assets/logo.png";

import usuariosIniciales from "./data/users";

import "./styles/global.css";

// =====================================================
// OBTENER USUARIOS
// =====================================================

const obtenerUsuarios = () => {
  try {
    const guardados = localStorage.getItem("usuarios");

    if (guardados) {
      return JSON.parse(guardados);
    }

    localStorage.setItem(
      "usuarios",
      JSON.stringify(usuariosIniciales)
    );

    return usuariosIniciales;
  } catch (error) {
    console.error("Error al cargar usuarios:", error);
    return usuariosIniciales;
  }
};

// =====================================================
// APP PRINCIPAL
// =====================================================

function App() {
  const [usuario, setUsuario] = useState(null);
  const [pagina, setPagina] = useState("dashboard");

  // ===================================================
  // CARGAR USUARIO GUARDADO
  // ===================================================

  useEffect(() => {
    const usuarioGuardado =
      localStorage.getItem("usuarioActual");

    if (usuarioGuardado) {
      try {
        setUsuario(JSON.parse(usuarioGuardado));
      } catch (error) {
        console.error(
          "Error al recuperar la sesión:",
          error
        );

        localStorage.removeItem("usuarioActual");
      }
    }
  }, []);

  // ===================================================
  // INICIAR SESIÓN
  // ===================================================

  const iniciarSesion = (usuarioIngresado) => {
    setUsuario(usuarioIngresado);
    setPagina("dashboard");

    localStorage.setItem(
      "usuarioActual",
      JSON.stringify(usuarioIngresado)
    );
  };

  // ===================================================
  // CERRAR SESIÓN
  // ===================================================

  const cerrarSesion = () => {
    setUsuario(null);
    setPagina("dashboard");

    localStorage.removeItem("usuarioActual");
  };

  // ===================================================
  // SI NO HAY USUARIO → LOGIN
  // ===================================================

  if (!usuario) {
    return <Login onLogin={iniciarSesion} />;
  }

  // ===================================================
  // DASHBOARD
  // ===================================================

  const Dashboard = () => {
    return (
      <div className="dashboard-page">

        <div className="welcome">
          <span className="eyebrow">
            BIENVENIDO
          </span>

          <h1>
            Hola,{" "}
            {usuario.nombre?.split(" ")[0]} 👋
          </h1>

          <p>
            Has ingresado al sistema como{" "}
            <strong>{usuario.rol}</strong>.
          </p>
        </div>

        {/* TARJETAS */}

        <section className="cards">

          {/* INVENTARIO */}

          {(usuario.rol === "Administrador" ||
            usuario.rol === "Almacenero") && (
            <div
              className="card"
              onClick={() => setPagina("inventario")}
              style={{ cursor: "pointer" }}
            >
              <div className="card-icon blue">
                <Package />
              </div>

              <h3>Inventario</h3>

              <p>
                Consulta y controla el stock
                de los productos.
              </p>
            </div>
          )}

          {/* VENTAS */}

          {(usuario.rol === "Administrador" ||
            usuario.rol === "Vendedor") && (
            <div
              className="card"
              onClick={() => setPagina("ventas")}
              style={{ cursor: "pointer" }}
            >
              <div className="card-icon green">
                <ShoppingCart />
              </div>

              <h3>Ventas</h3>

              <p>
                Registra y consulta las
                ventas realizadas.
              </p>
            </div>
          )}

          {/* USUARIOS */}

          {usuario.rol === "Administrador" && (
            <div
              className="card"
              onClick={() => setPagina("usuarios")}
              style={{ cursor: "pointer" }}
            >
              <div className="card-icon purple">
                <ShieldCheck />
              </div>

              <h3>Usuarios</h3>

              <p>
                Administra los usuarios y
                sus permisos.
              </p>
            </div>
          )}

        </section>

        {/* INFORMACIÓN DEL USUARIO */}

        <section
          className="user-info-dashboard"
          style={{
            marginTop: "24px",
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "24px",
          }}
        >
          <h2>
            Información de acceso
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "15px",
              marginTop: "18px",
            }}
          >

            <div>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Usuario
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {usuario.usuario}
              </strong>
            </div>

            <div>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Nombre
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {usuario.nombre}
              </strong>
            </div>

            <div>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Rol
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                }}
              >
                {usuario.rol}
              </strong>
            </div>

            <div>
              <span
                style={{
                  color: "#64748b",
                  fontSize: "13px",
                }}
              >
                Estado
              </span>

              <strong
                style={{
                  display: "block",
                  marginTop: "5px",
                  color: "#059669",
                }}
              >
                {usuario.estado}
              </strong>
            </div>

          </div>
        </section>

      </div>
    );
  };

  // ===================================================
  // MÓDULO TEMPORAL
  // ===================================================

  const ModuloTemporal = ({
    titulo,
    descripcion,
    icono,
  }) => {
    return (
      <div className="dashboard-page">

        <div className="welcome">
          <span className="eyebrow">
            MÓDULO
          </span>

          <h1>
            {icono} {titulo}
          </h1>

          <p>
            {descripcion}
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            border: "1px solid #e2e8f0",
            borderRadius: "12px",
            padding: "40px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "48px",
              marginBottom: "15px",
            }}
          >
            {icono}
          </div>

          <h2>{titulo}</h2>

          <p
            style={{
              color: "#64748b",
            }}
          >
            Este módulo está preparado
            para continuar su desarrollo.
          </p>
        </div>

      </div>
    );
  };

  // ===================================================
  // CONTENIDO SEGÚN PÁGINA
  // ===================================================

  const renderPagina = () => {

    // DASHBOARD

    if (pagina === "dashboard") {
      return <Dashboard />;
    }

    // PRODUCTOS

    if (pagina === "productos") {

      if (
        usuario.rol === "Administrador" ||
        usuario.rol === "Almacenero" ||
        usuario.rol === "Vendedor"
      ) {
        return (
          <ProductosPage usuario={usuario} />
        );
      }

      return (
        <ModuloTemporal
          titulo="Acceso restringido"
          descripcion="No tienes permisos para acceder a este módulo."
          icono="🔒"
        />
      );
    }

    // INVENTARIO

    if (pagina === "inventario") {

      if (
        usuario.rol === "Administrador" ||
        usuario.rol === "Almacenero"
      ) {
        return (
          <InventarioPage usuario={usuario} />
        );
      }

      return (
        <ModuloTemporal
          titulo="Acceso restringido"
          descripcion="No tienes permisos para acceder al inventario."
          icono="🔒"
        />
      );
    }

    // VENTAS

    if (pagina === "ventas") {

      if (
        usuario.rol === "Administrador" ||
        usuario.rol === "Vendedor"
      ) {
        return (
          <PuntoVentaPage usuario={usuario} />
        );
      }

      return (
        <ModuloTemporal
          titulo="Acceso restringido"
          descripcion="No tienes permisos para acceder al módulo de ventas."
          icono="🔒"
        />
      );
    }

    // USUARIOS

    if (pagina === "usuarios") {

      if (usuario.rol === "Administrador") {
        return <UsuariosPage />;
      }

      return (
        <ModuloTemporal
          titulo="Acceso restringido"
          descripcion="Solo el Administrador puede administrar usuarios."
          icono="🔒"
        />
      );
    }

    // REPORTES

    if (pagina === "reportes") {

      if (usuario.rol === "Administrador") {
        return (
          <ModuloTemporal
            titulo="Reportes"
            descripcion="Aquí podrás consultar reportes de ventas, inventario y caja."
            icono="📊"
          />
        );
      }

      return (
        <ModuloTemporal
          titulo="Acceso restringido"
          descripcion="Solo el Administrador puede acceder a los reportes."
          icono="🔒"
        />
      );
    }

    // PÁGINA DESCONOCIDA

    return <Dashboard />;
  };

  // ===================================================
  // SISTEMA PRINCIPAL
  // ===================================================

  return (
    <div className="app">

      <Sidebar
        pagina={pagina}
        setPagina={setPagina}
        usuario={usuario}
        cerrarSesion={cerrarSesion}
      />

      <div className="main-content">

        {/* HEADER */}

        <header className="header">

          <div className="header-title">

            <Store size={25} />

            <div>
              <strong>
                El Buen Vecino
              </strong>

              <span>
                Sistema de gestión
              </span>
            </div>

          </div>

          <div className="usuario">

            <div className="avatar">
              {usuario.nombre
                ?.charAt(0)
                ?.toUpperCase()}
            </div>

            <div>
              <strong>
                {usuario.nombre}
              </strong>

              <span>
                {usuario.rol}
              </span>
            </div>

            <button
              type="button"
              className="logout"
              onClick={cerrarSesion}
            >
              Cerrar sesión
            </button>

          </div>

        </header>

        {/* CONTENIDO */}

        <main className="dashboard">
          {renderPagina()}
        </main>

      </div>
    </div>
  );
}

// =====================================================
// LOGIN
// =====================================================

function Login({ onLogin }) {

  const [usuario, setUsuario] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [mostrarPassword, setMostrarPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  // ===================================================
  // INICIAR SESIÓN
  // ===================================================

  const iniciarSesion = (e) => {

    e.preventDefault();

    const listaUsuarios =
      obtenerUsuarios();

    const usuarioEncontrado =
      listaUsuarios.find(
        (u) =>
          u.usuario.toLowerCase() ===
            usuario.toLowerCase() &&
          u.password === password &&
          u.estado === "Activo"
      );

    if (!usuarioEncontrado) {
      setError(
        "Usuario o contraseña incorrectos."
      );

      return;
    }

    setError("");

    onLogin(usuarioEncontrado);
  };

  // ===================================================
  // INTERFAZ LOGIN
  // ===================================================

  return (
    <div className="login-page">

      {/* LADO IZQUIERDO */}

      <div className="login-left">

        <div className="login-decoration decoration-1"></div>

        <div className="login-decoration decoration-2"></div>

        <div className="login-brand">

          <div className="brand-logo">
            <img
              src={logo}
              alt="Bodega El Buen Vecino - Sistema de gestión de ventas e inventario"
            />
          </div>

          <p>
            Sistema web para la gestión
            de tu bodega.
          </p>

          <div className="features">

            <div>
              <Package size={20} />
              <span>
                Inventario
              </span>
            </div>

            <div>
              <ShoppingCart size={20} />
              <span>
                Ventas
              </span>
            </div>

            <div>
              <ShieldCheck size={20} />
              <span>
                Control
              </span>
            </div>

          </div>

        </div>

      </div>

      {/* LADO DERECHO */}

      <div className="login-right">

        <div className="login-box">

          <div className="mobile-logo">
            <img
              src={logo}
              alt="Bodega El Buen Vecino"
            />
          </div>

          <span className="system-label">
            SISTEMA WEB
          </span>

          <h2>
            Iniciar sesión
          </h2>

          <p className="login-description">
            Ingresa tus datos para acceder
            al sistema.
          </p>

          <form onSubmit={iniciarSesion}>

            {/* USUARIO */}

            <div className="input-group">

              <label>
                Usuario
              </label>

              <input
                type="text"
                placeholder="Ingresa tu usuario"
                value={usuario}
                onChange={(e) => {
                  setUsuario(e.target.value);
                  setError("");
                }}
              />

            </div>

            {/* CONTRASEÑA */}

            <div className="input-group">

              <label>
                Contraseña
              </label>

              <div className="password-input">

                <input
                  type={
                    mostrarPassword
                      ? "text"
                      : "password"
                  }
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                />

                <button
                  type="button"
                  onClick={() =>
                    setMostrarPassword(
                      !mostrarPassword
                    )
                  }
                >
                  {mostrarPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* ERROR */}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* BOTÓN */}

            <button
              type="submit"
              className="login-button"
            >
              <LogIn size={19} />
              Ingresar al sistema
            </button>

          </form>

          {/* USUARIOS DEMO */}

          <div className="demo-users">

            <strong>
              Usuarios de demostración
            </strong>

            <div>
              <span>
                Administrador
              </span>

              <code>
                admin / admin123
              </code>
            </div>

            <div>
              <span>
                Almacenero
              </span>

              <code>
                almacen / almacen123
              </code>
            </div>

            <div>
              <span>
                Vendedor
              </span>

              <code>
                vendedor / vendedor123
              </code>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default App;