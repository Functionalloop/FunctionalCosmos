'use client';
import { useState, useEffect } from 'react';
import { api } from '../../utils/api';

const ENDPOINTS = [
  { name: 'Projects', get: api.getProjects, path: '/projects' },
  { name: 'Tech Stack', get: api.getTechStack, path: '/tech-stack' },
  { name: 'Academics', get: api.getAcademics, path: '/academics' },
  { name: 'Socials', get: api.getSocials, path: '/socials' },
  { name: 'Resume Experience', get: api.getResumeExperience, path: '/resume/experience' },
  { name: 'Resume Skills', get: api.getResumeSkills, path: '/resume/skills' },
  { name: 'Resume Education', get: api.getResumeEducation, path: '/resume/education' },
  { name: 'Resume Certifications', get: api.getResumeCertifications, path: '/resume/certifications' },
];

export default function AdminDashboard({ password }: { password: string }) {
  const [activeTab, setActiveTab] = useState(ENDPOINTS[0]);
  const [data, setData] = useState<any[]>([]);
  const [editingItem, setEditingItem] = useState<any | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await activeTab.get();
      setData(res as any[]);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const method = isCreating ? 'POST' : 'PUT';
    const url = isCreating ? `${API_BASE_URL}${activeTab.path}` : `${API_BASE_URL}${activeTab.path}/${editingItem.id}`;
    
    try {
      // Remove id before sending for create
      const payload = { ...editingItem };
      if (isCreating) delete payload.id;

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': password
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        throw new Error('Failed to save');
      }
      await fetchData();
      setEditingItem(null);
      setIsCreating(false);
    } catch(err) {
      console.error(err);
      alert('Error saving data. Check console.');
    }
    setLoading(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this?')) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}${activeTab.path}/${id}`, {
        method: 'DELETE',
        headers: {
          'x-admin-password': password
        }
      });
      if (!res.ok) throw new Error('Failed to delete');
      await fetchData();
    } catch(err) {
      console.error(err);
      alert('Error deleting data.');
    }
    setLoading(false);
  };

  const startCreate = () => {
    // Generate a default empty object based on the first item's keys if available
    const template: any = {};
    if (data.length > 0) {
      Object.keys(data[0]).forEach(key => {
        if (key !== 'id') {
          template[key] = typeof data[0][key] === 'number' ? 0 : '';
        }
      });
    } else {
      // Fallback empty object, user will have to type carefully
      template['title_or_name'] = '';
    }
    setEditingItem(template);
    setIsCreating(true);
  };

  return (
    <div className="flex h-screen bg-[#02080c] text-[#fed7aa] font-mono overflow-hidden">
      {/* Sidebar */}
      <div className="w-64 border-r border-teal-900/50 bg-[#040f16] flex flex-col">
        <div className="p-4 border-b border-teal-900/50">
          <h1 className="text-xl font-cinzel text-teal-400 uppercase tracking-widest font-bold">Admin Console</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {ENDPOINTS.map((ep) => (
            <button
              key={ep.name}
              onClick={() => { setActiveTab(ep); setEditingItem(null); setIsCreating(false); }}
              className={`w-full text-left px-4 py-3 text-sm transition-colors ${
                activeTab.name === ep.name 
                  ? 'bg-teal-900/40 text-teal-300 border-l-4 border-teal-500' 
                  : 'hover:bg-teal-900/20 text-gray-400 hover:text-[#fed7aa] border-l-4 border-transparent'
              }`}
            >
              {ep.name}
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-teal-900/50 text-xs text-teal-700">
          SECURE UPLINK ACTIVE
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="p-6 border-b border-teal-900/50 flex justify-between items-center bg-[#02080c] shadow-md z-10">
          <h2 className="text-2xl font-cormorant text-[#fed7aa] tracking-wider uppercase">{activeTab.name}</h2>
          <button 
            onClick={startCreate}
            className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-[#02080c] rounded text-sm font-bold uppercase transition-colors"
          >
            + Create New
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 relative">
          {loading && (
            <div className="absolute inset-0 bg-[#02080c]/50 flex items-center justify-center z-20">
              <div className="text-teal-400 animate-pulse">Processing...</div>
            </div>
          )}

          {editingItem ? (
            <form onSubmit={handleSave} className="bg-[#040f16] p-6 rounded border border-teal-900 shadow-xl max-w-4xl mx-auto">
              <h3 className="text-xl mb-4 text-teal-400 border-b border-teal-900 pb-2">
                {isCreating ? 'Create' : 'Edit'} Record
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.keys(editingItem).filter(k => k !== 'id').map(key => (
                  <div key={key} className={key === 'description' || key === 'content' ? 'col-span-1 md:col-span-2' : ''}>
                    <label className="block text-xs uppercase text-teal-600 mb-1">{key}</label>
                    {key === 'description' || key === 'content' ? (
                      <textarea
                        value={editingItem[key] || ''}
                        onChange={(e) => setEditingItem({ ...editingItem, [key]: e.target.value })}
                        className="w-full bg-[#02080c] border border-teal-800 rounded p-2 text-[#fed7aa] focus:border-teal-400 focus:outline-none min-h-[100px]"
                      />
                    ) : (
                      <input
                        type={typeof editingItem[key] === 'number' ? 'number' : 'text'}
                        value={editingItem[key] || ''}
                        onChange={(e) => {
                          const val = e.target.type === 'number' ? parseFloat(e.target.value) || 0 : e.target.value;
                          setEditingItem({ ...editingItem, [key]: val });
                        }}
                        className="w-full bg-[#02080c] border border-teal-800 rounded p-2 text-[#fed7aa] focus:border-teal-400 focus:outline-none"
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-teal-800 text-teal-400 hover:bg-teal-900/30 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-[#02080c] hover:bg-teal-500 rounded font-bold"
                >
                  Save Changes
                </button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {data.map((item, idx) => (
                <div key={idx} className="bg-[#040f16] border border-teal-900/40 p-4 rounded flex justify-between items-center hover:border-teal-700 transition-colors">
                  <div className="flex-1 min-w-0 pr-4">
                    <h4 className="text-lg font-bold text-teal-300 truncate">
                      {item.title || item.name || item.institution || item.company || item.platform || item.degree || `Item #${item.id}`}
                    </h4>
                    <p className="text-sm text-gray-500 truncate">
                      {item.description || item.category || item.slug || item.role || item.period}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => { setEditingItem({ ...item }); setIsCreating(false); }}
                      className="px-3 py-1 bg-teal-900/50 hover:bg-teal-800 border border-teal-700 text-teal-300 rounded text-xs transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleDelete(item.id)}
                      className="px-3 py-1 bg-red-900/30 hover:bg-red-800/80 border border-red-800 text-red-300 rounded text-xs transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
              {data.length === 0 && (
                <div className="text-center p-12 border border-dashed border-teal-900/50 text-teal-700 rounded">
                  No records found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
