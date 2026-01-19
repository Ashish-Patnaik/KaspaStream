import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

if (!API_KEY) {
  console.warn('⚠️ VITE_OPENROUTER_API_KEY not set. AI features will use mock data.');
}

export interface ParsedTask {
  title: string;
  description: string;
  reward: number;
  estimatedTime?: string;
  requirements?: string[];
}

export interface VerificationResult {
  score: number;
  feedback: string;
  approved: boolean;
}

/**
 * Helper to call OpenRouter API with JSON enforcement
 */
async function callOpenRouter(messages: any[]) {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        // "google/gemini-2.0-flash-exp:free" is currently free and supports Vision (Images)
        // You can also use "openai/gpt-4o" if you have credits
        model: "google/gemini-2.0-flash-exp:free", 
        messages: messages,
        temperature: 0.2,
        response_format: { type: "json_object" } 
      },
      {
        headers: {
          "Authorization": `Bearer ${API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:5173", // Required by OpenRouter
          "X-Title": "KaspaStream Worker"
        }
      }
    );
    
    const content = response.data.choices[0].message.content;
    
    // Clean up markdown code blocks if the AI adds them (e.g. ```json ... ```)
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      throw new Error("Failed to parse JSON from AI response");
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error("OpenRouter API Error:", error);
    throw error;
  }
}

/**
 * Parse natural language input (Text Only)
 */
export async function parseTaskWithAI(naturalInput: string): Promise<ParsedTask> {
  if (!API_KEY) return mockParseTask(naturalInput);

  try {
    const prompt = `You are a task extractor. Extract task data from the user input.
    
    User Input: "${naturalInput}"
    
    Respond with ONLY valid JSON using this schema:
    { 
      "title": "string (max 50 chars)", 
      "description": "string", 
      "reward": number (default 0.5 if not found), 
      "estimatedTime": "string", 
      "requirements": ["string"] 
    }`;

    const parsed = await callOpenRouter([
      { role: "system", content: "You are a helpful assistant that outputs raw JSON." },
      { role: "user", content: prompt }
    ]);

    return {
      title: parsed?.title || naturalInput.substring(0, 50),
      description: parsed?.description || naturalInput,
      reward: parsed?.reward || 0.5,
      estimatedTime: parsed?.estimatedTime || "5-10 min",
      requirements: parsed?.requirements || []
    };
  } catch (e) {
    console.error("Parse Error", e);
    return mockParseTask(naturalInput);
  }
}

/**
 * Verify task submission with OPTIONAL IMAGE (Vision)
 */
export async function verifyTaskWithAI(
  taskDescription: string,
  submissionData: string,
  base64Image?: string | null
): Promise<VerificationResult> {
  if (!API_KEY) return mockVerifyTask();

  try {
    const promptText = `
    Task Requirements: ${taskDescription}
    
    Worker Submission Notes: ${submissionData}
    
    ${base64Image ? "NOTE: An image proof has been provided." : "NOTE: No image proof provided."}
    
    Evaluate if this task is completed satisfactorily.
    Respond with ONLY valid JSON: 
    { 
      "score": number (0-100), 
      "feedback": "short explanation", 
      "approved": boolean (true if score >= 90) 
    }`;

    const contentPayload: any[] = [
      { type: "text", text: promptText }
    ];

    // If image exists, add it to payload in the standard OpenRouter/OpenAI vision format
    if (base64Image) {
      contentPayload.push({
        type: "image_url",
        image_url: {
          url: base64Image // Must be a data URI (data:image/jpeg;base64,...)
        }
      });
    }

    const parsed = await callOpenRouter([
      { role: "system", content: "You are a strict QA auditor. Analyze text and images." },
      { role: "user", content: contentPayload }
    ]);

    return {
      score: parsed?.score || 0,
      feedback: parsed?.feedback || "Verification processed",
      approved: parsed?.approved || false
    };

  } catch (e) {
    console.error("Verification failed", e);
    return mockVerifyTask();
  }
}

// --- Mock Fallbacks (Used if API Key is missing or Error) ---
function mockParseTask(input: string): ParsedTask {
  const rewardMatch = input.match(/(\d+\.?\d*)\s*KAS/i);
  return { 
    title: input.slice(0, 30), 
    description: input, 
    reward: rewardMatch ? parseFloat(rewardMatch[1]) : 0.5, 
    estimatedTime: "5m", 
    requirements: ["Manual Check"] 
  };
}

function mockVerifyTask(): VerificationResult {
  return { 
    score: 95, 
    feedback: "Mock verification passed (API Key missing or Error)", 
    approved: true 
  };
}