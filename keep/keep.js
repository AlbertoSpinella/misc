'use strict';

const { writeFile, readFile } = require('fs/promises');

const readData = async () => {
    const data = await readFile("./data/data.txt", { encoding: 'utf8', flag: 'a+' });
    const parsedData = JSON.parse(data);
    return parsedData;
}

const actionsAdd = async c => {
    try {
        if (c.length < 2) {
            const message = 
`Error! Invalid ADD parameter.\n
Sintax:
keep add [value]`;
            return console.log(message);
        };
        const insertedValue = c.slice(1).join(" ");
        console.log("ADD", insertedValue, "\n");
    
        const data = await readData();

        const itemFound = data.filter(val => val == insertedValue).length;

        if (itemFound != 0) return console.log("Error: elements exists.");
        data.push(insertedValue);
        const dataToBeWritten = JSON.stringify(data);
    
        await writeFile("./data/data.txt", dataToBeWritten, { flag: 'w' });
        return actionsList();
        //
    } catch (error) {
        throw error;
    }
};

const actionsList = async () => {
    try {
        console.log("LIST\n");
    
        const data = await readData();
        data.map((val, i) => {
            console.log(i, "-->", val);
        });
    } catch (error) {
        throw error;
    }
};

const actionsDelete = async c => {
    try {
        if (c.length < 2) {
            return console.log(
`Error! Invalid DELETE parameter.\n
Sintax:
keep delete [value]`);
        };
        const insertedValue = c.slice(1).join(" ");
        console.log("DELETE", insertedValue, "\n");
    
        const data = await readData();
        if (insertedValue < data.length) {
            const filteredData = data.filter((val, index) => index != insertedValue);
            const dataToBeWritten = JSON.stringify(filteredData);
            await writeFile("./data/data.txt", dataToBeWritten, { flag: 'w' });
            return actionsList();
        }
        return console.log("Error: item doesn't exists.\n");
    } catch (error) {
        throw error;
    }
};

const actionsHelp = () => {
    const message =
`keep\n
Sintassi:
keep action [value]\n
Commands:
    add [value]    \| Add the element [value]
    list           \| List all the elements
    delete [value] \| Delete the element [value]
    -h             \| Print help for keep`;
    console.log(message);
};

const handleOptions = async comm => {
    try {
        if (comm.length < 1) return console.log(`\nError: no command provided!\n\nSintax:\nkeep action [value]`);
        if (comm[0] == "add") return await actionsAdd(comm);
        if (comm[0] == "list") return actionsList();
        if (comm[0] == "delete") return await actionsDelete(comm);
        if (comm[0] == "-h" || comm[0] == "help") {
            return actionsHelp();
        }
        const message =
`Command invalid!\n
Commands:
    add [value]    \| Add the element [value]
    list           \| List all the elements
    delete [value] \| Delete the element [value]
    -h             \| Print help for keep`;
        return console.log(message);
    } catch (error) {
        throw error;
    }
};

const main = async () => {
    try {
        handleOptions(process.argv.slice(2));
    } catch (error) {
        console.log(error);
    }
};

main();