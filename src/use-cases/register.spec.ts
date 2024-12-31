import bcryptjs from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'
import { RegisterUseCase, type RegisterUseCaseRequest } from './register'

describe('Register Use Case', () => {
  const USER_EMAIL = 'johndoe@example.com'
  const USER_PASSWORD = '123456'

  const registerUseCaseRequest: RegisterUseCaseRequest = {
    name: 'John Doe',
    email: USER_EMAIL,
    password: USER_PASSWORD,
  }

  let usersRepository: InMemoryUsersRepository
  let sut: RegisterUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new RegisterUseCase(usersRepository)
  })

  it('should be able to register', async () => {
    const { user } = await sut.execute(registerUseCaseRequest)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const { user } = await sut.execute(registerUseCaseRequest)

    const isPasswordCorrectlyHashed = await bcryptjs.compare(
      USER_PASSWORD,
      user.passwordHash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    await sut.execute(registerUseCaseRequest)

    await expect(() =>
      sut.execute(registerUseCaseRequest),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
