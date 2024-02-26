import { FastifyReply, FastifyRequest } from "fastify";
import { knex } from "../database";



export async function validateSessionId(request: FastifyRequest, response: FastifyReply){
    const sessionId = request.cookies.session_id

    if(!sessionId){
        response.status(403).send({
            error:'Unauthorized.'
        })
    }

    const user = await knex('tb_users')
    .where('session_id', sessionId)
    .select()
    .first()

    if(!user){
        response.status(403).send({
            error:'Unauthorized.'
        })
    }
    
    request.user = user
}