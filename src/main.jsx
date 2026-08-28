import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ShoppingBag, Search, Plus, Minus, Trash2, PackageCheck } from 'lucide-react';
import './style.css';

const API = '/api';
const money = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

function App() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('Todos');
  const [notice, setNotice] = useState('');

  useEffect(() => { fetch(`${API}/products`).then(r => r.json()).then(setProducts).catch(() => setNotice('Não foi possível carregar os produtos.')); }, []);
  const categories = ['Todos', ...new Set(products.map(p => p.category))];
  const filtered = useMemo(() => products.filter(p => (category === 'Todos' || p.category === category) && p.name.toLowerCase().includes(query.toLowerCase())), [products, query, category]);
  const count = cart.reduce((n, i) => n + i.quantity, 0);
  const total = cart.reduce((n, i) => n + i.price * i.quantity, 0);
  const add = product => setCart(c => c.some(i => i.id === product.id) ? c.map(i => i.id === product.id ? {...i, quantity: i.quantity + 1} : i) : [...c, {...product, quantity: 1}]);
  const change = (id, delta) => setCart(c => c.map(i => i.id === id ? {...i, quantity: i.quantity + delta} : i).filter(i => i.quantity > 0));
  async function checkout() {
    if (!cart.length) return;
    const r = await fetch(`${API}/orders`, { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({items: cart}) });
    const order = await r.json(); setNotice(`Pedido ${order.id} confirmado • ${money(order.total)}`); setCart([]);
  }

  return <div className="app">
    <header><a className="brand"><span className="brand-mark">N</span><span>NORD<span className="muted">STORE</span></span></a><nav><a>Início</a><a>Produtos</a><a>Sobre</a></nav><div className="search"><Search size={18}/><input aria-label="Buscar produtos" placeholder="Buscar produtos" value={query} onChange={e=>setQuery(e.target.value)}/></div><button className="cart-button" onClick={()=>document.getElementById('cart').scrollIntoView({behavior:'smooth'})}><ShoppingBag size={19}/><span>{count}</span></button></header>
    <main><section className="hero"><div><p className="eyebrow">CURADORIA DIGITAL</p><h1>Produtos que<br/><em>combinam</em> com você.</h1><p className="lead">Uma seleção essencial de tecnologia, casa e acessórios para deixar sua rotina mais inteligente.</p><button className="primary" onClick={()=>document.getElementById('products').scrollIntoView({behavior:'smooth'})}>Explorar coleção <span>→</span></button></div><div className="hero-card"><div className="orb">✦</div><p>DESIGN / FUNÇÃO</p><strong>Menos ruído.<br/>Mais essência.</strong></div></section>
    <section id="products" className="catalog"><div className="section-head"><div><p className="eyebrow">COLEÇÃO</p><h2>Escolha seu próximo favorito.</h2></div><div className="filters">{categories.map(c=><button key={c} className={category===c?'active':''} onClick={()=>setCategory(c)}>{c}</button>)}</div></div><div className="grid">{filtered.map(p=><article className="product" key={p.id}><div className="product-art"><span>{p.emoji}</span><small>{p.stock} em estoque</small></div><div className="product-info"><div><p>{p.category}</p><h3>{p.name}</h3></div><strong>{money(p.price)}</strong></div><button className="add" onClick={()=>add(p)}><Plus size={17}/> Adicionar</button></article>)}</div></section>
    <section id="cart" className="cart-section"><div><p className="eyebrow">SEU PEDIDO</p><h2>Carrinho</h2>{cart.length===0?<p className="empty">Seu carrinho está vazio. Adicione algo que você goste.</p>:cart.map(i=><div className="cart-item" key={i.id}><span className="mini-art">{i.emoji}</span><div className="cart-name"><b>{i.name}</b><span>{money(i.price)}</span></div><div className="qty"><button onClick={()=>change(i.id,-1)}><Minus size={14}/></button><span>{i.quantity}</span><button onClick={()=>change(i.id,1)}><Plus size={14}/></button></div><button className="remove" onClick={()=>setCart(c=>c.filter(x=>x.id!==i.id))}><Trash2 size={16}/></button></div>)}</div><aside className="summary"><p>Total</p><h3>{money(total)}</h3><button className="primary full" disabled={!cart.length} onClick={checkout}><PackageCheck size={18}/> Finalizar pedido</button></aside></section></main>
    <footer><span>© 2026 NORDSTORE</span><span>Feito para comprar melhor.</span></footer>{notice&&<button className="notice" onClick={()=>setNotice('')}>{notice}</button>}
  </div>;
}
createRoot(document.getElementById('root')).render(<App />);
