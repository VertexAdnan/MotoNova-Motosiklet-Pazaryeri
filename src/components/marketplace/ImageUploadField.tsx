import { type ChangeEvent } from "react";

type ImageUploadFieldProps = {
  files: File[];
  onChange: (files: File[]) => void;
};

export default function ImageUploadField({ files, onChange }: ImageUploadFieldProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const incomingFiles = Array.from(event.target.files || []);
    const nextFiles = [...files, ...incomingFiles].slice(0, 12);
    onChange(nextFiles);
    event.target.value = "";
  };

  const removeFile = (index: number) => {
    onChange(files.filter((_, fileIndex) => fileIndex !== index));
  };

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 sm:p-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-slate-900">Fotoğraf Yükleme</p>
          <p className="mt-1 text-sm text-slate-600">
            En az 6 net fotoğraf önerilir. Kapak fotoğrafı ilk görsel olarak gösterilir.
          </p>
        </div>

        <label className="inline-flex cursor-pointer items-center justify-center rounded-pill bg-brand-secondary px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800">
          Dosya Seç
          <input type="file" accept="image/*" multiple className="hidden" onChange={handleFileChange} />
        </label>
      </div>

      {files.length > 0 ? (
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {files.map((file, index) => (
            <div key={`${file.name}-${index}`} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm">
              <div className="min-w-0">
                <p className="truncate font-semibold text-slate-800">{file.name}</p>
                <p className="text-xs text-slate-500">{Math.round(file.size / 1024)} KB</p>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="rounded-full px-2 py-1 text-xs font-semibold text-red-600 transition hover:bg-red-50"
              >
                Kaldır
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="skeleton-shimmer h-24 rounded-xl" />
          ))}
        </div>
      )}
    </div>
  );
}
