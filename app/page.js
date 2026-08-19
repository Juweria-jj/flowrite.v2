'use client';
import { useState, useRef } from 'react';

export default function Home() {
  const [bullets, setBullets] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [tone, setTone] = useState('authentic');
  const [length, setLength] = useState('400 words');
  const abortControllerRef = useRef(null);

  const generate = async () => {
    setLoading(true);
    setOutput('');
    abortControllerRef.current = new AbortController();
    
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({bullets, tone, length}),
        signal: abortControllerRef.current.signal
      });
      const data = await res.json();
      setOutput(data.text);
      setHistory([{id: Date.now(), bullets, result: data.text}, ...history]);
    } catch(e) {
      if(e.name !== 'AbortError') setOutput('Error: ' + e.message);
    }
    setLoading(false);
  };

  const cancel = () => {
    abortControllerRef.current?.abort();
    setLoading(false);
  };

  return (
    <div style={{background: '#0f172a', color: 'white', minHeight: '100vh', padding: '40px', fontFamily: 'Arial'}}>
      <h1 style={{fontSize: '40px', textAlign: 'center'}}>Flowrite ✨</h1>
      <p style={{textAlign: 'center', color: '#94a3b8'}}>Turn bullets into essays. Powered by Gemini</p>

      <div style={{display: 'flex', gap: '20px', maxWidth: '1200px', margin: '40px auto'}}>
        {/* LEFT: EDITOR */}
        <div style={{flex: 2}}>
          <h3>Settings</h3>
          <select value={tone} onChange={e => setTone(e.target.value)} style={{padding: '8px', margin: '5px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px'}}>
            <option>authentic</option><option>formal</option><option>inspiring</option>
          </select>
          <select value={length} onChange={e => setLength(e.target.value)} style={{padding: '8px', margin: '5px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '6px'}}>
            <option>300 words</option><option>400 words</option><option>500 words</option>
          </select>

          <textarea 
            value={bullets} 
            onChange={e => setBullets(e.target.value)}
            placeholder="1. won debate\n2. started coding club..."
            style={{width: '100%', height: '200px', margin: '10px 0', padding: '12px', background: '#1e293b', color: 'white', border: 'none', borderRadius: '8px'}}
          />
          
          <button onClick={generate} disabled={loading} style={{background: '#6366f1', padding: '12px 24px', border: 'none', borderRadius: '8px', color: 'white', marginRight: '10px'}}>
            {loading ? 'Generating...' : 'Generate'}
          </button>
          {loading && <button onClick={cancel} style={{background: '#ef4444', padding: '12px 24px', border: 'none', borderRadius: '8px', color: 'white'}}>Cancel</button>}
          
          <div style={{marginTop: '20px', background: '#1e293b', padding: '20px', borderRadius: '8px', whiteSpace: 'pre-wrap'}}>{output}</div>
        </div>

        {/* RIGHT: HISTORY */}
        <div style={{flex: 1}}>
          <h3>History</h3>
          {history.map(h => (
            <div key={h.id} onClick={() => setOutput(h.result)} style={{background: '#1e293b', padding: '10px', margin: '5px 0', borderRadius: '6px', cursor: 'pointer', fontSize: '12px'}}>
              {h.bullets.slice(0, 50)}...
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
