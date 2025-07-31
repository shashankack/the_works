import { Hono } from "hono";
import { authMiddleware } from "../../middleware/auth";
import { generateCloudinarySignature } from "@/lib/cloudinarySignature";

export const uploadRoutes = new Hono<{ Bindings: Env }>();

uploadRoutes.use("*", authMiddleware("admin"));

uploadRoutes.get("/all", async (c) => {
  const folder = "images"; // or "galleries", or leave blank
  // const expression = `folder:${folder}`;
  const expression = `resource_type:image`;

  const timestamp = Math.floor(Date.now() / 1000);
  const searchParams = new URLSearchParams();
  searchParams.append("expression", expression);
  // searchParams.append("sort_by", "created_at");
  searchParams.append("max_results", "50");

  // Create Basic Auth header
  const authHeader = `Basic ${btoa(
    `${c.env.CLOUDINARY_API_KEY}:${c.env.CLOUDINARY_API_SECRET}`
  )}`;

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_CLOUD_NAME}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: searchParams.toString(),
      }
    );

    const result = await res.json();
    if (!res.ok || result.error) {
      throw new Error(result.error?.message || "Search failed");
    }

    return c.json({ resources: result.resources });
  } catch (err) {
    console.error("❌ Cloudinary fetch failed:", err);
    return c.json({ error: "Could not fetch image list", details: err }, 500);
  }
});

// POST /api/uploads — Unsigned Cloudinary upload
uploadRoutes.post("/thumbnail", async (c) => {
  const formData = await c.req.formData();
  const file = formData.get("file") as File;

  if (!(file instanceof File)) {
    return c.json({ error: "No valid file uploaded" }, 400);
  }

  const uploadPreset = "Image Handler"; // 👈 make sure this matches your Cloudinary preset name
  const folder = "images"; // 👈 optional: can be "classes", "events", etc.

  const uploadForm = new FormData();
  uploadForm.append("file", file);
  uploadForm.append("upload_preset", uploadPreset);
  uploadForm.append("folder", folder);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: uploadForm,
      }
    );

    const result = await res.json();
    console.log("🛰 Cloudinary response:", result);

    if (!result.secure_url) {
      throw new Error(result.error?.message || "Upload failed");
    }

    return c.json({ url: result.secure_url });
  } catch (err) {
    console.error("🔥 Upload failed:", err);
    return c.json({ error: "Upload failed", details: err }, 500);
  }
});

uploadRoutes.post("/gallery", async (c) => {
  const formData = await c.req.formData();
  const allItems = formData.getAll("files");

  const validFiles = allItems.filter(
    (item): item is File => item instanceof File
  );

  if (!validFiles.length) {
    return c.json({ error: "No valid images uploaded" }, 400);
  }

  const uploadPreset = "Image Handler"; // 👈 make sure this matches your Cloudinary preset name
  const folder = "galleries";

  try {
    const uploads = await Promise.all(
      validFiles.map(async (file) => {
        const form = new FormData();
        form.append("file", file);
        form.append("upload_preset", uploadPreset);
        form.append("folder", folder);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_CLOUD_NAME}/image/upload`,
          { method: "POST", body: form }
        );

        const result = await res.json();
        return result.secure_url || null;
      })
    );

    const urls = uploads.filter((url): url is string => !!url);
    return c.json({ urls });
  } catch (err) {
    console.error("🔥 Upload failed:", err);
    return c.json({ error: "Upload failed", details: err }, 500);
  }
});

uploadRoutes.delete("/:identifier", async (c) => {
  const raw = decodeURIComponent(c.req.param("identifier"));
  const timestamp = Math.floor(Date.now() / 1000);

  // If it's a full URL → extract public_id
  const publicId = raw.startsWith("http")
    ? raw
        .split("/upload/")[1] // e.g., "v123/images/abc.jpg"
        ?.split(".")[0] // remove .jpg
        ?.replace(/^v\d+\//, "") // remove version
    : raw;

  if (!publicId) return c.json({ error: "Invalid identifier" }, 400);

  const form = new FormData();
  form.append("api_key", c.env.CLOUDINARY_API_KEY);
  form.append("timestamp", String(timestamp));

  const sigParams = {
    public_id: publicId,
    timestamp,
  };
  const signature = await generateCloudinarySignature(
    sigParams,
    c.env.CLOUDINARY_API_SECRET
  );

  form.append("signature", signature);
  form.append("public_id", publicId);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${c.env.CLOUDINARY_CLOUD_NAME}/image/destroy`,
      { method: "POST", body: form }
    );

    const result = await res.json();
    console.log("🗑 Cloudinary delete:", result);

    return c.json({
      success: result.result === "ok",
      publicId,
      message: result.result === "ok" ? "Deleted" : result.result,
    });
  } catch (err) {
    return c.json({ error: "Delete failed", details: err }, 500);
  }
});

export default uploadRoutes;
