import {
  Menu
} from "lucide-react";

function Header({
  usuario,
  titulo,
  abrirMenu
}) {

  return (
    <header className="main-header">

      <button
        className="mobile-menu"
        onClick={abrirMenu}
      >
        <Menu size={22} />
      </button>


      <div className="header-title">

        <span>
          Bodega El Buen Vecino
        </span>

        <h1>
          {titulo}
        </h1>

      </div>


      <div className="header-user">

        <div className="header-avatar">
          {usuario.nombre.charAt(0)}
        </div>

        <div className="header-user-info">

          <strong>
            {usuario.nombre}
          </strong>

          <span>
            {usuario.rol}
          </span>

        </div>

      </div>

    </header>
  );
}

export default Header;