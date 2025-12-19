import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import HelloWorld from './components/HelloWorld';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="app-nav">
          <Link to="/">Home</Link>
          <Link to="/hello">Hello World</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hello" element={<HelloWorld />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
