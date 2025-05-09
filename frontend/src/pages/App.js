import CassioImage from '../components/CassioImage';
import '../styles/App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <CassioImage />
        <CassioImage />
        <CassioImage />
        <CassioImage />
        <CassioImage />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
