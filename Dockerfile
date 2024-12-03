# Step 1: Use a base image that has Node.js pre-installed
FROM node:18

# Step 2: Set the working directory inside the container
WORKDIR /usr/src/app

# Step 3: Copy package.json and package-lock.json (if present) to the container
COPY package*.json ./

# Step 4: Install dependencies
RUN npm install

# Step 5: Copy the rest of the application files
COPY . .

# Step 6: Use an ENTRYPOINT that properly passes arguments
ENTRYPOINT ["node", "generate.mjs"]

# Step 7: Set default CMD to provide example arguments (can be overridden at runtime)
CMD ["--name", "defaultChaincode", "--dir", "/usr/src/app/chaincodes"]
