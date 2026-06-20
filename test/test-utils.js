import { prismaClient } from "../src/application/database.js"
import bcrypt from "bcrypt";

export const createTestUser = async () => {
    await prismaClient.user.create({
        data: {
            username: "unittest",
            password: await bcrypt.hash("rahasiaunittest", 10),
            name: "Unit Test",
            token: "unittesttoken"
        }
    });
}

export const getTestUser = async () => {
    return prismaClient.user.findUnique({
        where: {
            username: "unittest"
        }
    });
}

export const removeTestUser = async () => {
    await prismaClient.user.deleteMany({
        where: {
            username: "unittest"
        }
    });
}