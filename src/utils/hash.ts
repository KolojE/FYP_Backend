import { hash, genSalt, compare, } from "bcrypt";

type hash_salt = {
    hashed: string,
    salt: string
}

export async function hashPassword(password: string): Promise<hash_salt> {
    const saltValue = await genSalt();
    const hashValue = await hash(password, saltValue)

    const result: hash_salt =
    {
        salt: saltValue,
        hashed: hashValue,
    }
    return result;

}

export async function verify(password: string, hashedPassword: string): Promise<boolean> {

    const result = await compare(password, hashedPassword);
    console.log(result)

    return result;





}