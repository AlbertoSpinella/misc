const inquirer = require('inquirer');

const validateQuestion = (value) => {
    try {
        const isValid = !isNaN(value) && value > 0;
        return isValid || 'Please enter a number';
    } catch (error) {
        throw error;
    }
};

const questions = [
    {
        type: "number",
        name: "hours",
        message: "How many hours do you want to study?",
        validate: validateQuestion,
          filter: Number
    },
    {
        type: "number",
        name: "chunk",
        message: "How many minutes do you want do study consecutively?",
        validate: validateQuestion,
          filter: Number
    },
    {
        type: "number",
        name: "shortBreak",
        message: "How long is your short break?",
        validate: validateQuestion,
          filter: Number
    },
    {
        type: "number",
        name: "longBreak",
        message: "How long is your long break?",
        validate: validateQuestion,
          filter: Number
    },
    {
        type: "number",
        name: "cycles",
        message: "After how many cycles do you want to take the long break?",
        validate: validateQuestion,
          filter: Number
    }
];

const retrieveInput = async () => {
    try {
        const answers = await inquirer.prompt(questions);
        console.log('\nInserted Data:\n', JSON.stringify(answers, null, '  '));
        return await answers;
    } catch (error) {
        console.log(error);
    }
};

module.exports.retrieveInput = retrieveInput;