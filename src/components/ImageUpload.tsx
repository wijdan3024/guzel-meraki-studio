"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
  multiple?: boolean;
}

// ---- Uploads directly from the browser to Cloudinary using an UNSIGNED
// upload preset. This is the simplest approach for a student project —
// no backend route or secret key is needed, since the preset itself
// restricts what can be uploaded (folder, size, format) from the
// Cloudinary dashboard settings.
export default function ImageUpload({ value, onChange, multiple = true }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setError("");
    setUploading(true);

    try {
      const uploadedUrls: string[] = [];

      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", uploadPreset as string);

        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
          { method: "POST", body: formData }
        );

        const data = await res.json();
        if (!res.ok) throw new Error(data.error?.message || "Upload failed");

        uploadedUrls.push(data.secure_url);
      }

      onChange(multiple ? [...value, ...uploadedUrls] : uploadedUrls);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const removeImage = (url: string) => {
    onChange(value.filter((v) => v !== url));
  };

  return (
    <div>
      <label className="text-sm text-[#2B2320]/70 mb-2 block">Images</label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-3 mb-3">
          {value.map((url) => (
            <div key={url} className="relative w-20 h-20 rounded-xl overflow-hidden group">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(url)}
                className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
              >
                <X size={16} className="text-white" />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-[#6B1F3D]/25 text-sm text-[#6B1F3D] hover:bg-[#6B1F3D]/5 transition-colors disabled:opacity-60"
      >
        {uploading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
        {uploading ? "Uploading..." : "Upload image"}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />

      {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
    </div>
  );
}
