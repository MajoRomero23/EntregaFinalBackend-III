import { generateMockUsers, generateMockProducts } from '../utils/mockGenerator.js';
import User from '../models/user.model.js';
import Product from '../models/Product.js';

export const getMockUsers = (req, res) => {
  const qty = parseInt(req.params.qty) || 50;
  const users = generateMockUsers(qty);
  res.json(users);
};

export const generateData = async (req, res) => {
  const { users = 0, products = 0 } = req.body;

  try {
    const mockUsers = generateMockUsers(users);
    const mockProducts = generateMockProducts(products);

    await User.insertMany(mockUsers);
    await Product.insertMany(mockProducts);

    res.status(201).json({ message: 'Datos generados correctamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al generar datos', details: error.message });
  }
};