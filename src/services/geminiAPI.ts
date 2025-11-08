import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

let genAI: GoogleGenerativeAI | null = null

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY)
} else {
  console.warn('Gemini API key not found. AI features will use mock data.')
}

export interface SVGShapeRequest {
  description: string
  width?: number
  height?: number
}

export interface SVGShapeResponse {
  svgPath: string
  fill: string
  stroke: string
  strokeWidth: number
}

/**
 * Generate SVG path using Gemini AI
 */
export async function generateSVGShape(request: SVGShapeRequest): Promise<SVGShapeResponse> {
  if (!genAI) {
    // Return mock data if no API key
    return generateMockSVGShape(request)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const prompt = `You are an SVG path generator. Generate a VALID SVG path for the following description.

Description: ${request.description}
Canvas size: ${request.width || 100}x${request.height || 100}

IMPORTANT RULES:
1. Return ONLY valid SVG path data (M, L, C, Q, A commands)
2. Path should fit within a viewBox of 0 0 ${request.width || 100} ${request.height || 100}
3. Use relative coordinates when possible
4. Keep the shape centered
5. Return ONLY the path data, no explanation

RESPONSE FORMAT (JSON):
{
  "svgPath": "M 10 10 L 90 10 L 90 90 L 10 90 Z",
  "fill": "#4A90E2",
  "stroke": "#2E5C8A",
  "strokeWidth": 2
}

Generate the SVG shape now:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        svgPath: parsed.svgPath || 'M 10 10 L 90 10 L 90 90 L 10 90 Z',
        fill: parsed.fill || '#4A90E2',
        stroke: parsed.stroke || '#2E5C8A',
        strokeWidth: parsed.strokeWidth || 2
      }
    }

    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('Gemini API error:', error)
    return generateMockSVGShape(request)
  }
}

/**
 * Generate diagram with nodes and edges using Gemini AI
 */
export async function generateDiagram(prompt: string): Promise<{
  nodes: Array<{
    id: string
    label: string
    category?: string
    position: { x: number; y: number }
    description?: string
    customShape?: SVGShapeResponse
  }>
  edges: Array<{
    id: string
    source: string
    target: string
    label?: string
  }>
}> {
  if (!genAI) {
    return generateMockDiagram(prompt)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })

    const aiPrompt = `You are a system architecture diagram generator. Create a diagram based on the user's request.

User request: ${prompt}

Generate a diagram with nodes and connections. Return ONLY valid JSON in this exact format:

{
  "nodes": [
    {
      "id": "1",
      "label": "Node Name",
      "category": "Language|Framework|Database|Tools|Custom",
      "position": { "x": 100, "y": 100 },
      "description": "Brief description"
    }
  ],
  "edges": [
    {
      "id": "e1",
      "source": "1",
      "target": "2",
      "label": "Connection description"
    }
  ]
}

Rules:
- Create 3-7 nodes
- Position nodes in a logical layout (left to right, top to bottom)
- Use standard tech names (React, Node.js, MongoDB, AWS, etc.)
- Add meaningful connections between related nodes
- Return ONLY the JSON, no explanation

Generate now:`

    const result = await model.generateContent(aiPrompt)
    const response = await result.response
    const text = response.text()

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return parsed
    }

    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('Gemini API error:', error)
    return generateMockDiagram(prompt)
  }
}

/**
 * Mock SVG shape generator (fallback)
 */
function generateMockSVGShape(_request: SVGShapeRequest): SVGShapeResponse {
  const shapes = [
    'M 50 10 L 90 30 L 90 70 L 50 90 L 10 70 L 10 30 Z', // Hexagon
    'M 10 50 L 30 10 L 70 10 L 90 50 L 70 90 L 30 90 Z', // Different hexagon
    'M 50 10 L 80 35 L 70 70 L 30 70 L 20 35 Z', // Pentagon
    'M 10 10 L 90 10 L 90 90 L 10 90 Z', // Square
    'M 50 10 L 90 40 L 75 90 L 25 90 L 10 40 Z' // Pentagon variant
  ]

  const colors = ['#4A90E2', '#E24A90', '#90E24A', '#E2904A', '#904AE2']

  const randomShape = (shapes[Math.floor(Math.random() * shapes.length)] || shapes[0]) as string
  const randomColor = (colors[Math.floor(Math.random() * colors.length)] || colors[0]) as string

  return {
    svgPath: randomShape,
    fill: randomColor,
    stroke: adjustColor(randomColor, -30),
    strokeWidth: 2
  }
}

/**
 * Mock diagram generator (fallback)
 */
function generateMockDiagram(_prompt: string): {
  nodes: any[]
  edges: any[]
} {
  return {
    nodes: [
      {
        id: '1',
        label: 'Frontend',
        category: 'Framework',
        position: { x: 100, y: 150 },
        description: 'User interface'
      },
      {
        id: '2',
        label: 'Backend',
        category: 'Language',
        position: { x: 400, y: 150 },
        description: 'Server logic'
      },
      {
        id: '3',
        label: 'Database',
        category: 'Database',
        position: { x: 700, y: 150 },
        description: 'Data storage'
      }
    ],
    edges: [
      {
        id: 'e1-2',
        source: '1',
        target: '2',
        label: 'API calls'
      },
      {
        id: 'e2-3',
        source: '2',
        target: '3',
        label: 'queries'
      }
    ]
  }
}

/**
 * Adjust color brightness
 */
function adjustColor(color: string, amount: number): string {
  const hex = color.replace('#', '')
  const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount))
  const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount))
  const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount))

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}
