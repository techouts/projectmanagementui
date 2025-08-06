# Use Node.js base image

FROM node:21.6-alpine AS builder

# Set the working directory inside the container

WORKDIR /src/app

# Copy package.json and package-lock.json for dependency installation

COPY package*.json ./

# Install dependencies

RUN npm install

# Copy the rest of the files into the working directory

COPY . .

# Set environment variables

ENV NODE_ENV=production

ENV HOST=0.0.0.0

# Build the application

RUN npm run build

# Use a smaller runtime image for the final build

FROM node:21.6-alpine AS runner

# Set the working directory

WORKDIR /src/app

# Copy the build output and dependencies from the builder stage

COPY --from=builder /src/app .

# Expose the port for the application

EXPOSE 3000

# Start the application

CMD ["npm", "start"]
