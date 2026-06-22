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

export const createTestContact = async () => {
    await prismaClient.contact.create({
        data: {
            username: "unittest",
            first_name: "Unit",
            last_name: "Test",
            email: "unittest@test.com",
            phone: "08123456789"
        }
    });
}


export const createManyTestContacts = async () => {
    for (let i = 0; i < 15; i++) {
        await prismaClient.contact.create({
            data: {
                username: "unittest",
                first_name: `Unit ${i}`,
                last_name: `Test ${i}`,
                email: `unittest${i}@test.com`,
                phone: `081234567${i}`
            }
        });
    }
}

export const getTestContact = async () => {
    return prismaClient.contact.findFirst({
        where: {
            username: "unittest"
        }
    });
}

export const removeAllTestContacts = async () => {
    await prismaClient.contact.deleteMany({
        where: {
            username: "unittest"
        }
    });
}

export const createTestAddresses = async () => {
    const contact = await getTestContact();
    await prismaClient.address.create({
        data: {
            contact_id: contact.id,
            street: "Unit Test Street",
            city: "Unit Test City",
            province: "Unit Test Province",
            country: "Unit Test Country",
            postal_code: "12345"
        }
    });
}

export const getTestAddress = async () => {
    return prismaClient.address.findFirst({
        where: {
            contact: {
                username: "unittest"
            }
        }
    });
}

export const removeAllTestAddresses = async () => {
    await prismaClient.address.deleteMany({
        where: {
            contact: {
                username: "unittest"
            }
        }
    });
}