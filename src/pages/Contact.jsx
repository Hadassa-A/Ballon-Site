import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { RiContactsLine } from "react-icons/ri";
import emailjs from "@emailjs/browser";
import { useRef } from "react";
import { useState } from "react";
import { PiSmileyWinkThin } from "react-icons/pi";
import { PiSmileyMehThin } from "react-icons/pi";


function Contact() {

  const models = ["דגם א", "דגם ב", "דגם ג", "דגם ד", "דגם ה"];

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
  const [modalType, setModalType] = useState("success"); // success | error


  const validateName = (value) => {
    value = value.trim();
    if (!value) {
      setNameError(""); // אם השדה ריק – לא מציבים שגיאה
      return;
    }
    if (value.length < 2 || !/^[A-Za-zא-ת\s]+$/.test(value)) {
      setNameError("התוכן לא תקין");
    } else {
      setNameError("");
    }
  };


  const validateEmail = (value) => {
    value = value.trim();
    if (!value) {
      setEmailError("");
      return;
    }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(value)) {
      setEmailError("כתובת דוא''ל לא תקינה");
    } else {
      setEmailError("");
    }
  };

  const validatePhone = (value) => {
    value = value.trim();
    if (!value) {
      setPhoneError("");
      return;
    }
    const phoneRegex = /^0\d{1,2}-?\d{6,7}$/;
    if (!phoneRegex.test(value)) {
      setPhoneError("מספר טלפון לא תקין");
    } else {
      setPhoneError("");
    }
  };
  const validateMessage = (value) => {
    value = value.trim();
    if (!value) {
      setMessageError("");
      return;
    } else if (value.length < 5) {
      setMessageError("הודעה קצרה מדי");
    } else {
      setMessageError("");
    }
  };



  const form = useRef();
  const sendEmail = (e) => {
    e.preventDefault();

    const formData = new FormData(form.current);
    const name = formData.get("user_name")?.trim() || "";
    const email = formData.get("user_email")?.trim() || "";
    const phone = formData.get("user_phone")?.trim() || "";
    const message = formData.get("message_text")?.trim() || "";
    const model = formData.get("model")?.trim() || "";

    let formValid = true; // נניח שהטופס תקין, נבדוק בהמשך

    // 🔹 שם
    if (!name) {
      setNameError("שדה חובה");
      setNameTouched(true);
      formValid = false;
    } else {
      setNameError("");
    }

    // 🔹 מייל
    if (!email) {
      setEmailError("שדה חובה");
      setEmailTouched(true);
      formValid = false;
    } else {
      setEmailError("");
    }

    // 🔹 טלפון
    if (!phone) {
      setPhoneError("שדה חובה");
      setPhoneTouched(true);
      formValid = false;
    } else {
      setPhoneError("");
    }

    // 🔹 הודעה
    if (!message) {
      setMessageError("שדה חובה");
      setMessageTouched(true);
      formValid = false;
    } else {
      setMessageError("");
    }

    // 🔹 דגם
    if (!model) {
      setModelError("שדה חובה");
      setModelTouched(true);
      formValid = false;
    } else {
      setModelError("");
    }

    // אם לפחות אחד מהשדות לא תקין — מפסיקים פה
    if (!formValid) return;

    // 🔹 אם הכול תקין – שולחים
    emailjs
      .sendForm(
        // "service_cco668q",
        "template_7kos0nf",
        form.current,
        "rQbcDWkuY8VzCVH_y"
      )
      .then(
        () => {
          setModalMessage(<>
            <PiSmileyWinkThin className="fs-3 fs-md-4 fs-lg-5" />
            <br />
            ההודעה נשלחה בהצלחה!
          </>);
          setModalType("success");
          setModalShow(true);
          e.target.reset();
        },
        () => {
          setModalMessage(<>
            <PiSmileyMehThin className="fs-3 fs-md-4 fs-lg-5" />
            מצטערים
            <br />
            אירעה שגיאה בשליחת ההודעה.
          </>);
          setModalType("error");
          setModalShow(true);
        }
      );
  };



  return (
    <>
      <Header />

      <main className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">צרו קשר</h1>
          <h2 className="h4 mb-3">
            נשמח לשמוע מכם! מלאו את הטופס ונחזור אליכם בהקדם.
          </h2>
          <RiContactsLine className="fs-3 fs-md-4 fs-lg-5" />
        </div>

        <div className="row justify-content-center">
          <div className="col-md-8">
            <form ref={form} onSubmit={sendEmail}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  שם
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="user_name"
                  placeholder="הכניסו את שמכם"
                  onBlur={(e) => {
                    setNameTouched(true);
                    validateName(e.target.value);
                  }}
                  onChange={(e) => {
                    if (nameError) validateName(e.target.value); // עדכון השגיאה בזמן הקלדה
                  }}
                />
                {nameTouched && nameError && (
                  <div className="text-danger small">{nameError}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  דוא״ל
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  name="user_email"
                  placeholder="example@gmail.com"
                  onBlur={(e) => {
                    setEmailTouched(true);
                    validateEmail(e.target.value);
                  }}
                  onChange={(e) => {
                    if (emailError) validateEmail(e.target.value); // עדכון השגיאה בזמן הקלדה
                  }}
                />
                {emailTouched && emailError && <div className="text-danger small">{emailError}</div>}
              </div>
              <div className="mb-3">
                <label htmlFor="phone" className="form-label">
                  טלפון
                </label>
                <input
                  type="tel"
                  className="form-control text-end"
                  id="phone"
                  name="user_phone"
                  placeholder="054-1234567"
                  onBlur={(e) => {
                    setPhoneTouched(true);
                    validatePhone(e.target.value);
                  }}
                  onChange={(e) => {
                    if (phoneError) validatePhone(e.target.value); // עדכון השגיאה בזמן הקלדה
                  }}
                />
                {phoneTouched && phoneError && <div className="text-danger small">{phoneError}</div>}

              </div>

              <div className="mb-3">
                <label htmlFor="model" className="form-label">
                  דגם
                </label>
                <select
                  className="form-select"
                  id="model"
                  name="model"
                  defaultValue=""
                  onBlur={(e) => {
                    setModelTouched(true);
                    const value = e.target.value;
                  }}
                  onChange={(e) => {
                    if (modelError) {
                      const value = e.target.value;
                      setModelError(value ? "" : "שדה חובה");
                    }
                  }}
                >
                  <option value="" disabled>
                    בחרו דגם
                  </option>

                  {models.map((m, index) => (
                    <option key={index} value={m}>
                      {m}
                    </option>
                  ))}
                </select>

                {modelTouched && modelError && (
                  <div className="text-danger small">{modelError}</div>
                )}
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  הודעה
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  name="message_text"
                  rows="5"
                  placeholder="כתבו כאן את ההודעה שלכם..."
                  onBlur={(e) => {
                    setMessageTouched(true);
                    validateMessage(e.target.value);
                  }}
                  onChange={(e) => {
                    if (messageError) validateMessage(e.target.value); // עדכון השגיאה בזמן הקלדה
                  }}
                ></textarea>
                {messageTouched && messageError && <div className="text-danger small">{messageError}</div>}

              </div>

              <button type="submit" className="btn btn-primary w-100">
                שליחה
              </button>
            </form>
          </div>
        </div>
      </main>

      {modalShow && (
        <div
          className="modal fade show"
          tabIndex="-1"
          style={{
            display: "block",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div
              className={`modal-content ${modalType === "success" ? "border-success" : "border-danger"
                }`}
            >
              <div
                className="modal-header text-white"
                style={{
                  backgroundColor: modalType === "success" ? "var(--color-subtitle-gold)" : "var(--color-text-gray)", // צבעים מותאמים אישית
                }}
              >

                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setModalShow(false)}
                ></button>
              </div>
              <div className="modal-body text-center fs-5">{modalMessage}</div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setModalShow(false)}
                >
                  סגור
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <Footer />
    </>
  );
}

export default Contact;
