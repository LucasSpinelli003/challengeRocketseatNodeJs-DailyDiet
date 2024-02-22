import { FastifyInstance } from "fastify";
import { knex } from "../database";
import { z } from 'zod'
import { randomUUID } from "crypto";
import { validateSessionId } from "../middlewears/checkSessionIdCookie";



export async function userRoutes(app: FastifyInstance){

    app.get('/',
    {
        preHandler:[validateSessionId]
    },
    async (request)=>{

        const sessionId = request.cookies.session_id

        const users = await knex('tb_users')
        .where('session_id', sessionId)
        .select()

        return { users }
    })

    app.get('/:searchTerm',
    {
        preHandler:[validateSessionId]
    },
    async (request)=>{

        const schemaUserId = z.object({
            searchTerm: z.string()
        })

        const { searchTerm } = schemaUserId.parse(request.params)

        const sessionId = request.cookies.session_id

        const users = await knex('tb_users')
        .where('session_id', sessionId)
        .where('login','like',`%${searchTerm}%`)
        .orWhere('name','like',`%${searchTerm}%`)
        .select()

        return { users }
    })

    app.post('/', async (request, response) =>{

        const usersRequestSchema = z.object({
            name: z.string(),
            login: z.string(),
            password: z.string()
        })

        const {login, name, password } = usersRequestSchema.parse(request.body)

        let sessionId = request.cookies.session_id

        if(!sessionId){
            sessionId = randomUUID()
            response.cookie('session_id',sessionId,{
                path:'/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
        }

        await knex('tb_users')
        .insert({
            id: randomUUID(),   
            name,
            login,
            password,
            session_id: sessionId
        })
        response.status(201).send()
    })

}