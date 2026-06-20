import supertest from "supertest";
import {web} from "../src/application/web.js";
import {prismaClient} from "../src/application/database.js";
import {logger} from "../src/application/logging.js";
import { createTestUser, getTestUser, removeTestUser } from "./test-utils.js";
import bcrypt from "bcrypt";

describe('POST /api/users', function () {

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can register new user', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: "unittest",
                password: "rahasiaunittest",
                name: "Unit Test"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe("unittest");
        expect(result.body.data.name).toBe("Unit Test");
        expect(result.body.data.password).toBeUndefined();
    });

    it('showuld reject register if request invalid', async () => {
        const result = await supertest(web)
            .post('/api/users')
            .send({
                username: "",
                password: "",
                name: "",
            })

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if user existed', async () => {
        let result = await supertest(web)
            .post('/api/users')
            .send({
                username: "unittest",
                password: "rahasiaunittest",
                name: "Unit Test"
            });

        result = await supertest(web)
            .post('/api/users')
            .send({
                username: "unittest",
                password: "rahasiaunittest",
                name: "Unit Test"
            })

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

});

describe("POST /api/users/login", function () {
  
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'unittest',
                password: 'rahasiaunittest'
            });

        expect(result.status).toBe(200)
        expect(result.body.data.token).toBeDefined();
        expect(result.body.data.token).not.toBe('unittesttoken');
    });

    it('should reject login if request invalid', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: '',
                password: ''
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if password is wrong', async () => {
        const result = await supertest(web)
            .post('/api/users/login')
            .send({
                username: 'unittest',
                password: 'unittestwrong'
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

});

describe('GET /api/users/current', function () {
   
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can get current user', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'unittesttoken')

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('unittest');
        expect(result.body.data.name).toBe('Unit Test');
    });

    it('should reject if token invalid', async () => {
        const result = await supertest(web)
            .get('/api/users/current')
            .set('Authorization', 'unittesttokeninvalid')

        expect(result.status).toBe(401)
        expect(result.body.errors).toBeDefined();
    });

});

describe('PATCH /api/users/current', function () {

    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can be update user', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'unittesttoken')
            .send({
                name: "Unit Test Update",
                password: "rahasiaunittestupdate"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('unittest');
        expect(result.body.data.name).toBe('Unit Test Update');

        const user = await getTestUser();
        expect(await bcrypt.compare('rahasiaunittestupdate', user.password)).toBeTruthy();
    });

    it('should can update user name', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'unittesttoken')
            .send({
                name: "Unit Test Update"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('unittest');
        expect(result.body.data.name).toBe('Unit Test Update');
    });

    it('should can update user password', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'unittesttoken')
            .send({
                password: "rahasiaunittestupdate"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.username).toBe('unittest');
        expect(result.body.data.name).toBe('Unit Test');

        const user = await getTestUser();
        expect(await bcrypt.compare('rahasiaunittestupdate', user.password)).toBeTruthy();
    });

    it('should reject if token invalid', async () => {
        const result = await supertest(web)
            .patch('/api/users/current')
            .set('Authorization', 'unittesttokeninvalid')
            .send({});

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

});

describe('DELETE /api/users/logout', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can logout', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe('Ok');

        const user = await getTestUser();
        expect(user.token).toBeNull();
    });

    it('should reject logout if token is invalid', async () => {
        const result = await supertest(web)
            .delete('/api/users/logout')
            .set('Authorization', 'unittesttokeninvalid');

        expect(result.status).toBe(401);
    })
})