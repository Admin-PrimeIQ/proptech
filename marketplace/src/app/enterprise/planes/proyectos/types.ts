export type ProjectFolder = {
  id: string;
  name: string;
  stats: string;
  active?: boolean;
};

export type ProjectFileItem = {
  id: string;
  name: string;
  owner: string;
  ownerInitials: string;
  lastModified: string;
  type: "pdf" | "xlsx" | "zip" | "dwg" | "doc";
};

export type EnterpriseProjectsData = {
  title: string;
  description: string;
  folders: ProjectFolder[];
  files: ProjectFileItem[];
};
