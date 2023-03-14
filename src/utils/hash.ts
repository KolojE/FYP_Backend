import { hash, genSalt, compare, } from "bcrypt";

type hash_salt = {
    hashValue: string,
    salt: string
}

export async function hashPassword(password: string): Promise<hash_salt> {
    const saltValue = await genSalt();
    const hashValue = await hash(password, saltValue)

    const result: hash_salt =
    {
        salt: saltValue,
        hashValue: hashValue,
    }
    return result;

}

export async function verify(password: string, salt: string, hashedPassword: string): Promise<boolean> {

    const hashValue = await hash(password, salt);

    const result = compare(hashValue, hashedPassword);


    return result;





}