import 'fastify'

declare module 'fastify' {
    export interface FastifyRequest {
        user?: {
            id: string,
            name: string,
            login: string,
            password: string,
            session_id: string
          }
    }
}

