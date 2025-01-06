import type { Gym as PrismaGym, Prisma } from '@prisma/client'

export type Gym = PrismaGym
export type GymCreateInput = Prisma.GymCreateInput

export interface FindManyNearbyParams {
  latitude: number
  longitude: number
}

export interface GymsRepository {
  findById(id: string): Promise<Gym | null>
  findManyNearby(params: FindManyNearbyParams): Promise<Gym[]>
  searchMany(query: string, page: number): Promise<Gym[]>
  create(data: GymCreateInput): Promise<Gym>
}
