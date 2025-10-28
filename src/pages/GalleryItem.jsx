import React from "react";

function GalleryItem({ image }) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div className="card h-100 shadow-sm"
        style={{
          height: "250px",
          overflow: "hidden",
        }}>
        <img
          src={image.src}
          className="card-img-top"
          alt={image.title}
          style={{
            objectFit: "cover",
            height: "70%",
          }}
        />
        <div className="card-body text-center p-2">
          <h5 className="card-title fs-6 m-0">{image.title}</h5>
        </div>
      </div>
    </div>
  );
}

export default GalleryItem;
