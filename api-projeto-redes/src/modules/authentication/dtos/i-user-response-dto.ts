interface IUserResponseDTO {
  email: string
  name: string
  id: string
  avatar: string
  avatarUrl(): string
}

export { IUserResponseDTO }