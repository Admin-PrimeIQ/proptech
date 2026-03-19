import { EnterpriseProjectsData } from "../types";

const PROJECTS_MOCK: EnterpriseProjectsData = {
  title: "Residential Project A",
  description: "Manage your project files and shared documentation",
  folders: [
    { id: "f-1", name: "Residencial Las Palmas", stats: "24 files · 1.2 GB", active: false },
    { id: "f-2", name: "Ocean View Estates", stats: "15 files · 450 MB", active: true },
    { id: "f-3", name: "Downtown Complex", stats: "8 files · 89 MB", active: false },
  ],
  files: [
    {
      id: "file-1",
      name: "Market Analysis 2024.pdf",
      owner: "Me",
      ownerInitials: "ME",
      lastModified: "Oct 12, 2023, 10:45 AM",
      type: "pdf",
    },
    {
      id: "file-2",
      name: "Financial Reports Q3.xlsx",
      owner: "Sarah Chen",
      ownerInitials: "SC",
      lastModified: "Oct 10, 2023, 02:15 PM",
      type: "xlsx",
    },
    {
      id: "file-3",
      name: "Site Progress Photos.zip",
      owner: "Me",
      ownerInitials: "ME",
      lastModified: "Oct 08, 2023, 09:30 AM",
      type: "zip",
    },
    {
      id: "file-4",
      name: "Residential Site Plans - Final.dwg",
      owner: "John Doe",
      ownerInitials: "JD",
      lastModified: "Sep 25, 2023, 11:00 AM",
      type: "dwg",
    },
    {
      id: "file-5",
      name: "Legal Compliance Docs.pdf",
      owner: "Legal Dept",
      ownerInitials: "LD",
      lastModified: "Sep 20, 2023, 04:45 PM",
      type: "doc",
    },
  ],
};

export async function getEnterpriseProjectsData(): Promise<EnterpriseProjectsData> {
  // TODO: Reemplazar por consumo real de API cuando backend esté disponible.
  // Ejemplo:
  // const response = await fetch("/api/enterprise/proyectos");
  // if (!response.ok) throw new Error("No se pudo cargar los proyectos");
  // return response.json();
  return Promise.resolve(PROJECTS_MOCK);
}
