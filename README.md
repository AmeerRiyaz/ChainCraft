


# ChainCraft - Chaincode Generator

A command-line tool for generating a structure for Hyperledger Fabric chaincode. This tool helps you easily create a customizable chaincode by defining various functions such as query, create, and history tracking.

## Features

- Generate a customizable chaincode structure for Hyperledger Fabric.
- Define multiple types of functions: Query, Create, Composite Key-based Create, Query All Transactions, and History.
- Easily extendable with custom functions.
- Prompts user for necessary input like chaincode name and function details.
- Generates all necessary files: `index.js`, `package.json`, `chaincode.js`, and `README.md`.

![chaincraft](https://github.com/user-attachments/assets/4908f606-7071-4165-852f-afa680236ce2)


## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/AmeerRiyaz/ChainCraft.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Make sure you have Node.js version 12 or higher installed.

## Usage

You can use the tool directly from the command line.

```bash
node generate.mjs --name <chaincode-name> --dir <target-directory>
```

Where:
- `<chaincode-name>` is the name of your chaincode (e.g., `asset`).
- `<target-directory>` is the directory where the chaincode structure should be created.

### Example

```bash
node generate.mjs --name myChaincode --dir ./chaincode
```

This will create a new directory `./chaincode/myChaincode` with the necessary files for the chaincode.

## Custom Functions

While generating chaincode, you can define different types of functions:
- **Query**: Retrieve data by key.
- **Create**: Add new data to the ledger.
- **Create with Composite Key**: Add data using a composite key.
- **Query All Transactions**: Retrieve all transactions.
- **History**: Get the history of a key.
- **Custom**: Define your own function.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contributing

Feel free to fork the repository and submit pull requests. Contributions are always welcome!



For any issues or requests, please open an issue on the [GitHub repository] https://github.com/AmeerRiyaz/ChainCraft.git.



