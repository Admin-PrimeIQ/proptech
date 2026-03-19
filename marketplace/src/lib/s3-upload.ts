import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";

// Inicializar cliente S3
const s3Client = new S3Client({
  region: process.env.S3_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.S3_BUCKET_NAME || "";

/**
 * Sube un archivo a S3 y retorna la URL pública
 * @param file - Archivo a subir
 * @param folder - Carpeta en S3 (opcional, por defecto "uploads")
 * @returns URL pública del archivo subido
 */
export async function uploadFileToS3(
  file: File | Buffer,
  folder: string = "uploads"
): Promise<string> {
  try {
    // Generar nombre único para el archivo
    const fileExtension = file instanceof File 
      ? file.name.split(".").pop() 
      : "jpg";
    const fileName = `${folder}/${uuidv4()}.${fileExtension}`;

    // Convertir File a Buffer si es necesario
    let buffer: Buffer;
    if (file instanceof File) {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else {
      buffer = file;
    }

    // Subir a S3
    // Nota: No usamos ACL porque el bucket puede tener Block Public ACLs habilitado
    // La visibilidad pública se controla mediante la política del bucket
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: fileName,
      Body: buffer,
      ContentType: file instanceof File ? file.type : "image/jpeg",
    });

    await s3Client.send(command);

    // Retornar URL pública
    const publicUrl = `https://${BUCKET_NAME}.s3.${process.env.S3_REGION || "us-east-1"}.amazonaws.com/${fileName}`;
    
    return publicUrl;
  } catch (error) {
    console.error("Error uploading file to S3:", error);
    throw new Error("Error al subir el archivo a S3");
  }
}

/**
 * Extrae el key de S3 desde una URL pública
 * @param url - URL pública de S3
 * @returns Key del archivo en S3 (ej: "uploads/uuid.jpg") o null si no se puede extraer
 */
export function extractS3KeyFromUrl(url: string): string | null {
  try {
    // Formato: https://bucket-name.s3.region.amazonaws.com/folder/file.ext
    const urlPattern = new RegExp(
      `https://${BUCKET_NAME}\\.s3\\.${process.env.S3_REGION || "us-east-1"}\\.amazonaws\\.com/(.+)`
    );
    const match = url.match(urlPattern);
    return match ? match[1] : null;
  } catch (error) {
    console.error("Error extracting S3 key from URL:", error);
    return null;
  }
}

/**
 * Elimina un archivo de S3
 * @param url - URL pública del archivo a eliminar
 * @returns true si se eliminó correctamente, false en caso contrario
 */
export async function deleteFileFromS3(url: string): Promise<boolean> {
  try {
    const key = extractS3KeyFromUrl(url);
    if (!key) {
      console.warn("No se pudo extraer el key de S3 de la URL:", url);
      return false;
    }

    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    console.log("Archivo eliminado de S3:", key);
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    // No lanzamos error para no interrumpir el flujo si falla la eliminación
    return false;
  }
}
