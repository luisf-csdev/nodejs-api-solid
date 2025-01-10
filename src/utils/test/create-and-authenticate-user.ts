import bcryptjs from 'bcryptjs'
import type { FastifyInstance } from 'fastify'
import request from 'supertest'
import { prisma } from '@/lib/prisma'

export async function createAndAuthenticateUser(
  app: FastifyInstance,
  isAdmin = false,
) {
  const userEmail = 'johndoe@example.com'
  const userPassword = '123456'

  await prisma.user.create({
    data: {
      name: 'John Doe',
      email: userEmail,
      passwordHash: await bcryptjs.hash(userPassword, 6),
      role: isAdmin ? 'ADMIN' : 'MEMBER',
    },
  })

  const authResponse = await request(app.server).post('/sessions').send({
    email: userEmail,
    password: userPassword,
  })

  const { token } = authResponse.body

  return {
    token,
    userEmail,
  }
}
