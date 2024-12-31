import bcryptjs from 'bcryptjs'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import {
  AuthenticateUseCase,
  type AuthenticateUseCaseRequest,
} from './authenticate'
import { InvalidCredentialsError } from './errors/invalid-credentials-error'

describe('Authenticate Use Case', () => {
  const USER_EMAIL = 'johndoe@example.com'
  const USER_PASSWORD = '123456'

  const sutRequest: AuthenticateUseCaseRequest = {
    email: USER_EMAIL,
    password: USER_PASSWORD,
  }

  let usersRepository: InMemoryUsersRepository
  let sut: AuthenticateUseCase

  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    sut = new AuthenticateUseCase(usersRepository)
  })

  it('should be able to authenticate', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: USER_EMAIL,
      passwordHash: await bcryptjs.hash(USER_PASSWORD, 6),
    })

    const { user } = await sut.execute(sutRequest)

    expect(user.id).toEqual(expect.any(String))
  })

  it('should not be able to authenticate with wrong email', async () => {
    await expect(() => sut.execute(sutRequest)).rejects.toBeInstanceOf(
      InvalidCredentialsError,
    )
  })

  it('should not be able to authenticate with wrong password', async () => {
    await usersRepository.create({
      name: 'John Doe',
      email: USER_EMAIL,
      passwordHash: await bcryptjs.hash(USER_PASSWORD, 6),
    })

    const wrongPassword = '123123'

    await expect(() =>
      sut.execute({ ...sutRequest, password: wrongPassword }),
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})
