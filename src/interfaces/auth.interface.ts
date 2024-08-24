export interface Auth {
  nickname: string
  password: string
}

export interface UserWithToken {
  token: string
  nickname: string
}
