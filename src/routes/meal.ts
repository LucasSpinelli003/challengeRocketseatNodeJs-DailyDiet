import { FastifyInstance } from "fastify";
import { validateSessionId } from "../middlewears/checkSessionIdCookie";
import { knex } from "../database";
import { z } from 'zod'
import { randomUUID } from "crypto";



export async function mealRoutes(app: FastifyInstance){

    app.get('/',
    {
        preHandler: [validateSessionId]
    },
    async (request)=>{

        const sessionId = request.cookies.session_id

        console.log(request.tb_user?.id)

        

        const meal = await knex('tb_meal')
        .where({'id_user': request.tb_user?.id})
        .select()

        return {meal}
    }
    )


    app.get('/:id',
    {
        preHandler: [validateSessionId]
    },
    async (request) =>{
        
        const idMealSchema = z.object({
            id: z.string()
        })

        const { id } = idMealSchema.parse(request.params)

        const meal = await knex('tb_meal')
        .where('id_user', id)
        .orWhere('id', id)
        
        return {meal}
    }
    )
    
    app.get('/metrics/:id', 
    {
        preHandler:[validateSessionId]
    },
    async (request) =>{
        
        const idUserSchema = z.object({
            id: z.string()
        })

        const { id } = idUserSchema.parse(request.params)

        const mealsUser = knex('tb_meal')
        .where('id_user',id)
        .select()
        
        const metric = (await mealsUser).reduce((acc, meal) =>{
          if(meal.type == 'inside'){
                acc.inside += 1;
                acc.total +=1;
                acc.currentSequence += 1;
                acc.bestSequence = Math.max(acc.bestSequence, acc.currentSequence)
            }else{
                acc.outside += 1;
                acc.currentSequence = 0;
                acc.total += 1;

            }
            return acc;
        },
        {
            inside: 0,
            outside:0,
            bestSequence:0,
            currentSequence: 0,
            total: 0
        })

        const { total, inside, outside, bestSequence } = metric

        return { total, inside, outside, bestSequence }
    }
    )


    app.post('/',
    {
        preHandler: [validateSessionId]
    }
    ,async (request, response) =>{

        const sessionId = request.cookies.session_id

        const mealRequestSchema = z.object({
            name: z.string(),
            description: z.string(),
            type: z.enum(['inside','outside'])
        })

        const {description, name, type} = mealRequestSchema.parse(request.body)

        const id_user = await knex('tb_users')
        .where('session_id',sessionId)
        .select('id')

        const { id } = id_user[0]
        const id_meal = randomUUID()

        await knex('tb_meal')
        .insert({
            id: id_meal,
            id_user:id,
            name,
            description,
            type
        })
        response.status(201).send()
    })

    app.put('/:id', {
        preHandler:[validateSessionId]
    }, async (request, response)=>{
        
        const mealIdSchema = z.object({
            id: z.string()
        })

        const mealBodySchema = z.object({
            name: z.string(),
            description: z.string(),
            createdAt: z.string(),
            type: z.enum(['inside','outside'])
        })

        
        const { id } = mealIdSchema.parse(request.params)
        const { name, description, createdAt, type } = mealBodySchema.parse(request.body)
        
        const newDate = new Date(createdAt)
        if(!newDate){
            response.status(400).send()
        }

        console.log(id)
        await knex('tb_meal')   
        .where('id',id)
        .update({
            name,
            description,
            type,
            createdAt
        })
        response.status(204).send()
    })

    app.delete('/:id',
    {
        preHandler: [validateSessionId]
    },
    async (request, response) =>{

        const deleteIdSchema = z.object({
            id: z.string()
        })

        const { id } = deleteIdSchema.parse(request.params)

        await knex('tb_meal')
        .where('id',id)
        .delete()
        response.status(204).send()
    })

}