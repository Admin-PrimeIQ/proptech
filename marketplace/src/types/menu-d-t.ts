export interface IMenuDT {
  id: number;
  title: string;
  link: string;
  home_menus?: {
    title: string;
    link: string;
    img: string;
  }[];
  pages_mega_menu?: {
    first: {
      title: string;
      submenus: {
        title: string;
        link: string;
      }[];
    };
    second: {
      title: string;
      submenus: {
        title: string;
        link: string;
      }[];
    };
  };
  portfolio_mega_menus?: {
    first: {
      title: string;
      submenus: {
        id: number;
        menu_lists: {
          title: string;
          link: string;
        }[];
      }[];
    };
    second: {
      submenus: {
        id: number;
        title: string;
        menu_lists: {
          title: string;
          link: string;
        }[];
      }[];
    };
  };
  dropdown_menus?: {
    title: string;
    link: string;
  }[]

}