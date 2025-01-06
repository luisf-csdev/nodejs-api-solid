import { Decimal } from '@prisma/client/runtime/library'
import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { FetchNearbyGymsUseCase } from './fetch-nearby-gyms'

describe('Fetch Nearby Gyms Use Case', () => {
  const NEARBY_GYM_ID = 'nearby-gym-id'
  const NEARBY_GYM_LATITUDE = 25.809581
  const NEARBY_GYM_LONGITUDE = -80.208504

  const OVER_LIMIT_GYM_ID = 'over-limit-gym-id'
  const OVER_LIMIT_GYM_LATITUDE = 40.730277
  const OVER_LIMIT_GYM_LONGITUDE = -73.753088

  let gymsRepository: InMemoryGymsRepository
  let sut: FetchNearbyGymsUseCase

  beforeEach(async () => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new FetchNearbyGymsUseCase(gymsRepository)
  })

  it('should be able to fetch nearby gyms', async () => {
    await gymsRepository.create({
      id: NEARBY_GYM_ID,
      title: 'Nearby Gym',
      description: '',
      phone: '',
      latitude: new Decimal(NEARBY_GYM_LATITUDE),
      longitude: new Decimal(NEARBY_GYM_LONGITUDE),
    })

    await gymsRepository.create({
      id: OVER_LIMIT_GYM_ID,
      title: 'Over-limit Gym',
      description: '',
      phone: '',
      latitude: new Decimal(OVER_LIMIT_GYM_LATITUDE),
      longitude: new Decimal(OVER_LIMIT_GYM_LONGITUDE),
    })

    const { gyms } = await sut.execute({
      userLatitude: NEARBY_GYM_LATITUDE,
      userLongitude: NEARBY_GYM_LONGITUDE,
    })

    expect(gyms).toHaveLength(1)
    expect(gyms).toEqual([expect.objectContaining({ title: 'Nearby Gym' })])
  })
})
