import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthService } from '../auth/auth.service';
import * as bcrypt from 'bcrypt';
import { Types } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private authService: AuthService,
  ) { }

  async onModuleInit() {
    const existing = await this.userModel.findOne({ email: 'root@email.com' });
    if (!existing) {
      const hashedPassword = await this.authService.hashPassword('administrador123');
      const admin: Partial<User> = {
        name: 'root',
        nombreUsuario: 'admin',
        email: 'root@email.com',
        password: hashedPassword,
        telefono: '0968144760',
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

    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }
 async addSubjectsToUser(userId: string, subjectIds: string[]): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { 
        $addToSet: { 
          createbysubject: { $each: subjectIds } 
        } 
      },
      { new: true } // Devuelve el documento actualizado
    ).exec();
    
    if (!user) {
      throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }

    return user;
  }

  // --- NUEVO MÉTODO PARA ELIMINAR UNA MATERIA ---
  /**
   * @description Elimina un ID de materia del array 'createbysubject' de un usuario.
   * Utiliza $pull para remover el elemento específico.
   * @param userId El ID del usuario.
   * @param subjectId El ID de la materia a eliminar.
   * @returns El usuario actualizado.
   */
  async removeSubjectFromUser(userId: string, subjectId: string): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      { 
        $pull: { 
          createbysubject: subjectId 
        } 
      },
      { new: true } // Devuelve el documento actualizado
    ).exec();

    if (!user) {
        throw new NotFoundException(`Usuario con ID ${userId} no encontrado.`);
    }
    
    return user;
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
      .select('_id name password role')
      .exec();
  }
  async findAlumnosByMateria(materiaId: string) {
    return this.userModel.find({ createbysubject: materiaId, role: 'alumno' }).exec();
  }
 

  async resetPassword(id: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      { password: hashedPassword },
      { new: true }
    );
  
    return updatedUser;
  }
  async updatePassword(userId: string, newPassword: string) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  
    return this.userModel.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });
  }
  // En UsersService
async findByRole(role: string) {
  return this.userModel.find({ role }).exec();
}

  async findManyByField(field: string, value: any): Promise<UserDocument[]> {
    return this.userModel.find({ [field]: value }).exec();
  }
  async getMateriasDelUsuario(userId: Types.ObjectId) {
  return this.userModel.findById(userId).populate('createbysubject').exec();
}

}
