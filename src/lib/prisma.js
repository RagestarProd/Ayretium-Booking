import { PrismaClient } from '@prisma/client'

let prisma

if (process.env.NODE_ENV === 'production') {
	prisma = new PrismaClient()
} else {
	// In development, attach to global to avoid multiple instances caused by hot reloads
	if (!global.prisma) {
		global.prisma = new PrismaClient()
	}
	prisma = global.prisma
}

export default prisma
