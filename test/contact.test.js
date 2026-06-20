import supertest from "supertest";
import { web } from "../src/application/web.js";
import { prismaClient } from "../src/application/database.js";
import { logger } from "../src/application/logging.js"; 
import { createManyTestContacts, createTestContact, createTestUser, getTestContact, removeAllTestContacts, removeTestUser } from "./test-utils.js";

describe('POST /api/contacts', function () {

    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can create new contact', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'unittesttoken')
            .send({
                first_name: "Unit",
                last_name: "Test",
                email: "unittest@test.com",
                phone: "08123456789"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.first_name).toBe('Unit');
        expect(result.body.data.last_name).toBe('Test');
        expect(result.body.data.email).toBe('unittest@test.com');
        expect(result.body.data.phone).toBe('08123456789');
    });

    it('should reject if request is not valid', async () => {
        const result = await supertest(web)
            .post('/api/contacts')
            .set('Authorization', 'unittesttoken')
            .send({
                first_name: "",
                last_name: "Test",
                email: "test",
                phone: "0812345678987654321"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

});

describe('GET /api/contacts/:contactId', function () {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can get contact', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id)
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe(testContact.first_name);
        expect(result.body.data.last_name).toBe(testContact.last_name);
        expect(result.body.data.email).toBe(testContact.email);
        expect(result.body.data.phone).toBe(testContact.phone);
    });

    it('should return 404 if contact id is not found', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1)
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(404);
    });

});

describe('PUT /api/contacts/:contactId', function () {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can update existing contact', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization', 'unittesttoken')
            .send({
                first_name: "Unit Update",
                last_name: "Test Update",
                email: "unittestupdate@test.com",
                phone: "081234567891"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBe(testContact.id);
        expect(result.body.data.first_name).toBe('Unit Update');
        expect(result.body.data.last_name).toBe('Test Update');
        expect(result.body.data.email).toBe('unittestupdate@test.com');
        expect(result.body.data.phone).toBe('081234567891');
    });

    it('should reject if request is not valid', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id)
            .set('Authorization', 'unittesttoken')
            .send({
                first_name: "",
                last_name: "Test",
                email: "test",
                phone: "0812345678987654321"
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + 1)
            .set('Authorization', 'unittesttoken')
            .send({
                first_name: "Unit",
                last_name: "Test",
                email: "unittest@test.com",
                phone: "08123456789"
            });

        expect(result.status).toBe(404);
    });
   
});

describe('DELETE /api/contacts/:contactId', function () {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can delete contact', async () => {
        let testContact = await getTestContact();
        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id)
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data).toBe("Ok");

        testContact = await getTestContact();
        expect(testContact).toBeNull();
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + 1)
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(404);
    });

});

describe('GET /api/contacts', function () {

    beforeEach(async () => {
        await createTestUser();
        await createManyTestContacts();
    });

    afterEach(async () => {
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can search without parameter', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search to page 2', async () => {
        const result = await supertest(web)
            .get('/api/contacts?page=2')
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_item).toBe(15);
    });

    it('should can search using name', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                name: "test 1"
            })
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using email', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                email: "test1"
            })
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });

    it('should can search using phone', async () => {
        const result = await supertest(web)
            .get('/api/contacts')
            .query({
                phone: "0812345671"
            })
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_item).toBe(6);
    });
   
});