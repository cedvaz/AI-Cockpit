
import { GoogleGenAI, Type } from "@google/genai";
import { Deal, Account, Interaction, Message, TaskType, TaskPriority } from '../types.ts';

// Initializing the AI client with the environment key
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const enrichLeadAI = async (input: string) => {
  const prompt = `
    ACT AS A SALES OPS INTELLIGENCE AGENT.
    Target Input: "${input}"
    
    Task: Extract or infer company details for a new CRM lead. 
    If it's a URL, use it. If it's a name, guess the likely domain.
    
    Provide a JSON response:
    - name: Clean Company Name
    - domain: Official website domain
    - industry: Standard industry category
    - painPoint: One sentence hypothesis on why they need AI Ops (based on industry trends).
    - valueEstimate: A realistic project value in EUR (number only) for an AI Audit.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          domain: { type: Type.STRING },
          industry: { type: Type.STRING },
          painPoint: { type: Type.STRING },
          valueEstimate: { type: Type.NUMBER }
        },
        required: ['name', 'domain', 'industry', 'painPoint', 'valueEstimate']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeMessageAI = async (message: Message, deal?: Deal, account?: Account) => {
  const prompt = `
    ACT AS AN EXECUTIVE ASSISTANT.
    Analyze this email and provide intelligence.
    
    Sender: ${message.sender}
    Subject: ${message.subject}
    Body: ${message.body}
    Context: ${deal ? `Associated with Deal: ${deal.name} for ${account?.name}` : 'No specific deal context'}

    Task:
    1. Write a high-quality "Response Draft" (German).
    2. Extract a list of "Suggested Tasks" from the email. Each task needs:
       - title: Clear, actionable title.
       - type: Either 'Sales', 'Delivery', or 'Admin'.
       - priority: 'P0', 'P1', 'P2', or 'P3'.
       - minutes: Estimated time to complete.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          draftResponse: { type: Type.STRING },
          suggestedTasks: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['Sales', 'Delivery', 'Admin'] },
                priority: { type: Type.STRING, enum: ['P0', 'P1', 'P2', 'P3'] },
                estimatedMinutes: { type: Type.NUMBER }
              },
              required: ['title', 'type', 'priority', 'estimatedMinutes']
            }
          }
        },
        required: ['draftResponse', 'suggestedTasks']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const prepareCallAI = async (deal: Deal, account: Account, interactions: Interaction[], depth: 'Quick' | 'Standard' | 'Deep') => {
  const prompt = `
    ACT AS A WORLD-CLASS SALES ENGINEER.
    Task: Prepare an ultra-high-performance sales briefing for a high-ticket AI deal.
    Context:
    - Company: ${account.name} (Industry: ${account.industry}, Domain: ${account.domain})
    - Deal: ${deal.name} (Current Stage: ${deal.stage})
    - History: ${interactions.map(i => i.content).join(' | ')}
    - Analysis Depth: ${depth}

    Provide a JSON response with:
    - snapshot: 1-2 sentences of killer industry context.
    - hypotheses: 3 bold claims on how AI will save them money or generate revenue.
    - risks: Potential technical or political roadblocks.
    - briefing: goal, a tight agenda, and 5 "discovery" questions.
    - followUpDraft: A direct, high-status follow-up email.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          snapshot: { type: Type.STRING },
          hypotheses: { type: Type.ARRAY, items: { type: Type.STRING } },
          risks: { type: Type.ARRAY, items: { type: Type.STRING } },
          briefing: {
            type: Type.OBJECT,
            properties: {
              goal: { type: Type.STRING },
              agenda: { type: Type.ARRAY, items: { type: Type.STRING } },
              keyQuestions: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ['goal', 'agenda', 'keyQuestions']
          },
          followUpDraft: { type: Type.STRING }
        },
        required: ['snapshot', 'hypotheses', 'risks', 'briefing', 'followUpDraft']
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const generateOutreachAI = async (deal: Deal, account: Account, tone: string) => {
  const prompt = `
    Generate a highly personalized LinkedIn outreach message.
    Target: Decision maker at ${account.name}.
    Topic: ${deal.name}.
    Tone: ${tone}.
    Style: No fluff. Max 3 sentences.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          message: { type: Type.STRING }
        }
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
