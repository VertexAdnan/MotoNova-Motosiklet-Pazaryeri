import { useState } from "react";

type ImageGalleryProps = {
  images: string[];
  alt: string;
};

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = images[activeIndex] ?? images[0];

  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-soft">
        <img
          src={activeImage}
          alt={alt}
          loading="lazy"
          className="h-[300px] w-full object-cover sm:h-[420px]"
        />
      </div>

      <div className="grid grid-cols-4 gap-2 sm:grid-cols-5">
        {images.slice(0, 10).map((image, index) => (
          <button
            key={`${image}-${index}`}
            type="button"
            onClick={() => setActiveIndex(index)}
            className={`overflow-hidden rounded-xl border transition duration-300 ${
              index === activeIndex
                ? "border-orange-300 ring-2 ring-orange-200"
                : "border-slate-200 hover:border-orange-200"
            }`}
          >
            <img src={image} alt={`${alt} ${index + 1}`} loading="lazy" className="h-20 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
