import { useEffect, useMemo, useState } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  CheckCircle,
  Banknote,
  CreditCard,
  Smartphone,
  Package,
} from "lucide-react";

import "../styles/pos.css";

const imprimirBoleta = (venta) => {
  const ventana = window.open("", "_blank", "width=420,height=700");

  if (!ventana) {
    alert("Permite las ventanas emergentes para generar la boleta.");
    return;
  }

  const filas = venta.productos
    .map(
      (producto) => `
        <tr>
          <td>
            ${producto.nombre}
            <br />
            <small>${producto.cantidad} x S/ ${producto.precio.toFixed(2)}</small>
          </td>
          <td style="text-align:right">
            S/ ${producto.subtotal.toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  ventana.document.write(`
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <title>Boleta ${venta.numeroVenta}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          max-width: 360px;
          margin: 20px auto;
          padding: 10px;
          color: #222;
          font-size: 13px;
        }
        h1, h2, p { text-align: center; }
        h1 { font-size: 22px; margin-bottom: 4px; }
        h2 { font-size: 16px; }
        .detalle { margin: 16px 0; }
        table { width: 100%; border-collapse: collapse; }
        th, td {
          padding: 8px 2px;
          border-bottom: 1px dashed #bbb;
          text-align: left;
          vertical-align: top;
        }
        .total {
          font-size: 18px;
          font-weight: bold;
        }
        .derecha { text-align: right; }
        @media print {
          body { margin: 0 auto; }
        }
      </style>
    </head>
    <body>
      <h1>EL BUEN VECINO</h1>
      <p>BOLETA DE VENTA</p>
      <hr />
      <p><strong>Número:</strong> ${venta.numeroVenta}</p>
      <p><strong>Fecha:</strong> ${venta.fecha}</p>
      <p><strong>Vendedor:</strong> ${venta.vendedor}</p>
      <p><strong>Pago:</strong> ${venta.metodoPago}</p>

      <div class="detalle">
        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th class="derecha">Importe</th>
            </tr>
          </thead>
          <tbody>${filas}</tbody>
        </table>
      </div>

      <p class="derecha">Subtotal: S/ ${venta.subtotal.toFixed(2)}</p>
      <p class="derecha total">TOTAL: S/ ${venta.total.toFixed(2)}</p>
      ${
        venta.metodoPago === "Efectivo"
          ? `
            <p class="derecha">Recibido: S/ ${venta.dineroRecibido.toFixed(2)}</p>
            <p class="derecha">Vuelto: S/ ${venta.vuelto.toFixed(2)}</p>
          `
          : ""
      }

      <hr />
      <p>¡Gracias por tu compra!</p>
      <script>
        window.onload = () => {
          window.print();
        };
      <\/script>
    </body>
    </html>
  `);

  ventana.document.close();
};

const productosIniciales = [
  {
    id: 1,
    codigo: "775000100001",
    codigoBarras: "775000100001",
    nombre: "Arroz Costeño 1 kg",
    descripcion: "Arroz Costeño 1 kg",
    categoria: "Abarrotes",
    precioCompra: 3.2,
    precioVenta: 4.2,
    precio: 4.2,
    stock: 40,
    stockActual: 40,
  },
  {
    id: 2,
    codigo: "775000100002",
    codigoBarras: "775000100002",
    nombre: "Azúcar Rubia 1 kg",
    descripcion: "Azúcar Rubia 1 kg",
    categoria: "Abarrotes",
    precioCompra: 3.1,
    precioVenta: 4.0,
    precio: 4.0,
    stock: 20,
    stockActual: 20,
  },
  {
    id: 3,
    codigo: "775000100003",
    codigoBarras: "775000100003",
    nombre: "Aceite Primor 1 L",
    descripcion: "Aceite Primor 1 L",
    categoria: "Abarrotes",
    precioCompra: 7.5,
    precioVenta: 9.0,
    precio: 9.0,
    stock: 15,
    stockActual: 15,
  },
  {
    id: 4,
    codigo: "775000100004",
    codigoBarras: "775000100004",
    nombre: "Leche Gloria 400 g",
    descripcion: "Leche Gloria 400 g",
    categoria: "Lácteos",
    precioCompra: 3.2,
    precioVenta: 4.2,
    precio: 4.2,
    stock: 18,
    stockActual: 18,
  },
  {
    id: 5,
    codigo: "775000100005",
    codigoBarras: "775000100005",
    nombre: "Galletas Soda Field",
    descripcion: "Galletas Soda Field",
    categoria: "Galletas",
    precioCompra: 1.2,
    precioVenta: 1.8,
    precio: 1.8,
    stock: 12,
    stockActual: 12,
  },
];

function PuntoVentaPage({ usuario }) {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [carrito, setCarrito] = useState([]);
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [dineroRecibido, setDineroRecibido] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");

  // ---------------------------------------------------------
  // OBTENER PRECIO
  // ---------------------------------------------------------

  const obtenerPrecio = (producto) => {
    const precio =
      producto?.precioVenta ??
      producto?.precio ??
      producto?.precio_venta ??
      producto?.precioVentaUnitario ??
      0;

    const numero = Number(precio);

    return Number.isFinite(numero) ? numero : 0;
  };

  // ---------------------------------------------------------
  // OBTENER STOCK
  // ---------------------------------------------------------

  const obtenerStock = (producto) => {
    const stock =
      producto?.stockActual ??
      producto?.stock ??
      producto?.cantidad ??
      0;

    const numero = Number(stock);

    return Number.isFinite(numero) ? numero : 0;
  };

  // ---------------------------------------------------------
  // NORMALIZAR PRODUCTOS
  // ---------------------------------------------------------

  const normalizarProducto = (producto) => {
    const precio = obtenerPrecio(producto);
    const stock = obtenerStock(producto);

    return {
      ...producto,
      id: producto.id ?? producto.id_producto,
      nombre:
        producto.nombre ??
        producto.descripcion ??
        producto.producto ??
        "Producto sin nombre",
      codigo:
        producto.codigo ??
        producto.codigoBarras ??
        producto.codigo_barras ??
        producto.id_producto ??
        "",
      codigoBarras:
        producto.codigoBarras ??
        producto.codigo_barras ??
        producto.codigo ??
        "",
      categoria: producto.categoria ?? "General",
      precioVenta: precio,
      precio: precio,
      stock: stock,
      stockActual: stock,
    };
  };

  // ---------------------------------------------------------
  // CARGAR PRODUCTOS
  // ---------------------------------------------------------

  useEffect(() => {
    try {
      const productosGuardados = localStorage.getItem("productos");

      if (productosGuardados) {
        const datos = JSON.parse(productosGuardados);

        if (Array.isArray(datos) && datos.length > 0) {
          setProductos(datos.map(normalizarProducto));
          return;
        }
      }
    } catch (error) {
      console.error("Error al cargar productos:", error);
    }

    setProductos(productosIniciales.map(normalizarProducto));
  }, []);

  // ---------------------------------------------------------
  // ESCUCHAR CAMBIOS DE PRODUCTOS
  // ---------------------------------------------------------

  useEffect(() => {
    const actualizarProductos = () => {
      try {
        const productosGuardados = localStorage.getItem("productos");

        if (productosGuardados) {
          const datos = JSON.parse(productosGuardados);

          if (Array.isArray(datos)) {
            setProductos(datos.map(normalizarProducto));
          }
        }
      } catch (error) {
        console.error("Error actualizando productos:", error);
      }
    };

    window.addEventListener("productosActualizados", actualizarProductos);

    return () => {
      window.removeEventListener(
        "productosActualizados",
        actualizarProductos
      );
    };
  }, []);

  // ---------------------------------------------------------
  // PRODUCTOS FILTRADOS
  // ---------------------------------------------------------

  const productosFiltrados = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();

    if (!texto) {
      return [];
    }

    return productos.filter((producto) => {
      const nombre = String(producto.nombre ?? "").toLowerCase();

      const codigo = String(
        producto.codigo ??
          producto.codigoBarras ??
          ""
      ).toLowerCase();

      return (
        nombre.includes(texto) ||
        codigo.includes(texto)
      );
    });
  }, [productos, busqueda]);

  // ---------------------------------------------------------
  // AGREGAR AL CARRITO
  // ---------------------------------------------------------

  const agregarAlCarrito = (producto) => {
    setError("");
    setMensaje("");

    const productoNormalizado = normalizarProducto(producto);

    const stock = obtenerStock(productoNormalizado);

    if (stock <= 0) {
      setError("Este producto no tiene stock disponible.");
      return;
    }

    setCarrito((carritoAnterior) => {
      const productoExistente = carritoAnterior.find(
        (item) => item.id === productoNormalizado.id
      );

      if (productoExistente) {
        if (productoExistente.cantidad >= stock) {
          setError("No hay más unidades disponibles de este producto.");
          return carritoAnterior;
        }

        return carritoAnterior.map((item) =>
          item.id === productoNormalizado.id
            ? {
                ...item,
                cantidad: item.cantidad + 1,
              }
            : item
        );
      }

      return [
        ...carritoAnterior,
        {
          ...productoNormalizado,
          cantidad: 1,
        },
      ];
    });

    setBusqueda("");
  };

  // ---------------------------------------------------------
  // AUMENTAR CANTIDAD
  // ---------------------------------------------------------

  const aumentarCantidad = (id) => {
    setError("");

    setCarrito((carritoAnterior) =>
      carritoAnterior.map((item) => {
        if (item.id !== id) {
          return item;
        }

        const stock = obtenerStock(item);

        if (item.cantidad >= stock) {
          setError("No puedes agregar más unidades. Stock insuficiente.");
          return item;
        }

        return {
          ...item,
          cantidad: item.cantidad + 1,
        };
      })
    );
  };

  // ---------------------------------------------------------
  // DISMINUIR CANTIDAD
  // ---------------------------------------------------------

  const disminuirCantidad = (id) => {
    setError("");

    setCarrito((carritoAnterior) =>
      carritoAnterior
        .map((item) => {
          if (item.id !== id) {
            return item;
          }

          return {
            ...item,
            cantidad: item.cantidad - 1,
          };
        })
        .filter((item) => item.cantidad > 0)
    );
  };

  // ---------------------------------------------------------
  // ELIMINAR DEL CARRITO
  // ---------------------------------------------------------

  const eliminarDelCarrito = (id) => {
    setCarrito((carritoAnterior) =>
      carritoAnterior.filter((item) => item.id !== id)
    );
  };

  // ---------------------------------------------------------
  // SUBTOTAL
  // ---------------------------------------------------------

  const subtotal = useMemo(() => {
    return carrito.reduce((total, item) => {
      const precio = obtenerPrecio(item);
      const cantidad = Number(item.cantidad) || 0;

      return total + precio * cantidad;
    }, 0);
  }, [carrito]);

  // ---------------------------------------------------------
  // TOTAL
  // ---------------------------------------------------------

  const total = subtotal;

  // ---------------------------------------------------------
  // DINERO RECIBIDO
  // ---------------------------------------------------------

  const recibido = Number(dineroRecibido) || 0;

  const vuelto =
    metodoPago === "Efectivo"
      ? Math.max(recibido - total, 0)
      : 0;

  // ---------------------------------------------------------
  // COMPLETAR VENTA
  // ---------------------------------------------------------

  const completarVenta = () => {
    setError("");
    setMensaje("");

    if (carrito.length === 0) {
      setError("Agrega al menos un producto a la venta. ");
      return;
    }

    if (total <= 0) {
      setError("El total de la venta no es válido.");
      return;
    }

    if (
      metodoPago === "Efectivo" &&
      recibido < total
    ) {
      setError(
        `El dinero recibido es insuficiente. Faltan S/ ${(total - recibido).toFixed(
          2
        )}.`
      );
      return;
    }

    // -----------------------------------------
    // ACTUALIZAR STOCK
    // -----------------------------------------

    const productosActualizados = productos.map((producto) => {
      const itemVendido = carrito.find(
        (item) => item.id === producto.id
      );

      if (!itemVendido) {
        return producto;
      }

      const stockActual = obtenerStock(producto);

      const nuevoStock = Math.max(
        stockActual - itemVendido.cantidad,
        0
      );

      return {
        ...producto,
        stock: nuevoStock,
        stockActual: nuevoStock,
      };
    });

    setProductos(productosActualizados);

    // -----------------------------------------
    // GUARDAR PRODUCTOS
    // -----------------------------------------

    localStorage.setItem(
      "productos",
      JSON.stringify(productosActualizados)
    );

    // -----------------------------------------
    // CREAR VENTA
    // -----------------------------------------

    const ventasGuardadas =
      JSON.parse(localStorage.getItem("ventas")) || [];

    const nuevaVenta = {
      id:
        Date.now(),

      numeroVenta:
        `V-${Date.now()}`,

      fecha:
        new Date().toLocaleString("es-PE"),

      fechaHora:
        new Date().toISOString(),

      usuario:
        usuario?.nombre ?? "Usuario",

      idUsuario:
        usuario?.id ?? null,

      vendedor:
        usuario?.nombre ?? "Usuario",

      metodoPago,

      subtotal: Number(subtotal.toFixed(2)),

      total: Number(total.toFixed(2)),

      dineroRecibido:
        metodoPago === "Efectivo"
          ? Number(recibido.toFixed(2))
          : Number(total.toFixed(2)),

      vuelto:
        Number(vuelto.toFixed(2)),

      productos: carrito.map((item) => ({
        id: item.id,

        codigo:
          item.codigo ??
          item.codigoBarras ??
          "",

        nombre: item.nombre,

        cantidad: item.cantidad,

        precio:
          Number(obtenerPrecio(item).toFixed(2)),

        subtotal:
          Number(
            (
              obtenerPrecio(item) *
              item.cantidad
            ).toFixed(2)
          ),
      })),
    };

    const nuevasVentas = [
      ...ventasGuardadas,
      nuevaVenta,
    ];

    localStorage.setItem(
      "ventas",
      JSON.stringify(nuevasVentas)
    );

    // Avisar a otros componentes
    window.dispatchEvent(
      new Event("productosActualizados")
    );

    window.dispatchEvent(
      new Event("ventasActualizadas")
    );

    // -----------------------------------------
    // LIMPIAR VENTA
    // -----------------------------------------

    setCarrito([]);
    setBusqueda("");
    setDineroRecibido("");

    setMensaje(
      `Venta ${nuevaVenta.numeroVenta} registrada correctamente.`
    );

    setTimeout(() => {
  imprimirBoleta(nuevaVenta);
}, 300);

    // Quitar mensaje después de unos segundos
    setTimeout(() => {
      setMensaje("");
    }, 4000);
  };

  // ---------------------------------------------------------
  // CANCELAR VENTA
  // ---------------------------------------------------------

  const cancelarVenta = () => {
    setCarrito([]);
    setDineroRecibido("");
    setBusqueda("");
    setError("");
    setMensaje("");
  };

  // ---------------------------------------------------------
  // INTERFAZ
  // ---------------------------------------------------------

  return (
    <div className="pos-page">

      {/* ENCABEZADO */}
      <div className="page-heading">
        <div>
          <span className="eyebrow">
            PUNTO DE VENTA
          </span>

          <h1>Registrar venta</h1>

          <p>
            Busca productos, agrégalos al carrito y registra el cobro.
          </p>
        </div>
      </div>

      {/* MENSAJE DE ÉXITO */}
      {mensaje && (
        <div className="success-message">
          <CheckCircle size={20} />
          <span>{mensaje}</span>
        </div>
      )}

      {/* MENSAJE DE ERROR */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="pos-layout">

        {/* ==========================================
            PARTE IZQUIERDA
        ========================================== */}

        <section className="pos-products">

          <div className="search-box">

            <Search size={20} />

            <input
              type="text"
              placeholder="Buscar por nombre o código..."
              value={busqueda}
              onChange={(e) => {
                setBusqueda(e.target.value);
                setError("");
              }}
            />

          </div>

          {/* RESULTADOS */}
          {busqueda && (
            <div className="product-results">

              {productosFiltrados.length === 0 ? (

                <div className="empty-results">
                  <Package size={35} />

                  <strong>
                    Producto no encontrado
                  </strong>

                  <span>
                    No encontramos productos con esa búsqueda.
                  </span>
                </div>

              ) : (

                productosFiltrados.map((producto) => {

                  const precio =
                    obtenerPrecio(producto);

                  const stock =
                    obtenerStock(producto);

                  return (
                    <div
                      className="product-result"
                      key={producto.id}
                    >

                      <div className="product-result-info">

                        <div className="product-icon">
                          <Package size={20} />
                        </div>

                        <div>

                          <strong>
                            {producto.nombre}
                          </strong>

                          <span>
                            Código:{" "}
                            {producto.codigo ||
                              producto.codigoBarras ||
                              "N/A"}
                          </span>

                          <small>
                            Stock: {stock}
                          </small>

                        </div>

                      </div>

                      <div className="product-result-action">

                        <strong>
                          S/ {precio.toFixed(2)}
                        </strong>

                        <button
                          type="button"
                          onClick={() =>
                            agregarAlCarrito(producto)
                          }
                          disabled={stock <= 0}
                        >
                          <Plus size={17} />
                          Agregar
                        </button>

                      </div>

                    </div>
                  );
                })

              )}

            </div>
          )}

          {/* ESTADO VACÍO */}
          {!busqueda && (
            <div className="pos-empty">

              <ShoppingCart size={32} />

              <strong>
                Agrega productos a la venta
              </strong>

              <span>
                Busca por nombre o código de barras.
              </span>

            </div>
          )}

        </section>

        {/* ==========================================
            CARRITO
        ========================================== */}

        <aside className="pos-cart">

          <div className="cart-header">

            <div>

              <h2>Carrito</h2>

              <span>
                {carrito.length} producto
                {carrito.length !== 1 ? "s" : ""}
              </span>

            </div>

            {carrito.length > 0 && (
              <button
                type="button"
                className="clear-cart"
                onClick={cancelarVenta}
              >
                Vaciar
              </button>
            )}

          </div>

          {/* PRODUCTOS DEL CARRITO */}
          <div className="cart-items">

            {carrito.length === 0 ? (

              <div className="cart-empty">

                <ShoppingCart size={45} />

                <strong>
                  El carrito está vacío
                </strong>

                <span>
                  Busca un producto para comenzar.
                </span>

              </div>

            ) : (

              carrito.map((item) => {

                const precio =
                  obtenerPrecio(item);

                const subtotalProducto =
                  precio * item.cantidad;

                return (
                  <div
                    className="cart-item"
                    key={item.id}
                  >

                    <div className="cart-item-info">

                      <strong>
                        {item.nombre}
                      </strong>

                      <span>
                        S/ {precio.toFixed(2)} c/u
                      </span>

                    </div>

                    <div className="cart-item-bottom">

                      <div className="quantity-control">

                        <button
                          type="button"
                          onClick={() =>
                            disminuirCantidad(item.id)
                          }
                        >
                          <Minus size={15} />
                        </button>

                        <span>
                          {item.cantidad}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            aumentarCantidad(item.id)
                          }
                        >
                          <Plus size={15} />
                        </button>

                      </div>

                      <strong>
                        S/ {subtotalProducto.toFixed(2)}
                      </strong>

                      <button
                        type="button"
                        className="remove-item"
                        onClick={() =>
                          eliminarDelCarrito(item.id)
                        }
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </div>
                );
              })

            )}

          </div>

          {/* ========================================
              RESUMEN
          ======================================== */}

          <div className="cart-summary">

            <div className="summary-line">

              <span>
                Subtotal 
              </span>

              <strong>
                S/ {subtotal.toFixed(2)}
              </strong>

            </div>

            <div className="summary-total">

              <span>
                Total 
              </span>

              <strong>
                S/ {total.toFixed(2)}
              </strong>

            </div>

            <hr />

            {/* MÉTODO DE PAGO */}

            <label className="payment-label">
              Método de pago
            </label>

            <div className="payment-methods">

              <button
                type="button"
                className={
                  metodoPago === "Efectivo"
                    ? "payment-active"
                    : ""
                }
                onClick={() => {
                  setMetodoPago("Efectivo");
                  setDineroRecibido("");
                }}
              >
                <Banknote size={18} />
                Efectivo
              </button>

              <button
                type="button"
                className={
                  metodoPago === "Tarjeta"
                    ? "payment-active"
                    : ""
                }
                onClick={() => {
                  setMetodoPago("Tarjeta");
                  setDineroRecibido("");
                }}
              >
                <CreditCard size={18} />
                Tarjeta
              </button>

              <button
                type="button"
                className={
                  metodoPago === "Yape/Plin"
                    ? "payment-active"
                    : ""
                }
                onClick={() => {
                  setMetodoPago("Yape/Plin");
                  setDineroRecibido("");
                }}
              >
                <Smartphone size={18} />
                Yape/Plin
              </button>

            </div>

            {/* EFECTIVO */}

            {metodoPago === "Efectivo" && (
              <>
                <label className="payment-label">
                  Dinero recibido
                </label>

                <div className="money-input">

                  <span>
                    S/
                  </span>

                  <input
                    type="number"
                    min="0"
                    step="0.10"
                    placeholder="0.00"
                    value={dineroRecibido}
                    onChange={(e) =>
                      setDineroRecibido(
                        e.target.value
                      )
                    }
                  />

                </div>

                <div
                  className={
                    recibido >= total
                      ? "change-box"
                      : "change-box insufficient"
                  }
                >

                  <span>
                    {recibido >= total
                      ? "Vuelto"
                      : "Falta"}
                  </span>

                  <strong>
                    S/{" "}
                    {(
                      recibido >= total
                        ? vuelto
                        : total - recibido
                    ).toFixed(2)}
                  </strong>

                </div>
              </>
            )}

            {/* TARJETA / YAPE */}

            {metodoPago !== "Efectivo" && (
              <div className="digital-payment-info">

                {metodoPago === "Tarjeta" ? (
                  <>
                    <CreditCard size={22} />
                    <span>
                      Confirma que el pago con tarjeta haya sido realizado.
                    </span>
                  </>
                ) : (
                  <>
                    <Smartphone size={22} />
                    <span>
                      Confirma que el pago por Yape/Plin haya sido realizado.
                    </span>
                  </>
                )}

              </div>
            )}

            {/* BOTÓN */}

            <button
              type="button"
              className="complete-sale"
              onClick={completarVenta}
              disabled={carrito.length === 0}
            >
              <CheckCircle size={19} />
              Completar venta
            </button>

          </div>

        </aside>

      </div>
    </div>
  );
}

export default PuntoVentaPage;