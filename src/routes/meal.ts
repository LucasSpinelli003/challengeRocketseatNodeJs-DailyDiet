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
    async (request, response)=>{        

        const meal = await knex('tb_meal')
        .where('id_user', request.user?.id)
        .select()

        response.status(200).send({meal})
    }
    )


    app.get('/:id',
    {
        preHandler: [validateSessionId]
    },
    async (request, response) =>{
        
        const idMealSchema = z.object({
            id: z.string()
        })

        const { id } = idMealSchema.parse(request.params)

        const meal = await knex('tb_users')
        .where('id_user', id)
        .orWhere('id', id)
        
        response.status(200).send({meal})
    }
    )
    
    app.get('/metrics', 
    {
        preHandler:[validateSessionId]
    },
    async (request, response) =>{

        const mealsUser = knex('tb_meal')
        .where('id_user',request.user?.id)
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

        response.status(200).send({ total, inside, outside, bestSequence })
    }
    )


    app.post('/',
    {
        preHandler: [validateSessionId]
    }
    ,async (request, response) =>{

        const mealRequestSchema = z.object({
            name: z.string(),
            description: z.string(),
            type: z.enum(['inside','outside'])
        })

        const {description, name, type} = mealRequestSchema.parse(request.body)

        const id_meal = randomUUID()

        await knex('tb_meal')
        .insert({
            id: id_meal,
            id_user: request.user?.id,
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
            createdAt: z.coerce.date(),
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
        .where('id_user', request.user?.id)
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
        .where('id_user', request.user?.id)
        .where('id',id)
        .delete()
        response.status(204).send()
    })

}