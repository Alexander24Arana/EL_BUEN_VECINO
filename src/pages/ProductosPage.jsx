import { useEffect, useState } from "react";

import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Package,
  X,
  Save,
  AlertTriangle,
} from "lucide-react";

import "../styles/products.css";

import productosIniciales from "../data/products";
import categoriasIniciales from "../data/categories";

function ProductosPage({ usuario }) {
  const [productos, setProductos] = useState(() => {
    try {
      const guardados = sessionStorage.getItem("productos_bodega");

      return guardados
        ? JSON.parse(guardados)
        : productosIniciales;
    } catch (error) {
      console.error(
        "Error al cargar productos:",
        error
      );

      return productosIniciales;
    }
  });

  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("Todas");

  const [modalAbierto, setModalAbierto] =
    useState(false);

  const [productoEditando, setProductoEditando] =
    useState(null);

  const [formulario, setFormulario] = useState({
    codigo: "",
    nombre: "",
    categoria: "Abarrotes",
    compra: "",
    precio: "",
    stock: "",
    minimo: 5,
  });

  // ==========================================
  // GUARDAR PRODUCTOS
  // ==========================================

  useEffect(() => {
    try {
      sessionStorage.setItem(
        "productos_bodega",
        JSON.stringify(productos)
      );
    } catch (error) {
      console.error(
        "Error al guardar productos:",
        error
      );
    }
  }, [productos]);

  // ==========================================
  // AVISAR A INVENTARIO Y OTROS COMPONENTES
  // ==========================================

  const notificarProductosActualizados = () => {
    window.dispatchEvent(
      new Event("productosActualizados")
    );
  };

  // ==========================================
  // CATEGORÍAS
  // ==========================================

  const categorias = [
  "Todas",
  ...new Set([
    ...categoriasIniciales,
    ...productos.map(
      (producto) => producto.categoria
    ),
  ]),
];

  // ==========================================
  // FILTRAR PRODUCTOS
  // ==========================================

  const productosFiltrados = productos.filter(
    (producto) => {
      const texto = busqueda
        .trim()
        .toLowerCase();

      const coincideBusqueda =
        producto.nombre
          .toLowerCase()
          .includes(texto) ||
        producto.codigo
          .toLowerCase()
          .includes(texto);

      const coincideCategoria =
        categoria === "Todas" ||
        producto.categoria === categoria;

      return (
        coincideBusqueda &&
        coincideCategoria
      );
    }
  );

  // ==========================================
  // ABRIR MODAL NUEVO
  // ==========================================

  const nuevoProducto = () => {
    setProductoEditando(null);

    setFormulario({
      codigo: "",
      nombre: "",
      categoria: "Abarrotes",
      compra: "",
      precio: "",
      stock: "",
      minimo: 5,
    });

    setModalAbierto(true);
  };

  // ==========================================
  // ABRIR MODAL EDITAR
  // ==========================================

  const editarProducto = (producto) => {
    setProductoEditando(producto);

    setFormulario({
      codigo: producto.codigo,
      nombre: producto.nombre,
      categoria: producto.categoria,
      compra: producto.compra,
      precio: producto.precio,
      stock: producto.stock,
      minimo: producto.minimo,
    });

    setModalAbierto(true);
  };

  // ==========================================
  // CERRAR MODAL
  // ==========================================

  const cerrarModal = () => {
    setModalAbierto(false);
    setProductoEditando(null);

    setFormulario({
      codigo: "",
      nombre: "",
      categoria: "Abarrotes",
      compra: "",
      precio: "",
      stock: "",
      minimo: 5,
    });
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
  // VALIDAR FORMULARIO
  // ==========================================

  const validarFormulario = () => {
    if (!formulario.codigo.trim()) {
      alert("Ingresa el código del producto.");
      return false;
    }

    if (!formulario.nombre.trim()) {
      alert("Ingresa el nombre del producto.");
      return false;
    }

    if (!formulario.compra) {
      alert(
        "Ingresa el precio de compra."
      );
      return false;
    }

    if (!formulario.precio) {
      alert(
        "Ingresa el precio de venta."
      );
      return false;
    }

    if (formulario.stock === "") {
      alert(
        "Ingresa el stock del producto."
      );
      return false;
    }

    const compra = Number(formulario.compra);
    const precio = Number(formulario.precio);
    const stock = Number(formulario.stock);
    const minimo = Number(formulario.minimo);

    if (
      Number.isNaN(compra) ||
      compra < 0
    ) {
      alert(
        "El precio de compra no es válido."
      );
      return false;
    }

    if (
      Number.isNaN(precio) ||
      precio < 0
    ) {
      alert(
        "El precio de venta no es válido."
      );
      return false;
    }

    if (
      Number.isNaN(stock) ||
      stock < 0
    ) {
      alert(
        "El stock no es válido."
      );
      return false;
    }

    if (
      Number.isNaN(minimo) ||
      minimo < 0
    ) {
      alert(
        "El stock mínimo no es válido."
      );
      return false;
    }

    return true;
  };

  // ==========================================
  // GUARDAR PRODUCTO
  // ==========================================

  const guardarProducto = (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    const codigo = formulario.codigo.trim();
    const nombre = formulario.nombre.trim();

    // Evitar códigos duplicados
    const codigoExiste = productos.some(
      (producto) =>
        producto.codigo.toLowerCase() ===
          codigo.toLowerCase() &&
        producto.id !==
          productoEditando?.id
    );

    if (codigoExiste) {
      alert(
        "Ya existe un producto con ese código."
      );
      return;
    }

    const nuevo = {
      id: productoEditando
        ? productoEditando.id
        : Date.now(),

      codigo,

      nombre,

      categoria:
        formulario.categoria,

      compra: Number(
        formulario.compra
      ),

      precio: Number(
        formulario.precio
      ),

      stock: Number(
        formulario.stock
      ),

      minimo: Number(
        formulario.minimo
      ),
    };

    if (productoEditando) {
      setProductos((anterior) =>
        anterior.map((producto) =>
          producto.id ===
          productoEditando.id
            ? nuevo
            : producto
        )
      );
    } else {
      setProductos((anterior) => [
        ...anterior,
        nuevo,
      ]);
    }

    // Actualizar sessionStorage inmediatamente
    const productosActualizados =
      productoEditando
        ? productos.map((producto) =>
            producto.id ===
            productoEditando.id
              ? nuevo
              : producto
          )
        : [...productos, nuevo];

    sessionStorage.setItem(
      "productos_bodega",
      JSON.stringify(
        productosActualizados
      )
    );

    // Avisar a Inventario
    notificarProductosActualizados();

    cerrarModal();
  };

  // ==========================================
  // ELIMINAR PRODUCTO
  // ==========================================

  const eliminarProducto = (id) => {
    if (
      usuario?.rol !==
      "Administrador"
    ) {
      alert(
        "Solo el Administrador puede eliminar productos."
      );
      return;
    }

    const producto = productos.find(
      (p) => p.id === id
    );

    if (!producto) {
      return;
    }

    const confirmar = window.confirm(
      `¿Eliminar "${producto.nombre}"?`
    );

    if (!confirmar) {
      return;
    }

    const productosActualizados =
      productos.filter(
        (producto) =>
          producto.id !== id
      );

    setProductos(
      productosActualizados
    );

    sessionStorage.setItem(
      "productos_bodega",
      JSON.stringify(
        productosActualizados
      )
    );

    notificarProductosActualizados();
  };

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  const stockBajo = productos.filter(
    (producto) =>
      Number(producto.stock) <=
      Number(producto.minimo)
  ).length;

  const unidades = productos.reduce(
    (total, producto) =>
      total + Number(producto.stock),
    0
  );

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="productos-page">

      {/* ENCABEZADO */}

      <div className="productos-heading">
        <div>
          <span className="section-label">
            CATÁLOGO
          </span>

          <h2>
            Productos
          </h2>

          <p>
            Administra los productos de
            El Buen Vecino.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={nuevoProducto}
        >
          <Plus size={19} />
          Nuevo producto
        </button>
      </div>

      {/* ESTADÍSTICAS */}

      <div className="productos-stats">

        <div className="product-stat">
          <div className="product-stat-icon">
            <Package size={21} />
          </div>

          <div>
            <span>
              Productos
            </span>

            <strong>
              {productos.length}
            </strong>
          </div>
        </div>

        <div className="product-stat">
          <div className="product-stat-icon">
            📦
          </div>

          <div>
            <span>
              Unidades en stock
            </span>

            <strong>
              {unidades}
            </strong>
          </div>
        </div>

        <div className="product-stat warning">
          <div className="product-stat-icon">
            <AlertTriangle
              size={21}
            />
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

      {/* FILTROS */}

      <div className="products-toolbar">

        <div className="search-box">
          <Search size={19} />

          <input
            type="text"
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={(e) =>
              setBusqueda(
                e.target.value
              )
            }
          />
        </div>

        <select
          value={categoria}
          onChange={(e) =>
            setCategoria(
              e.target.value
            )
          }
        >
          {categorias.map((cat) => (
            <option
              key={cat}
              value={cat}
            >
              {cat}
            </option>
          ))}
        </select>

      </div>

      {/* TABLA */}

      <div className="products-table-container">

        <table className="products-table">

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
                Compra
              </th>

              <th>
                Precio
              </th>

              <th>
                Stock
              </th>

              <th>
                Estado
              </th>

              <th>
                Acciones
              </th>
            </tr>
          </thead>

          <tbody>

            {productosFiltrados.length ===
            0 ? (
              <tr>
                <td
                  colSpan="8"
                  className="empty-products"
                >
                  No se encontraron
                  productos.
                </td>
              </tr>
            ) : (
              productosFiltrados.map(
                (producto) => (
                  <tr
                    key={producto.id}
                  >

                    <td>
                      <span className="product-code">
                        {producto.codigo}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {producto.nombre}
                      </strong>
                    </td>

                    <td>
                      <span className="category-badge">
                        {producto.categoria}
                      </span>
                    </td>

                    <td>
                      S/{" "}
                      {Number(
                        producto.compra
                      ).toFixed(2)}
                    </td>

                    <td className="price-cell">
                      S/{" "}
                      {Number(
                        producto.precio
                      ).toFixed(2)}
                    </td>

                    <td>
                      <strong>
                        {producto.stock}
                      </strong>
                    </td>

                    <td>
                      {Number(
                        producto.stock
                      ) <=
                      Number(
                        producto.minimo
                      ) ? (
                        <span className="stock-badge low">
                          Stock bajo
                        </span>
                      ) : (
                        <span className="stock-badge ok">
                          Disponible
                        </span>
                      )}
                    </td>

                    <td>
                      <div className="product-actions">

                        <button
                          type="button"
                          className="action-edit"
                          title="Editar"
                          onClick={() =>
                            editarProducto(
                              producto
                            )
                          }
                        >
                          <Pencil
                            size={17}
                          />
                        </button>

                        {usuario?.rol ===
                          "Administrador" && (
                          <button
                            type="button"
                            className="action-delete"
                            title="Eliminar"
                            onClick={() =>
                              eliminarProducto(
                                producto.id
                              )
                            }
                          >
                            <Trash2
                              size={17}
                            />
                          </button>
                        )}

                      </div>
                    </td>

                  </tr>
                )
              )
            )}

          </tbody>

        </table>

      </div>

      {/* MODAL */}

      {modalAbierto && (
        <div className="modal-overlay">

          <div className="product-modal">

            <div className="modal-header">

              <div>
                <span>
                  {productoEditando
                    ? "EDITAR PRODUCTO"
                    : "NUEVO PRODUCTO"}
                </span>

                <h3>
                  {productoEditando
                    ? "Modificar producto"
                    : "Registrar producto"}
                </h3>
              </div>

              <button
                type="button"
                className="modal-close"
                onClick={cerrarModal}
              >
                <X size={21} />
              </button>

            </div>

            <form
              className="product-form"
              onSubmit={
                guardarProducto
              }
            >

              {/* CÓDIGO + CATEGORÍA */}

              <div className="form-row">

                <div className="form-field">

                  <label>
                    Código *
                  </label>

                  <input
                    name="codigo"
                    value={
                      formulario.codigo
                    }
                    onChange={
                      cambiarFormulario
                    }
                    placeholder="Ej. 775000100009"
                  />

                </div>

                <div className="form-field">

                  <label>
                    Categoría *
                  </label>

                  <select
                    name="categoria"
                    value={
                      formulario.categoria
                    }
                    onChange={
                      cambiarFormulario
                    }
                  >
                    <option value="Abarrotes">
                      Abarrotes
                    </option>

                    <option value="Bebidas">
                      Bebidas
                    </option>

                    <option value="Lácteos">
                      Lácteos
                    </option>

                    <option value="Snacks">
                      Snacks
                    </option>

                    <option value="Conservas">
                      Conservas
                    </option>

                    <option value="Limpieza">
                      Limpieza
                    </option>

                    <option value="Higiene">
                      Higiene
                    </option>
                  </select>

                </div>

              </div>

              {/* NOMBRE */}

              <div className="form-field">

                <label>
                  Nombre del producto *
                </label>

                <input
                  name="nombre"
                  value={
                    formulario.nombre
                  }
                  onChange={
                    cambiarFormulario
                  }
                  placeholder="Ej. Fideos Don Vittorio 500 g"
                />

              </div>

              {/* PRECIOS */}

              <div className="form-row">

                <div className="form-field">

                  <label>
                    Precio de compra *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="compra"
                    value={
                      formulario.compra
                    }
                    onChange={
                      cambiarFormulario
                    }
                    placeholder="0.00"
                  />

                </div>

                <div className="form-field">

                  <label>
                    Precio de venta *
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    name="precio"
                    value={
                      formulario.precio
                    }
                    onChange={
                      cambiarFormulario
                    }
                    placeholder="0.00"
                  />

                </div>

              </div>

              {/* STOCK */}

              <div className="form-row">

                <div className="form-field">

                  <label>
                    Stock inicial *
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="stock"
                    value={
                      formulario.stock
                    }
                    onChange={
                      cambiarFormulario
                    }
                    placeholder="0"
                  />

                </div>

                <div className="form-field">

                  <label>
                    Stock mínimo
                  </label>

                  <input
                    type="number"
                    min="0"
                    name="minimo"
                    value={
                      formulario.minimo
                    }
                    onChange={
                      cambiarFormulario
                    }
                  />

                </div>

              </div>

              {/* BOTONES */}

              <div className="modal-actions">

                <button
                  type="button"
                  className="btn-secondary"
                  onClick={
                    cerrarModal
                  }
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="btn-primary"
                >
                  <Save size={18} />

                  {productoEditando
                    ? "Guardar cambios"
                    : "Registrar producto"}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  );
}

export default ProductosPage;