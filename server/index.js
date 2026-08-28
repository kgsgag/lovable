import express from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3001;
app.use(cors());
app.use(express.json());

let products = [
  { id: 1, name: 'Fone Aura Pro', category: 'Áudio', price: 399.9, stock: 12, emoji: '🎧' },
  { id: 2, name: 'Teclado Nova 75', category: 'Periféricos', price: 549.9, stock: 8, emoji: '⌨️' },
  { id: 3, name: 'Mouse Flux X', category: 'Periféricos', price: 249.9, stock: 20, emoji: '🖱️' },
  { id: 4, name: 'Luminária Halo', category: 'Casa', price: 189.9, stock: 15, emoji: '💡' },
  { id: 5, name: 'Mochila Orbit', category: 'Acessórios', price: 299.9, stock: 6, emoji: '🎒' },
  { id: 6, name: 'Smartwatch Pulse', category: 'Wearables', price: 699.9, stock: 5, emoji: '⌚' }
];

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.get('/api/products', (_req, res) => res.json(products));
app.post('/api/products', (req, res) => {
  const product = { id: Date.now(), ...req.body };
  products.push(product);
  res.status(201).json(product);
});
app.post('/api/orders', (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  const total = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);
  res.status(201).json({ id: `ORD-${Date.now()}`, status: 'confirmed', total, items });
});

app.listen(port, () => console.log(`Store API listening on ${port}`));
