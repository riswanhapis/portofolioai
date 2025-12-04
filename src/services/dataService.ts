import { supabase, isSupabaseConfigured } from './supabaseClient';

export interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack: string[];
  demo_url: string;
  repo_url: string;
  image_url: string;
  category: string;
}

export interface Certificate {
  id: number;
  name: string;
  issuer: string;
  date: string;
  credential_url: string;
  image_url: string;
}

const MOCK_PROJECTS: Project[] = [
  {
    id: 1,
    title: 'E-Commerce Dashboard',
    description: 'A comprehensive dashboard for managing online stores, featuring real-time analytics and inventory management.',
    tech_stack: ['React', 'TypeScript', 'Tailwind', 'Supabase'],
    demo_url: '#',
    repo_url: '#',
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    category: 'Web App'
  },
  {
    id: 2,
    title: 'Network Security Scanner',
    description: 'A python-based tool for scanning network vulnerabilities and generating detailed reports.',
    tech_stack: ['Python', 'Flask', 'Docker'],
    demo_url: '#',
    repo_url: '#',
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    category: 'Security'
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'Modern personal portfolio with dark theme and smooth animations.',
    tech_stack: ['React', 'GSAP', 'Tailwind'],
    demo_url: '#',
    repo_url: '#',
    image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80',
    category: 'Web App'
  }
];

const MOCK_CERTIFICATES: Certificate[] = [
  {
    id: 1,
    name: 'Certified Ethical Hacker (CEH)',
    issuer: 'EC-Council',
    date: '2024',
    credential_url: '#',
    image_url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    name: 'Google Cybersecurity Professional',
    issuer: 'Google',
    date: '2023',
    credential_url: '#',
    image_url: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    name: 'Meta Frontend Developer',
    issuer: 'Meta',
    date: '2023',
    credential_url: '#',
    image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80'
  }
];

export const getProjects = async (): Promise<Project[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, returning mock data');
    return MOCK_PROJECTS;
  }

  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching projects:', error);
    return MOCK_PROJECTS;
  }

  return data || [];
};

export const getCertificates = async (): Promise<Certificate[]> => {
  if (!isSupabaseConfigured()) {
    return MOCK_CERTIFICATES;
  }

  const { data, error } = await supabase
    .from('certificates')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching certificates:', error);
    return MOCK_CERTIFICATES;
  }

  return data || [];
};

// --- CRUD Operations for Projects ---

export const addProject = async (project: Omit<Project, 'id'>) => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('projects').insert([project]).select();
  if (error) throw error;
  return data?.[0];
};

export const updateProject = async (id: number, updates: Partial<Project>) => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('projects').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
};

export const deleteProject = async (id: number) => {
  if (!isSupabaseConfigured()) return null;
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
};

// --- CRUD Operations for Certificates ---

export const addCertificate = async (cert: Omit<Certificate, 'id'>) => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('certificates').insert([cert]).select();
  if (error) throw error;
  return data?.[0];
};

export const updateCertificate = async (id: number, updates: Partial<Certificate>) => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('certificates').update(updates).eq('id', id).select();
  if (error) throw error;
  return data?.[0];
};

export const deleteCertificate = async (id: number) => {
  if (!isSupabaseConfigured()) return null;
  const { error } = await supabase.from('certificates').delete().eq('id', id);
  if (error) throw error;
};

// --- Storage Operations ---

export const uploadImage = async (file: File): Promise<string | null> => {
  if (!isSupabaseConfigured()) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('portfolio-images')
    .upload(filePath, file);

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage
    .from('portfolio-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
};

// --- Site Settings Operations ---

export interface SiteSettings {
  id: number;
  maintenance_mode: boolean;
  site_title: string;
  contact_email: string;
  about_description: string;
  skills: string[];
  hero_image_url?: string;
}

export interface Message {
  id: number;
  created_at: string;
  name: string;
  email: string;
  message: string;
  is_read: boolean;
}

export const getSiteSettings = async (): Promise<SiteSettings | null> => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('site_settings').select('*').single();
  if (error) {
    console.error('Error fetching settings:', error);
    return null;
  }
  return data;
};

export const updateSiteSettings = async (updates: Partial<SiteSettings>) => {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await supabase.from('site_settings').update(updates).eq('id', 1).select();
  if (error) throw error;
  return data?.[0];
};

// --- Message Operations ---

export const getMessages = async (): Promise<Message[]> => {
  if (!isSupabaseConfigured()) return [];
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
  return data || [];
};

export const deleteMessage = async (id: number) => {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.from('messages').delete().eq('id', id);
  if (error) throw error;
};

export const sendMessage = async (msg: Omit<Message, 'id' | 'created_at' | 'is_read'>) => {
  if (!isSupabaseConfigured()) return;
  const { error } = await supabase.from('messages').insert([msg]);
  if (error) throw error;
};
