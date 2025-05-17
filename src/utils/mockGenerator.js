import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';

export function generateMockUsers(quantity = 50) {
  const roles = ['user', 'admin'];
  const users = [];

  for (let i = 0; i < quantity; i++) {
    const hashedPassword = bcrypt.hashSync('coder123', 10);

    users.push({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password: hashedPassword,
      role: roles[Math.floor(Math.random() * roles.length)],
      pets: [],
    });
  }

  return users;
}

export function generateMockProducts(quantity = 50) {
  const products = [];

  for (let i = 0; i < quantity; i++) {
    products.push({
      title: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      price: parseFloat(faker.commerce.price()),
      stock: faker.number.int({ min: 1, max: 100 }),
      category: faker.commerce.department(),
      code: faker.string.alphanumeric(10),
      thumbnails: [faker.image.url()],
    });
  }

  return products;
}
