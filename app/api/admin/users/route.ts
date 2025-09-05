// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/db'
import { getServerSession } from 'next-auth/next'
import { hashPassword } from '@/utils/hash'
import { authOptions } from '../../auth/[...nextauth]/options'

export async function GET() {
  // For listing users
  const users = await prisma.user.findMany({
    where: {
      role: { in: ['ADMIN', 'MANAGER'] }
    },
    select: { id: true, name: true, email: true, role: true }
  })
  return NextResponse.json({ users })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPERADMIN') {
    return new NextResponse(
      JSON.stringify({ message: 'Access denied' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const { name, email, password, role } = await request.json()

  if (!name || !email || !password || !role || !['ADMIN', 'MANAGER'].includes(role)) {
    return new NextResponse(
      JSON.stringify({ message: 'Missing or invalid fields' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const existingUser = await prisma.user.findUnique({ where: { email } })
  if (existingUser) {
    return new NextResponse(
      JSON.stringify({ message: 'User already exists' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const hashedPassword = await hashPassword(password)

  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword, role }
  })

  return NextResponse.json({ user }, { status: 201 })
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'SUPERADMIN') {
    return new NextResponse(
      JSON.stringify({ message: 'Access denied' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const url = new URL(request.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return new NextResponse(
      JSON.stringify({ message: 'Missing user id' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  await prisma.user.delete({ where: { id } })

  return new NextResponse(null, { status: 204 })
}

