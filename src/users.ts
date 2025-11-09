import { v4 as uuidv4 } from 'uuid';

export interface UserData {
  username: string;
  age: number;
  hobbies: Array<string>;
}

export interface UserDataWithId extends UserData {
  id: string;
}

export function isUserData(data: unknown): data is UserData {
  return (
    data !== null &&
    typeof data === 'object' &&
    'username' in data &&
    'age' in data &&
    'hobbies' in data &&
    typeof data.username === 'string' &&
    typeof data.age === 'number' &&
    Array.isArray(data.hobbies)
  );
}

export function isUserDataWithId(data: unknown): data is UserDataWithId {
  return isUserData(data) && 'id' in data && typeof data.id === 'number';
}

export class User {
  public id: string;
  public username: string;
  public age: number;
  public hobbies: string[];

  constructor(username: string, age: number, hobbies: string[] = []) {
    this.id = uuidv4();
    this.username = username;
    this.age = age;
    this.hobbies = hobbies;
  }
  public static fromJSON(data: UserData): User {
    return new User(data.username, data.age, data.hobbies);
  }
}

export class Users {
  private static _users: Map<string, User> = new Map();
  public static async initializeFromJSON(filePath: string): Promise<void> {
    try {
      const fs = await import('fs/promises');
      const data = await fs.readFile(filePath, 'utf-8');
      const jsonData: unknown = JSON.parse(data);
      const usersData: UserData[] =
        Array.isArray(jsonData) && jsonData.every(element => isUserData(element)) ? jsonData : [];

      usersData.forEach(userData => {
        const user = User.fromJSON(userData);
        Users.addUser(user);
      });

      console.log(`Loaded ${usersData.length} users from ${filePath}`);
    } catch (error) {
      console.error('Error loading users from JSON:', error);
      throw error;
    }
  }
  public static addUser(user: User): void {
    if (this._users.has(user.id)) {
      throw new Error(`User with ID ${user.id} already exists`);
    }
    this._users.set(user.id, user);
  }
  public static updateUser(user: UserDataWithId): User | undefined {
    if (!this._users.has(user.id)) {
      return undefined;
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
      return undefined;
    }
    return this._users.get(id);
  }
}
