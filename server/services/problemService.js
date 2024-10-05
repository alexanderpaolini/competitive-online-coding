const fs = require('fs');
const path = require('path');

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

module.exports = { loadProblems, getRandomProblem };
