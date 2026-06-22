import express from 'express';
import { authMiddleware } from '../middleware/auth-middlware.js';
import userController from '../controller/user-controller.js';
import contactController from '../controller/contact-controller.js';
import addressController from '../controller/address-controller.js';
const apiRouter = new express.Router();

apiRouter.use(authMiddleware);

apiRouter.get('/api/users/current', userController.get);
apiRouter.patch('/api/users/current', userController.update);
apiRouter.delete('/api/users/logout', userController.logout);

apiRouter.post('/api/contacts', contactController.create);
apiRouter.get('/api/contacts/:contactId', contactController.get);
apiRouter.put('/api/contacts/:contactId', contactController.update);
apiRouter.delete('/api/contacts/:contactId', contactController.remove);
apiRouter.get('/api/contacts', contactController.search);

apiRouter.post('/api/contacts/:contactId/addresses', addressController.create);
apiRouter.get('/api/contacts/:contactId/addresses/:addressId', addressController.get);
apiRouter.put('/api/contacts/:contactId/addresses/:addressId', addressController.update);
apiRouter.delete('/api/contacts/:contactId/addresses/:addressId', addressController.remove);
apiRouter.get('/api/contacts/:contactId/addresses', addressController.list);

export {
    apiRouter
}