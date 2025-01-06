import type { CheckIn as PrismaCheckIn, Prisma } from '@prisma/client'

export type CheckIn = PrismaCheckIn

export type CheckInUncheckedCreateInput = Prisma.CheckInUncheckedCreateInput

export interface CheckInsRepository {
  findById(id: string): Promise<CheckIn | null>
  findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>
  findManyByUserId(userId: string, page: number): Promise<CheckIn[]>
  countByUserId(userId: string): Promise<number>
  create(data: CheckInUncheckedCreateInput): Promise<CheckIn>
  save(checkIn: CheckIn): Promise<CheckIn>
}
