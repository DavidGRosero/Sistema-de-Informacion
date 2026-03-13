const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const bcrypt = require("bcrypt"); // para encriptar contraseñas

const app = express();
app.use(cors());
app.use(express.json());

// ================== CONEXIÓN A SUPABASE (Postgres) ==================
const pool = new Pool({
  host: "aws-1-us-east-1.pooler.supabase.com",
  user: "postgres.cupxithihgvvqjeshyos",
  password: "Davidgetial2005",
  database: "postgres",
  port: 6543,
  ssl: { rejectUnauthorized: false }
});

// ================== CLIENTES ==================
app.get("/clientes", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM clientes");
    res.json(result.rows);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/clientes", async (req, res) => {
  const { nombre, contacto, direccion } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO clientes (nombre, contacto, direccion) VALUES ($1, $2, $3) RETURNING id_cliente",
      [nombre, contacto, direccion]
    );
    res.json({ message: "Cliente agregado", id: result.rows[0].id_cliente });
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.put("/clientes/:id", async (req, res) => {
  const { id } = req.params;
  const { nombre, contacto, direccion } = req.body;
  try {
    const result = await pool.query(
      "UPDATE clientes SET nombre = $1, contacto = $2, direccion = $3 WHERE id_cliente = $4 RETURNING *",
      [nombre, contacto, direccion, id]
    );
    if (result.rows.length > 0) {
      res.json({ message: "Cliente actualizado", cliente: result.rows[0] });
    } else {
      res.json({ message: "Cliente no encontrado" });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ================== PRODUCTOS ==================
app.get("/productos", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM productos");
    res.json(result.rows);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/productos", async (req, res) => {
  const { nombre, precio, stock } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO productos (nombre, precio, stock) VALUES ($1, $2, $3) RETURNING id_producto",
      [nombre, precio, stock]
    );
    res.json({ message: "Producto agregado", id: result.rows[0].id_producto });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ================== USUARIOS ==================
// Registro de usuario nuevo
app.post("/register", async (req, res) => {
  console.log("Datos recibidos en /register:", req.body); // 👈 se verá en la terminal
  try {
    const hash = await bcrypt.hash(req.body.contraseña, 10);
    const result = await pool.query(
      "INSERT INTO usuarios (nombre, correo, contraseña, rol) VALUES ($1, $2, $3, $4) RETURNING id_usuario",
      [req.body.nombre, req.body.correo, hash, req.body.rol]
    );
    res.json({ message: "Usuario registrado exitosamente", id: result.rows[0].id_usuario });
  } catch (err) {
    console.error("Error en /register:", err); // 👈 muestra el error real en la terminal
    res.status(500).json({ message: "Error al registrar usuario", error: err.message });
  }
});


// Login de usuario
app.post("/login", async (req, res) => {
  const { correo, contraseña } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (result.rows.length === 0) {
      return res.json({ message: "Usuario no encontrado" });
    }

    const usuario = result.rows[0];
    const valido = await bcrypt.compare(contraseña, usuario.contraseña);

    if (!valido) {
      return res.json({ message: "Credenciales incorrectas" });
    }

    res.json({ message: "Login exitoso", usuario });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ================== VENTAS ==================
app.get("/ventas", async (req, res) => {
  try {
    const sql = `
      SELECT v.id_venta, v.fecha, c.nombre AS cliente, v.total
      FROM ventas v
      JOIN clientes c ON v.id_cliente = c.id_cliente
    `;
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/ventas", async (req, res) => {
  const { fecha, id_cliente, total } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO ventas (fecha, id_cliente, total) VALUES ($1, $2, $3) RETURNING id_venta",
      [fecha, id_cliente, total]
    );
    res.json({ message: "Venta registrada", id: result.rows[0].id_venta });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ================== DETALLE VENTA ==================
app.get("/detalleventa", async (req, res) => {
  try {
    const sql = `
      SELECT d.id_detalle, v.id_venta, p.nombre AS producto, d.cantidad, d.subtotal
      FROM detalleventa d
      JOIN ventas v ON d.id_venta = v.id_venta
      JOIN productos p ON d.id_producto = p.id_producto
    `;
    const result = await pool.query(sql);
    res.json(result.rows);
  } catch (err) {
    res.json({ error: err.message });
  }
});

app.post("/detalleventa", async (req, res) => {
  const { id_venta, id_producto, cantidad, subtotal } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO detalleventa (id_venta, id_producto, cantidad, subtotal) VALUES ($1, $2, $3, $4) RETURNING id_detalle",
      [id_venta, id_producto, cantidad, subtotal]
    );
    res.json({ message: "Detalle de venta agregado", id: result.rows[0].id_detalle });
  } catch (err) {
    res.json({ error: err.message });
  }
});

// ================== SERVIDOR ==================
app.listen(3000, () => {
  console.log("Servidor corriendo en http://localhost:3000");
});
