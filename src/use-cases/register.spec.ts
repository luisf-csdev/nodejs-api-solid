import { describe, expect, it } from 'vitest'
import { createRegisterUseCase, RegisterUseCaseRequest } from './register'
import { compare } from 'bcryptjs'
import { createInMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

describe('Register Use Case', () => {
  const USER_EMAIL = 'johndoe@example.com'
  const USER_PASSWORD = '123456'

  const registerUseCaseRequest: RegisterUseCaseRequest = {
    name: 'John Doe',
    email: USER_EMAIL,
    password: USER_PASSWORD,
  }

  it('should be able to register', async () => {
    const usersRepository = createInMemoryUsersRepository()
    const registerUseCase = createRegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute(registerUseCaseRequest)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should hash user password upon registration', async () => {
    const usersRepository = createInMemoryUsersRepository()
    const registerUseCase = createRegisterUseCase(usersRepository)

    const { user } = await registerUseCase.execute(registerUseCaseRequest)

    const isPasswordCorrectlyHashed = await compare(
      USER_PASSWORD,
      user.passwordHash,
    )

    expect(isPasswordCorrectlyHashed).toBe(true)
  })

  it('should not be able to register with same email twice', async () => {
    const usersRepository = createInMemoryUsersRepository()
    const registerUseCase = createRegisterUseCase(usersRepository)

    await registerUseCase.execute(registerUseCaseRequest)

    await expect(() =>
      registerUseCase.execute(registerUseCaseRequest),
    ).rejects.toBeInstanceOf(UserAlreadyExistsError)
  })
})
