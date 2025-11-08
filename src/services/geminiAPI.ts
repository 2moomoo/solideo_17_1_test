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

export interface PolygonPath {
  id: string
  svgPath: string
  fill: string
  stroke: string
  strokeWidth: number
  opacity?: number
}

export interface TechStackIconRequest {
  description: string // e.g., "React logo", "Node.js icon", "Database symbol"
  width?: number
  height?: number
}

export interface TechStackIconResponse {
  name: string
  description: string
  polygons: PolygonPath[]
  viewBox: { width: number; height: number }
}

export interface TechStackElement {
  id: string
  techName: string
  position: { x: number; y: number }
  polygons: PolygonPath[]
  label?: string
}

export interface StyledLayoutRequest {
  selectedStacks: string[] // e.g., ['react', 'nodejs', 'mongodb']
  styleDescription: string // e.g., "train station platform with each tech as a train car"
  canvasWidth?: number
  canvasHeight?: number
}

export interface StyledLayoutResponse {
  elements: TechStackElement[]
  backgroundPolygons?: PolygonPath[] // Optional background elements (platform, rails, etc.)
  description: string
}

/**
 * Generate styled layout with selected tech stacks using Gemini AI
 */
export async function generateStyledLayout(request: StyledLayoutRequest): Promise<StyledLayoutResponse> {
  if (!genAI) {
    return generateMockStyledLayout(request)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    const prompt = `You are a creative tech stack visualization designer. Create a styled layout where each technology is represented with simple polygon shapes.

Selected Technologies: ${request.selectedStacks.join(', ')}
Style Theme: ${request.styleDescription}
Canvas Size: ${request.canvasWidth || 1200}x${request.canvasHeight || 800}

IMPORTANT RULES:
1. Create visual elements for EACH selected technology
2. Each tech element should have 2-5 simple polygons (rectangles, triangles, circles as polygons)
3. Design elements according to the style theme
4. Position elements logically in the canvas
5. Add optional background polygons if they enhance the theme (platform, rails, roads, etc.)
6. Use colors that match the tech's brand or theme
7. Keep polygons simple and editable

RESPONSE FORMAT (JSON):
{
  "description": "Train station platform with React, Node.js, and MongoDB as train cars",
  "backgroundPolygons": [
    {
      "id": "bg-platform",
      "svgPath": "M 0 600 L 1200 600 L 1200 650 L 0 650 Z",
      "fill": "#8B7355",
      "stroke": "#654321",
      "strokeWidth": 2,
      "opacity": 1
    },
    {
      "id": "bg-rail-1",
      "svgPath": "M 0 650 L 1200 650 L 1200 655 L 0 655 Z",
      "fill": "#333333",
      "stroke": "#222222",
      "strokeWidth": 1,
      "opacity": 1
    }
  ],
  "elements": [
    {
      "id": "tech-react",
      "techName": "React",
      "position": { "x": 100, "y": 450 },
      "label": "React",
      "polygons": [
        {
          "id": "react-car-body",
          "svgPath": "M 0 0 L 150 0 L 150 120 L 0 120 Z",
          "fill": "#61dafb",
          "stroke": "#00d8ff",
          "strokeWidth": 3,
          "opacity": 1
        },
        {
          "id": "react-car-roof",
          "svgPath": "M 10 0 L 140 0 L 120 -30 L 30 -30 Z",
          "fill": "#4fa8c5",
          "stroke": "#00d8ff",
          "strokeWidth": 2,
          "opacity": 1
        }
      ]
    }
  ]
}

Generate the styled layout now (return ONLY valid JSON):`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        description: parsed.description || request.styleDescription,
        elements: parsed.elements || [],
        backgroundPolygons: parsed.backgroundPolygons || []
      }
    }

    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('Gemini API error:', error)
    return generateMockStyledLayout(request)
  }
}

/**
 * Generate tech stack icon with individual editable polygons using Gemini AI
 */
export async function generateTechStackIcon(request: TechStackIconRequest): Promise<TechStackIconResponse> {
  if (!genAI) {
    return generateMockTechStackIcon(request)
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

    const prompt = `You are a tech icon designer. Create a tech stack icon by breaking it down into individual polygon paths.

Description: ${request.description}
Canvas size: ${request.width || 200}x${request.height || 200}

IMPORTANT RULES:
1. Break down the icon into 3-8 individual polygon shapes
2. Each polygon should be a separate, editable SVG path
3. Use simple geometric shapes (rectangles, triangles, circles as polygons)
4. Each polygon should have its own color and can be independently styled
5. Paths should fit within a viewBox of 0 0 ${request.width || 200} ${request.height || 200}
6. Return ONLY valid JSON, no explanation

RESPONSE FORMAT (JSON):
{
  "name": "React",
  "description": "React logo with atomic symbol",
  "viewBox": { "width": 200, "height": 200 },
  "polygons": [
    {
      "id": "polygon-1",
      "svgPath": "M 100 80 C 120 80 140 90 140 100 C 140 110 120 120 100 120 C 80 120 60 110 60 100 C 60 90 80 80 100 80 Z",
      "fill": "#61dafb",
      "stroke": "#00d8ff",
      "strokeWidth": 2,
      "opacity": 1
    },
    {
      "id": "polygon-2",
      "svgPath": "M 95 95 L 105 95 L 105 105 L 95 105 Z",
      "fill": "#282c34",
      "stroke": "#000000",
      "strokeWidth": 1,
      "opacity": 1
    }
  ]
}

Generate the tech stack icon now:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        name: parsed.name || 'Tech Icon',
        description: parsed.description || request.description,
        viewBox: parsed.viewBox || { width: request.width || 200, height: request.height || 200 },
        polygons: parsed.polygons || []
      }
    }

    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('Gemini API error:', error)
    return generateMockTechStackIcon(request)
  }
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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

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
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

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
 * Mock tech stack icon generator (fallback)
 */
function generateMockTechStackIcon(request: TechStackIconRequest): TechStackIconResponse {
  const width = request.width || 200
  const height = request.height || 200

  // Simple React-like icon with 3 editable polygons
  return {
    name: 'Mock Icon',
    description: request.description,
    viewBox: { width, height },
    polygons: [
      {
        id: 'polygon-1',
        svgPath: `M ${width/2} ${height*0.3} C ${width*0.7} ${height*0.3} ${width*0.85} ${height*0.4} ${width*0.85} ${height*0.5} C ${width*0.85} ${height*0.6} ${width*0.7} ${height*0.7} ${width/2} ${height*0.7} C ${width*0.3} ${height*0.7} ${width*0.15} ${height*0.6} ${width*0.15} ${height*0.5} C ${width*0.15} ${height*0.4} ${width*0.3} ${height*0.3} ${width/2} ${height*0.3} Z`,
        fill: '#61dafb',
        stroke: '#00d8ff',
        strokeWidth: 2,
        opacity: 0.8
      },
      {
        id: 'polygon-2',
        svgPath: `M ${width*0.35} ${height*0.35} L ${width*0.65} ${height*0.35} L ${width*0.65} ${height*0.65} L ${width*0.35} ${height*0.65} Z`,
        fill: '#282c34',
        stroke: '#1a1e26',
        strokeWidth: 1,
        opacity: 1
      },
      {
        id: 'polygon-3',
        svgPath: `M ${width/2} ${height*0.4} L ${width*0.6} ${height*0.5} L ${width/2} ${height*0.6} L ${width*0.4} ${height*0.5} Z`,
        fill: '#61dafb',
        stroke: '#00d8ff',
        strokeWidth: 1,
        opacity: 1
      }
    ]
  }
}

/**
 * Mock styled layout generator (fallback)
 */
function generateMockStyledLayout(request: StyledLayoutRequest): StyledLayoutResponse {
  const width = request.canvasWidth || 1200
  const height = request.canvasHeight || 800

  // Generate train station platform style
  const elements: TechStackElement[] = request.selectedStacks.map((techName, index) => {
    const xPos = 150 + index * 250
    const yPos = height * 0.55

    const colors: Record<string, string> = {
      react: '#61dafb',
      vue: '#42b883',
      angular: '#dd0031',
      nodejs: '#339933',
      python: '#3776ab',
      mongodb: '#47a248',
      postgresql: '#336791',
      docker: '#2496ed',
      kubernetes: '#326ce5'
    }

    const color = colors[techName.toLowerCase()] || '#4A90E2'

    return {
      id: `tech-${techName}-${index}`,
      techName,
      position: { x: xPos, y: yPos },
      label: techName,
      polygons: [
        {
          id: `${techName}-car-body`,
          svgPath: 'M 0 0 L 180 0 L 180 100 L 0 100 Z',
          fill: color,
          stroke: adjustColor(color, -30),
          strokeWidth: 3,
          opacity: 1
        },
        {
          id: `${techName}-car-roof`,
          svgPath: 'M 15 0 L 165 0 L 145 -25 L 35 -25 Z',
          fill: adjustColor(color, -20),
          stroke: adjustColor(color, -30),
          strokeWidth: 2,
          opacity: 1
        },
        {
          id: `${techName}-wheel-1`,
          svgPath: 'M 30 100 C 30 85 45 85 45 100 C 45 115 30 115 30 100 Z',
          fill: '#333333',
          stroke: '#222222',
          strokeWidth: 2,
          opacity: 1
        },
        {
          id: `${techName}-wheel-2`,
          svgPath: 'M 135 100 C 135 85 150 85 150 100 C 150 115 135 115 135 100 Z',
          fill: '#333333',
          stroke: '#222222',
          strokeWidth: 2,
          opacity: 1
        }
      ]
    }
  })

  // Background: platform and rails
  const backgroundPolygons: PolygonPath[] = [
    {
      id: 'bg-platform',
      svgPath: `M 0 ${height * 0.75} L ${width} ${height * 0.75} L ${width} ${height * 0.82} L 0 ${height * 0.82} Z`,
      fill: '#8B7355',
      stroke: '#654321',
      strokeWidth: 2,
      opacity: 1
    },
    {
      id: 'bg-rail-1',
      svgPath: `M 0 ${height * 0.82} L ${width} ${height * 0.82} L ${width} ${height * 0.825} L 0 ${height * 0.825} Z`,
      fill: '#333333',
      stroke: '#222222',
      strokeWidth: 1,
      opacity: 1
    },
    {
      id: 'bg-rail-2',
      svgPath: `M 0 ${height * 0.86} L ${width} ${height * 0.86} L ${width} ${height * 0.865} L 0 ${height * 0.865} Z`,
      fill: '#333333',
      stroke: '#222222',
      strokeWidth: 1,
      opacity: 1
    }
  ]

  return {
    description: `Train station platform with ${request.selectedStacks.join(', ')} as train cars`,
    elements,
    backgroundPolygons
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
