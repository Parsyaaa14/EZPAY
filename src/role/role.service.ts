import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { EntityNotFoundError,Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './entities/role.entity';

@Injectable()
export class RoleService {



  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createRoleDto: CreateRoleDto) {
    const result = await this.roleRepository.insert(createRoleDto);

    return this.roleRepository.findOneOrFail({
      where: {
        id_role: result.identifiers[0].id,
      },
    });
  }

  findAll() {
    return this.roleRepository.findAndCount();
  }

  async findOne(id: string) {
    try {
      return await this.roleRepository.findOneOrFail({
        where: {
          id_role: id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }
  }

  async update(id: string, updateUserDto: UpdateRoleDto) {
    try {
      await this.roleRepository.findOneOrFail({
        where: {
          id_role: id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.roleRepository.update(id, updateUserDto);

    return this.roleRepository.findOneOrFail({
      where: {
        id_role: id,
      },
    });
  }

  async remove(id: string) {
    try {
      await this.roleRepository.findOneOrFail({
        where: {
          id_role: id,
        },
      });
    } catch (e) {
      if (e instanceof EntityNotFoundError) {
        throw new HttpException(
          {
            statusCode: HttpStatus.NOT_FOUND,
            error: 'Data not found',
          },
          HttpStatus.NOT_FOUND,
        );
      } else {
        throw e;
      }
    }

    await this.roleRepository.delete(id);
  }
}
