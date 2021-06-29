const questions = [
    {
        type: 'number',
        name: 'totalWorkTime',
        message: 'How many hours do you want to work today?',
        filter: (input) => {
            if (isNaN(input)) throw new Error('Please enter a number');
            return input
        },
    },
    {
        type: 'number',
        name: 'workPhase',
        message: 'How many minutes do you want to work consecutively?',
        filter: (input) => {
            if (isNaN(input)) throw new Error('Please enter a number');
            return input
        },
    },
    {
        type: 'number',
        name: 'shortBreak',
        message: 'How many minutes for the short break?',
        filter: (input) => {
            if (isNaN(input)) throw new Error('Please enter a number');
            return input
        },
    },
    {
        type: 'number',
        name: 'cycles',
        message: 'How many work phases (with short break) before long break?',
        filter: (input) => {
            if (isNaN(input)) throw new Error('Please enter a number');
            if (input < 1) throw new Error('At least one cycle');
            return input
        },
    },
    {
        type: 'number',
        name: 'longBreak',
        message: 'How many minutes for the long break?',
        filter: (input) => {
            if (isNaN(input)) throw new Error('Please enter a number');
            return input
        },
    }
];

module.exports = questions;