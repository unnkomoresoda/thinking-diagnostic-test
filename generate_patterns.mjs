import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

const client = new GoogleGenerativeAI({ apiKey });

// Generate Cognitive Layer patterns
async function generateLayerPatterns() {
  console.log("Generating Cognitive Layer patterns...");
  
  const prompt = `You are an expert in personality psychology and cognitive assessment. Generate 4 different sets of 10 Cognitive Layer diagnostic questions. Each question should measure one of these 5 layers:
- Layer 1 (Execution): Concrete task execution and immediate problem-solving
- Layer 2 (Analysis): Data interpretation and pattern recognition
- Layer 3 (Strategy): Mid-term planning and resource allocation
- Layer 4 (System): Complex system design and architecture
- Layer 5 (Macro): Civilization-level vision and paradigm shifts

Each set should use completely different approaches and scenarios to measure the same layers. Questions should be in Japanese.

For each question, provide:
- id: unique identifier (e.g., "layer_p1_q1" for pattern 1 question 1)
- text: the question in Japanese
- options: array of 5 options, each with {label, layer (1-5)}

Format as JSON with structure:
{
  "patterns": [
    {
      "patternId": "layer_pattern_1",
      "questions": [...]
    },
    ...
  ]
}`;

  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  // Extract JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("Failed to parse layer patterns response");
}

// Generate Processing Power patterns
async function generatePowerPatterns() {
  console.log("Generating Processing Power patterns...");
  
  const prompt = `You are an expert in logical reasoning and cognitive assessment. Generate 4 different sets of 10 Processing Power diagnostic questions. Each question should test logical reasoning with:
- 1 correct answer
- 3-4 trap answers (common logical fallacies or misconceptions)
- An explanation of why the answer is correct

Each set should use completely different problem types and domains (e.g., logic puzzles, pattern recognition, mathematical reasoning, causal inference) to measure the same logical reasoning ability. Questions should be in Japanese.

For each question, provide:
- id: unique identifier (e.g., "power_p1_q1" for pattern 1 question 1)
- text: the question in Japanese
- options: array of 4 options with {label, correct (boolean), trapType (if trap)}
- explanation: why the correct answer is right

Format as JSON with structure:
{
  "patterns": [
    {
      "patternId": "power_pattern_1",
      "questions": [...]
    },
    ...
  ]
}`;

  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("Failed to parse power patterns response");
}

// Generate Dynamic Shift patterns
async function generateShiftPatterns() {
  console.log("Generating Dynamic Shift patterns...");
  
  const prompt = `You are an expert in scenario-based assessment. Generate 4 different sets of 3 Dynamic Shift diagnostic scenarios. Each scenario should have 9 phases where the user must respond to evolving situations by choosing from 5 options (each corresponding to a cognitive layer: 1=Execution, 2=Analysis, 3=Strategy, 4=System, 5=Macro).

Each set should use completely different scenarios (e.g., business crisis, personal relationship, project management, social movement) to measure the same adaptive thinking ability. Scenarios should be in Japanese.

For each scenario, provide:
- id: unique identifier (e.g., "shift_p1_s1" for pattern 1 scenario 1)
- situation: initial scenario setup in Japanese
- phases: array of 9 phases, each with {description, options: [{label, layer (1-5), quality (0-100)}]}

Format as JSON with structure:
{
  "patterns": [
    {
      "patternId": "shift_pattern_1",
      "scenarios": [...]
    },
    ...
  ]
}`;

  const model = client.getGenerativeModel({ model: "gemini-2.5-flash" });
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }
  throw new Error("Failed to parse shift patterns response");
}

async function main() {
  try {
    const layerPatterns = await generateLayerPatterns();
    const powerPatterns = await generatePowerPatterns();
    const shiftPatterns = await generateShiftPatterns();
    
    const output = {
      layerPatterns,
      powerPatterns,
      shiftPatterns,
      generatedAt: new Date().toISOString(),
    };
    
    console.log(JSON.stringify(output, null, 2));
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}

main();
