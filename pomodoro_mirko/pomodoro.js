'use strict';
const inquirer = require('inquirer');
const cliProgress = require('cli-progress');
const notifier = require('node-notifier');
const _colors = require('colors');


const handleBars = (answers, multibar, workPhaseBar, totalWorkBar) => {
    let pause = false;
    let cycles = 1;
    let phaseValue = 0;
    let totalValue = 0;

    const phaseProgress = () => {
        if (!pause) {
            workPhaseBar.increment();
            phaseValue++;
            if (phaseValue >= workPhaseBar.getTotal()) {
                pause = true;
                notifier.notify('Hai terminato!');
                workPhaseBar.update(0);
                phaseValue = 0;
            }
        }
        if (pause) {
            if (cycles < answers['cycles']) {
                // setTimeout(() => { cycles++; pause = false; }, answers['shortBreak'] * 60000);
                setTimeout(() => { cycles++; pause = false; }, 2500);
            }
            if (cycles >= answers['cycles']) {
                // setTimeout(() => { cycles++; pause = false; }, answers['longBreak'] * 60000);
                setTimeout(() => { cycles = 1; pause = false; }, 5000);
            }
        }
    };

    const totalProgress = () => {
        totalWorkBar.increment();
        totalValue++;
        if (totalValue >= totalWorkBar.getTotal()) {
            clearInterval(totalTimer);
            clearInterval(phaseTimer);
            multibar.stop();
            notifier.notify('Fine giornata');
        }
    };

    const phaseTimer = setInterval(phaseProgress, 1000);
    const totalTimer = setInterval(totalProgress, 1000);
};

const createBars = (answers) => {
    console.log(JSON.stringify(answers, null, '  '));
    const multibar = new cliProgress.MultiBar({
        format: 'CLI Progress |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total}',
        clearOnComplete: true,
        hideCursor: true
    }, cliProgress.Presets.shades_grey);
    // const totalWorkBar = multibar.create(answers['totalWorkTime'] * 3600, 0);
    // const workPhaseBar = multibar.create(answers['workPhase'] * 60, 0);
    const workPhaseBar = multibar.create(10, 0);
    const totalWorkBar = multibar.create(30, 0);
    return new Promise((resolve) => resolve([multibar, workPhaseBar, totalWorkBar]));
};

const main = async () => {
    try {
        const questions = require('./questions');
        const answers = await inquirer.prompt(questions);
        const bars = await createBars(answers);
        handleBars(answers, ...bars);
    } catch (error) {
        console.log(error);
    }
};

main();