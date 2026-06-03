"use client";

import type { ImageRecord } from "@/lib/types";

type Props = {
  images: ImageRecord[];
  onSelect: (image: ImageRecord) => void;
};

export function ImageGrid({ images, onSelect }: Props) {
  if (images.length === 0) {
    return (
      <div className="panel empty-state">
        No images match your filters yet. Upload a photo to get started.
      </div>
    );
  }

  return (
    <div className="image-grid">
      {images.map((image) => (
        <article
          key={image.id}
          className="image-card"
          onClick={() => onSelect(image)}
          onKeyDown={(event) => {
            if (event.key === "Enter") onSelect(image);
          }}
          role="button"
          tabIndex={0}
        >
          <img src={`/uploads/${image.filename}`} alt={image.ai.description} />
          <div className="image-card-body">
            <h3>{image.ai.garmentType}</h3>
            <p>{image.ai.description.slice(0, 90)}...</p>
            <div className="meta-row">
              <span className="chip ai">{image.ai.style}</span>
              {image.annotations.tags.slice(0, 2).map((tag) => (
                <span className="chip designer" key={tag}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
