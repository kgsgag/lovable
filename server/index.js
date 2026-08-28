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
  const { name, category, price, stock, emoji = '📦' } = req.body;
  if (!name || !category || !Number.isFinite(Number(price)) || !Number.isInteger(Number(stock)) || Number(price) < 0 || Number(stock) < 0) {
    return res.status(400).json({ error: 'Produto inválido.' });
  }
  const product = { id: Date.now(), name, category, price: Number(price), stock: Number(stock), emoji };
  products.push(product);
  res.status(201).json(product);
});
app.post('/api/orders', (req, res) => {
  const items = Array.isArray(req.body.items) ? req.body.items : [];
  if (!items.length) return res.status(400).json({ error: 'O pedido precisa ter itens.' });

  const normalized = [];
  for (const item of items) {
    const product = products.find(p => p.id === item.id);
    const quantity = Number(item.quantity);
    if (!product || !Number.isInteger(quantity) || quantity < 1) return res.status(400).json({ error: 'Item de pedido inválido.' });
    if (quantity > product.stock) return res.status(409).json({ error: `Estoque insuficiente para ${product.name}.` });
    normalized.push({ id: product.id, name: product.name, price: product.price, quantity });
  }

  const total = normalized.reduce((sum, item) => sum + item.price * item.quantity, 0);
  normalized.forEach(item => {
    const product = products.find(p => p.id === item.id);
    product.stock -= item.quantity;
  });
  res.status(201).json({ id: `ORD-${Date.now()}`, status: 'confirmed', total, items: normalized });
});

app.listen(port, () => console.log(`Store API listening on ${port}`));
