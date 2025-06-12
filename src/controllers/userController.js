import { generateToken } from '../utils/jwtUtils.js';
import userService from '../services/userService.js';

export const registerUser = async (req, res) => {
  try {
    const userDTO = await userService.registerUser(req.body);
    const token = generateToken(userDTO);
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(201).json({ message: 'Usuario registrado con éxito', token, user: userDTO });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userDTO = await userService.getUserById(req.user.id);
    if (!userDTO) return res.status(404).json({ error: 'Usuario no encontrado' });

    res.render('perfil', { user: userDTO });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).send('Error al cerrar sesión');
    res.redirect('/login');
  });
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(`🔑 Intento de login con email: ${email}`);

    const userDTO = await userService.authenticateUser(email, password);
    if (!userDTO) return res.status(401).json({ error: "Usuario o contraseña incorrectos" });

    const token = generateToken(userDTO);
    res.cookie('jwt', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
    res.status(200).json({ message: "Login exitoso", token, user: userDTO });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
