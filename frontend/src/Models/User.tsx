export interface User{
    username: string;
    email: string;
    hwid?: string,
    authenticated?: boolean;
    password?: string;
}