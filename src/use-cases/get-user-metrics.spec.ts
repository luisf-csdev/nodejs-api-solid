import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { GetUserMetricsUseCase } from './get-user-metrics'

describe('Get User Metrics Use Case', () => {
  const USER_ID = 'user-01'

  const NEARBY_GYM_ID = 'gym-01'
  const DISTANT_GYM_ID = 'gym-02'

  let checkInsRepository: InMemoryCheckInsRepository
  let sut: GetUserMetricsUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new GetUserMetricsUseCase(checkInsRepository)
  })

  it('should be able to get check-ins count from metrics', async () => {
    await checkInsRepository.create({
      gymId: NEARBY_GYM_ID,
      userId: USER_ID,
    })

    await checkInsRepository.create({
      gymId: DISTANT_GYM_ID,
      userId: USER_ID,
    })

    const { checkInsCount } = await sut.execute({
      userId: USER_ID,
    })

    expect(checkInsCount).toEqual(2)
  })
})
