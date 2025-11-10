// src/components/AccessibilityButton.jsx
import React, { useState } from "react";
import { FaUniversalAccess, FaTimes } from "react-icons/fa";

const AccessibilityButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [noAnimation, setNoAnimation] = useState(false);
  const [highlightLinks, setHighlightLinks] = useState(false);

  const applySettings = () => {
    document.documentElement.style.fontSize = `${fontSize}%`;

    if (highContrast) {
      document.body.classList.add("high-contrast");
    } else {
      document.body.classList.remove("high-contrast");
    }

    if (noAnimation) {
      document.body.classList.add("no-animation");
    } else {
      document.body.classList.remove("no-animation");
    }

    if (highlightLinks) {
      document.body.classList.add("highlight-links");
    } else {
      document.body.classList.remove("highlight-links");
    }
  };

  const reset = () => {
    setFontSize(100);
    setHighContrast(false);
    setNoAnimation(false);
    setHighlightLinks(false);
    document.documentElement.style.fontSize = "";
    document.body.classList.remove("high-contrast", "no-animation", "highlight-links");
  };

  return (
    <>
      {/* כפתור ראשי */}
      <button
        className="btn btn-primary rounded-circle shadow-lg d-flex align-items-center justify-content-center"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "60px",
          height: "60px",
          zIndex: 9999,
          fontSize: "1.5rem"
        }}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="פתח תפריט נגישות"
      >
        {isOpen ? <FaTimes /> : <FaUniversalAccess />}
      </button>

      {/* תפריט */}
      {isOpen && (
        <div
          className="bg-white rounded shadow-lg p-3"
          style={{
            position: "fixed",
            bottom: "90px",
            right: "20px",
            width: "280px",
            zIndex: 9999,
            border: "1px solid #ddd"
          }}
        >
          <h6 className="text-center mb-3 fw-bold">הגדרות נגישות</h6>

          {/* גודל טקסט */}
          <div className="mb-3">
            <label className="form-label small fw-bold">גודל טקסט</label>
            <div className="d-flex align-items-center gap-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setFontSize(Math.max(80, fontSize - 10))}
              >
                A-
              </button>
              <span className="flex-grow-1 text-center">{fontSize}%</span>
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => setFontSize(Math.min(150, fontSize + 10))}
              >
                A+
              </button>
            </div>
          </div>

          {/* ניגודיות */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="contrast"
              checked={highContrast}
              onChange={(e) => setHighContrast(e.target.checked)}
            />
            <label className="form-check-label small" htmlFor="contrast">
              ניגודיות גבוהה
            </label>
          </div>

          {/* ללא תנועה */}
          <div className="form-check mb-2">
            <input
              className="form-check-input"
              type="checkbox"
              id="noanim"
              checked={noAnimation}
              onChange={(e) => setNoAnimation(e.target.checked)}
            />
            <label className="form-check-label small" htmlFor="noanim">
              עצור אנימציות
            </label>
          </div>

          {/* הדגשת קישורים */}
          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="links"
              checked={highlightLinks}
              onChange={(e) => setHighlightLinks(e.target.checked)}
            />
            <label className="form-check-label small" htmlFor="links">
              הדגש קישורים
            </label>
          </div>

          <div className="d-flex gap-2">
            <button className="btn btn-success btn-sm w-50" onClick={applySettings}>
              החל
            </button>
            <button className="btn btn-secondary btn-sm w-50" onClick={reset}>
              איפוס
            </button>
          </div>
        </div>
      )}

      {/* CSS מוטמע */}
      <style jsx>{`
        .high-contrast {
          background-color: #000 !important;
          color: #fff !important;
        }
        .high-contrast * {
          color: #fff !important;
          background-color: #000 !important;
          border-color: #fff !important;
        }
        .no-animation * {
          animation: none !important;
          transition: none !important;
        }
        .highlight-links a {
          outline: 3px solid yellow !important;
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};

export default AccessibilityButton;