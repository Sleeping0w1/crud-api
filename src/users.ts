import { v4 as uuidv4 } from 'uuid';

export class User {
  public id = uuidv4();
  constructor(
    public username: string,
    public age: number,
    public hobbies: Array<string>
  ) {}
}

export class Users {
  private static _users: Map<string, User> = new Map();
  public static init(startUsers?: Array<User>): void {
    if (Users._users.size === 0 && startUsers) {
      startUsers.forEach(user => {
        Users.addUser(user);
      });
    }
  }
  public static addUser(user: User): void {
    if (this._users.has(user.id)) {
      throw new Error(`User with ID ${user.id} already exists`);
    }
    this._users.set(user.id, user);
  }
  public static updateUser(user: User): User {
    if (!this._users.has(user.id)) {
      throw new Error(`User with ID ${user.id} not found`);
    }
    this._users.set(user.id, user);
    return user;
  }
  public static removeUser(id: string): boolean {
    if (!this._users.has(id)) {
      throw new Error(`User with ID ${id} not found`);
    }
    return this._users.delete(id);
  }
  public static getUsers(): Array<User> {
    return Array.from(this._users.values());
  }
  public static getUserById(id: string): User | undefined {
    if (!this._users.has(id)) {
      throw new Error(`User with ID ${id} not found`);
    }
    return this._users.get(id);
  }
}
