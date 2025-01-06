import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { FetchUserCheckInsHistoryUseCase } from './fetch-user-check-ins-history'

describe('Fetch User Check-in History Use Case', () => {
  const USER_ID = 'user-01'

  const NEARBY_GYM_ID = 'gym-01'
  const DISTANT_GYM_ID = 'gym-02'

  let checkInsRepository: InMemoryCheckInsRepository
  let sut: FetchUserCheckInsHistoryUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    sut = new FetchUserCheckInsHistoryUseCase(checkInsRepository)
  })

  it('should be able to fetch check-in history', async () => {
    await checkInsRepository.create({
      gymId: NEARBY_GYM_ID,
      userId: USER_ID,
    })

    await checkInsRepository.create({
      gymId: DISTANT_GYM_ID,
      userId: USER_ID,
    })

    const { checkIns } = await sut.execute({
      userId: USER_ID,
      page: 1,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: NEARBY_GYM_ID }),
      expect.objectContaining({ gymId: DISTANT_GYM_ID }),
    ])
  })

  it('should be able to fetch paginated check-in history', async () => {
    for (let i = 1; i <= 22; i++) {
      await checkInsRepository.create({
        gymId: `gym-${i}`,
        userId: USER_ID,
      })
    }

    const { checkIns } = await sut.execute({
      userId: USER_ID,
      page: 2,
    })

    expect(checkIns).toHaveLength(2)
    expect(checkIns).toEqual([
      expect.objectContaining({ gymId: 'gym-21' }),
      expect.objectContaining({ gymId: 'gym-22' }),
    ])
  })
})
