import {
  LayoutDashboard,
  Package,
  Warehouse,
  ShoppingCart,
  Users,
  BarChart3,
  LogOut,
  Store,
} from "lucide-react";
import logo from "../assets/logo.png";

function Sidebar({ pagina, setPagina, usuario, cerrarSesion }) {
  const esAdministrador =
    usuario?.rol === "Administrador";

  const esAlmacenero =
    usuario?.rol === "Almacenero";

  const esVendedor =
    usuario?.rol === "Vendedor";

  const irA = (paginaDestino) => {
    setPagina(paginaDestino);
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}

      <div className="sidebar-logo">
        <img
          src={logo}
          alt="Bodega El Buen Vecino"
        />
      </div>

      {/* USUARIO */}

      <div className="sidebar-user">

        <div className="sidebar-avatar">
          {usuario?.nombre
            ?.charAt(0)
            ?.toUpperCase() || "U"}
        </div>

        <div className="sidebar-user-info">

          <strong>
            {usuario?.nombre || "Usuario"}
          </strong>

          <span>
            {usuario?.rol || "Usuario"}
          </span>

        </div>

      </div>

      {/* MENÚ */}

      <nav className="sidebar-menu">

        <p className="menu-title">
          PRINCIPAL
        </p>

        {/* DASHBOARD */}

        <button
          type="button"
          className={
            pagina === "dashboard"
              ? "sidebar-item active"
              : "sidebar-item"
          }
          onClick={() => irA("dashboard")}
        >
          <LayoutDashboard size={19} />

          <span>
            Dashboard
          </span>
        </button>

        {/* =================================
            ADMINISTRADOR
        ================================= */}

        {esAdministrador && (
          <>
            <p className="menu-title">
              ADMINISTRACIÓN
            </p>

            <button
              type="button"
              className={
                pagina === "productos"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => irA("productos")}
            >
              <Package size={19} />

              <span>
                Productos
              </span>
            </button>

            <button
              type="button"
              className={
                pagina === "inventario"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => irA("inventario")}
            >
              <Warehouse size={19} />

              <span>
                Inventario
              </span>
            </button>

            <button
              type="button"
              className={
                pagina === "ventas"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => irA("ventas")}
            >
              <ShoppingCart size={19} />

              <span>
                Ventas
              </span>
            </button>

            <button
              type="button"
              className={
                pagina === "usuarios"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => irA("usuarios")}
            >
              <Users size={19} />

              <span>
                Usuarios
              </span>
            </button>

            <button
              type="button"
              className={
                pagina === "reportes"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => irA("reportes")}
            >
              <BarChart3 size={19} />

              <span>
                Reportes
              </span>
            </button>
          </>
        )}

        {/* =================================
            ALMACENERO
        ================================= */}

        {esAlmacenero && (
          <>
            <p className="menu-title">
              ALMACÉN
            </p>

            <button
              type="button"
              className={
                pagina === "productos"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => irA("productos")}
            >
              <Package size={19} />

              <span>
                Productos
              </span>
            </button>

            <button
              type="button"
              className={
                pagina === "inventario"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => irA("inventario")}
            >
              <Warehouse size={19} />

              <span>
                Inventario
              </span>
            </button>
          </>
        )}

        {/* =================================
            VENDEDOR
        ================================= */}

        {esVendedor && (
          <>
            <p className="menu-title">
              VENTAS
            </p>

            <button
              type="button"
              className={
                pagina === "ventas"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => irA("ventas")}
            >
              <ShoppingCart size={19} />

              <span>
                Punto de Venta
              </span>
            </button>

            <button
              type="button"
              className={
                pagina === "productos"
                  ? "sidebar-item active"
                  : "sidebar-item"
              }
              onClick={() => irA("productos")}
            >
              <Package size={19} />

              <span>
                Productos
              </span>
            </button>
          </>
        )}

      </nav>

      {/* CERRAR SESIÓN */}

      <div className="sidebar-bottom">

        <button
          type="button"
          className="logout-sidebar"
          onClick={cerrarSesion}
        >
          <LogOut size={19} />

          <span>
            Cerrar sesión
          </span>
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;