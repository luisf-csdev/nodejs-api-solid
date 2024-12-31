import { User, UsersRepository } from '../users-repository'

export function createInMemoryUsersRepository(): UsersRepository {
  const items: User[] = []

  return {
    async create(data) {
      const user: User = {
        id: 'user-1',
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        createdAt: new Date(),
      }

      items.push(user)

      return user
    },

    async findByEmail(email) {
      const user = items.find((item) => item.email === email)
      return user ?? null
    },
  }
}
