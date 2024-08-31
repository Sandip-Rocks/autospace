import { BadRequestException, Injectable } from '@nestjs/common'
import { FindManyUserArgs, FindUniqueUserArgs } from './dtos/find.args'
import { PrismaService } from 'src/common/prisma/prisma.service'
import { UpdateUserInput } from './dtos/update-user.input'
import {
  LoginInput,
  LoginOutput,
  RegisterWithCredentialsInput,
  RegisterWithProviderInput,
} from './dtos/create-user.input'
import * as bcrypt from 'bcryptjs'
import { v4 as uuid } from 'uuid'
import { AuthProviderType } from '@prisma/client'
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  registerWithProvider({ image, name, uid, type }: RegisterWithProviderInput) {
    return this.prisma.user.create({
      data: {
        uid,
        name,
        image,
        AuthProvider: {
          create: {
            type,
          },
        },
      },
    })
  }

  async registerWithCredentials({
    email,
    name,
    password,
    image,
  }: RegisterWithCredentialsInput) {
    const existingUser = await this.prisma.credentials.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new BadRequestException('User already exists with this email.')
    }

    const salt = await bcrypt.genSalt()
    const passwordHash = await bcrypt.hash(password, salt)
    const uid = uuid()
    return this.prisma.user.create({
      data: {
        uid,
        name,
        image,
        Credentials: {
          create: {
            email,
            passwordHash,
          },
        },
        AuthProvider: {
          create: {
            type: AuthProviderType.CREDENTIALS,
          },
        },
      },
    })
  }

  findAll(args: FindManyUserArgs) {
    return this.prisma.user.findMany(args)
  }

  findOne(args: FindUniqueUserArgs) {
    return this.prisma.user.findUnique(args)
  }

  update(updateUserInput: UpdateUserInput) {
    const { uid, ...data } = updateUserInput
    return this.prisma.user.update({
      where: { uid },
      data: data,
    })
  }

  remove(args: FindUniqueUserArgs) {
    return this.prisma.user.delete(args)
  }

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    const credentials = await this.prisma.credentials.findUnique({
      where: { email },
    })

    if (!credentials) {
      throw new BadRequestException('Invalid email or password.')
    }

    const user = await this.prisma.user.findUnique({
      where: { uid: credentials.uid },
    })

    if (!user) {
      throw new BadRequestException('Invalid email or password.')
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      credentials.passwordHash,
    )

    if (!isPasswordValid) {
      throw new BadRequestException('Invalid email or password.')
    }

    return {
      token: this.jwtService.sign({ uid: user.uid }, { algorithm: 'HS256' }),
    }
  }
}
