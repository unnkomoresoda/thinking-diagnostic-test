import { invokeLLM } from "./_core/llm";
import type {
  LayerQuestion,
  PowerQuestion,
  ShiftScenario,
} from "@shared/diagnosticData";

/**
 * Generate multiple patterns of Cognitive Layer questions using LLM
 */
export async function generateLayerPatterns(patternCount: number = 4) {
  const prompt = `You are an expert in personality psychology and cognitive assessment. Generate ${patternCount} different sets of 10 Cognitive Layer diagnostic questions. Each question should measure one of these 5 layers:
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
      "questions": [
        {
          "id": "layer_p1_q1",
          "text": "...",
          "options": [
            {"label": "...", "layer": 1},
            ...
          ]
        },
        ...
      ]
    },
    ...
  ]
}`;

  const result = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a JSON generator. Always respond with valid JSON only, no markdown formatting.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = result.choices[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Invalid LLM response for layer patterns");
  }

  try {
    // Clean up the content to handle control characters
    const cleanedContent = content
      .replace(/[\x00-\x1F\x7F]/g, (match) => {
        // Replace control characters with their escaped versions
        const charCode = match.charCodeAt(0);
        if (charCode === 0x0A) return '\n'; // newline
        if (charCode === 0x0D) return '\r'; // carriage return
        if (charCode === 0x09) return '\t'; // tab
        return ''; // remove other control characters
      });
    return JSON.parse(cleanedContent);
  } catch (e) {
    console.error("Failed to parse layer patterns:", content.substring(0, 500));
    throw new Error(`JSON parsing failed for layer patterns: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

/**
 * Generate multiple patterns of Processing Power questions using LLM
 */
export async function generatePowerPatterns(patternCount: number = 4) {
  const prompt = `You are an expert in logical reasoning and cognitive assessment. Generate ${patternCount} different sets of 10 Processing Power diagnostic questions. Each question should test logical reasoning with:
- 1 correct answer
- 3-4 trap answers (common logical fallacies or misconceptions)
- An explanation of why the answer is correct

Each set should use completely different problem types and domains (e.g., logic puzzles, pattern recognition, mathematical reasoning, causal inference) to measure the same logical reasoning ability. Questions should be in Japanese.

For each question, provide:
- id: unique identifier (e.g., "power_p1_q1" for pattern 1 question 1)
- text: the question in Japanese
- options: array of 4 options with {label, correct (boolean), trapType (optional)}
- explanation: why the correct answer is right

Format as JSON with structure:
{
  "patterns": [
    {
      "patternId": "power_pattern_1",
      "questions": [
        {
          "id": "power_p1_q1",
          "text": "...",
          "options": [
            {"label": "...", "correct": true},
            {"label": "...", "correct": false, "trapType": "..."},
            ...
          ],
          "explanation": "..."
        },
        ...
      ]
    },
    ...
  ]
}`;

  const result = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a JSON generator. Always respond with valid JSON only, no markdown formatting.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = result.choices[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Invalid LLM response for power patterns");
  }

  try {
    // Clean up the content to handle control characters
    const cleanedContent = content
      .replace(/[\x00-\x1F\x7F]/g, (match) => {
        // Replace control characters with their escaped versions
        const charCode = match.charCodeAt(0);
        if (charCode === 0x0A) return '\n'; // newline
        if (charCode === 0x0D) return '\r'; // carriage return
        if (charCode === 0x09) return '\t'; // tab
        return ''; // remove other control characters
      });
    return JSON.parse(cleanedContent);
  } catch (e) {
    console.error("Failed to parse power patterns:", content.substring(0, 500));
    throw new Error(`JSON parsing failed for power patterns: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}

/**
 * Generate multiple patterns of Dynamic Shift scenarios using LLM
 */
export async function generateShiftPatterns(patternCount: number = 4) {
  const prompt = `You are an expert in scenario-based assessment. Generate ${patternCount} different sets of 3 Dynamic Shift diagnostic scenarios. Each scenario should have 9 phases where the user must respond to evolving situations by choosing from 5 options (each corresponding to a cognitive layer: 1=Execution, 2=Analysis, 3=Strategy, 4=System, 5=Macro).

Each set should use completely different scenarios (e.g., business crisis, personal relationship, project management, social movement) to measure the same adaptive thinking ability. Scenarios should be in Japanese.

For each scenario, provide:
- id: unique identifier (e.g., "shift_p1_s1" for pattern 1 scenario 1)
- situation: initial scenario setup in Japanese (2-3 sentences)
- phases: array of 9 phases, each with {description (1-2 sentences), options: [{label, layer (1-5), quality (0-100)}]}

Format as JSON with structure:
{
  "patterns": [
    {
      "patternId": "shift_pattern_1",
      "scenarios": [
        {
          "id": "shift_p1_s1",
          "situation": "...",
          "phases": [
            {
              "description": "...",
              "options": [
                {"label": "...", "layer": 1, "quality": 70},
                ...
              ]
            },
            ...
          ]
        },
        ...
      ]
    },
    ...
  ]
}`;

  const result = await invokeLLM({
    messages: [
      {
        role: "system",
        content:
          "You are a JSON generator. Always respond with valid JSON only, no markdown formatting.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const content = result.choices[0]?.message?.content;
  if (typeof content !== "string") {
    throw new Error("Invalid LLM response for shift patterns");
  }

  try {
    // Clean up the content to handle control characters
    const cleanedContent = content
      .replace(/[\x00-\x1F\x7F]/g, (match) => {
        // Replace control characters with their escaped versions
        const charCode = match.charCodeAt(0);
        if (charCode === 0x0A) return '\n'; // newline
        if (charCode === 0x0D) return '\r'; // carriage return
        if (charCode === 0x09) return '\t'; // tab
        return ''; // remove other control characters
      });
    return JSON.parse(cleanedContent);
  } catch (e) {
    console.error("Failed to parse shift patterns:", content.substring(0, 500));
    throw new Error(`JSON parsing failed for shift patterns: ${e instanceof Error ? e.message : 'Unknown error'}`);
  }
}
