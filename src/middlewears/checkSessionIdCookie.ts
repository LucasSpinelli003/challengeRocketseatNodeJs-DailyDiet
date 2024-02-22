import { FastifyReply, FastifyRequest } from "fastify";


export async function validateSessionId(request: FastifyRequest, response: FastifyReply){
    const sessionId = await request.cookies.session_id

    if(!sessionId){
        response.status(403).send({
            error:'Unauthorized.'
        })
    }
}