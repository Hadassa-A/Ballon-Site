import React from "react";
import { handleRipple } from "../components/Ripple";

function GalleryItem({ image, openModal }) {
  return (
    <div className="col-12 col-md-6 col-lg-4">
      <div
        className="card h-100 shadow-sm d-flex flex-column"
        style={{
          cursor: "pointer",
          overflow: "hidden",
          transition: "transform 0.3s"
        }}
        onMouseDown={handleRipple}
        onClick={() => openModal(image)}
      >
        {/* תמונה ראשית */}
        <img
          src={image.src}
          className="card-img-top"
          alt={image.title}
          style={{
            objectFit: "cover",
            height: "250px",
            width: "100%",
            transition: "transform 0.3s"
          }}
        />

        {/* כותרת התמונה */}
        <h5 className="text-center my-2">{image.title}</h5>

        {/* פרטי הדגם בשורה אחת */}
        <div
          className="d-flex justify-content-between px-3 mb-3"
          style={{ fontSize: "0.9rem" }}
        >
          <span>#{image.modelNumber}</span>
          <span>{image.category}</span>
          <span>{image.price} ₪</span>
          <span>צפיות: {image.views}</span>
        </div>

        {/* כפתור הזמנה בתחתית */}
        <div className="mt-auto px-3 pb-3">
          <button
            className="btn btn-primary w-100"
            onClick={(e) => {
              e.stopPropagation(); // מונע פתיחת המודאל
              window.location.href = `/contact?model=${image.modelNumber}&title=${image.title}&category=${image.category}&thumb=${image.thumbnail}`;
            }}
          >
            כזה אני רוצה!!!

          </button>
        </div>
      </div>
    </div>
  );
}

export default GalleryItem;
