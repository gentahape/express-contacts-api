import express from "express";
import userController from "../controller/user-controller.js";

const publicApi = new express.Router();

publicApi.post("/api/users", userController.register);
publicApi.post("/api/users/login", userController.login);

export {
    publicApi
}