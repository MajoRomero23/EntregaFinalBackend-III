import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import UserModel from '../models/user.model.js';
import UserDTO from '../dto/UserDTO.js';
import { sendEmail } from '../services/mailService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

export const registerSession = async (req, res) => {
  try {
    const { first_name, last_name, email, password, age } = req.body;

    if (!first_name || !last_name || !email || !password || !age) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El usuario ya está registrado' });
    }

    const hashedPassword = await bcrypt.hash(password.trim().normalize("NFC"), 10);

    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      age,
    });

    const token = jwt.sign({ id: newUser._id, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

    await sendEmail({
      to: email,
      subject: "¡Bienvenido a nuestra florería! 🌸",
      template: "confirmation",
      context: { name: first_name }
    });

    res.status(201).json({ message: 'Usuario registrado con éxito', token });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const loginSession = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("📩 Email recibido:", email);
    console.log("🔑 Password recibido:", password);

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      console.error("❌ Usuario no encontrado");
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    const isMatch = await bcrypt.compare(password.trim().normalize("NFC"), user.password);
    console.log("👤 Usuario encontrado:", user.email);
    console.log("🔐 Hash en DB:", user.password);
    console.log("✅ ¿Password coincide?:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ error: "Usuario o contraseña incorrectos" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    console.log("🔐 Login:", 200, { message: "Login exitoso", token });

    res.status(200).json({ message: "Login exitoso", token });
  } catch (error) {
    console.error("Error en el login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const currentSession = async (req, res) => {
  try {
    const user = await UserModel.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    console.log("👤 Sesión actual:", 200, { user: new UserDTO(user) });
    res.status(200).json({ user: new UserDTO(user) });
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const logoutSession = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ error: 'Error al cerrar sesión' });
    }
    res.clearCookie('connect.sid');
    res.redirect('/login');
  });
};
