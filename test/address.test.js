import supertest from "supertest";
import {web} from "../src/application/web.js";
import { createTestAddresses, createTestContact, createTestUser, getTestAddress, getTestContact, removeAllTestAddresses, removeAllTestContacts, removeTestUser } from "./test-utils.js";

describe('POST /api/contacts/:contactId/addresses', function () {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can create new address', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'unittesttoken')
            .send({
                street: "Unit Test Street",
                city: "Unit Test City",
                province: "Unit Test Province",
                country: "Unit Test Country",
                postal_code: "12345"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.street).toBe('Unit Test Street');
        expect(result.body.data.city).toBe('Unit Test City');
        expect(result.body.data.province).toBe('Unit Test Province');
        expect(result.body.data.country).toBe('Unit Test Country');
        expect(result.body.data.postal_code).toBe('12345');
    });

    it('should reject if address request is invalid', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .post('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'unittesttoken')
            .send({
                street: "Unit Test Street",
                city: "Unit Test City",
                province: "",
                country: "",
                postal_code: ""
            });

        expect(result.status).toBe(400);
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const result = await supertest(web)
            .post('/api/contacts/' + testContact.id + 1 + '/addresses')
            .set('Authorization', 'unittesttoken')
            .send({
                street: "Unit Test Street",
                city: "Unit Test City",
                province: "Unit Test Province",
                country: "Unit Test Country",
                postal_code: "12345"
            });

        expect(result.status).toBe(404);
    });

});

describe('GET /api/contacts/:contactId/addresses/:addressId', function () {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddresses();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can get contact', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data.id).toBeDefined();
        expect(result.body.data.street).toBe('Unit Test Street');
        expect(result.body.data.city).toBe('Unit Test City');
        expect(result.body.data.province).toBe('Unit Test Province');
        expect(result.body.data.country).toBe('Unit Test Country');
        expect(result.body.data.postal_code).toBe('12345');
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1 + '/addresses/' + testAddress.id)
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(404);
    });

});

describe('PUT /api/contacts/:contactId/addresses/:addressId', function () {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddresses();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can update address', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'unittesttoken')
            .send({
                street: "Unit Test Street Update",
                city: "Unit Test City Update",
                province: "Unit Test Province Update",
                country: "Unit Test Country Update",
                postal_code: "54321"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.street).toBe('Unit Test Street Update');
        expect(result.body.data.city).toBe('Unit Test City Update');
        expect(result.body.data.province).toBe('Unit Test Province Update');
        expect(result.body.data.country).toBe('Unit Test Country Update');
        expect(result.body.data.postal_code).toBe('54321');
    });

    it('should reject if request is not valid', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'unittesttoken')
            .send({
                street: "Unit Test Street Update",
                city: "Unit Test City Update",
                province: "",
                country: "",
                postal_code: ""
            });

        expect(result.status).toBe(400);
    });

    it('should reject if address is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .put('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id + 1)
            .set('Authorization', 'unittesttoken')
            .send({
                street: "Unit Test Street Update",
                city: "Unit Test City Update",
                province: "Unit Test Province Update",
                country: "Unit Test Country Update",
                postal_code: "54321"
            });

        expect(result.status).toBe(404);
    });

});

describe('DELETE /api/contacts/:contactId/addresses/:addressId', function () {

    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddresses();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can remove address', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id)
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
    });

    it('should reject if address is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + '/addresses/' + testAddress.id + 1)
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(404);
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();
        const testAddress = await getTestAddress();

        const result = await supertest(web)
            .delete('/api/contacts/' + testContact.id + 1 + '/addresses/' + testAddress.id)
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(404);
    });

});

describe('GET /api/contacts/:contactId/addresses', function () {
    
    beforeEach(async () => {
        await createTestUser();
        await createTestContact();
        await createTestAddresses();
    });

    afterEach(async () => {
        await removeAllTestAddresses();
        await removeAllTestContacts();
        await removeTestUser();
    });

    it('should can list address', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + '/addresses')
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(1);
    });

    it('should reject if contact is not found', async () => {
        const testContact = await getTestContact();

        const result = await supertest(web)
            .get('/api/contacts/' + testContact.id + 1 + '/addresses')
            .set('Authorization', 'unittesttoken');

        expect(result.status).toBe(404);
    })

});