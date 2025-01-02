import bcryptjs from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import { GetUserProfileUseCase } from './get-user-profile'

describe('Get User Profile Use Case', () => {
  const USER_NAME = 'John Doe'
  const USER_EMAIL = 'johndoe@example.com'
  const USER_PASSWORD = '123456'

  let usersRepository: InMemoryUsersRepository
  let sut: GetUserProfileUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new GetUserProfileUseCase(usersRepository)
  })

  it('should be able to get user profile', async () => {
    const createdUser = await usersRepository.create({
      name: USER_NAME,
      email: USER_EMAIL,
      passwordHash: await bcryptjs.hash(USER_PASSWORD, 6),
    })

    const { user } = await sut.execute({ userId: createdUser.id })

    expect(user.name).toEqual(USER_NAME)
  })

  it('should not be able to get user profile with wrong id', async () => {
    await expect(() =>
      sut.execute({ userId: 'non-existing-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
