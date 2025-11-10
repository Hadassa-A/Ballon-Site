const express = require('express');
const sql = require('mssql');  // ← רק כאן!
const cors = require('cors');
const multer = require('multer');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
    credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// SQL Server Configuration
const config = {
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    user: process.env.DB_USER,         // ← חייב להיות כאן!
    password: process.env.DB_PASSWORD, // ← חייב להיות כאן!
    options: {
        encrypt: false,
        trustServerCertificate: true,
        enableArithAbort: true,
        trustedConnection: true
    }
};

let pool;

async function connectDB() {
    try {
        pool = await sql.connect(config); // ← שמור כאן
        console.log('✅ מחובר למסד הנתונים בהצלחה!');
        return pool;
    } catch (err) {
        console.error('❌ שגיאה בהתחברות:', err.message);
        process.exit(1);
    }
}

// חיבור למסד
connectDB();

// הגדרת Multer להעלאת תמונות
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // הגבלה של 5MB
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('רק קבצי תמונה מותרים (JPEG, PNG, WebP)'));
        }
    }
});

// ========== אימות מנהל ==========
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || '123';
if (!ADMIN_PASSWORD) {
  console.warn('⚠️  WARNING: ADMIN_PASSWORD is not set. Admin login will be disabled in production.');
  // אם תרצי — אפשר להפעיל exit(1) כדי לא להריץ ב־production בלי סיסמה:
  // if (process.env.NODE_ENV === 'production') process.exit(1);
}


app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, message: 'התחברות הצליחה' });
    } else {
        res.status(401).json({ success: false, message: 'סיסמה שגויה' });
    }
});

// ========== Categories APIs ==========

// קבלת כל הקטגוריות
app.get('/api/categories', async (req, res) => {
    try {
        const result = await pool.request().query('SELECT CategoryID, Name FROM Categories');
        // תקן את השמות!
        const categories = result.recordset.map(row => ({
            CategoryID: row.CategoryID,
            Name: row.Name
        }));
        res.json(categories);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// הוספת קטגוריה חדשה
app.post('/api/categories', async (req, res) => {
    try {
        const { name } = req.body;
        if (!name?.trim()) {
            return res.status(400).json({ error: 'שם קטגוריה חסר' });
        }
        const result = await pool.request()
            .input('Name', sql.NVarChar, name)
            .query('INSERT INTO Categories (Name) OUTPUT INSERTED.* VALUES (@Name)');
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('שגיאה בהוספת קטגוריה:', err.message);
        res.status(500).json({ error: 'שגיאה בהוספת קטגוריה: ' + err.message });
    }
});

// עדכון קטגוריה
app.put('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        await pool.request()
            .input('id', sql.Int, id)
            .input('name', sql.NVarChar, name)
            .query('UPDATE Categories SET Name = @name WHERE CategoryID = @id');
        res.json({ success: true, message: 'הקטגוריה עודכנה בהצלחה' });
    } catch (err) {
        console.error('שגיאה בעדכון קטגוריה:', err.message);
        res.status(500).json({ error: 'שגיאה בעדכון קטגוריה: ' + err.message });
    }
});

// מחיקת קטגוריה
app.delete('/api/categories/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // בדיקה אם יש מוצרים בקטגוריה
        const checkProducts = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT COUNT(*) as count FROM Products WHERE CategoryID = @id');

        if (checkProducts.recordset[0].count > 0) {
            return res.status(400).json({
                error: 'לא ניתן למחוק קטגוריה שיש בה מוצרים'
            });
        }

        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Categories WHERE CategoryID = @id');
        res.json({ success: true, message: 'הקטגוריה נמחקה בהצלחה' });
    } catch (err) {
        console.error('שגיאה בבדיקת המוצרים קטגוריה:', err.message);
        res.status(500).json({ error: 'שגיאה במחיקת קטגוריה' });
    }
});

// ========== Products APIs ==========

// קבלת כל המוצרים
app.get('/api/products', async (req, res) => {
    try {
        const result = await pool.request()
            .query(`
        SELECT p.*, c.Name as CategoryName 
        FROM Products p
        LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
        ORDER BY p.ProductID DESC
      `);
        res.json(result.recordset);
    } catch (err) {
        console.error('שגיאה בטעינת מוצרים:', err.message);
        res.status(500).json({ error: 'שגיאה בטעינת מוצרים: ' + err.message });
    }
});

// קבלת מוצרים לפי קטגוריה
app.get('/api/products/categories/:categoryId', async (req, res) => {
    try {
        const { categoryId } = req.params;
        const result = await pool.request()
            .input('categoryId', sql.Int, categoryId)
            .query(`
        SELECT p.*, c.Name as CategoryName 
        FROM Products p
        LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
        WHERE p.CategoryID = @categoryId
        ORDER BY p.ProductID DESC
      `);
        res.json(result.recordset);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת מוצרים' });
    }
});

// קבלת מוצר בודד
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.request()
            .input('id', sql.Int, id)
            .query(`
        SELECT p.*, c.Name as CategoryName 
        FROM Products p
        LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
        WHERE p.ProductID = @id
      `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'המוצר לא נמצא' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת מוצר' });
    }
});
app.post('/api/products', upload.single('image'), async (req, res) => {
  try {
    const { price, categoryId, title } = req.body;

    if (!req.file) return res.status(400).json({ error: 'לא הועלתה תמונה' });
    if (!price || isNaN(price)) return res.status(400).json({ error: 'מחיר לא תקין' });
    if (!categoryId || isNaN(categoryId)) return res.status(400).json({ error: 'קטגוריה לא תקינה' });
    if (!title?.trim()) return res.status(400).json({ error: 'שם המוצר חסר' });

    const priceNum = parseFloat(price);
    const catIdNum = parseInt(categoryId, 10);
    const productTitle = title.trim();

    // בדוק קטגוריה
    const catCheck = await pool.request()
      .input('id', sql.Int, catIdNum)
      .query('SELECT 1 FROM Categories WHERE CategoryID = @id');
    if (catCheck.recordset.length === 0) {
      return res.status(400).json({ error: 'קטגוריה לא קיימת' });
    }

    // שמור תמונה
    const filename = `product_${Date.now()}.jpg`;
    const filepath = path.join(__dirname, 'uploads', filename);
    await sharp(req.file.buffer)
      .resize(1920, null, { withoutEnlargement: true, fit: 'inside' })
      .jpeg({ quality: 85 })
      .toFile(filepath);

    // === INSERT – בלי ModelNumber! ===
    const result = await pool.request()
      .input('image', sql.NVarChar, filename)
      .input('price', sql.Decimal(10, 2), priceNum)
      .input('categoryId', sql.Int, catIdNum)
      .input('title', sql.NVarChar(100), productTitle)
      .query(`
        INSERT INTO Products (Image, Price, CategoryID, ViewCount, Title)
        VALUES (@image, @price, @categoryId, 0, @title);

        SELECT p.*, c.Name AS CategoryName 
        FROM Products p
        LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
        WHERE p.ProductID = SCOPE_IDENTITY();
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('שגיאה בהוספת מוצר:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// עדכון מוצר (עם או בלי תמונה חדשה)
// עדכון מוצר – תומך ב-price ו/או categoryId
app.put('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { price, categoryId, title } = req.body;

        // בדוק שיש לפחות שדה אחד
        if (price === undefined && categoryId === undefined && title === undefined) {
            return res.status(400).json({ error: "אין שדות לעדכון" });
        }

        // בנה שאילתה דינמית
        const updates = [];
        const request = pool.request();

        if (price !== undefined) {
            const priceNum = parseFloat(price);
            if (isNaN(priceNum)) {
                return res.status(400).json({ error: "מחיר לא תקין" });
            }
            updates.push("Price = @price");
            request.input('price', sql.Decimal(10, 2), priceNum);
        }

        if (categoryId !== undefined) {
            const catIdNum = parseInt(categoryId, 10);
            if (isNaN(catIdNum)) {
                return res.status(400).json({ error: "קטגוריה לא תקינה" });
            }
            // בדוק שהקטגוריה קיימת
            const catCheck = await pool.request()
                .input('catId', sql.Int, catIdNum)
                .query('SELECT 1 FROM Categories WHERE CategoryID = @catId');
            if (catCheck.recordset.length === 0) {
                return res.status(400).json({ error: "קטגוריה לא קיימת" });
            }
            updates.push("CategoryID = @categoryId");
            request.input('categoryId', sql.Int, catIdNum);
        }
        if (title !== undefined) {
            const trimmedTitle = title.trim();
            if (!trimmedTitle) {
                return res.status(400).json({ error: "שם המוצר לא יכול להיות ריק" });
            }
            updates.push("Title = @title");
            request.input('title', sql.NVarChar(100), trimmedTitle);
        }

        request.input('id', sql.Int, id);

        await request.query(`
      UPDATE Products 
      SET ${updates.join(', ')} 
      WHERE ProductID = @id
    `);

        res.json({ success: true, message: "עודכן בהצלחה" });
    } catch (err) {
        console.error('שגיאה בעדכון מוצר:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// ספירת צפיה במוצר
app.post('/api/products/:id/view', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.request()
            .input('id', sql.Int, id)
            .query('UPDATE Products SET ViewCount = ViewCount + 1 WHERE ProductID = @id');
        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בעדכון צפיות' });
    }
});

// ========== Statistics APIs (למנהל) ==========

// קבלת סטטיסטיקות כלליות
app.get('/api/admin/stats', async (req, res) => {
    try {
        const totalProducts = await pool.request()
            .query('SELECT COUNT(*) as count FROM Products');

        const totalCategories = await pool.request()
            .query('SELECT COUNT(*) as count FROM Categories');

        const totalViews = await pool.request()
            .query('SELECT SUM(ViewCount) as total FROM Products');

        const topProducts = await pool.request()
            .query(`
        SELECT TOP 5 p.*, c.Name as CategoryName 
        FROM Products p
        LEFT JOIN Categories c ON p.CategoryID = c.CategoryID
        ORDER BY p.ViewCount DESC
      `);

        res.json({
            totalProducts: totalProducts.recordset[0].count,
            totalCategories: totalCategories.recordset[0].count,
            totalViews: totalViews.recordset[0].total || 0,
            topProducts: topProducts.recordset
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'שגיאה בטעינת סטטיסטיקות' });
    }
});

// מחיקת מוצר
app.delete('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // קבל את שם התמונה לפני המחיקה
        const imageResult = await pool.request()
            .input('id', sql.Int, id)
            .query('SELECT Image FROM Products WHERE ProductID = @id');

        if (imageResult.recordset.length === 0) {
            return res.status(404).json({ error: 'המוצר לא נמצא' });
        }

        const imageName = imageResult.recordset[0].Image;
        const imagePath = path.join(__dirname, 'uploads', imageName);

        // מחק את התמונה מהדיסק
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath);
        }

        // מחק מהמסד
        await pool.request()
            .input('id', sql.Int, id)
            .query('DELETE FROM Products WHERE ProductID = @id');

        res.json({ success: true, message: 'המוצר נמחק בהצלחה' });
    } catch (err) {
        console.error('שגיאה במחיקת מוצר:', err.message);
        res.status(500).json({ error: 'שגיאה במחיקה: ' + err.message });
    }
});

// ========== Server Startup ==========
// חיבור למסד ואז הפעלת השרת
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('נכשל בהפעלת השרת:', err);
});