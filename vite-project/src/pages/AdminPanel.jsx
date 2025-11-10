import React, { useState, useEffect } from "react";
import { RiFunctionAddLine } from "react-icons/ri";
import { PiColumnsPlusRight } from "react-icons/pi";
import { TfiViewListAlt } from "react-icons/tfi";

const API_URL = "http://localhost:5000/api";

function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newItem, setNewItem] = useState({
    imageFile: null,
    title: "",
    modelNumber: "",
    price: "",
    categoryId: "",
  });

  const [filterCategory, setFilterCategory] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState(""); // "asc" או "desc"
  const [searchTitle, setSearchTitle] = useState("");

  const [newCategory, setNewCategory] = useState("");

  // טעינת נתונים
  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch(`${API_URL}/products`).catch(() => ({ ok: false })),
        fetch(`${API_URL}/categories`).catch(() => ({ ok: false }))
      ]);

      // טפלי בכל בקשה בנפרד
      let prods = [];
      let cats = [];

      if (prodRes.ok) {
        prods = await prodRes.json();
      } else {
        console.error("שגיאה בטעינת מוצרים:", prodRes.status);
      }

      if (catRes.ok) {
        cats = await catRes.json();
        console.log("קטגוריות נטענו:", cats); // ← תראי בקונסול
      } else {
        console.error("שגיאה בטעינת קטגוריות:", catRes.status);
      }

      setProducts(Array.isArray(prods) ? prods : []);
      setCategories(Array.isArray(cats) ? cats : []);

    } catch (err) {
      console.error("שגיאה כללית:", err);
      // אל תרוקני אם רק חלק נכשל
    } finally {
      setLoading(false);
    }

  };

  // התחברות
  const handleLogin = async () => {
    if (!password.trim()) {
      setError("הכניסי סיסמה");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (data.success) {
        setIsAuthenticated(true);
        setError("");
        loadData();
      } else {
        setError("סיסמה שגויה");
      }
    } catch {
      setError("שגיאה בחיבור");
    }
  };

  // הוספת מוצר
  const handleAddItem = async () => {
    if (!newItem.imageFile) return alert("בחרי תמונה");
    if (!newItem.title.trim()) return alert("השם של המוצר");
    if (!newItem.price || isNaN(newItem.price)) return alert("הכניסי מחיר תקין");
    if (!newItem.categoryId) return alert("בחרי קטגוריה");

    const formData = new FormData();
    formData.append("image", newItem.imageFile);
    formData.append("price", newItem.price);
    formData.append("categoryId", newItem.categoryId); // ← מחרוזת, בסדר!
    formData.append("title", newItem.title);

    try {
      const res = await fetch(`${API_URL}/products`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "שגיאה בהוספה");
        return;
      }

      setProducts([...products, data]);
      setNewItem({ imageFile: null, title: "", price: "", categoryId: "" });
    } catch (err) {
      alert("שגיאה בחיבור לשרת");
    }
  };

  // מחיקת מוצר
  const handleDelete = async (id) => {
    if (!window.confirm("למחוק?")) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE"
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "שגיאה במחיקה");
        return;
      }

      // רק עכשיו – מחק מה-state
      setProducts(products.filter(p => p.ProductID !== id));
    } catch (err) {
      alert("שגיאה בחיבור לשרת");
    }
  };

  // הוספת קטגוריה
  const addCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      const res = await fetch(`${API_URL}/categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newCategory }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories([...categories, data]);
      setNewCategory("");
    } catch {
      alert("שגיאה בהוספת קטגוריה");
    }
  };

  // מחיקת קטגוריה – תיקון מלא!
  const deleteCategory = async (id) => {
    if (!window.confirm("למחוק קטגוריה?")) return;
    try {
      const res = await fetch(`${API_URL}/categories/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "לא ניתן למחוק – יש מוצרים");
        return;
      }
      setCategories(categories.filter(c => c.CategoryID !== id));
    } catch {
      alert("שגיאה במחיקה");
    }
  };


  // const updateProduct = async (id, updates) => {
  //   try {
  //     const res = await fetch(`${API_URL}/products/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(updates)
  //     });

  //     if (!res.ok) {
  //       const err = await res.json();
  //       alert(err.error || "שגיאה בשמירה");
  //       return;
  //     }

  //     alert("נשמר בהצלחה!");
  //     loadData(); // רענון הרשימה
  //   } catch {
  //     alert("שגיאה בחיבור");
  //   }
  // };

  // טופס כניסה – תיקון: input תמיד זמין
  if (!isAuthenticated) {
    return (
      <>
        <main className="container my-5 text-center">
          <h1 className="display-5 fw-bold">כניסה לאיזור ניהול</h1>
          <div className="d-inline-block text-start w-100" style={{ maxWidth: "300px" }}>
            <input
              type="password"
              className="form-control mb-3"
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="off"
              autoFocus // ← פוקוס אוטומטי
            />
            {error && <div className="text-danger small mb-2">{error}</div>}
            <button className="btn btn-primary w-100" onClick={handleLogin}>
              כניסה
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main className="container my-5">
        <h1 className="display-5 fw-bold text-center mb-3">איזור ניהול מוצרים</h1>

        {loading && (
          <div className="text-center my-4">
            <div className="spinner-border text-primary"></div>
            <p>טוען...</p>
          </div>
        )}

        {/* הוספת מוצר */}
        <section className="mb-5 p-4 border rounded adminSection">
          <h2 className="h4 mb-3"><RiFunctionAddLine />&nbsp;&nbsp;&nbsp;&nbsp;הוספת דגם חדש </h2>
          <div className="row g-3">
            <div className="col-md-6">
              <input
                type="file"
                accept="image/*"
                className="form-control"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) setNewItem({ ...newItem, imageFile: file });
                }}
              />

            </div>

            <div className="col-md-6">
              <input
                type="text"
                className="form-control"
                placeholder="שם המוצר"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <input
                type="number"
                className="form-control"
                placeholder="מחיר"
                value={newItem.price}
                onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
              />
            </div>

            <div className="col-md-4">
              <select
                className="form-select"
                value={newItem.categoryId}
                onChange={(e) => setNewItem({ ...newItem, categoryId: e.target.value })}
              >
                <option value="">בחר קטגוריה</option>
                {categories.map((cat) => (
                  <option key={cat.CategoryID} value={cat.CategoryID}>
                    {cat.Name}
                  </option>
                ))}
              </select>

            </div>

            <div className="col-md-4">
              <button className="btn btn-primary w-100" onClick={handleAddItem}>
                הוסף את המוצר למאגר שלנו
              </button>
            </div>
          </div>
        </section>

        {/* ניהול קטגוריות */}
        <section className="mb-5 p-4 border rounded adminSection">
          <h2 className="h4 mb-3"><PiColumnsPlusRight />&nbsp;&nbsp;&nbsp;&nbsp;ניהול קטגוריות</h2>
          <div className="input-group mb-3 w-50">
            <input
              type="text"
              className="form-control"
              placeholder="שם קטגוריה"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <button className="btn btn-primary rounded" onClick={addCategory}>
              הוסף
            </button>
          </div>
          <ul className="list-group ">
            {categories.map((cat) => (
              <li
                key={cat.CategoryID}
                className="list-group-item d-flex justify-content-between align-items-center "
              >
                {cat.Name}
                <button
                  className="btn btn-primary"
                  onClick={() => deleteCategory(cat.CategoryID)}
                >
                  מחק
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* רשימת מוצרים */}
        <section className="mb-5 p-4 border rounded adminSection">
          <h2 className="h4 mb-3"><TfiViewListAlt />&nbsp;&nbsp;&nbsp;&nbsp;רשימת דגמים</h2>

          {/* כפתורי סינון ומיון */}
        {/* כפתורי סינון ומיון – הכל בתוך קופסה אחת */}
<div className="mb-4">
  <div className="container-fluid px-0">
    <div className="row justify-content-center">
      <div className="col-12 col-lg-10 col-xl-9">

        {/* קופסה אחת – כוללת חיפוש, קטגוריה, מיון ואיפוס */}
        <div className="bg-light p-3 rounded shadow-sm">
          
          {/* שורה 1: חיפוש + קטגוריה */}
          <div className="row g-3 align-items-center mb-3">
            <div className="col-md-8">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="חפש לפי שם המוצר..."
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2">
                <label className="form-label mb-0 text-muted small">קטגוריה:</label>
                <select
                  className="form-select form-select-sm"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="">הכל</option>
                  {categories.map((cat) => (
                    <option key={cat.CategoryID} value={cat.CategoryID}>
                      {cat.Name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* שורה 2: מיון + איפוס – בתוך אותה קופסה */}
          {/* שורה 2: מיון + איפוס – עם רווחים ורוחב רחב יותר */}
<div className="d-flex flex-wrap align-items-center justify-content-between mt-2 gap-2">
  <div className="d-flex gap-2">
    <button
      className={`btn btn-primary btn-sm px-4  col-2${sortField === "ModelNumber" ? "btn-primary" : "btn-outline-secondary"}`}
      onClick={() => {
        if (sortField === "ModelNumber") {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortField("ModelNumber");
          setSortOrder("asc");
        }
      }}
    >
      מספר דגם {sortField === "ModelNumber" && (sortOrder === "asc" ? "↑" : "↓")}
    </button>

    <button
      className={`btn btn-primary btn-sm px-4  col-2${sortField === "Price" ? "btn-primary" : "btn-outline-secondary"}`}
      onClick={() => {
        if (sortField === "Price") {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortField("Price");
          setSortOrder("asc");
        }
      }}
    >
      מחיר {sortField === "Price" && (sortOrder === "asc" ? "↑" : "↓")}
    </button>

    <button
      className={`btn btn-primary btn-sm px-4 col-2${sortField === "ViewCount" ? "btn-primary" : "btn-outline-secondary"}`}
      onClick={() => {
        if (sortField === "ViewCount") {
          setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
          setSortField("ViewCount");
          setSortOrder("asc");
        }
      }}
    >
      צפיות {sortField === "ViewCount" && (sortOrder === "asc" ? "↑" : "↓")}
    </button>
  </div>

  <button
    className="btn btn-primary btn-sm px-3 col-3"
    onClick={() => {
      setFilterCategory("");
      setSortField("");
      setSortOrder("");
      setSearchTitle("");
    }}
  >
    ✕ איפוס
  </button>
</div>

        </div>
        {/* סיום הקופסה */}

      </div>
    </div>
  </div>
</div>


          {products.length === 0 ? (
            <p>אין מוצרים.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered text-center align-middle">
                <thead className="table-light">
                  <tr>
                    <th>תמונה</th>
                    <th>שם המוצר</th>
                    <th>מספר דגם</th>
                    <th>מחיר</th>
                    <th>קטגוריה</th>
                    <th>צפיות</th>
                    <th>פעולות</th>
                  </tr>
                </thead>
                <tbody>
                  {(() => {
                    let list = [...products];

                    // סינון לפי קטגוריה
                    if (filterCategory) {
                      list = list.filter(p => p.CategoryID == filterCategory);
                    }

                    // מיון
                    if (sortField && sortOrder) {
                      list.sort((a, b) => {
                        let aVal = a[sortField];
                        let bVal = b[sortField];

                        // המרה למספרים עבור מחיר וצפיות
                        if (sortField === "Price" || sortField === "ViewCount") {
                          aVal = Number(aVal) || 0;
                          bVal = Number(bVal) || 0;
                        }

                        return sortOrder === "asc"
                          ? (aVal > bVal ? 1 : -1)
                          : (aVal < bVal ? 1 : -1);
                      });
                    }

                    return list;
                  })().map((item) => (
                    <tr key={item.ProductID}>
                      <td>
                        <img
                          src={`http://localhost:5000/uploads/${item.Image}`}
                          alt={item.Title}
                          width="80"
                          className="img-thumbnail"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control form-control-sm text-center"
                          defaultValue={item.Title || ""}
                          onBlur={async (e) => {
                            const newTitle = e.target.value.trim();
                            if (newTitle === (item.Title || "")) return;
                            if (!newTitle) {
                              alert("שם המוצר לא יכול להיות ריק");
                              e.target.value = item.Title || "";
                              return;
                            }
                            if (!window.confirm(`לשנות שם ל-"${newTitle}"?`)) {
                              e.target.value = item.Title || "";
                              return;
                            }

                            try {
                              const res = await fetch(`${API_URL}/products/${item.ProductID}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ title: newTitle })
                              });
                              if (!res.ok) throw new Error();
                              loadData();
                            } catch {
                              alert("שגיאה בעדכון שם");
                              e.target.value = item.Title || "";
                            }
                          }}
                        />
                      </td>
                      <td>
                        <span className="badge bg-secondary">{item.ModelNumber}</span>
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control text-center"
                          defaultValue={item.Price}
                          onBlur={async (e) => {
                            const newPrice = e.target.value;
                            if (newPrice === item.Price.toString()) return;

                            if (!window.confirm(`לשנות מחיר ל-${newPrice} ₪?`)) {
                              e.target.value = item.Price;
                              return;
                            }

                            try {
                              const res = await fetch(`${API_URL}/products/${item.ProductID}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ price: newPrice })
                              });

                              if (!res.ok) throw new Error();
                              alert("המחיר עודכן בהצלחה!");
                              loadData();
                            } catch {
                              alert("שגיאה בעדכון מחיר");
                              e.target.value = item.Price;
                            }
                          }}
                        />
                      </td>
                      <td>
                        <select
                          className="form-select"
                          defaultValue={item.CategoryID}
                          onChange={async (e) => {
                            const newCatId = e.target.value;
                            if (newCatId === item.CategoryID.toString()) return;

                            const catName = categories.find(c => c.CategoryID == newCatId)?.Name || "ללא";
                            if (!window.confirm(`לשנות קטגוריה ל-${catName}?`)) {
                              e.target.value = item.CategoryID;
                              return;
                            }

                            try {
                              const res = await fetch(`${API_URL}/products/${item.ProductID}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ categoryId: newCatId })
                              });

                              if (!res.ok) throw new Error();
                              alert("הקטגוריה עודכנה בהצלחה!");
                              loadData();
                            } catch {
                              alert("שגיאה בעדכון קטגוריה");
                              e.target.value = item.CategoryID;
                            }
                          }}
                        >
                          {categories.map((cat) => (
                            <option key={cat.CategoryID} value={cat.CategoryID}>
                              {cat.Name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>{item.ViewCount || 0}</td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleDelete(item.ProductID)}
                        >
                          מחק
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </>
  );
}

export default AdminPanel;