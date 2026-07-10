export interface ILoginUser {
    email: string,
    password: string
}
export interface RegisterUserPayload {
    fullName: string,
    email: string,
    password: string,
    role: 'CUSTOMER' | 'PROVIDER' | 'ADMIN',
}