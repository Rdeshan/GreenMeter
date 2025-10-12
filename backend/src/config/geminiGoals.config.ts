import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
import * as constants from '../constants/indexGoals'; 

dotenv.config()

// Initialize Gemini client
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

/**
 * AiGenerate
 * @param key - the prompt key (e.g., "consumption_recommendation" or "overall_recommend")
 * @param aiReqData - input data for Gemini
 * @returns AI-generated recommendations + summary
 */
export default async function AiGenerate(key: string, aiReqData: any) {
  try {
    const model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' })

    const prompt = makePrompt(key, aiReqData)
    const aiResult = await model.generateContent(prompt)

    const text =
      aiResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text || ''

    const response = cleanResponse(text)

    let parsed: any = {}
    try {
      parsed = JSON.parse(response)
    } catch (e) {
      console.error('AI parsing error:', e, response)
    }

    return {
      title: parsed?.title || 'AI Suggested Goal',
      priority: parsed?.priority || 'Medium',
      timeFrequency: parsed?.timeFrequency || 'Daily',
      time: parsed?.time || '21:00',
      recommendations: parsed?.recommendations || {
        tips: [],
        improvements: [],
        warnings: [],
      },
      summary: parsed?.summary || '',
      estimated_kWh: parsed?.estimated_kWh || null,
      device_name: parsed?.device_name || '',
    }
  } catch (error) {
    console.error('❌ AI generation failed:', error)
    return {
      title: 'AI Suggested Goal',
      priority: 'Medium',
      timeFrequency: 'Daily',
      time: '21:00',
      recommendations: {
        tips: ['Unable to generate AI suggestions right now.'],
        improvements: [],
        warnings: [],
      },
      summary: 'AI generation failed. Please try again later.',
    }
  }
}


/**
 * Helper: Combine prompt metadata + input data into one string
 */
const makePrompt = (key: string, aiReqData: any): string => {
  const prompt = constants.prompts.find((p) => p.key === key)?.prompt || null

  return `
Role:
${prompt?.role}

Context:
${prompt?.context}

Task:
${prompt?.task}

Input Data:
${JSON.stringify(aiReqData, null, 2)}

Output Format:
${prompt?.outputFormat}

Style:
${prompt?.style}
  `
}

/**
 * Helper: Clean Gemini response text
 */
const cleanResponse = (text: string) => {
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/^[\s\n]+|[\s\n]+$/g, '')
}