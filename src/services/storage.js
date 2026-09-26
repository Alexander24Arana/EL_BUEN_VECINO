// ==========================================
// STORAGE DEL SISTEMA
// ==========================================

// ---------- LOCAL STORAGE ----------

export const guardarLocal = (clave, datos) => {
  try {
    localStorage.setItem(clave, JSON.stringify(datos));
    return true;
  } catch (error) {
    console.error(
      `Error al guardar "${clave}" en localStorage:`,
      error
    );
    return false;
  }
};

export const obtenerLocal = (clave, valorPorDefecto = null) => {
  try {
    const datos = localStorage.getItem(clave);

    if (!datos) {
      return valorPorDefecto;
    }

    return JSON.parse(datos);
  } catch (error) {
    console.error(
      `Error al obtener "${clave}" de localStorage:`,
      error
    );
    return valorPorDefecto;
  }
};

export const eliminarLocal = (clave) => {
  try {
    localStorage.removeItem(clave);
    return true;
  } catch (error) {
    console.error(
      `Error al eliminar "${clave}" de localStorage:`,
      error
    );
    return false;
  }
};


// ---------- SESSION STORAGE ----------

export const guardarSesion = (clave, datos) => {
  try {
    sessionStorage.setItem(
      clave,
      JSON.stringify(datos)
    );
    return true;
  } catch (error) {
    console.error(
      `Error al guardar "${clave}" en sessionStorage:`,
      error
    );
    return false;
  }
};

export const obtenerSesion = (
  clave,
  valorPorDefecto = null
) => {
  try {
    const datos = sessionStorage.getItem(clave);

    if (!datos) {
      return valorPorDefecto;
    }

    return JSON.parse(datos);
  } catch (error) {
    console.error(
      `Error al obtener "${clave}" de sessionStorage:`,
      error
    );
    return valorPorDefecto;
  }
};

export const eliminarSesion = (clave) => {
  try {
    sessionStorage.removeItem(clave);
    return true;
  } catch (error) {
    console.error(
      `Error al eliminar "${clave}" de sessionStorage:`,
      error
    );
    return false;
  }
};