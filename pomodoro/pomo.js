'use strict';
const notifier = require('node-notifier');
const cliProgress = require('cli-progress');
const dataHarvester = require("./modules/dataHarvester");

console.log("POMODORO");

const multibar = new cliProgress.MultiBar({
    format: '"{bar}" | {type} | {percentage}% | {value}/{total}',
    clearOnComplete: false,
    hideCursor: true
});

const createBars = (insertedData) => {
    try {
        const partialBar = multibar.create(insertedData.chunk, 0, {type: "chunk"});
        const totalBar = multibar.create(insertedData.hours * 60, 0, {type: "total"});
        return {partialBar, totalBar};
    } catch (error) {
        throw error;
    }
};

const work = (partialBar, totalBar, pauses) => {
    try {
        if (partialBar.value < partialBar.total) {
            partialBar.increment();
            totalBar.increment();
        }
        if (partialBar.value == partialBar.total) {
            pauses.completed += 1;
        }
        return;
    } catch (error) {
        throw error;
    }
};

const wait = (pauses) => {
    try {
        if (pauses.value < pauses.total) {
            return pauses.value += 1;
        }
        return;
    } catch (error) {
        throw error;
    }
};

const handleShortBreak = async (partialBar, pauses) => {
    try {
        if (pauses.shortBreak.value == pauses.shortBreak.total) {
            partialBar.update(0);
            pauses.shortBreak.value = 0;
            return;
        }
        return await wait(pauses.shortBreak);
    } catch (error) {
        throw error;
    }   
};

const handleBars = async (partialBar, totalBar, pauses, insertedData) => {
    try {
        if (partialBar.value != partialBar.total) { //if partial is not ended
            return work(partialBar, totalBar, pauses);
        }
        if (pauses.completed < insertedData.cycles) { //if cycles aren't completed
            return await handleShortBreak(partialBar, pauses);
        }
        if (pauses.longBreak.value == pauses.longBreak.total) { //if longBreak is ended
            partialBar.update(0);
            pauses.longBreak.value = 0;
            pauses.completed = 0;
            return;
        }
        return await wait(pauses.longBreak);
    } catch (error) {
        throw error;
    } 

};

const handleEnd = (timer, multibar) => {
    try {
        clearInterval(timer);
        const message = "Congratulations! You successfully worked with the tomato technique.";
        multibar.stop();
        notifier.notify({
            title: "Tomato",
            message: message
        });
        return console.log(message);
    } catch (error) {
        throw error;
    } 
};

const handleTimeline = async insertedData => {
    try {
        const pauses = {
            shortBreak: {
                value: 0,
                total: insertedData.shortBreak
            },
            longBreak: {
                value: 0,
                total: insertedData.longBreak
            },
            completed: 0
        }
        const {partialBar, totalBar} = await createBars(insertedData);
        const timer = setInterval(() => {
            if (totalBar.value < totalBar.total) {
                return handleBars(partialBar, totalBar, pauses, insertedData);
            }
            handleEnd(timer, multibar);
        }, 100); //every minute (60000 instead of 100)
        
    } catch (error) {
        throw error;
    }  
};

const main = async () => {
    try {
        const insertedData = await dataHarvester.retrieveInput();
        //const insertedData = { hours: 2, chunk: 25, shortBreak: 10, longBreak: 30, cycles: 5 };
        console.log("\ninsertedData:\n",JSON.stringify(insertedData, null, '  '));

        return await handleTimeline(insertedData);

    } catch (error) {
        console.log(error);
    }
};

main();