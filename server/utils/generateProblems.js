const { writeFileSync } = require('fs');
const OpenAI = require('openai');

require('dotenv').config()

const createBetterCodingQuestion = async () => {
    const openai = new OpenAI();

    // Function to generate an initial random coding question
    const generateQuestion = async () => {
        const prompt = `Generate a random coding problem of easy difficulty but make it esoteric so it wouldn't have been seen before.
        The output should be in JSON format with the following structure:
        Be sure that the problem only uses standard in/out and does not have any unnecessary printing.

        {
            "title": "Problem Title",
            "testCases": {
                "testCaseName": {
                        "input": "Input String",
                        "expectedOutput": "Expected Output String"
                }
            },
            "memoryLimit": 500,
            "timeLimit": 2,
            "description": "\\n# Problem Title\\n\\nProblem description goes here, explaining what the task is and providing context or requirements for the solution. Make sure to include any constraints or examples to clarify the problem. Use markdown here but DO NOT USE LATEX.\\n\\n## Example 1\\n\\nInput:\\n\\n~~~txt\\nExample input goes here\\n~~~\\n\\nOutput:\\n\\n~~~txt\\nExample output goes here\\n~~~"
        }
        
        Make sure to produce a VALID JSON. 
        Notes: 
        1. Description must only be one line with \\n in it.
        2. Only expect to use stdin.E.X. DO NOT provide arrays in the inputs or outputs.
        3. Follow the format of the description exactly.
        4. Remember we are writing programs not functions.
        5. You must include at least 1-2 examples in the description.
        6. Every problem must be able to be solved in C so for lists the number of items must be predetermined

        Example Topics: Sorting, Greedy Algorithms, Basic Data Structures (Stacks, Queues, Linked Lists), Recursion, Binary Search, Two Pointers, Prefix Sums, Sliding Window Technique, Basic Dynamic Programming (Knapsack, Fibonacci), String Manipulation (Pattern Matching, Palindromes), Mathematics (GCD, LCM, Modular Arithmetic), Bit Manipulation, Graphs (BFS, DFS), Union-Find (Disjoint Set Union), Counting Problems, Simple Geometry (Lines, Circles, Distance)`;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are an assistant that generates random coding questions.' },
                    { role: 'user', content: prompt }
                ],
                response_format: {
                    type: 'json_object'
                },
                max_tokens: 2000,
                temperature: 0.7,
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Error fetching the coding question:', error);
            throw error;
        }
    };

    // Function to improve the generated question
    const improveQuestion = async (question) => {
        const improvementPrompt = `Here is a coding problem in JSON format:\n\n${JSON.stringify(question, null, 2)}\n\nNow improve it by doing the following:\n\n1. Add at least 2 more test cases.\n2. Make sure the problem is clear and doesn't have any ambiguities.\n3. Ensure it is solvable in C.\n4. Make sure there are no unnecessary print statements in the output.\n\n5. Fix any incorrect test cases.\n\nRemember:\n1. Do not give any hints or edge cases\n2. Do not explain how to solve the problem or give extra information.`;

        try {
            const response = await openai.chat.completions.create({
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are an assistant that improves coding questions.' },
                    { role: 'user', content: improvementPrompt }
                ],
                response_format: {
                    type: 'json_object'
                },
                max_tokens: 2000,
                temperature: 0.7,
            });

            return JSON.parse(response.choices[0].message.content);
        } catch (error) {
            console.error('Error improving the coding question:', error);
            throw error;
        }
    };

    try {
        // Step 1: Generate a random coding question
        const initialQuestion = await generateQuestion();

        // Step 2: Improve the generated question
        const improvedQuestion = await improveQuestion(initialQuestion);

        return improvedQuestion;
    } catch (error) {
        console.error('Error in the question generation process:', error);
    }
};

async function main() {
    for (let i = 0; i < 30; i++) {
        const problem = await createBetterCodingQuestion();
        writeFileSync(`../problems/${problem.title.toLowerCase().split(" ").join("")}.json`, JSON.stringify(problem))
        console.log("Created Problem:", problem.title)
    }
}

main()
