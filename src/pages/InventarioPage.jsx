import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  AlertTriangle,
  Package,
  X,
  Save,
} from "lucide-react";

import "../styles/inventario.css";

function InventarioPage({ usuario }) {
  const [productos, setProductos] = useState([]);

  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");

  const [modal, setModal] = useState(false);

  const [formulario, setFormulario] = useState({
    productoId: "",
    tipo: "Entrada",
    cantidad: "",
    motivo: "",
  });

  const [movimientos, setMovimientos] = useState(() => {
    const guardados = sessionStorage.getItem(
      "movimientos_inventario"
    );

    return guardados
      ? JSON.parse(guardados)
      : [];
  });


  // ==========================================
  // CARGAR PRODUCTOS
  // ==========================================

  useEffect(() => {
    cargarProductos();

    const actualizar = () => {
      cargarProductos();
    };

    window.addEventListener(
      "productosActualizados",
      actualizar
    );

    return () => {
      window.removeEventListener(
        "productosActualizados",
        actualizar
      );
    };
  }, []);


  const cargarProductos = () => {
    const guardados =
      sessionStorage.getItem("productos_bodega");

    if (guardados) {
      setProductos(JSON.parse(guardados));
    } else {
      setProductos([]);
    }
  };


  // ==========================================
  // GUARDAR MOVIMIENTOS
  // ==========================================

  useEffect(() => {
    sessionStorage.setItem(
      "movimientos_inventario",
      JSON.stringify(movimientos)
    );
  }, [movimientos]);


  // ==========================================
  // PRODUCTOS FILTRADOS
  // ==========================================

  const productosFiltrados = productos.filter(
    (producto) => {

      const texto =
        busqueda.toLowerCase();

      const coincideBusqueda =
        producto.nombre
          .toLowerCase()
          .includes(texto) ||
        producto.codigo
          .toLowerCase()
          .includes(texto);

      const coincideStock =
        tipoFiltro === "Todos" ||
        (tipoFiltro === "Stock bajo" &&
          producto.stock <= producto.minimo) ||
        (tipoFiltro === "Disponible" &&
          producto.stock > producto.minimo);

      return (
        coincideBusqueda &&
        coincideStock
      );
    }
  );


  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  const totalProductos =
    productos.length;

  const totalUnidades =
    productos.reduce(
      (total, producto) =>
        total + Number(producto.stock),
      0
    );

  const stockBajo =
    productos.filter(
      (producto) =>
        Number(producto.stock) <=
        Number(producto.minimo)
    ).length;


  // ==========================================
  // ABRIR MODAL
  // ==========================================

  const abrirMovimiento = () => {

    if (productos.length === 0) {
      alert(
        "Primero debes registrar productos."
      );
      return;
    }

    setFormulario({
      productoId: productos[0].id,
      tipo: "Entrada",
      cantidad: "",
      motivo: "",
    });

    setModal(true);
  };


  // ==========================================
  // CAMBIAR FORMULARIO
  // ==========================================

  const cambiarFormulario = (e) => {

    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };


  // ==========================================
  // REGISTRAR MOVIMIENTO
  // ==========================================

  const registrarMovimiento = (e) => {

    e.preventDefault();

    const cantidad =
      Number(formulario.cantidad);

    if (!formulario.productoId) {
      alert("Selecciona un producto.");
      return;
    }

    if (!cantidad || cantidad <= 0) {
      alert("Ingresa una cantidad válida.");
      return;
    }


    const producto =
      productos.find(
        (p) =>
          p.id === Number(formulario.productoId)
      );

    if (!producto) {
      alert("No se encontró el producto.");
      return;
    }


    // ========================================
    // CALCULAR NUEVO STOCK
    // ========================================

    let nuevoStock =
      Number(producto.stock);


    if (formulario.tipo === "Entrada") {

      nuevoStock += cantidad;

    } else {

      if (cantidad > nuevoStock) {

        alert(
          `No puedes retirar ${cantidad} unidades. ` +
          `El producto solo tiene ${nuevoStock}.`
        );

        return;
      }

      nuevoStock -= cantidad;
    }


    // ========================================
    // ACTUALIZAR PRODUCTO
    // ========================================

    const productosActualizados =
      productos.map((p) => {

        if (p.id === producto.id) {

          return {
            ...p,
            stock: nuevoStock,
          };
        }

        return p;
      });


    setProductos(productosActualizados);


    sessionStorage.setItem(
      "productos_bodega",
      JSON.stringify(
        productosActualizados
      )
    );


    // ========================================
    // REGISTRAR MOVIMIENTO
    // ========================================

    const movimiento = {

      id: Date.now(),

      productoId: producto.id,

      producto:
        producto.nombre,

      tipo:
        formulario.tipo,

      cantidad,

      stockAnterior:
        producto.stock,

      stockNuevo:
        nuevoStock,

      motivo:
        formulario.motivo ||
        "Movimiento de inventario",

      usuario:
        usuario?.nombre ||
        "Usuario",

      fecha:
        new Date().toLocaleString("es-PE"),
    };


    setMovimientos((anteriores) => [
      movimiento,
      ...anteriores,
    ]);


    // Avisar a otras partes de la aplicación
    window.dispatchEvent(
      new Event("productosActualizados")
    );


    setModal(false);

    setFormulario({
      productoId: "",
      tipo: "Entrada",
      cantidad: "",
      motivo: "",
    });
  };


  return (
    <div className="inventario-page">

      {/* =====================================
          ENCABEZADO
      ===================================== */}

      <div className="inventario-heading">

        <div>

          <span className="section-label">
            CONTROL DE STOCK
          </span>

          <h2>
            Inventario
          </h2>

          <p>
            Controla las entradas, salidas y
            existencias de la bodega.
          </p>

        </div>


        <button
          className="btn-primary"
          onClick={abrirMovimiento}
        >

          <Plus size={19} />

          Nuevo movimiento

        </button>

      </div>


      {/* =====================================
          ESTADÍSTICAS
      ===================================== */}

      <div className="inventario-stats">

        <div className="inventory-stat">

          <div className="inventory-stat-icon blue">
            <Package size={21} />
          </div>

          <div>

            <span>
              Productos 
            </span>

            <strong>
              {totalProductos}
            </strong>

          </div>

        </div>


        <div className="inventory-stat">

          <div className="inventory-stat-icon green">
            📦
          </div>

          <div>

            <span>
              Unidades en stock
            </span>

            <strong>
              {totalUnidades}
            </strong>

          </div>

        </div>


        <div className="inventory-stat">

          <div className="inventory-stat-icon orange">
            <AlertTriangle size={21} />
          </div>

          <div>

            <span>
              Stock bajo
            </span>

            <strong>
              {stockBajo}
            </strong>

          </div>

        </div>

      </div>


      {/* =====================================
          FILTROS
      ===================================== */}

      <div className="inventory-toolbar">

        <div className="inventory-search">

          <Search size={19} />

          <input
            type="text"
            placeholder="Buscar producto..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(e.target.value)
            }
          />

        </div>


        <select
          value={tipoFiltro}
          onChange={(e) =>
            setTipoFiltro(e.target.value)
          }
        >

          <option value="Todos">
            Todos
          </option>

          <option value="Disponible">
            Disponible
          </option>

          <option value="Stock bajo">
            Stock bajo
          </option>

        </select>

      </div>


      {/* =====================================
          TABLA DE INVENTARIO
      ===================================== */}

      <div className="inventory-table-container">

        <table className="inventory-table">

          <thead>

            <tr>

              <th>
                Código
              </th>

              <th>
                Producto
              </th>

              <th>
                Categoría
              </th>

              <th>
                Stock
              </th>

              <th>
                Stock mínimo
              </th>

              <th>
                Estado
              </th>

            </tr>

          </thead>


          <tbody>

            {productosFiltrados.length === 0 ? (

              <tr>

                <td
                  colSpan="6"
                  className="inventory-empty"
                >
                  No hay productos para mostrar.
                </td>

              </tr>

            ) : (

              productosFiltrados.map(
                (producto) => (

                  <tr key={producto.id}>

                    <td>
                      <span className="inventory-code">
                        {producto.codigo}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {producto.nombre}
                      </strong>
                    </td>

                    <td>
                      <span className="inventory-category">
                        {producto.categoria}
                      </span>
                    </td>

                    <td>

                      <strong>
                        {producto.stock}
                      </strong>

                    </td>

                    <td>
                      {producto.minimo}
                    </td>

                    <td>

                      {producto.stock <=
                      producto.minimo ? (

                        <span className="inventory-status low">
                          Stock bajo
                        </span>

                      ) : (

                        <span className="inventory-status available">
                          Disponible
                        </span>

                      )}

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>


      {/* =====================================
          MOVIMIENTOS
      ===================================== */}

      <div className="movements-section">

        <div className="movements-heading">

          <div>

            <h3>
              Últimos movimientos
            </h3>

            <p>
              Historial de operaciones de inventario.
            </p>

          </div>

        </div>


        <div className="movements-table-container">

          <table className="movements-table">

            <thead>

              <tr>

                <th>
                  Fecha
                </th>

                <th>
                  Producto
                </th>

                <th>
                  Tipo
                </th>

                <th>
                  Cantidad
                </th>

                <th>
                  Stock anterior
                </th>

                <th>
                  Stock nuevo
                </th>

                <th>
                  Usuario
                </th>

              </tr>

            </thead>


            <tbody>

              {movimientos.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="inventory-empty"
                  >
                    Todavía no hay movimientos registrados.
                  </td>

                </tr>

              ) : (

                movimientos
                  .slice(0, 10)
                  .map((movimiento) => (

                    <tr key={movimiento.id}>

                      <td>
                        {movimiento.fecha}
                      </td>

                      <td>
                        <strong>
                          {movimiento.producto}
                        </strong>
                      </td>

                      <td>

                        {movimiento.tipo ===
                        "Entrada" ? (

                          <span className="movement-entry">

                            <ArrowDownToLine
                              size={15}
                            />

                            Entrada

                          </span>

                        ) : (

                          <span className="movement-exit">

                            <ArrowUpFromLine
                              size={15}
                            />

                            Salida

                          </span>

                        )}

                      </td>

                      <td>
                        {movimiento.cantidad}
                      </td>

                      <td>
                        {movimiento.stockAnterior}
                      </td>

                      <td>
                        <strong>
                          {movimiento.stockNuevo}
                        </strong>
                      </td>

                      <td>
                        {movimiento.usuario}
                      </td>

                    </tr>

                  ))

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =====================================
          MODAL MOVIMIENTO
      ===================================== */}

      {modal && (

        <div className="modal-overlay">

          <div className="inventory-modal">

            <div className="modal-header">

              <div>

                <span>
                  INVENTARIO
                </span>

                <h3>
                  Registrar movimiento
                </h3>

              </div>


              <button
                className="modal-close"
                type="button"
                onClick={() =>
                  setModal(false)
                }
              >

                <X size={21} />

              </button>

            </div>


            <form
              className="inventory-form"
              onSubmit={registrarMovimiento}
            >

              <div className="form-field">

                <label>
                  Producto *
                </label>

                <select
                  name="productoId"
                  value={formulario.productoId}
                  onChange={cambiarFormulario}
                >

                  {productos.map(
                    (producto) => (

                      <option
                        key={producto.id}
                        value={producto.id}
                      >
                        {producto.nombre} —
                        Stock: {producto.stock}
                      </option>

                    )
                  )}

                </select>

              </div>


              <div className="form-field">

                <label>
                  Tipo de movimiento *
                </label>

                <select
                  name="tipo"
                  value={formulario.tipo}
                  onChange={cambiarFormulario}
                >

                  <option value="Entrada">
                    Entrada de mercadería
                  </option>

                  <option value="Salida">
                    Salida
                  </option>

                </select>

              </div>


              <div className="form-field">

                <label>
                  Cantidad *
                </label>

                <input
                  type="number"
                  name="cantidad"
                  min="1"
                  value={formulario.cantidad}
                  onChange={cambiarFormulario}
                  placeholder="Ingresa la cantidad"
                />

              </div>


              <div className="form-field">

                <label>
                  Motivo
                </label>

                <input
                  type="text"
                  name="motivo"
                  value={formulario.motivo}
                  onChange={cambiarFormulario}
                  placeholder="Ej. Compra a proveedor"
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() =>
                    setModal(false)
                  }
                >
                  Cancelar
                </button>


                <button
                  type="submit"
                  className="btn-primary"
                >

                  <Save size={18} />

                  Registrar movimiento

                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default InventarioPage;