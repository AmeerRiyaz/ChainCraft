#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';

// Helper function to print usage
function printUsage() {
    console.log(chalk.green(`Usage: generateChaincode.js --name <chaincode-name> --dir <target-directory>`));
}

// Parse arguments
const args = process.argv.slice(2);
const argMap = {};
for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '');
    const value = args[i + 1];
    argMap[key] = value;
}

const { name, dir } = argMap;

if (!name || !dir) {
    console.error(chalk.red("Error: Missing required arguments."));
    printUsage();
    process.exit(1);
}

// Validate name and directory
if (!/^[a-zA-Z0-9_-]+$/.test(name)) {
    console.error(chalk.red("Error: Chaincode name can only contain letters, numbers, underscores, and dashes."));
    process.exit(1);
}

if (!fs.existsSync(dir)) {
    console.error(chalk.red(`Error: The directory ${dir} does not exist.`));
    process.exit(1);
}

// Helper function to create chaincode functions
function generateFunctionContent(func) {
    switch (func.type) {
        case 'query':
            return `async ${func.name}(ctx, key) {
                const value = await ctx.stub.getState(key);
                if (!value || value.length === 0) {
                    throw new Error(\`Key \${key} does not exist\`);
                }
                return value.toString();
            }`;
        case 'create':
            return `async ${func.name}(ctx, args) {
                console.info('======================= Recording New Data');
                let inputArgs;
                try {
                    inputArgs = JSON.parse(args);
                } catch (err) {
                    throw new Error("Invalid JSON input. Ensure the input arguments are properly formatted.");
                }

                let key;
                let data = { Object: inputArgs };
                key = inputArgs.key;

                await ctx.stub.putState(key, Buffer.from(JSON.stringify(data)));
                return JSON.stringify({ Status: "Success", Message: "Recording of Data is Successful", Key: key });
            }`;
        case 'createComposite':
            return `async ${func.name}(ctx, args) {
                console.info('======================= Recording New Data');
                let inputArgs;
                try {
                    inputArgs = JSON.parse(args);
                } catch (err) {
                    throw new Error("Invalid JSON input. Ensure the input arguments are properly formatted.");
                }

                let key = await ctx.stub.createCompositeKey(this.indexName, [inputArgs.key]);
                await ctx.stub.putState(key, Buffer.from(JSON.stringify({ Object: inputArgs })));
                return JSON.stringify({ Status: "Success", Message: "Recording of Data is Successful", Key: key });
            }`;
        case 'queryComposite':
            return `async ${func.name}(ctx, args) {
                const key = JSON.parse(args).key;
                const compositeKey = await ctx.stub.createCompositeKey(this.indexName, [key]);
                const ID = await ctx.stub.getState(compositeKey);
                return ID.toString();
            }`;
        case 'queryAllTX':
            return `async queryAllTx(ctx) {
                const allResults = [];
                for await (const { key, value } of ctx.stub.getStateByRange("", "")) {
                    const record = JSON.parse(Buffer.from(value).toString("utf8")) || value;
                    allResults.push({ Key: key, Record: record });
                }
                return JSON.stringify(allResults);
            }`;
        case 'History':
            return `async History(ctx, key) {
                const history = [];
                for await (const res of ctx.stub.getHistoryForKey(key)) {
                    history.push({ txId: res.txId, value: res.value.toString(), isDelete: res.isDelete });
                }
                return JSON.stringify({ key: key, values: history });
            }`;
        default:
            return `async ${func.name}(ctx, ...args) {
                console.log('${func.name} called with args:', args);
            }`;
    }
}

// Prompt user for functions
async function promptForFunctions() {
    const functions = [];
    let addMore = true;

    while (addMore) {
        const { functionName, functionType } = await inquirer.prompt([
            {
                type: 'input',
                name: 'functionName',
                message: chalk.blue('Enter the name of the function:'),
                validate: (input) => input ? true : chalk.red('Function name cannot be empty.'),
            },
            {
                type: 'list',
                name: 'functionType',
                message: chalk.blue('Select the type of function:'),
                choices: [
                    { name: 'Query (Retrieve data)', value: 'query' },
                    { name: 'Create (Add new data)', value: 'create' },
                    { name: 'Create with Composite Key (Add data with composite key)', value: 'createComposite' },
                    { name: 'Query with Composite Key (Retrieve data with composite key)', value: 'queryComposite' },
                    { name: 'Query All Transactions (Retrieve all transactions)', value: 'queryAllTX' },
                    { name: 'History (Get history of a key)', value: 'History' },
                    { name: 'Custom (Define your own function)', value: 'custom' },
                ],
            },
        ]);

        functions.push({ name: functionName, type: functionType });

        const { continueAdding } = await inquirer.prompt([
            {
                type: 'confirm',
                name: 'continueAdding',
                message: chalk.yellow('Do you want to add another function?'),
                default: false,
            },
        ]);

        addMore = continueAdding;
    }

    return functions;
}

// Generate chaincode.js content dynamically
async function generateChaincode(name, functions) {
    const chaincodeClassName = name.charAt(0).toUpperCase() + name.slice(1);
    const functionContents = functions.map(generateFunctionContent).join('\n');

    return `'use strict';

import { Contract } from 'fabric-contract-api';

class ${chaincodeClassName} extends Contract {
    async initLedger(ctx) {
        console.log(chalk.green('${name} chaincode initialized'));
    }
${functionContents}
}

export default ${chaincodeClassName};
` ;
}

// Main function
(async function main() {
    const spinner = ora(chalk.cyan('Initializing Chaincode Generation...')).start();

    // Ensure target directory exists
    const targetDir = path.resolve(dir, name);
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
    }

    // Ensure lib directory exists
    const libDir = path.join(targetDir, 'lib');
    if (!fs.existsSync(libDir)) {
        fs.mkdirSync(libDir, { recursive: true });
    }

    // Define base files
    const chaincodeClassName = name.charAt(0).toUpperCase() + name.slice(1);
    const indexJsContent = `'use strict';

import ${name}Contract from './lib/chaincode';

export const ${name}Contract = ${name}Contract;
export const contracts = [ ${name}Contract ];
` ;

    const packageJson = `{
  "name": "${chaincodeClassName}",
  "author": "ameers",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "start": "fabric-chaincode-node start"
  },
  "engines": {
    "node": ">=12",
    "npm": ">=5"
  },
  "dependencies": {
    "fabric-contract-api": "^2.5.2",
    "fabric-shim": "^2.5.2"
  },
  "devDependencies": {
    "esdoc": "^1.1.0",
    "esdoc-standard-plugin": "^1.0.0"
  }
}` ;

    // Generate directories
    try {
        // Stop spinner before prompting the user
        spinner.stop();

        // Prompt user for functions
        const functions = await promptForFunctions();

        // Create index.js and package.json
        await Promise.all([
            fs.promises.writeFile(path.join(targetDir, 'index.js'), indexJsContent),
            fs.promises.writeFile(path.join(targetDir, 'package.json'), packageJson),
        ]);

        // Create chaincode.js with user-defined functions
        const chaincodeJsContent = await generateChaincode(name, functions);
        await fs.promises.writeFile(path.join(libDir, 'chaincode.js'), chaincodeJsContent);

        // Generate README.md
        const readmeContent = `# ${name} Chaincode\n\nThis chaincode includes the following functions:\n\n${functions.map(f => `- ${f.name}: ${f.type}`).join('\n')}`;
        await fs.promises.writeFile(path.join(targetDir, 'README.md'), readmeContent);

        // Indicate success with the spinner
        spinner.succeed(chalk.green(`Chaincode '${name}' structure created successfully at '${targetDir}'`));
    } catch (err) {
        console.error(chalk.red('Error during file operations:', err.message));  // Log the error message
        spinner.fail(chalk.red('Error during file operations'));
        process.exit(1);
    }
})();
