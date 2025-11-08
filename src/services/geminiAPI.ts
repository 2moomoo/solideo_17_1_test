import { GoogleGenAI } from '@google/genai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || ''

let genAI: GoogleGenAI | null = null

if (API_KEY) {
  genAI = new GoogleGenAI({ apiKey: API_KEY })
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

export interface StyleTemplate {
  name: string
  description: string
  elementTemplate: PolygonPath[]  // Template for ONE element (uses relative coordinates 0-100)
  backgroundPolygons?: PolygonPath[]  // Background elements (absolute coordinates)
  elementWidth: number  // Template size
  elementHeight: number
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
 * Generate style template from AI (ONE template for all elements)
 */
export async function generateStyleTemplate(styleDescription: string, canvasWidth: number, canvasHeight: number): Promise<StyleTemplate> {
  if (!genAI) {
    return generateMockStyleTemplate(styleDescription, canvasWidth, canvasHeight)
  }

  try {
    const prompt = `You are a creative visualization designer. Create a SINGLE reusable template that represents this style:

Style Theme: ${styleDescription}
Canvas Size: ${canvasWidth}x${canvasHeight}
Template Size: Approximately 180x120 pixels

IMPORTANT RULES:
1. Create ONE reusable template (not for specific technologies)
2. Template should have 2-5 simple polygons
3. Use RELATIVE coordinates (0-180 width, 0-120 height range)
4. Use neutral placeholder colors (will be replaced per-tech)
5. Add optional background polygons (platform, rails, etc.) with ABSOLUTE coordinates
6. Keep it simple and editable

RESPONSE FORMAT (JSON):
{
  "name": "Train Car",
  "description": "A simple train car shape",
  "elementWidth": 180,
  "elementHeight": 120,
  "elementTemplate": [
    {
      "id": "body",
      "svgPath": "M 0 20 L 180 20 L 180 120 L 0 120 Z",
      "fill": "#PLACEHOLDER",
      "stroke": "#000000",
      "strokeWidth": 3,
      "opacity": 1
    },
    {
      "id": "roof",
      "svgPath": "M 15 20 L 165 20 L 145 0 L 35 0 Z",
      "fill": "#PLACEHOLDER",
      "stroke": "#000000",
      "strokeWidth": 2,
      "opacity": 1
    },
    {
      "id": "wheel-1",
      "svgPath": "M 30 120 C 30 105 45 105 45 120 C 45 135 30 135 30 120 Z",
      "fill": "#333333",
      "stroke": "#222222",
      "strokeWidth": 2,
      "opacity": 1
    },
    {
      "id": "wheel-2",
      "svgPath": "M 135 120 C 135 105 150 105 150 120 C 150 135 135 135 135 120 Z",
      "fill": "#333333",
      "stroke": "#222222",
      "strokeWidth": 2,
      "opacity": 1
    }
  ],
  "backgroundPolygons": [
    {
      "id": "platform",
      "svgPath": "M 0 ${canvasHeight * 0.75} L ${canvasWidth} ${canvasHeight * 0.75} L ${canvasWidth} ${canvasHeight * 0.82} L 0 ${canvasHeight * 0.82} Z",
      "fill": "#8B7355",
      "stroke": "#654321",
      "strokeWidth": 2,
      "opacity": 1
    }
  ]
}

Generate the style template now (return ONLY valid JSON):`

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt
    })

    const text = response.text || ''

    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      return {
        name: parsed.name || 'Style Template',
        description: parsed.description || styleDescription,
        elementWidth: parsed.elementWidth || 180,
        elementHeight: parsed.elementHeight || 120,
        elementTemplate: parsed.elementTemplate || [],
        backgroundPolygons: parsed.backgroundPolygons || []
      }
    }

    throw new Error('Failed to parse AI response')
  } catch (error) {
    console.error('Gemini API error:', error)
    return generateMockStyleTemplate(styleDescription, canvasWidth, canvasHeight)
  }
}

/**
 * Apply style template to selected tech stacks
 */
function applyStyleToStacks(
  template: StyleTemplate,
  selectedStacks: string[],
  _canvasWidth: number,
  canvasHeight: number
): StyledLayoutResponse {
  const techColors: Record<string, string> = {
    react: '#61dafb',
    vue: '#42b883',
    angular: '#dd0031',
    svelte: '#ff3e00',
    nodejs: '#339933',
    python: '#3776ab',
    java: '#007396',
    go: '#00add8',
    mongodb: '#47a248',
    postgresql: '#336791',
    mysql: '#4479a1',
    redis: '#dc382d',
    docker: '#2496ed',
    kubernetes: '#326ce5',
    aws: '#ff9900',
    github: '#181717'
  }

  const elements: TechStackElement[] = selectedStacks.map((techName, index) => {
    const color = techColors[techName.toLowerCase()] || '#4A90E2'
    const xPos = 150 + index * (template.elementWidth + 50)
    const yPos = canvasHeight * 0.55

    // Clone template polygons and replace colors
    const polygons = template.elementTemplate.map((polygon, polyIndex) => ({
      ...polygon,
      id: `${techName}-${polygon.id}-${polyIndex}`,
      fill: polygon.fill === '#PLACEHOLDER' ? color : polygon.fill,
      stroke: polygon.stroke === '#PLACEHOLDER' ? adjustColor(color, -30) : polygon.stroke
    }))

    return {
      id: `tech-${techName}-${index}`,
      techName,
      position: { x: xPos, y: yPos },
      label: techName,
      polygons
    }
  })

  return {
    description: `${template.description} with ${selectedStacks.join(', ')}`,
    elements,
    backgroundPolygons: template.backgroundPolygons || []
  }
}

/**
 * Generate styled layout with selected tech stacks using Gemini AI
 */
export async function generateStyledLayout(request: StyledLayoutRequest): Promise<StyledLayoutResponse> {
  const canvasWidth = request.canvasWidth || 1200
  const canvasHeight = request.canvasHeight || 800

  // Step 1: Get style template from AI
  const template = await generateStyleTemplate(request.styleDescription, canvasWidth, canvasHeight)

  // Step 2: Apply template to all selected stacks
  return applyStyleToStacks(template, request.selectedStacks, canvasWidth, canvasHeight)
}

/**
 * Generate tech stack icon with individual editable polygons using Gemini AI
 */
export async function generateTechStackIcon(request: TechStackIconRequest): Promise<TechStackIconResponse> {
  if (!genAI) {
    return generateMockTechStackIcon(request)
  }

  try {
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

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt
    })

    const text = response.text || ''

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

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: prompt
    })

    const text = response.text || ''

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

    const response = await genAI.models.generateContent({
      model: 'gemini-2.0-flash-exp',
      contents: aiPrompt
    })

    const text = response.text || ''

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
 * Mock style template generator (fallback)
 */
function generateMockStyleTemplate(_styleDescription: string, canvasWidth: number, canvasHeight: number): StyleTemplate {
  return {
    name: 'Train Car',
    description: 'Simple train car template',
    elementWidth: 180,
    elementHeight: 120,
    elementTemplate: [
      {
        id: 'body',
        svgPath: 'M 0 20 L 180 20 L 180 120 L 0 120 Z',
        fill: '#PLACEHOLDER',
        stroke: '#000000',
        strokeWidth: 3,
        opacity: 1
      },
      {
        id: 'roof',
        svgPath: 'M 15 20 L 165 20 L 145 0 L 35 0 Z',
        fill: '#PLACEHOLDER',
        stroke: '#000000',
        strokeWidth: 2,
        opacity: 1
      },
      {
        id: 'wheel-1',
        svgPath: 'M 30 120 C 30 105 45 105 45 120 C 45 135 30 135 30 120 Z',
        fill: '#333333',
        stroke: '#222222',
        strokeWidth: 2,
        opacity: 1
      },
      {
        id: 'wheel-2',
        svgPath: 'M 135 120 C 135 105 150 105 150 120 C 150 135 135 135 135 120 Z',
        fill: '#333333',
        stroke: '#222222',
        strokeWidth: 2,
        opacity: 1
      }
    ],
    backgroundPolygons: [
      {
        id: 'platform',
        svgPath: `M 0 ${canvasHeight * 0.75} L ${canvasWidth} ${canvasHeight * 0.75} L ${canvasWidth} ${canvasHeight * 0.82} L 0 ${canvasHeight * 0.82} Z`,
        fill: '#8B7355',
        stroke: '#654321',
        strokeWidth: 2,
        opacity: 1
      },
      {
        id: 'rail-1',
        svgPath: `M 0 ${canvasHeight * 0.82} L ${canvasWidth} ${canvasHeight * 0.82} L ${canvasWidth} ${canvasHeight * 0.825} L 0 ${canvasHeight * 0.825} Z`,
        fill: '#333333',
        stroke: '#222222',
        strokeWidth: 1,
        opacity: 1
      },
      {
        id: 'rail-2',
        svgPath: `M 0 ${canvasHeight * 0.86} L ${canvasWidth} ${canvasHeight * 0.86} L ${canvasWidth} ${canvasHeight * 0.865} L 0 ${canvasHeight * 0.865} Z`,
        fill: '#333333',
        stroke: '#222222',
        strokeWidth: 1,
        opacity: 1
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
