import type { User, UsersRepository } from '@/repositories/users-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

export interface GetUserProfileUseCaseRequest {
  userId: string
}

export interface GetUserProfileUseCaseResponse {
  user: User
}

export class GetUserProfileUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserProfileUseCaseRequest): Promise<GetUserProfileUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      throw new ResourceNotFoundError()
    }

    return {
      user,
    }
  }
}
