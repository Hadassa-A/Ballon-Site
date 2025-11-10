import React, { useRef, useState, useEffect } from "react";
import { RiContactsLine } from "react-icons/ri";
import emailjs from "@emailjs/browser";
import { PiSmileyWinkThin, PiSmileyMehThin } from "react-icons/pi";
import { useNavigate, useLocation } from "react-router-dom";

const API_URL = "http://localhost:5000/api";

function Contact() {
  const navigate = useNavigate();
  const location = useLocation();
  const form = useRef();

  // דגמים מהשרת
  const [models, setModels] = useState([]);
  const [selectedModel, setSelectedModel] = useState("");
  const [selectedImage, setSelectedImage] = useState("");
  const [loadingModels, setLoadingModels] = useState(true);

  // ולידציות
  const [nameTouched, setNameTouched] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [modelTouched, setModelTouched] = useState(false);
  const [messageTouched, setMessageTouched] = useState(false);

  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [modelError, setModelError] = useState("");
  const [messageError, setMessageError] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState("success");

  // טעינת דגמים + פרמטרים מהגלריה
  useEffect(() => {
    const loadModels = async () => {
      try {
        setLoadingModels(true);
        const res = await fetch(`${API_URL}/products`);
        if (res.ok) {
          const data = await res.json();
          const sorted = data.sort((a, b) => a.ModelNumber.localeCompare(b.ModelNumber));
          setModels(sorted);
        }
      } catch (err) {
        console.error("שגיאה בטעינת דגמים:", err);
      } finally {
        setLoadingModels(false);
      }
    };

    loadModels();

    // אם הגיעו מהגלריה
    const params = new URLSearchParams(location.search);
    const modelParam = params.get("model");
    const thumbParam = params.get("thumb");
    if (modelParam && thumbParam) {
      setSelectedModel(modelParam);
      setSelectedImage(`http://localhost:5000/uploads/${thumbParam}`);
    }
  }, [location.search]);

  // ולידציות
  const validateName = (value) => {
    value = value.trim();
    if (!value) return setNameError("");
    if (value.length < 2 || !/^[A-Za-zא-ת\s]+$/.test(value)) {
      setNameError("התוכן לא תקין");
    } else {
      setNameError("");
    }
  };

  const validateEmail = (value) => {
    value = value.trim();
    if (!value) return setEmailError("");
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setEmailError("כתובת דוא״ל לא תקינה");
    } else {
      setEmailError("");
    }
  };

  const validatePhone = (value) => {
    value = value.trim();
    if (!value) return setPhoneError("");

    const digits = value.replace(/[^\d]/g, "");
    if (!/^[\d+\-]+$/.test(value)) return setPhoneError("המספר יכול להכיל רק ספרות, + או -");
    else if (digits.length < 9) return setPhoneError("מספר הטלפון חייב להכיל לפחות 9 ספרות");
    else if (!/^\+?\d{1,3}-?\d{6,}$/.test(value)) return setPhoneError("מספר טלפון לא תקין");
    else
      setPhoneError("");
  };


  const validateMessage = (value) => {
    value = value.trim();
    if (!value) return setMessageError("");
    if (value.length < 5) {
      setMessageError("הודעה קצרה מדי");
    } else {
      setMessageError("");
    }
  };

  // שליחת טופס
  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const name = formData.get("user_name")?.trim() || "";
    const email = formData.get("user_email")?.trim() || "";
    const phone = formData.get("user_phone")?.trim() || "";
    const message = formData.get("message_text")?.trim() || "";

    let formValid = true;

    // כניסה למנהל
    if (name === "ליפי" && email === "123@gmail.com") {
      navigate("/admin");
      return;
    }

    // --- ולידציה מלאה לכל שדה ---

  // שם
  if (!name) {
    setNameError("שדה חובה");
    setNameTouched(true);
    formValid = false;
  } else {
    validateName(name); // ← מפעיל את הולידציה
    if (nameError) formValid = false;
  }

  // אימייל
  if (!email) {
    setEmailError("שדה חובה");
    setEmailTouched(true);
    formValid = false;
  } else {
    validateEmail(email);
    if (emailError) formValid = false;
  }

  // טלפון
  if (!phone) {
    setPhoneError("שדה חובה");
    setPhoneTouched(true);
    formValid = false;
  } else {
    validatePhone(phone);
    if (phoneError) formValid = false;
  }

  // הודעה
  if (!message) {
    setMessageError("שדה חובה");
    setMessageTouched(true);
    formValid = false;
  } else {
    validateMessage(message);
    if (messageError) formValid = false;
  }

  // דגם
  // if (!selectedModel) {
  //   setModelError("שדה חובה");
  //   setModelTouched(true);
  //   formValid = false;
  // } else {
  //   setModelError("");
  // }

  // --- אם לא תקין – עצור כאן ---
  if (!formValid) {
    return;
  }

    emailjs
      .sendForm("service_cco668q", "template_7kos0nf", form.current, "rQbcDWkuY8VzCVH_y")
      .then(() => {
        setModalMessage(
          <>
            <PiSmileyWinkThin className="fs-3 fs-md-4 fs-lg-5" />
            <br />
            ההודעה נשלחה בהצלחה!
          </>
        );
        setModalType("success");
        setModalShow(true);
        e.target.reset();
        setSelectedModel("");
        setSelectedImage("");
      })
      .catch(() => {
        setModalMessage(
          <>
            <PiSmileyMehThin className="fs-3 fs-md-4 fs-lg-5" />
            <br />
            אירעה שגיאה בשליחת ההודעה.
          </>
        );
        setModalType("error");
        setModalShow(true);
      });
  };

  return (
    <>
      <main className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">צרו קשר</h1>
          <h2 className="h4 mb-3">נשמח לשמוע מכם! מלאו את הטופס ונחזור אליכם בהקדם.</h2>
          <RiContactsLine className="fs-3 fs-md-4 fs-lg-5" />
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <form ref={form} onSubmit={sendEmail}>
              {/* שם */}
              <div className="mb-3">
                <label htmlFor="name" className="form-label">שם</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="user_name"
                  placeholder="הכניסו את שמכם"
                  onBlur={(e) => { setNameTouched(true); validateName(e.target.value); }}
                  onChange={(e) => { if (nameError) validateName(e.target.value); }}
                />
                {nameTouched && nameError && <div className="text-danger small">{nameError}</div>}
              </div>

              {/* דוא״ל */}
              <div className="mb-3">
                <label htmlFor="email" className="form-label">דוא״ל</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="user_email"
                  placeholder="example@gmail.com"
                  onBlur={(e) => { setEmailTouched(true); validateEmail(e.target.value); }}
                  onChange={(e) => { if (emailError) validateEmail(e.target.value); }}
                />
                {emailTouched && emailError && <div className="text-danger small">{emailError}</div>}
              </div>

              {/* טלפון */}
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">טלפון</label>
                <input
                  type="tel"
                  className="form-control text-end"
                  id="phone"
                  name="user_phone"
                  placeholder="054-1234567"
                  onBlur={(e) => { setPhoneTouched(true); validatePhone(e.target.value); }}
                  onChange={(e) => { if (phoneError) validatePhone(e.target.value); }}
                />
                {phoneTouched && phoneError && <div className="text-danger small">{phoneError}</div>}
              </div>

              {/* דגם */}
              <div className="mb-3">
                <label htmlFor="model" className="form-label">דגם</label>
                <select
                  className="form-select"
                  id="model"
                  name="model"
                  value={selectedModel}
                  onChange={(e) => {
                    const model = e.target.value;
                    setSelectedModel(model);
                    const product = models.find(p => p.ModelNumber === model);
                    setSelectedImage(product ? `http://localhost:5000/uploads/${product.Image}` : "");
                    if (modelError) setModelError(model ? "" : "שדה חובה");
                  }}
                  onBlur={() => setModelTouched(true)}
                >
                  <option value="" disabled>
                    {loadingModels ? "טוען דגמים..." : "בחרו דגם"}
                  </option>
                  {models.map((p) => (
                    <option key={p.ProductID} value={p.ModelNumber}>
                      {p.ModelNumber}  - {p.Title}
                    </option>
                  ))}
                  
                </select>
                {modelTouched && modelError && <div className="text-danger small">{modelError}</div>}

                {/* תמונה של הדגם */}
                {selectedImage && (
                  <div className="mt-3 text-center">
                    <img
                      src={selectedImage}
                      alt={selectedModel}
                      className="img-fluid rounded shadow-sm"
                      style={{ maxHeight: "100px", objectFit: "cover" }}
                    />
                    {/* <p className="mt-2 text-muted"><strong>{selectedModel}</strong></p> */}
                  </div>
                )}
              </div>

              {/* הודעה */}
              <div className="mb-3">
                <label htmlFor="message" className="form-label">הודעה</label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message_text"
                  rows="5"
                  placeholder="כתבו כאן את ההודעה שלכם..."
                  onBlur={(e) => { setMessageTouched(true); validateMessage(e.target.value); }}
                  onChange={(e) => { if (messageError) validateMessage(e.target.value); }}
                />
                {messageTouched && messageError && <div className="text-danger small">{messageError}</div>}
              </div>

              <button type="submit" className="btn btn-primary w-100">שליחה</button>
            </form>
          </div>
        </div>
      </main>

      {/* מודאל */}
      {modalShow && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className={`modal-content ${modalType === "success" ? "border-success" : "border-danger"}`}>
              <div
                className="modal-header text-white"
                style={{
                  backgroundColor: modalType === "success" ? "var(--color-subtitle-gold)" : "var(--color-text-gray)"
                }}
              >
                <button type="button" className="btn-close btn-close-white" onClick={() => setModalShow(false)}></button>
              </div>
              <div className="modal-body text-center fs-5">{modalMessage}</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setModalShow(false)}>
                  סגור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </>
  );
}

export default Contact;