# AI Prompt Log

This file documents the AI prompts and assistance used during the development of this project.

## Conversation — tsconfig.json

I'm setting up a TypeScript Express backend. Explain what should go in tsconfig.json and why each option is needed.

**AI**

For a **TypeScript + Express backend**, `tsconfig.json` tells TypeScript **how to convert your** **`.ts`** **code into JavaScript** and what rules to use while checking your code.

A good starting configuration is:

{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "rootDir": "./src",
    "outDir": "./dist",
    "esModuleInterop": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
What each option means
Option	What it does	Why you need it
target	Decides which JavaScript version TypeScript produces	ES2022 lets you use modern JS features
module	Decides how import/export are converted	CommonJS works well with a traditional Node.js/Express setup
rootDir	Tells TypeScript where your source code lives	Keeps your source organized inside src/
outDir	Where compiled JavaScript is placed	Your .ts files in src/ become .js files in dist/
esModuleInterop	Makes CommonJS packages work nicely with ES-style imports	Lets you write things like import express from "express"
strict	Enables TypeScript's strict type checking	Catches many bugs before you run the backend
forceConsistentCasingInFileNames	Makes filename casing consistent	Prevents problems when moving between Windows/Linux
skipLibCheck	Skips type-checking declaration files inside dependencies	Makes compilation faster and avoids unrelated library type errors
include	Specifies which files TypeScript should compile	Here, everything under src/
exclude	Specifies files/directories to ignore	Prevents compiling node_modules and already-built dist
How it fits into your project

Suppose your project is:

backend/
├── src/
│   ├── server.ts
│   ├── routes/
│   ├── controllers/
│   └── services/
├── dist/
├── package.json
├── tsconfig.json
└── node_modules/

You write:

src/server.ts

TypeScript compiles it to something like:

dist/server.js

So the basic flow is:

You write TypeScript
        ↓
     src/*.ts
        ↓
   TypeScript compiler
        ↓
     dist/*.js
        ↓
      Node.js
One important point

tsconfig.json doesn't install TypeScript, Express, or anything else. It only configures the TypeScript compiler.

For example:

npm install express
npm install -D typescript ts-node @types/node @types/express

Then tsconfig.json tells TypeScript how to handle the TypeScript code in your project.

Also, since you're still in the project setup phase, you don't need to overcomplicate this file. The configuration above is a solid baseline; you can add options later when your actual backend requires them.