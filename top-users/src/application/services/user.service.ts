import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { User } from '@domain/entities/user.entity';
import { IUserRepository } from '@domain/repositories/user.repository.interface';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class UserService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const emailExists = await this.userRepository.emailExists(createUserDto.email);
    if (emailExists) {
      throw new BadRequestException('Email already exists');
    }

    const user = UserMapper.toDomain(createUserDto);

    const createdUser = await this.userRepository.create(user);

    return UserMapper.toResponse(createdUser);
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return UserMapper.toResponse(user);
  }

  async findAll(skip: number = 0, take: number = 10) {
    const users = await this.userRepository.findAll(skip, take);
    return UserMapper.toResponseArray(users);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.isDeleted_()) {
      throw new BadRequestException('Cannot update a deleted user');
    }

    if (updateUserDto.nome) {
      user.updateName(updateUserDto.nome);
    }

    if (updateUserDto.endereco) {
      user.updateAddress(updateUserDto.endereco);
    }

    const updatedUser = await this.userRepository.update(id, user);

    return UserMapper.toResponse(updatedUser);
  }

  async delete(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.userRepository.delete(id);
  }

  async restore(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (!user.isDeleted_()) {
      throw new BadRequestException('User is not deleted');
    }

    await this.userRepository.restore(id);
  }

  async activate(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.activate();
    const updatedUser = await this.userRepository.update(id, user);

    return UserMapper.toResponse(updatedUser);
  }

  async deactivate(id: string) {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    user.deactivate();
    const updatedUser = await this.userRepository.update(id, user);

    return UserMapper.toResponse(updatedUser);
  }
}

