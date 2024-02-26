import 'knex'

declare module 'knex/types/tables' {
    export interface Tables {
        tb_users:{
            id: string,
            name: string,
            password: string,
            login: string,
            session_id: string
        },
        tb_meal:{
            id: string,
            name: string,
            description: string,
            createdAt: Date,
            type: 'inside' | 'outside',
            id_user?: string
        }
    }
}