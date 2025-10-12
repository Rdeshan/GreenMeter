import { GoogleGenerativeAI } from '@google/generative-ai'
import dotenv from 'dotenv'
dotenv.config()
import * as constants from '../constants/index'

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export default async function AiGenerate (key: string, aiReqData: any) {
  const model = ai.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = makePrompt(key, aiReqData)

  const aiResult = await model.generateContent(prompt)

  const text =
    aiResult?.response?.candidates?.[0]?.content?.parts?.[0]?.text || ''

  let response = cleanResponse(text)
  const parsed = JSON.parse(response)

  const result = {
    recommendations: parsed?.recommendations || '',
    summary: parsed?.summary || ''
  }

  return result
}

const makePrompt = (key: string, aiReqData: any): string => {
  const prompt = constants.prompts.find(p => p.key === key)?.prompt || null

  return `
    Role: ${prompt?.role}
    Context: ${prompt?.context}
    Task: ${prompt?.task}
    Input Data: ${JSON.stringify(aiReqData, null, 2)}
    Output Format: ${prompt?.outputFormat}
    Style : ${prompt?.style}
  `
}

const cleanResponse = (text: string) => {
  const cleanText = text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .replace(/^[\s\n]+|[\s\n]+$/g, '')

  return cleanText
}