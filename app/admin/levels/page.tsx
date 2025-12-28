'use client';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function AdminLevelsPage() {
  const searchParams = useSearchParams();
  const [levels, setLevels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    id: '', name: '', description: '', unlockCode: '', sequence: 0, narrative: ''
  });
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setShowForm(true);
    }
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/admin/levels')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setLevels(data);
        setLoading(false);
      })
      .catch(err => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editMode ? '/api/admin/levels' : '/api/admin/levels';
    const method = editMode ? 'PUT' : 'POST'; // Assuming PUT logic is added to API or POST handles upsert

    const res = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      const savedLevel = await res.json();
      if (editMode) {
        setLevels(levels.map(l => l.id === savedLevel.id ? savedLevel : l).sort((a, b) => a.sequence - b.sequence));
      } else {
        setLevels([...levels, savedLevel].sort((a, b) => a.sequence - b.sequence));
      }
      setShowForm(false);
      setEditMode(false);
      setFormData({ id: '', name: '', description: '', unlockCode: '', sequence: levels.length + 1, narrative: '' });
    } else {
      alert('Failed to save level');
    }
  };

  const handleEdit = (level: any) => {
    setFormData({
      id: level.id,
      name: level.name,
      description: level.description || '',
      unlockCode: level.unlockCode,
      sequence: level.sequence,
      narrative: level.narrative
    });
    setEditMode(true);
    setShowForm(true);
  };

  if (loading) return <div className="text-green-500 animate-pulse">Loading protocols...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-green-400">Mission Protocols (Levels)</h1>
        <button 
          onClick={() => { setShowForm(!showForm); setEditMode(false); setFormData({ id: '', name: '', description: '', unlockCode: '', sequence: levels.length + 1, narrative: '' }); }}
          className="bg-green-700 hover:bg-green-600 text-white px-4 py-2 rounded font-mono border border-green-500"
        >
          {showForm ? '[ CANCEL ]' : '[ INITIALIZE NEW PROTOCOL ]'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 border border-green-600 p-6 rounded bg-green-900/10 backdrop-blur-md">
          <h2 className="text-xl mb-4 text-green-300 font-mono">{editMode ? 'Edit Level Configuration' : 'New Level Configuration'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-green-500 mb-1">LEVEL ID (UNIQUE)</label>
              <input 
                placeholder="e.g. omega-protocol" 
                value={formData.id}
                onChange={e => setFormData({...formData, id: e.target.value})}
                className="w-full bg-black border border-green-800 p-2 text-green-400 focus:border-green-400 outline-none"
                required
                disabled={editMode}
              />
            </div>
            <div>
              <label className="block text-xs text-green-500 mb-1">DISPLAY NAME</label>
              <input 
                placeholder="e.g. Operation Omega" 
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-black border border-green-800 p-2 text-green-400 focus:border-green-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-green-500 mb-1">UNLOCK CODE</label>
              <input 
                placeholder="Password to unlock" 
                value={formData.unlockCode}
                onChange={e => setFormData({...formData, unlockCode: e.target.value})}
                className="w-full bg-black border border-green-800 p-2 text-green-400 focus:border-green-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs text-green-500 mb-1">SEQUENCE ORDER</label>
              <input 
                type="number"
                placeholder="0" 
                value={formData.sequence}
                onChange={e => setFormData({...formData, sequence: parseInt(e.target.value)})}
                className="w-full bg-black border border-green-800 p-2 text-green-400 focus:border-green-400 outline-none"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs text-green-500 mb-1">BRIEF DESCRIPTION</label>
              <textarea 
                placeholder="Short summary for the level list..." 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-black border border-green-800 p-2 text-green-400 focus:border-green-400 outline-none h-20"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <label className="block text-xs text-green-500 mb-1">NARRATIVE / BRIEFING</label>
              <textarea 
                placeholder="Full mission text..." 
                value={formData.narrative}
                onChange={e => setFormData({...formData, narrative: e.target.value})}
                className="w-full bg-black border border-green-800 p-2 text-green-400 focus:border-green-400 outline-none h-32 font-mono text-sm"
              />
            </div>
          </div>
          <button type="submit" className="mt-6 bg-green-600 text-black font-bold px-6 py-3 rounded hover:bg-green-500 w-full md:w-auto">
            {editMode ? 'UPDATE PROTOCOL' : 'DEPLOY LEVEL PROTOCOLS'}
          </button>
        </form>
      )}
      
      <div className="space-y-4">
        {levels.length === 0 ? (
          <div className="text-gray-500 italic p-4 border border-gray-800 rounded">No active protocols found. Database is empty.</div>
        ) : (
          levels.map(level => (
            <div key={level.id} className="border border-green-900 p-4 rounded bg-black/40 flex flex-col md:flex-row justify-between items-start md:items-center hover:border-green-600 transition-colors group">
              <div className="mb-2 md:mb-0">
                <div className="text-lg font-bold text-green-300 flex items-center gap-2">
                  <span className="text-green-600 text-sm font-mono">#{level.sequence}</span>
                  {level.name} 
                  <span className="text-xs text-gray-500 font-mono bg-gray-900 px-2 py-1 rounded border border-gray-800 group-hover:border-green-800">{level.id}</span>
                </div>
                <div className="text-gray-400 text-sm mt-1">{level.description || 'No description provided.'}</div>
              </div>
              <div className="flex items-center gap-4">
                <div className="font-mono text-yellow-600 text-sm border border-yellow-900/30 bg-yellow-900/10 px-3 py-1 rounded">
                  KEY: {level.unlockCode}
                </div>
                <button 
                  onClick={() => handleEdit(level)}
                  className="text-blue-400 hover:text-blue-300 text-sm font-mono border border-blue-900 px-2 py-1 rounded hover:bg-blue-900/20"
                >
                  [EDIT]
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
