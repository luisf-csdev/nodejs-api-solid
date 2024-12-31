import { Prisma } from '@prisma/client'

export type User = {
  name: string
  id: string
  email: string
  passwordHash: string
  createdAt: Date
}

export type UsersRepository = {
  create(data: Prisma.UserCreateInput): Promise<User>
  findByEmail(email: string): Promise<User | null>
}
