import { Decimal } from '@prisma/client/runtime/library'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { InMemoryGymsRepository } from '@/repositories/in-memory/in-memory-gyms-repository'
import { CheckInUseCase } from './check-in'
import { MaxDistanceError } from './errors/max-distance-error'
import { MaxNumberOfCheckInsError } from './errors/max-number-of-check-ins-error'

describe('Check-in Use Case', () => {
  const USER_ID = 'user-01'

  const NEARBY_GYM_ID = 'gym-01'
  const NEARBY_GYM_LATITUDE = 25.809581
  const NEARBY_GYM_LONGITUDE = -80.208504

  const DISTANT_GYM_ID = 'gym-02'
  const DISTANT_GYM_LATITUDE = 25.809581
  const DISTANT_GYM_LONGITUDE = -80.214979

  let checkInsRepository: InMemoryCheckInsRepository
  let gymsRepository: InMemoryGymsRepository
  let sut: CheckInUseCase

  beforeEach(async () => {
    checkInsRepository = new InMemoryCheckInsRepository()
    gymsRepository = new InMemoryGymsRepository()
    sut = new CheckInUseCase(checkInsRepository, gymsRepository)

    await gymsRepository.create({
      id: NEARBY_GYM_ID,
      title: 'JavaScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(NEARBY_GYM_LATITUDE),
      longitude: new Decimal(NEARBY_GYM_LONGITUDE),
    })

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to check in', async () => {
    const { checkIn } = await sut.execute({
      gymId: NEARBY_GYM_ID,
      userId: USER_ID,
      userLatitude: NEARBY_GYM_LATITUDE,
      userLongitude: NEARBY_GYM_LONGITUDE,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in twice in the same day', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: NEARBY_GYM_ID,
      userId: USER_ID,
      userLatitude: NEARBY_GYM_LATITUDE,
      userLongitude: NEARBY_GYM_LONGITUDE,
    })

    await expect(() =>
      sut.execute({
        gymId: NEARBY_GYM_ID,
        userId: USER_ID,
        userLatitude: NEARBY_GYM_LATITUDE,
        userLongitude: NEARBY_GYM_LONGITUDE,
      }),
    ).rejects.toBeInstanceOf(MaxNumberOfCheckInsError)
  })

  it('should be able to check in twice but in different days', async () => {
    vi.setSystemTime(new Date(2022, 0, 20, 8, 0, 0))

    await sut.execute({
      gymId: NEARBY_GYM_ID,
      userId: USER_ID,
      userLatitude: NEARBY_GYM_LATITUDE,
      userLongitude: NEARBY_GYM_LONGITUDE,
    })

    vi.setSystemTime(new Date(2022, 0, 21, 8, 0, 0))

    const { checkIn } = await sut.execute({
      gymId: NEARBY_GYM_ID,
      userId: USER_ID,
      userLatitude: NEARBY_GYM_LATITUDE,
      userLongitude: NEARBY_GYM_LONGITUDE,
    })

    expect(checkIn.id).toEqual(expect.any(String))
  })

  it('should not be able to check in on distant gym', async () => {
    await gymsRepository.create({
      id: DISTANT_GYM_ID,
      title: 'TypeScript Gym',
      description: '',
      phone: '',
      latitude: new Decimal(DISTANT_GYM_LATITUDE),
      longitude: new Decimal(DISTANT_GYM_LONGITUDE),
    })

    await expect(() =>
      sut.execute({
        gymId: DISTANT_GYM_ID,
        userId: USER_ID,
        userLatitude: NEARBY_GYM_LATITUDE,
        userLongitude: NEARBY_GYM_LONGITUDE,
      }),
    ).rejects.toBeInstanceOf(MaxDistanceError)
  })
})
