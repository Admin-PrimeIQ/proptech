const menu_data_one = [
  {
    id: 1,
    label: "Home",
    url: "/",
  },
  {
    id: 2,
    label: "Compra",
    url: "/propiedades",
    submenu: [
      { id: 1, label: "Comprar propiedad", url: "/propiedades" },
      { id: 2, label: "Destacada", url: "/propiedad-destacada" },
      { id: 3, label: "Favoritos", url: "/favoritos" },
    ],
  },
  {
    id: 3,
    label: "Venta",
    url: "/administrador/propiedades",
    submenu: [
      {
        id: 1,
        label: "Vender propiedad",
        url: "/administrador/agregar-nueva-propiedad",
      },
      {
        id: 2,
        label: "Mis propiedades",
        url: "/administrador/propiedades",
      },
      {
        id: 3,
        label: "Solicitudes",
        url: "/dashboard/review",
      },
    ],
  },
  {
    id: 5,
    label: "Enterprise",
    url: "/enterprise",
    submenu: [
      { id: 1, label: "Mapa de absorcion", url: "/enterprise/mapa-absorcion" },
      { id: 2, label: "Mapa interactivo", url: "/enterprise/mapa-dinamico" },
    ],
  },
];

export default menu_data_one;
