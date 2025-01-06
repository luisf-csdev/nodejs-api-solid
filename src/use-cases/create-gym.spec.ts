import { beforeEach, describe, expect, it } from 'vitest'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CreateGymUseCase } from './create-gym'

describe('Create Gym Use Case', () => {
  const NEARBY_GYM_LATITUDE = 25.809581
  const NEARBY_GYM_LONGITUDE = -80.208504

  let gymsRepository: InMemoryGymsRepository
  let sut: CreateGymUseCase

  beforeEach(() => {
    gymsRepository = new InMemoryGymsRepository()
    sut = new CreateGymUseCase(gymsRepository)
  })

  it('should be able to create gym', async () => {
    const { gym } = await sut.execute({
      title: 'JavaScript Gym',
      description: null,
      phone: null,
      latitude: NEARBY_GYM_LATITUDE,
      longitude: NEARBY_GYM_LONGITUDE,
    })

    expect(gym.id).toEqual(expect.any(String))
  })
})
