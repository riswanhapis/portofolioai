import { GoogleGenerativeAI } from '@google/generative-ai';
import { getProjects, getCertificates, getSiteSettings } from './dataService';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
let model: any = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  const modelName = 'gemini-flash-latest';
  console.log('Initializing AI with model:', modelName);
  model = genAI.getGenerativeModel({ model: modelName });
}

export const sendMessageToAI = async (userMessage: string, history: { role: string; parts: string }[]) => {
  if (!model) {
    if (!API_KEY) {
      return "I'm sorry, but I haven't been configured with an API key yet. Please contact the administrator.";
    }
    return "AI service is currently unavailable.";
  }

  try {
    // Fetch context data
    const [projects, certificates, settings] = await Promise.all([
      getProjects(),
      getCertificates(),
      getSiteSettings()
    ]);

    const context = `
      You are a helpful AI assistant for a portfolio website.
      Here is the information about the portfolio owner:
      
      Name: Rizki Okan Saputra (or as defined in settings)
      Title: ${settings?.site_title || 'Web Developer'}
      About: ${settings?.about_description || 'Passionate developer.'}
      Skills: ${settings?.skills?.join(', ') || 'Web Development'}
      
      Projects:
      ${projects.map(p => `- ${p.title} (${p.category}): ${p.description}. Tech: ${p.tech_stack.join(', ')}`).join('\n')}
      
      Certificates:
      ${certificates.map(c => `- ${c.name} from ${c.issuer} (${c.date})`).join('\n')}
      
      Contact Email: ${settings?.contact_email}
      
      Instructions:
      - Answer questions based on this information.
      - Be polite, professional, and concise.
      - If you don't know the answer, say you don't have that information.
      - Speak in the language the user uses (Indonesian or English).
    `;

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: context }],
        },
        {
          role: 'model',
          parts: [{ text: "Understood. I am ready to answer questions about the portfolio owner." }],
        },
        ...history.map(h => ({
          role: h.role === 'ai' ? 'model' : 'user',
          parts: [{ text: h.parts }]
        }))
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text();
  } catch (error: any) {
    console.error('Error sending message to AI:', error);
    // Return the actual error message for debugging
    return `Error: ${error.message || 'Unknown error occurred'}. Please check the console for more details.`;
  }
};
