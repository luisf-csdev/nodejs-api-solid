import bcryptjs from 'bcryptjs'
import type { User, UsersRepository } from '@/repositories/users-repository'
import { UserAlreadyExistsError } from './errors/user-already-exists-error'

export interface RegisterUseCaseRequest {
  name: string
  email: string
  password: string
}

export interface RegisterUseCaseResponse {
  user: User
}

export class RegisterUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    name,
    email,
    password,
  }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
    const passwordHash = await bcryptjs.hash(password, 6)

    const userWithSameEmail = await this.usersRepository.findByEmail(email)

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError()
    }

    const user = await this.usersRepository.create({
      name,
      email,
      passwordHash,
    })

    return {
      user,
    }
  }
}
