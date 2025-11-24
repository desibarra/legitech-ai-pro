import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

declare const global: { prisma?: PrismaClient };

if (!global.prisma) {
    global.prisma = new PrismaClient();
}

prisma = global.prisma;

export default prisma;
