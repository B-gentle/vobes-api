import { AuthRouter } from './auth/entry.js'
import { honoApp } from '../middlewares/honoMiddleware.js'

export const services = honoApp()

services.route('/auth', AuthRouter)