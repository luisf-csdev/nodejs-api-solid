import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { SearchGymsUseCase } from './search-gyms'

describe('Fetch User Check-in History Use Case', () => {
  const NEARBY_GYM_ID = 'gym-01'
  const NEARBY_GYM_LATITUDE = 25.809581
  const NEARBY_GYM_LONGITUDE = -80.208504

  const DISTANT_GYM_ID = 'gym-02'
  const DISTANT_GYM_LATITUDE = 25.809581
  const DISTANTE_GYM_LONGITUDE = -80.214979

  let gymsRepository: InMemoryGymsRepository
  let sut: SearchGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new SearchGymsUseCase(gymsRepository)
  })

  it('should be able to search for gyms', async () => {
    await gymsRepository.create({
      id: NEARBY_GYM_ID,
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(NEARBY_GYM_LATITUDE),
      longitude: new Decimal(NEARBY_GYM_LONGITUDE),
    })

    await gymsRepository.create({
      id: DISTANT_GYM_ID,
      title: 'TypeScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(DISTANT_GYM_LATITUDE),
      longitude: new Decimal(DISTANTE_GYM_LONGITUDE),
    })

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 1,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'JavaScript Gym' })])
  })

  it('should be able to do a paginated gyms search', async () => {
    for (let i = 1; i <= 22; i++) {
      await gymsRepository.create({
        id: NEARBY_GYM_ID,
        title: `JavaScript Gym ${i}`,
        description: '',
        phone: '',
        latitude: new Decimal(NEARBY_GYM_LATITUDE),
        longitude: new Decimal(NEARBY_GYM_LONGITUDE),
      })
    }

    const { gyms } = await sut.execute({
      query: 'JavaScript',
      page: 2,
    })

    expect(gyms).toHaveLength(2)
    expect(gyms).toEqual([
      expect.objectContaining({ title: 'JavaScript Gym 21' }),
      expect.objectContaining({ title: 'JavaScript Gym 22' }),
    ])
  })
})
