const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

const loadProblems = () => {
    const problemsDir = path.join(__dirname, '../../problems');
    const problems = [];

    for (const folder of fs.readdirSync(problemsDir)) {
        const folderPath = path.join(problemsDir, folder);
        if (!fs.statSync(folderPath).isDirectory()) continue;

        const dataJsonPath = path.join(folderPath, 'data.json');
        const descriptionMdPath = path.join(folderPath, 'description.md');

        const dataJson = JSON.parse(fs.readFileSync(dataJsonPath, 'utf-8'));
        const descriptionMd = fs.readFileSync(descriptionMdPath, 'utf-8');

        dataJson.description = descriptionMd;
        dataJson.identifier = folder;

        problems.push(dataJson);
    }
    return problems;
};

const getRandomProblem = (problems) => {
    const randomIndex = Math.floor(Math.random() * problems.length);
    return problems[randomIndex];
};

const createRandomCodingQuestion = async () => {
    const openai = new OpenAI();

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
        "description": "\n# Problem Title\n\nProblem description goes here, explaining what the task is and providing context or requirements for the solution. Make sure to include any constraints or examples to clarify the problem. Use markdown here but DO NOT USE LATEX.\n\n## Example 1\n\nInput:\n\n~~~txt\nExample input goes here\n~~~\n\nOutput:\n\n~~~txt\nExample output goes here\n~~~"
    }
    
    Make sure to produce a VALID JSON. 
    Notes: 
    1. Description must only be one line with \n in it.
    2. Only expect to use stdin.E.X. DO NOT provide arrays in the inputs or outputs.
    3. Follow the format of the description exactly.
    4. Remember we are writing programs not functions.
    5. You must include at least 1-2 examples in the description.
    6. Every problem must be able to be solved in C so for lists the number of items must be predetermined
    
    Example Topics: Sorting, Greedy Algorithms, Basic Data Structures (Stacks, Queues, Linked Lists), Recursion, Binary Search, Two Pointers, Prefix Sums, Sliding Window Technique, Basic Dynamic Programming (Knapsack, Fibonacci), String Manipulation (Pattern Matching, Palindromes), Mathematics (GCD, LCM, Modular Arithmetic), Bit Manipulation, Graphs (BFS, DFS), Union-Find (Disjoint Set Union), Counting Problems, Simple Geometry (Lines, Circles, Distance)`;

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o', // Specify the model you want to use
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
        console.log(response.choices[0].message.content)
        return JSON.parse(response.choices[0].message.content);
    } catch (error) {
        console.error('Error fetching the coding question:', error);
        console.error('Trying again.');
        return createRandomCodingQuestion(); // Recursively retry on error
    }
};


module.exports = { loadProblems, getRandomProblem, createRandomCodingQuestion };
