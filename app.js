document.addEventListener("DOMContentLoaded", () => {
  // Datos de menús
  const menus = [
    {
      id: 1,
      nombre: "Pizza Margherita",
      precio: 10.99,
      descripcion: "Pizza clásica con tomate, mozzarella y albahaca.",
    },
    {
      id: 2,
      nombre: "Hamburguesa Clásica",
      precio: 8.5,
      descripcion: "Carne, lechuga, tomate y salsa especial.",
    },
    {
      id: 3,
      nombre: "Ensalada César",
      precio: 6.75,
      descripcion: "Lechuga, crutones, pollo y aderezo César.",
    },
    {
      id: 4,
      nombre: "Pasta Carbonara",
      precio: 9.25,
      descripcion: "Espagueti con salsa de huevo, queso y panceta.",
    },
    {
      id: 5,
      nombre: "Tacos al Pastor",
      precio: 7.99,
      descripcion: "Tacos de cerdo con piña y cilantro.",
    },
  ];

  const STORAGE_KEY = "historialPedidos";

  // Cargar historial desde localStorage
  async function loadHistorial() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  }

  // Guardar historial en localStorage
  async function saveHistorial(pedidos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pedidos));
  }

  // Renderizar menús
  const menuContainer = document.getElementById("menu");
  const menuSelect = document.getElementById("menu-select");
  console.log("Generando menús...");
  menus.forEach((menu) => {
    // Card para el menú
    const card = document.createElement("div");
    card.className = "bg-white p-4 rounded-lg shadow-lg"; // Se quitó la clase menu-card que era para fallback
    card.innerHTML = `
          <h3 class="text-xl font-semibold">${menu.nombre}</h3>
          <p class="text-gray-600">${menu.descripcion}</p>
          <p class="text-blue-600 font-bold">$${menu.precio.toFixed(2)}</p>
        `;
    menuContainer.appendChild(card);

    // Opción para el select
    const option = document.createElement("option");
    option.value = menu.id;
    option.textContent = `${menu.nombre} - $${menu.precio.toFixed(2)}`;
    menuSelect.appendChild(option);
  });
  console.log(
    "Menús generados:",
    menuContainer.children.length,
    "opciones en select:",
    menuSelect.children.length
  );

  // Cargar y renderizar historial
  let historial = [];
  loadHistorial().then((data) => {
    historial = data;
    renderHistorial();
  });

  const listaPedidos = document.getElementById("lista-pedidos");
  function renderHistorial() {
    listaPedidos.innerHTML = "";
    historial.forEach((pedido) => {
      const li = document.createElement("li");
      li.textContent = `${pedido.nombre} pidió ${pedido.cantidad} x ${pedido.menu} (Total: $${pedido.total}) - ${pedido.fecha}`;
      listaPedidos.appendChild(li);
    });
  }

  // Formulario de pedido
  const pedidoForm = document.getElementById("pedido-form");
  const mensaje = document.getElementById("mensaje");
  pedidoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const menuId = parseInt(menuSelect.value);
    const cantidad = parseInt(document.getElementById("cantidad").value);
    const nombre = document.getElementById("nombre").value;

    if (!nombre) return alert("Ingresa tu nombre.");
    if (!menuId) return alert("Selecciona un menú.");

    const menu = menus.find((m) => m.id === menuId);
    const pedido = {
      id: Date.now(),
      nombre,
      menu: menu.nombre,
      cantidad,
      total: (menu.precio * cantidad).toFixed(2),
      fecha: new Date().toLocaleString(),
    };

    try {
      await fakeApiRequest(pedido);
      mensaje.classList.remove("hidden");
      setTimeout(() => mensaje.classList.add("hidden"), 3000);

      historial.push(pedido);
      await saveHistorial(historial);
      renderHistorial();

      pedidoForm.reset();
    } catch (error) {
      alert("Error al enviar: " + error.message);
    }
  });

  // Simulación API servidor
  async function fakeApiRequest(pedido) {
    return new Promise((resolve) => setTimeout(() => resolve(pedido), 500));
  }

  // Sincronización con Google Drive (simulada)
  const syncButton = document.getElementById("sync-google");
  const statusSync = document.getElementById("status-sync");
  syncButton.addEventListener("click", async () => {
    if (historial.length === 0)
      return alert("No hay pedidos para sincronizar.");

    if (!navigator.onLine)
      return alert("Sin conexión a internet. No se puede sincronizar.");

    statusSync.textContent = "Sincronizando...";
    try {
      // Simulación de subida
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log("Subiendo a Google Drive:", JSON.stringify(historial));
      statusSync.textContent = "¡Sincronizado con Google Drive!";
      setTimeout(() => (statusSync.textContent = ""), 3000);
    } catch (error) {
      statusSync.textContent = "Error al sincronizar: " + error.message;
    }
  });
});
