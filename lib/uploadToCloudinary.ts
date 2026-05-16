/**
 * Uploads a file directly from the browser to Cloudinary (bypasses Vercel).
 * No file size limit from Vercel's perspective — Cloudinary's own limit applies (≥ 100 MB on free plan).
 */
export async function uploadToCloudinary(
  file: File,
  folder: string,
): Promise<{ url: string; publicId: string }> {
  // 1. Get a signed upload token from our backend
  const sigRes = await fetch(
    `/api/cloudinary/sign?folder=${encodeURIComponent(folder)}`,
  );
  if (!sigRes.ok) {
    const err = await sigRes.json().catch(() => ({}));
    throw new Error(err.error || "Failed to get upload signature");
  }
  const {
    signature,
    timestamp,
    cloudName,
    apiKey,
    folder: signedFolder,
  } = await sigRes.json();

  // 2. POST the file directly to Cloudinary
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", apiKey);
  fd.append("timestamp", String(timestamp));
  fd.append("signature", signature);
  fd.append("folder", signedFolder);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: fd },
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => ({}));
    throw new Error(err.error?.message || "Cloudinary upload failed");
  }

  const data = await uploadRes.json();
  return { url: data.secure_url, publicId: data.public_id };
}
