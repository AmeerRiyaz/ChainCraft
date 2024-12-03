

# ChainCraft - Chaincode Generator

A command-line tool for generating a structure for Hyperledger Fabric chaincode. This tool helps you easily create a customizable chaincode by defining various functions such as query, create, and history tracking.

## Features

- Generate a customizable chaincode structure for Hyperledger Fabric.
- Define multiple types of functions: Query, Create, Composite Key-based Create, Query All Transactions, and History.
- Easily extendable with custom functions.
- Prompts user for necessary input like chaincode name and function details.
- Generates all necessary files: `index.js`, `package.json`, `chaincode.js`, and `README.md`.
- Supports Docker to simplify execution and portability.

![chaincraft](https://github.com/user-attachments/assets/4908f606-7071-4165-852f-afa680236ce2)

---

## Installation

### Using Node.js
1. Clone the repository:
   ```bash
   git clone https://github.com/AmeerRiyaz/ChainCraft.git
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Ensure you have Node.js version 12 or higher installed.

---

## Docker Support

To simplify execution and avoid dependency issues, ChainCraft can be run using Docker. The pre-built Docker image includes all necessary dependencies to execute ChainCraft commands.

### Docker Image

The ChainCraft Docker image is available on Docker Hub: `ameerriyaz/chaincraft:1.0`.

### Pull the Docker Image

Ensure you have Docker installed. Pull the image with:
```bash
docker pull ameerriyaz/chaincraft:1.0
```

---

## Usage

### Using Node.js

Run the generator with:
```bash
node generate.mjs --name <chaincode-name> --dir <target-directory>
```

Where:
- `<chaincode-name>` is the name of your chaincode (e.g., `asset`).
- `<target-directory>` is the directory where the chaincode structure should be created.

#### Example
```bash
node generate.mjs --name myChaincode --dir ./chaincode
```

---

### Using Docker

Run the generator inside the Docker container with:
```bash
docker run -it --rm \
  -v "$(pwd)/chaincodes:/usr/src/app/chaincodes" \
  ameerriyaz/chaincraft:1.0 \
  --name <chaincode-name> --dir /usr/src/app/chaincodes
```

#### Explanation:
- `-it`: Runs the container interactively.
- `--rm`: Automatically removes the container after execution.
- `-v "$(pwd)/chaincodes:/usr/src/app/chaincodes"`: Maps the local `chaincodes` directory to the container directory `/usr/src/app/chaincodes`. This ensures generated chaincode files are stored locally.
- `ameerriyaz/chaincraft:1.0`: Specifies the Docker image to use.
- `--name <chaincode-name>`: Name of the chaincode to generate.
- `--dir /usr/src/app/chaincodes`: Specifies the directory inside the container for the chaincode files.

#### Example:
```bash
docker run -it --rm \
  -v "$(pwd)/chaincodes:/usr/src/app/chaincodes" \
  ameerriyaz/chaincraft:1.0 \
  --name myChaincode --dir /usr/src/app/chaincodes
```

The generated chaincode files will be available in your local `chaincodes` directory.

---

### Using the `chaincraft` Binary

The `chaincraft` binary provides a simplified way to run ChainCraft using Docker. The binary script automatically checks for the required Docker image and pulls it if not available.

#### Steps:
1. Ensure the `chaincraft` script is executable:
   ```bash
   chmod +x chaincraft
   ```

2. Run the generator:
   ```bash
   ./chaincraft --name <chaincode-name> --dir <target-directory>
   ```

#### Example:
```bash
./chaincraft --name myChaincode --dir /usr/src/app/chaincodes
```

This script will:
1. Check if the Docker image exists locally. If not, it will pull the image from Docker Hub.
2. Run the Docker container with the necessary arguments.
3. Save the generated chaincode files in the specified target directory.

---

## Custom Functions

While generating chaincode, you can define different types of functions:
- **Query**: Retrieve data by key.
- **Create**: Add new data to the ledger.
- **Create with Composite Key**: Add data using a composite key.
- **Query All Transactions**: Retrieve all transactions.
- **History**: Get the history of a key.
- **Custom**: Define your own function.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Contributing

Feel free to fork the repository and submit pull requests. Contributions are always welcome!

For any issues or requests, please open an issue on the [GitHub repository](https://github.com/AmeerRiyaz/ChainCraft.git).
