import { prisma } from '@/lib/prisma'
import { UsersRepository } from './users-repository'

export function createPrismaUsersRepository(): UsersRepository {
  return {
    async create(data) {
      const user = await prisma.user.create({
        data,
      })

      return user
    },

    async findByEmail(email) {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      })

      return user
    },
  }
}
