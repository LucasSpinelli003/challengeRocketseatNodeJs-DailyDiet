import 'fastify'

declare module 'fastify' {
    export interface FastifyRequest {
        user?: {
            id: string,
            name: string,
            login: string,
            password: string,
            id_meal: string | null,
            session_id: string
          }
    }
}

