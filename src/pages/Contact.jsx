import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { RiContactsLine } from "react-icons/ri";
function Contact() {
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
            <form>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">
                  שם מלא
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder="הכניסו את שמכם"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label">
                  דוא״ל
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder="example@gmail.com"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  הודעה
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="5"
                  placeholder="כתבו כאן את ההודעה שלכם..."
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary w-100">
                שליחה
              </button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

export default Contact;
