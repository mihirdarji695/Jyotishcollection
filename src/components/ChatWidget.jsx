import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, ChevronRight, Check, Compass } from 'lucide-react';
import './ChatWidget.css';

const BotAvatar = () => (
  <div className="bot-avatar">
    <span>JC</span>
  </div>
);

const UserAvatar = () => (
  <div className="bot-avatar" style={{ background: '#333', color: '#fff' }}>
    <span>Me</span>
  </div>
);

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Hello! Welcome to Jyoties Collection. How can I help you today? ✨',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [flowState, setFlowState] = useState('general'); // general, collecting_shipping, collecting_payment
  const [selectedProduct, setSelectedProduct] = useState(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (text = inputValue) => {
    if (!text.trim()) return;

    // Add User Message
    const newUserMsg = {
      id: Date.now(),
      type: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, newUserMsg]);
    setInputValue('');
    setIsTyping(true);

    // Simulate Bot Response Logic
    setTimeout(() => {
      let botResponse = {
        id: Date.now() + 1,
        type: 'bot',
        text: "I didn't quite catch that. Try saying 'Hi' to start our demo!",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      const lowerText = text.toLowerCase();

      // Handle Shipping Flow
      if (flowState === 'collecting_shipping') {
        botResponse.text = "Got it. 🏠 Please select your payment method.";
        botResponse.actions = [
          { label: "Cash on Delivery (COD)", value: "cod" },
          { label: "Online Payment (UPI/Card)", value: "online" }
        ];
        setFlowState('collecting_payment');
      }
      // Handle Payment Flow
      else if (flowState === 'collecting_payment') {
        botResponse.text = `Thank you! Your order for ${selectedProduct || 'your items'} has been confirmed. 📦 We will ship it to your address. Thanks for choosing Jyoties Collection! 💖`;
        botResponse.actions = [
          { label: "Track Order", value: "track" },
          { label: "Shop More", value: "start" }
        ];
        setFlowState('general');
        setSelectedProduct(null);
      }
      // General Flow
      else if (lowerText.includes('track') || lowerText.includes('order status')) {
        botResponse.text = "📦 Your order is currently being processed at our warehouse! It will be shipped within 24 hours.";
      }
      else if (lowerText.includes('hi') || lowerText.includes('hello') || lowerText.includes('hey') || lowerText.includes('start')) {
        botResponse.text = "Hi there! 👋 Check out our latest collections. Are you interested in our New Arrivals?";
        botResponse.actions = [
          { label: "Yes, show me New Arrivals", value: "show_new_arrivals" },
          { label: "Just browsing", value: "browsing" }
        ];
      }
      else if (text === "Yes, show me New Arrivals" || lowerText.includes('new arrival')) {
        botResponse.text = "Perfect! Our New Arrivals are stunning. What category are you looking to purchase?";
        botResponse.optionsType = 'checkbox';
        botResponse.options = [
          { label: "Co-ords", id: "coords" },
          { label: "Anarkali", id: "anarkali" },
          { label: "Dupatta Sets", id: "dupatta_sets" },
          { label: "Kurti Pant Set", id: "kurti_pant_set" },
          { label: "Festive Collection", id: "festive" }
        ];
      }
      else if (lowerText.includes('buying') || lowerText.includes('shop now') || lowerText.includes('buy') || lowerText.includes('purchase')) {
        // Extract Product Name if available (Buying [Name])
        const productName = text.replace('Buying ', '').replace('Shop Now', '').trim();
        if (productName && productName.length > 3) {
          setSelectedProduct(productName);
          botResponse.text = `Good choice! You selected ${productName}. What size fits you best? 📏`;
        } else {
          botResponse.text = "Great! What size fits you best? 📏";
        }

        botResponse.actions = [
          { label: "Small (S)", value: "S" },
          { label: "Medium (M)", value: "M" },
          { label: "Large (L)", value: "L" },
          { label: "Extra Large (XL)", value: "XL" }
        ];
      }
      else if (['navy', 'blue', 'fuchsia', 'yellow', 'powder', 'black', 'pink'].some(c => lowerText.includes(c))) {
        const colorInput = ['Navy Blue', 'Fuchsia', 'Sunshine Yellow', 'Powder Blue', 'Jet Black'].find(c => lowerText.includes(c.split(' ')[1]?.toLowerCase() || c.toLowerCase()));
        const color = colorInput || 'Navy Blue';
        botResponse.text = `Here are the trending ${color} styles available now:`;

        const productImages = {
          'Navy Blue': 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2000&auto=format&fit=crop',
          'Fuchsia': 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=2000&auto=format&fit=crop', // Pinkish/Red surrogate
          'Sunshine Yellow': 'https://images.unsplash.com/photo-1583391733958-e026b1346331?q=80&w=2000&auto=format&fit=crop',
          'Powder Blue': 'https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?q=80&w=2000&auto=format&fit=crop', // Light blue surrogate
          'Jet Black': 'https://images.unsplash.com/photo-1546213439-0c63286e007c?q=80&w=2000&auto=format&fit=crop' // Dark surrogate
        };

        // Realistic Product Names from Site
        let relevantProducts = [];
        if (color.includes('Blue') || color.includes('Navy')) {
          relevantProducts = [
            { id: 201, name: "Dark Navy A-Line Kurta Dupatta Set | Pure Silk", price: 4599, stock: 3, image: productImages['Navy Blue'], sizes: ['M', 'L', 'XL'] },
            { id: 202, name: "Prussian Blue Cotton Kurti Pant Set | Kalamkari", price: 2899, stock: 8, image: productImages['Navy Blue'] + '&t=2', sizes: ['S', 'M', 'L'] },
            { id: 203, name: "Navy Blue Cotton Peplum Top & Pant Co-ord", price: 2199, stock: 12, image: productImages['Navy Blue'] + '&t=3', sizes: ['M', 'L', 'XXL'] }
          ];
        } else if (color.includes('Fuchsia') || color.includes('Pink')) {
          relevantProducts = [
            { id: 301, name: "Royal Fuchsia Mul Chanderi Angrakha Dupatta Set", price: 3499, stock: 5, image: productImages['Fuchsia'], sizes: ['M', 'L'] },
            { id: 302, name: "Mauve Pink Cotton Kurti Pant Set | Mirror Work", price: 2699, stock: 10, image: productImages['Fuchsia'] + '&t=2', sizes: ['S', 'M', 'L', 'XL'] },
            { id: 303, name: "Dusty Pink Kurta Dupatta Set | Mul Chanderi", price: 3199, stock: 4, image: productImages['Fuchsia'] + '&t=3', sizes: ['L', 'XL'] }
          ];
        } else if (color.includes('Yellow')) {
          relevantProducts = [
            { id: 401, name: "Sunshine Yellow Mul Chanderi Angrakha Set", price: 3299, stock: 6, image: productImages['Sunshine Yellow'], sizes: ['S', 'M', 'L'] },
            { id: 402, name: "Golden Olive Cotton Kurti Pant Set", price: 2499, stock: 9, image: productImages['Sunshine Yellow'] + '&t=2', sizes: ['M', 'XL'] },
            { id: 403, name: "Mustard Floral Tunic", price: 1499, stock: 15, image: productImages['Sunshine Yellow'] + '&t=3', sizes: ['S', 'M', 'L', 'XXL'] }
          ];
        } else {
          // Default Fallback
          relevantProducts = [
            { id: 501, name: "Jet Black Knee-Length Kurta Dupatta Set | Katha Work", price: 3899, stock: 2, image: productImages['Jet Black'], sizes: ['M', 'L'] },
            { id: 502, name: "Off White Muslin No-Shoulder Co-ord Set", price: 2799, stock: 7, image: productImages['Jet Black'] + '&t=2', sizes: ['S', 'M', 'L'] },
            { id: 503, name: "Cocoa Brown Cotton Peplum Top & Pant", price: 2299, stock: 11, image: productImages['Jet Black'] + '&t=3', sizes: ['M', 'L', 'XL'] }
          ];
        }

        botResponse.products = relevantProducts;
      }
      else if (['co-ords', 'anarkali', 'dupatta sets', 'kurti pant set', 'festive'].some(cat => lowerText.includes(cat)) || lowerText.includes('interested in')) {
        botResponse.text = `Great choice! These styles are trending right now. Which color do you prefer?`;
        botResponse.optionsType = 'dropdown';
        botResponse.options = ["Navy Blue", "Fuchsia", "Sunshine Yellow", "Powder Blue", "Jet Black"];
      }
      else if (['coords', 'anarkali', 'dupatta', 'kurti', 'festive', 'set'].some(cat => lowerText.includes(cat))) {
        // Broad catch-all for typed categories
        botResponse.text = `Excellent choice! Which color matches your vibe today?`;
        botResponse.optionsType = 'dropdown';
        botResponse.options = ["Navy Blue", "Fuchsia", "Sunshine Yellow", "Powder Blue", "Jet Black"];
      }

      else if (['s', 'm', 'l', 'xl', 'xxl'].some(s => lowerText.split(' ').some(w => w.replace(/[()]/g, '') === s)) || text.includes('(')) {
        const sizeMatch = text.match(/\(([^)]+)\)/);
        const size = sizeMatch ? sizeMatch[1] : text.toUpperCase();
        botResponse.text = `Added ${selectedProduct || 'item'} (Size: ${size}) to your cart! 🛍️ Proceed to checkout?`;
        botResponse.actions = [
          { label: "Checkout", value: "checkout" },
          { label: "Continue Shopping", value: "continue" }
        ];
      }
      else if (lowerText.includes('checkout')) {
        botResponse.text = "Great! To ship your order, please enter your Full Name and Address.";
        setFlowState('collecting_shipping');
      }

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleExplore = () => {
    setMessages([]); // Clear chat
    setFlowState('general');
    setSelectedProduct(null);
    // Simulate user starting conversation
    setTimeout(() => {
      handleSend("Hi! I want to explore the collection.");
    }, 100);
  };

  const handleActionClick = (actionValue, actionLabel) => {
    handleSend(actionLabel);
  };

  const handleOptionSelect = (selectedOptions) => {
    const selectionText = Array.isArray(selectedOptions) ? selectedOptions.join(", ") : selectedOptions;
    handleSend(`I'm interested in ${selectionText}`);
  };

  return (
    <div className="chat-widget-container">
      {isOpen && (
        <div className="chat-window">
          {/* Header */}
          <div className="chat-header">
            <div className="header-info">
              <BotAvatar />
              <div className="bot-details">
                <h3>Jyoties Assistant</h3>
                <span><span className="status-dot"></span> Online</span>
              </div>
            </div>
            <button title="Explore Demo" onClick={handleExplore} className="icon-btn" style={{ background: 'transparent', border: 'none', color: 'white', marginRight: '8px', cursor: 'pointer' }}>
              <Compass size={20} />
            </button>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              <X size={20} />
            </button>
          </div>

          {/* Body */}
          <div className="chat-body">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-wrapper ${msg.type === 'bot' ? 'items-start' : 'items-end'}`}>
                <div className={`message ${msg.type}`}>
                  {msg.text}

                  {/* Action Buttons (Quick Replies) */}
                  {msg.actions && (
                    <div className="options-container" style={{ marginTop: '10px' }}>
                      {msg.actions.map(action => (
                        <button
                          key={action.value}
                          className="option-btn"
                          onClick={() => handleActionClick(action.value, action.label)}
                        >
                          {action.label} <ChevronRight size={14} />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Checkbox Options Demo */}
                  {msg.optionsType === 'checkbox' && (
                    <CategorySelector options={msg.options} onConfirm={handleOptionSelect} />
                  )}

                  {/* Dropdown/Chip Options Demo */}
                  {msg.optionsType === 'dropdown' && (
                    <ColorSelector options={msg.options} onSelect={handleOptionSelect} />
                  )}

                  {/* Product Carousel Demo */}
                  {msg.products && (
                    <ProductCarousel products={msg.products} onShopNow={handleActionClick} />
                  )}

                  <span className="message-time">{msg.timestamp}</span>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="typing-dots">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer */}
          <div className="chat-footer">
            <input
              type="text"
              className="chat-input"
              placeholder="Type a message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            />
            <button
              className="send-btn"
              onClick={() => handleSend()}
              disabled={!inputValue.trim()}
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button className="chat-toggle-btn" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X size={28} /> : <MessageCircle size={28} />}
        {!isOpen && <div className="notification-badge" />}
      </button>
    </div>
  );
};

// Sub-component for Checkbox Selection
const CategorySelector = ({ options, onConfirm }) => {
  const [selected, setSelected] = useState([]);

  const toggle = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const confirmSelection = () => {
    if (selected.length === 0) return;
    const labels = options.filter(o => selected.includes(o.id)).map(o => o.label);
    onConfirm(labels);
  };

  return (
    <div className="category-selector" style={{ marginTop: '10px', background: '#f9f9f9', padding: '10px', borderRadius: '8px' }}>
      {options.map(opt => (
        <label key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', cursor: 'pointer', fontSize: '0.9rem' }}>
          <input
            type="checkbox"
            checked={selected.includes(opt.id)}
            onChange={() => toggle(opt.id)}
            style={{ accentColor: '#591C27' }}
          />
          {opt.label}
        </label>
      ))}
      <button
        onClick={confirmSelection}
        style={{
          marginTop: '6px',
          width: '100%',
          backgroundColor: '#591C27',
          color: 'white',
          padding: '6px',
          borderRadius: '4px',
          fontSize: '0.8rem'
        }}
      >
        Confirm Selection
      </button>
    </div>
  );
};

// Sub-component for Color Selection (Chips)
const ColorSelector = ({ options, onSelect }) => {
  const getColorCode = (name) => {
    const map = {
      'Navy Blue': 'navy',
      'Fuchsia': 'magenta',
      'Sunshine Yellow': '#FFD700',
      'Powder Blue': 'lightblue',
      'Jet Black': 'black',
      'Mustard': '#e1ad01'
    };
    return map[name] || name.toLowerCase().replace(' ', '');
  };

  return (
    <div className="choice-chips" style={{ marginTop: '10px' }}>
      {options.map(color => (
        <button
          key={color}
          className="chip"
          onClick={() => onSelect(color)}
        >
          <span style={{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: getColorCode(color),
            marginRight: '6px',
            border: '1px solid #ddd'
          }}></span>
          {color}
        </button>
      ))}
    </div>
  );
};

// Sub-component for Product Carousel
const ProductCarousel = ({ products, onShopNow }) => {
  return (
    <div className="product-carousel" style={{
      marginTop: '12px',
      display: 'flex',
      gap: '12px',
      overflowX: 'auto',
      paddingBottom: '8px',
      scrollSnapType: 'x mandatory',
      width: '100%'
    }}>
      {products.map((product, index) => (
        <div key={index} style={{
          minWidth: '220px',
          maxWidth: '220px',
          background: 'white',
          border: '1px solid #eee',
          borderRadius: '8px',
          overflow: 'hidden',
          scrollSnapAlign: 'start',
          flexShrink: 0
        }}>
          <div style={{ height: '250px', background: '#f0f0f0', position: 'relative' }}>
            <img
              src={product.image}
              alt={product.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => { e.target.src = 'https://via.placeholder.com/220x250?text=Image+Unavailable' }}
            />
            {product.stock && (
              <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(255,255,255,0.9)', padding: '2px 6px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '600', color: '#d32f2f' }}>
                {product.stock} Left!
              </div>
            )}
          </div>
          <div style={{ padding: '12px' }}>
            <h4 style={{ margin: '0 0 4px 0', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{product.name}</h4>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontWeight: 'bold', color: '#591C27' }}>₹{product.price}</span>
              <span style={{ fontSize: '0.75rem', color: '#666' }}>Sizes: {product.sizes.join(', ')}</span>
            </div>

            <button
              onClick={() => onShopNow(product.id, `Buying ${product.name}`)}
              style={{
                width: '100%',
                padding: '8px',
                background: '#591C27',
                color: 'white',
                borderRadius: '4px',
                fontSize: '0.85rem',
                marginTop: '4px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              Shop Now
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatWidget;
