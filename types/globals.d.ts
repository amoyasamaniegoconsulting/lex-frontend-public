export {}

// Create a type for the roles
export type Roles = 'admin' | 'lex_editor' | 'member'

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles
    }
  }
}