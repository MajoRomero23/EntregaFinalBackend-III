import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

export const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
};
