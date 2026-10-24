
import { useEffect, useState } from "react";
import {
  BarChart3,
  TrendingUp,
  Package,
  ShoppingCart,
  AlertTriangle,
  DollarSign,
  ClipboardList,
} from "lucide-react";

import "../styles/reports.css";

const leerDatos = (clave) => {
  try {
    const datos = JSON.parse(localStorage.getItem(clave) || "[]");
    return Array.isArray(datos) ? datos : [];
  } catch {
    return [];
  }
};

function ReportesPage() {
  const [ventas, setVentas] = useState(() => leerDatos("ventas"));
  const [productos, setProductos] = useState(() => leerDatos("productos"));

  // Actualizar reportes al registrar ventas o cambiar el inventario.
  useEffect(() => {
    const actualizarReportes = () => {
      setVentas(leerDatos("ventas"));
      setProductos(leerDatos("productos"));
    };

    window.addEventListener("ventasActualizadas", actualizarReportes);
    window.addEventListener("productosActualizados", actualizarReportes);
    window.addEventListener("storage", actualizarReportes);

    return () => {
      window.removeEventListener("ventasActualizadas", actualizarReportes);
      window.removeEventListener("productosActualizados", actualizarReportes);
      window.removeEventListener("storage", actualizarReportes);
    };
  }, []);

  const dinero = (valor) =>
    new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(Number(valor) || 0);

  const totalVentas = ventas.reduce(
    (suma, venta) => suma + (Number(venta.total) || 0),
    0
  );

  const unidadesStock = productos.reduce(
    (suma, producto) =>
      suma +
      Math.max(
        0,
        Number(producto.stockActual ?? producto.stock ?? producto.cantidad) || 0
      ),
    0
  );

  const stockBajo = productos.filter((producto) => {
    const stock = Number(
      producto.stockActual ?? producto.stock ?? producto.cantidad
    ) || 0;

    const minimo = Number(producto.minimo ?? producto.stockMinimo ?? 5);

    return stock <= minimo;
  });

  const nombreProducto = (producto) =>
    producto.nombre ?? producto.descripcion ?? producto.producto ?? "Producto";

  const fechaVenta = (venta) => {
    if (venta.fecha) return venta.fecha;

    if (venta.fechaHora) {
      return new Date(venta.fechaHora).toLocaleString("es-PE");
    }

    return "Sin fecha";
  };

  return (
    <div className="reports-page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">ADMINISTRACIÓN</span>
          <h1>Reportes</h1>
          <p>Consulta las ventas registradas y el estado del inventario.</p>
        </div>
      </div>

      <div className="reports-grid">
        <div className="report-card">
          <div className="report-icon">
            <DollarSign />
          </div>
          <span>Total vendido</span>
          <h2>{dinero(totalVentas)}</h2>
        </div>

        <div className="report-card">
          <div className="report-icon">
            <ShoppingCart />
          </div>
          <span>Ventas registradas</span>
          <h2>{ventas.length}</h2>
        </div>

        <div className="report-card">
          <div className="report-icon">
            <Package />
          </div>
          <span>Unidades en stock</span>
          <h2>{unidadesStock}</h2>
        </div>

        <div className="report-card">
          <div className="report-icon">
            <AlertTriangle />
          </div>
          <span>Productos con stock bajo</span>
          <h2>{stockBajo.length}</h2>
        </div>
      </div>

      <section className="report-section">
        <div className="report-section-header">
          <h2><BarChart3 size={21} /> Ventas registradas</h2>
          <span>{ventas.length} registro(s)</span>
        </div>

        {ventas.length === 0 ? (
          <p className="report-empty">
            Todavía no hay ventas. Cuando el cajero complete una venta,
            aparecerá aquí.
          </p>
        ) : (
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>N.º de venta</th>
                  <th>Fecha</th>
                  <th>Vendedor</th>
                  <th>Método de pago</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {[...ventas].reverse().map((venta, indice) => (
                  <tr key={venta.id ?? indice}>
                    <td>{venta.numeroVenta ?? venta.id ?? `Venta ${indice + 1}`}</td>
                    <td>{fechaVenta(venta)}</td>
                    <td>{venta.vendedor ?? venta.usuario ?? "Sin nombre"}</td>
                    <td>{venta.metodoPago ?? "No especificado"}</td>
                    <td>{dinero(venta.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="report-section">
        <div className="report-section-header">
          <h2><TrendingUp size={21} /> Inventario con stock bajo</h2>
          <span>{stockBajo.length} producto(s)</span>
        </div>

        {stockBajo.length === 0 ? (
          <p className="report-empty">
            No hay productos con stock bajo.
          </p>
        ) : (
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Código</th>
                  <th>Stock actual</th>
                  <th>Stock mínimo</th>
                </tr>
              </thead>
              <tbody>
                {stockBajo.map((producto, indice) => (
                  <tr key={producto.id ?? indice}>
                    <td>{nombreProducto(producto)}</td>
                    <td>{producto.codigo ?? producto.codigoBarras ?? "N/A"}</td>
                    <td>
                      {Number(
                        producto.stockActual ?? producto.stock ?? producto.cantidad
                      ) || 0}
                    </td>
                    <td>{Number(producto.minimo ?? producto.stockMinimo ?? 5)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="report-section">
        <div className="report-section-header">
          <h2><ClipboardList size={21} /> Detalle de productos vendidos</h2>
        </div>

        {ventas.length === 0 ? (
          <p className="report-empty">Aún no hay productos vendidos.</p>
        ) : (
          <div className="report-table-wrapper">
            <table className="report-table">
              <thead>
                <tr>
                  <th>Venta</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {ventas.flatMap((venta, indiceVenta) =>
                  (Array.isArray(venta.productos) ? venta.productos : []).map(
                    (item, indiceItem) => (
                      <tr key={`${venta.id ?? indiceVenta}-${indiceItem}`}>
                        <td>{venta.numeroVenta ?? venta.id ?? `Venta ${indiceVenta + 1}`}</td>
                        <td>{item.nombre ?? "Producto"}</td>
                        <td>{Number(item.cantidad) || 0}</td>
                        <td>{dinero(item.precio)}</td>
                        <td>{dinero(item.subtotal)}</td>
                      </tr>
                    )
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}

export default ReportesPage;
