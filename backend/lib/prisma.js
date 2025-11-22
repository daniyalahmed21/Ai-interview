// backend/lib/prisma.js
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient(); // <-- just instantiate normally

module.exports = prisma;
