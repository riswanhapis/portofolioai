import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { useNavigate } from 'react-router-dom';
import { LogOut, Plus, Trash2, Edit, LayoutGrid, Award, Upload, Settings as SettingsIcon, Mail, User } from 'lucide-react';
import { 
  getProjects, getCertificates, getSiteSettings, getMessages,
  addProject, updateProject, deleteProject,
  addCertificate, updateCertificate, deleteCertificate,
  updateSiteSettings, deleteMessage,
  uploadImage,
} from '../services/dataService';
import type { Project, Certificate, SiteSettings, Message } from '../services/dataService';
import Modal from '../components/ui/Modal';

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'projects' | 'certificates' | 'messages' | 'settings'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<any>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const pData = await getProjects();
    const cData = await getCertificates();
    const sData = await getSiteSettings();
    const mData = await getMessages();
    setProjects(pData);
    setCertificates(cData);
    setSettings(sData);
    setMessages(mData);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const openModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setFormData({ ...item });
    } else {
      setEditingId(null);
      setFormData(activeTab === 'projects' ? {
        title: '', description: '', tech_stack: [], demo_url: '', repo_url: '', image_url: '', category: 'Web App'
      } : {
        name: '', issuer: '', date: '', credential_url: '', image_url: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    setUploading(true);
    const file = e.target.files[0];
    try {
      const publicUrl = await uploadImage(file);
      if (publicUrl) {
        setFormData({ ...formData, image_url: publicUrl });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        const data = { ...formData, tech_stack: Array.isArray(formData.tech_stack) ? formData.tech_stack : formData.tech_stack.split(',').map((s: string) => s.trim()) };
        if (editingId) {
          await updateProject(editingId, data);
        } else {
          await addProject(data);
        }
      } else {
        if (editingId) {
          await updateCertificate(editingId, formData);
        } else {
          await addCertificate(formData);
        }
      }
      await fetchData();
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save. Check console.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure?')) return;
    setLoading(true);
    try {
      if (activeTab === 'projects') {
        await deleteProject(id);
      } else if (activeTab === 'certificates') {
        await deleteCertificate(id);
      } else if (activeTab === 'messages') {
        await deleteMessage(id);
      }
      await fetchData();
    } catch (error) {
      console.error('Error deleting:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white flex">
      {/* Sidebar */}
      <aside className="w-64 bg-dark-lighter border-r border-gray-800 p-6 flex flex-col fixed h-full">
        <h1 className="text-2xl font-bold mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Admin Panel
        </h1>
        
        <nav className="flex-1 space-y-2">
          <button 
            onClick={() => setActiveTab('projects')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'projects' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <LayoutGrid size={20} />
            Projects
          </button>
          <button 
            onClick={() => setActiveTab('certificates')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'certificates' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Award size={20} />
            Certificates
          </button>
          <button 
            onClick={() => setActiveTab('messages')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'messages' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <Mail size={20} />
            Messages
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === 'settings' ? 'bg-primary/10 text-primary' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            <SettingsIcon size={20} />
            Settings
          </button>
        </nav>

        <button 
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-auto"
        >
          <LogOut size={20} />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 ml-64">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold capitalize">{activeTab} Management</h2>
          {(activeTab === 'projects' || activeTab === 'certificates') && (
            <button 
              onClick={() => openModal()}
              className="px-6 py-2 bg-primary text-dark font-bold rounded-lg hover:bg-white transition-colors flex items-center gap-2"
            >
              <Plus size={20} />
              Add New
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid gap-6">
            {activeTab === 'projects' ? (
              projects.map(project => (
                <div key={project.id} className="bg-dark-lighter p-6 rounded-xl border border-gray-800 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <img src={project.image_url} alt={project.title} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-bold text-lg">{project.title}</h3>
                      <span className="text-xs text-primary bg-primary/10 px-2 py-1 rounded">{project.category}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(project)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(project.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : activeTab === 'certificates' ? (
              certificates.map(cert => (
                <div key={cert.id} className="bg-dark-lighter p-6 rounded-xl border border-gray-800 flex justify-between items-center">
                  <div className="flex gap-4 items-center">
                    <img src={cert.image_url} alt={cert.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div>
                      <h3 className="font-bold text-lg">{cert.name}</h3>
                      <p className="text-sm text-gray-400">{cert.issuer} • {cert.date}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openModal(cert)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors">
                      <Edit size={18} />
                    </button>
                    <button onClick={() => handleDelete(cert.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))
            ) : activeTab === 'messages' ? (
              messages.length === 0 ? (
                <p className="text-gray-400 text-center py-10">No messages yet.</p>
              ) : (
                messages.map(msg => (
                  <div key={msg.id} className="bg-dark-lighter p-6 rounded-xl border border-gray-800">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="font-bold text-lg">{msg.name}</h3>
                        <p className="text-sm text-primary">{msg.email}</p>
                        <p className="text-xs text-gray-500 mt-1">{new Date(msg.created_at).toLocaleString()}</p>
                      </div>
                      <button onClick={() => handleDelete(msg.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                    <p className="text-gray-300 bg-dark p-4 rounded-lg">{msg.message}</p>
                  </div>
                ))
              )
            ) : (
              <div className="bg-dark-lighter p-8 rounded-xl border border-gray-800 max-w-2xl">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <SettingsIcon size={24} className="text-primary" />
                  System Settings
                </h3>
                
                <div className="space-y-8">
                  {/* Maintenance Mode */}
                  <div className="flex items-center justify-between p-4 bg-dark rounded-lg border border-gray-700">
                    <div>
                      <h4 className="font-bold">Maintenance Mode</h4>
                      <p className="text-sm text-gray-400">Lock the public site for visitors</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={settings?.maintenance_mode || false}
                        onChange={async (e) => {
                          const newVal = e.target.checked;
                          setSettings(prev => prev ? { ...prev, maintenance_mode: newVal } : null);
                          await updateSiteSettings({ maintenance_mode: newVal });
                        }}
                      />
                      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  {/* Profile Settings */}
                  <div>
                    <h4 className="font-bold mb-4 flex items-center gap-2">
                      <User size={20} className="text-primary" />
                      Profile Information
                    </h4>
                    <div className="space-y-4">
                      {/* Hero Image Upload */}
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Hero Image (Home)</label>
                        <div className="flex gap-4 items-center">
                          <div className="w-24 h-24 bg-dark border border-gray-700 rounded-lg overflow-hidden flex items-center justify-center">
                            {settings?.hero_image_url ? (
                              <img src={settings.hero_image_url} alt="Hero" className="w-full h-full object-cover" />
                            ) : (
                              <User size={32} className="text-gray-600" />
                            )}
                          </div>
                          <div>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={async (e) => {
                                if (!e.target.files || e.target.files.length === 0) return;
                                setUploading(true);
                                try {
                                  const file = e.target.files[0];
                                  const publicUrl = await uploadImage(file);
                                  if (publicUrl) {
                                    setSettings(prev => prev ? { ...prev, hero_image_url: publicUrl } : null);
                                    await updateSiteSettings({ hero_image_url: publicUrl });
                                    alert('Hero image updated!');
                                  }
                                } catch (error) {
                                  console.error('Error uploading:', error);
                                  alert('Failed to upload image');
                                } finally {
                                  setUploading(false);
                                }
                              }}
                              className="hidden"
                              id="hero-image-upload"
                            />
                            <label 
                              htmlFor="hero-image-upload"
                              className="cursor-pointer px-4 py-2 bg-dark border border-gray-700 rounded hover:border-primary transition-colors flex items-center gap-2 text-sm"
                            >
                              <Upload size={16} />
                              {uploading ? 'Uploading...' : 'Change Image'}
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Site Title</label>
                        <input 
                          type="text" 
                          value={settings?.site_title || ''}
                          onChange={(e) => setSettings(prev => prev ? { ...prev, site_title: e.target.value } : null)}
                          className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">About Description</label>
                        <textarea 
                          value={settings?.about_description || ''}
                          onChange={(e) => setSettings(prev => prev ? { ...prev, about_description: e.target.value } : null)}
                          className="w-full bg-dark border border-gray-700 rounded p-2 text-white h-24"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-2">Skills (comma separated)</label>
                        <input 
                          type="text" 
                          value={Array.isArray(settings?.skills) ? settings?.skills.join(', ') : settings?.skills || ''}
                          onChange={(e) => setSettings(prev => prev ? { ...prev, skills: e.target.value.split(',').map(s => s.trim()) } : null)}
                          className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Contact Email</label>
                          <input 
                            type="email" 
                            value={settings?.contact_email || ''}
                            onChange={(e) => setSettings(prev => prev ? { ...prev, contact_email: e.target.value } : null)}
                            className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">Phone Number</label>
                          <input 
                            type="text" 
                            value={settings?.contact_phone || ''}
                            onChange={(e) => setSettings(prev => prev ? { ...prev, contact_phone: e.target.value } : null)}
                            className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm text-gray-400 mb-2">Address</label>
                          <input 
                            type="text" 
                            value={settings?.contact_address || ''}
                            onChange={(e) => setSettings(prev => prev ? { ...prev, contact_address: e.target.value } : null)}
                            className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">GitHub URL</label>
                          <input 
                            type="url" 
                            value={settings?.github_url || ''}
                            onChange={(e) => setSettings(prev => prev ? { ...prev, github_url: e.target.value } : null)}
                            className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-2">LinkedIn URL</label>
                          <input 
                            type="url" 
                            value={settings?.linkedin_url || ''}
                            onChange={(e) => setSettings(prev => prev ? { ...prev, linkedin_url: e.target.value } : null)}
                            className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
                          />
                        </div>
                      </div>

                      <button 
                        onClick={async () => {
                          if (settings) await updateSiteSettings({ 
                            site_title: settings.site_title,
                            about_description: settings.about_description,
                            skills: settings.skills,
                            contact_email: settings.contact_email,
                            contact_phone: settings.contact_phone,
                            contact_address: settings.contact_address,
                            github_url: settings.github_url,
                            linkedin_url: settings.linkedin_url
                          });
                          alert('Settings updated!');
                        }}
                        className="px-6 py-2 bg-primary text-dark font-bold rounded hover:bg-white transition-colors"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modal */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={`${editingId ? 'Edit' : 'Add'} ${activeTab === 'projects' ? 'Project' : 'Certificate'}`}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === 'projects' ? (
            <>
              <input 
                type="text" placeholder="Title" required 
                value={formData.title || ''} 
                onChange={e => setFormData({...formData, title: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
              />
              <textarea 
                placeholder="Description" required 
                value={formData.description || ''} 
                onChange={e => setFormData({...formData, description: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded p-2 text-white h-24"
              />
              <input 
                type="text" placeholder="Tech Stack (comma separated)" required 
                value={Array.isArray(formData.tech_stack) ? formData.tech_stack.join(', ') : formData.tech_stack || ''} 
                onChange={e => setFormData({...formData, tech_stack: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
              />
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Project Image</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="project-image-upload"
                  />
                  <label 
                    htmlFor="project-image-upload"
                    className="cursor-pointer px-4 py-2 bg-dark-lighter border border-gray-700 rounded hover:border-primary transition-colors flex items-center gap-2 text-sm"
                  >
                    <Upload size={16} />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                  {formData.image_url && (
                    <span className="text-xs text-green-400">Image uploaded!</span>
                  )}
                </div>
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 h-20 object-cover rounded" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input 
                  type="url" placeholder="Demo URL" 
                  value={formData.demo_url || ''} 
                  onChange={e => setFormData({...formData, demo_url: e.target.value})}
                  className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
                />
                <input 
                  type="url" placeholder="Repo URL" 
                  value={formData.repo_url || ''} 
                  onChange={e => setFormData({...formData, repo_url: e.target.value})}
                  className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
                />
              </div>
              <select 
                value={formData.category || 'Web App'} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
              >
                <option value="Web App">Web App</option>
                <option value="Security">Security</option>
                <option value="Mobile">Mobile</option>
              </select>
            </>
          ) : (
            <>
              <input 
                type="text" placeholder="Name" required 
                value={formData.name || ''} 
                onChange={e => setFormData({...formData, name: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
              />
              <input 
                type="text" placeholder="Issuer" required 
                value={formData.issuer || ''} 
                onChange={e => setFormData({...formData, issuer: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
              />
              <input 
                type="text" placeholder="Date (Year)" required 
                value={formData.date || ''} 
                onChange={e => setFormData({...formData, date: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
              />
              
              {/* Image Upload */}
              <div>
                <label className="block text-sm text-gray-400 mb-1">Certificate Image</label>
                <div className="flex gap-2 items-center">
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="cert-image-upload"
                  />
                  <label 
                    htmlFor="cert-image-upload"
                    className="cursor-pointer px-4 py-2 bg-dark-lighter border border-gray-700 rounded hover:border-primary transition-colors flex items-center gap-2 text-sm"
                  >
                    <Upload size={16} />
                    {uploading ? 'Uploading...' : 'Upload Image'}
                  </label>
                  {formData.image_url && (
                    <span className="text-xs text-green-400">Image uploaded!</span>
                  )}
                </div>
                {formData.image_url && (
                  <img src={formData.image_url} alt="Preview" className="mt-2 h-20 object-cover rounded" />
                )}
              </div>

              <input 
                type="url" placeholder="Credential URL" 
                value={formData.credential_url || ''} 
                onChange={e => setFormData({...formData, credential_url: e.target.value})}
                className="w-full bg-dark border border-gray-700 rounded p-2 text-white"
              />
            </>
          )}
          
          <button 
            type="submit" 
            disabled={uploading}
            className="w-full bg-primary text-dark font-bold py-3 rounded hover:bg-white transition-colors disabled:opacity-50"
          >
            {editingId ? 'Update' : 'Create'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
