import { User, UsersRepository } from '@/repositories/users-repository'
import { hash } from 'bcryptjs'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export type RegisterUseCaseRequest = {
  name: string
  email: string
  password: string
}

export type RegisterUseCaseResponse = {
  user: User
}

export function createRegisterUseCase(usersRepository: UsersRepository) {
  const execute = async ({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> => {
    const passwordHash = await hash(password, 6)

    const userWithSameEmail = await usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await usersRepository.create({
      name,
      email,
      passwordHash,
    })

    return {
      user,
    }
  }

  return {
    execute,
  }
}
