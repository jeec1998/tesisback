import { Injectable,BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) {}
  
  async onModuleInit() {
    const existing = await this.userModel.findOne({ email: 'root@email.com' });
    if (!existing) {
      const hashedPassword = await this.authService.hashPassword('root');
      const admin: Partial<User> = {
        name: 'root',
        email: 'root@email.com',
        password: hashedPassword,
        role: 'admin',
      };
      await new this.userModel(admin).save();
      console.log('✅ Usuario admin root creado');
    } else {
      console.log('ℹ️ Usuario admin root ya existe');
    }
  }
  async create(createUserDto: CreateUserDto): Promise<User> {
    const hashedPassword = await this.authService.hashPassword(createUserDto.password);
  
    if (createUserDto.role !== 'alumno') {
      delete createUserDto.estado;
      delete createUserDto.estilo; 
    } else if (!createUserDto.estilo) {
      throw new BadRequestException('El campo "estilo" es obligatorio para alumnos');
    }
  
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });
  
    return createdUser.save();
  }
  

  findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User | null> {
    if (updateUserDto.password) {
      updateUserDto.password = await this.authService.hashPassword(updateUserDto.password);
    }
  
    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true }).exec();
  }
  
  remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async findByEmail(nombreUsuario: string): Promise<User | null> {
    return this.userModel
      .findOne({ nombreUsuario })
      .select('_id name password role') // Asegura los campos
      .exec();
  }
  
  
}
