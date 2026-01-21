import React from 'react';
import './App.css';
import ChatWidget from './components/ChatWidget';
import logoImage from './assets/logo.png';

function App() {
  return (
    <div className="app-container">
      <div className="overlay"></div>

      <div className="content-wrapper">
        <header className="demo-header">
          <img src={logoImage} alt="Jyoties Collection Logo" className="logo-image" />
          <h1>Jyoties Collection</h1>
          <p className="demo-tagline">Experience our new AI Shopping Assistant</p>
        </header>

        <main>
          <div className="grid-showcase">
            <div className="dummy-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=1974&auto=format&fit=crop" alt="Kurti" />
              </div>
              <div className="card-details">
                <div className="card-title">Festive Anarkali Suit</div>
                <div className="card-price">₹2,499</div>
              </div>
            </div>

            <div className="dummy-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1583391733958-e026b1346331?q=80&w=1978&auto=format&fit=crop" alt="Dress" />
              </div>
              <div className="card-details">
                <div className="card-title">Embroidered Tunic</div>
                <div className="card-price">₹1,899</div>
              </div>
            </div>

            <div className="dummy-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1616892697845-0556270b22ce?q=80&w=2070&auto=format&fit=crop" alt="Saree" />
              </div>
              <div className="card-details">
                <div className="card-title">Silk Blend Co-ord Set</div>
                <div className="card-price">₹3,299</div>
              </div>
            </div>
          </div>
        </main>

        <ChatWidget />
      </div>
    </div>
  );
}

export default App;
