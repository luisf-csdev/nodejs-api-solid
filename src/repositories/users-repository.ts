import type { Prisma, User as PrismaUser } from '@prisma/client'

export type UserCreateInput = Prisma.UserCreateInput

export type User = PrismaUser

export type UsersRepository = {
  create(data: UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
}
