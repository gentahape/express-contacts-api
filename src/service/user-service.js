import { ResponseError } from "../error/response-error.js";
import { getUserValidation, loginUserValidation, registerUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../application/database.js";
import bcrypt from "bcrypt";
import { v7 as uuid } from "uuid";

const register = async (request) => {
    const user = validate(registerUserValidation, request);

    const userExist = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (userExist > 0) {
        throw new ResponseError(400, "User already exist");
    }

    user.password = await bcrypt.hash(user.password, 10);

    return prismaClient.user.create({
        data: user,
        select: {
            username: true,
            name: true
        }
    });
}

const login = async (request) => {
    const loginReq = validate(loginUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: loginReq.username
        },
        select: {
            username: true,
            password: true
        }
    });
    if (!user) {
        throw new ResponseError(401, "Username or password is wrong");
    }

    const isPwdValid = await bcrypt.compare(loginReq.password, user.password);
    if (!isPwdValid) {
        throw new ResponseError(401, "Username or password is wrong");
    }

    const token = uuid().toString();
    return prismaClient.user.update({
        data: {
            token: token
        },
        where: {
            username: user.username
        },
        select: {
            token: true
        }
    });
}

const get = async (request) => {
    const username = validate(getUserValidation, request);
    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        },
        select: {
            username: true,
            name: true,
        }
    });
    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return user;
}

const update = async (request) => {
    const user = validate(updateUserValidation, request);

    const userExist = await prismaClient.user.count({
        where: {
            username: user.username
        }
    });

    if (userExist === 0) {
        throw new ResponseError(404, "User not found");
    }

    const data = {};
    if (user.name) {
        data.name = user.name;
    }

    if (user.password) {
        data.password = await bcrypt.hash(user.password, 10);
    }

    return prismaClient.user.update({
        where: {
            username: user.username
        },
        data: data,
        select: {
            username: true,
            name: true
        }
    });
}

const logout = async (request) => {
    const username = validate(getUserValidation, request);

    const user = await prismaClient.user.findUnique({
        where: {
            username: username
        }
    });

    if (!user) {
        throw new ResponseError(404, "User not found");
    }

    return prismaClient.user.update({
        where: {
            username: username
        },
        data: {
            token: null
        },
        select: {
            username: true
        }
    });
}

export default {
    register,
    login,
    get,
    update,
    logout
}