import {
  Column,
  Entity,
} from 'typeorm';
import Base from './base';

@Entity('administrador')
export default class EntidadeAdmin extends Base {
  @Column()
  public email?: string;

  @Column()
  public senha?: string;
  
  @Column()
  public nome?: string;
  
  @Column()
  public cpf?: string;
}