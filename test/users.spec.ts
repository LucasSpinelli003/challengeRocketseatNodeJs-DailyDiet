import { beforeEach, describe, skip } from "node:test";
import { afterAll, beforeAll, expect, it } from "vitest";
import { app } from "../src/app";
import { execSync } from 'child_process'
import request from 'supertest'



describe('Users routes', ()=>{
    beforeAll(async ()=>{
        await app.ready()
    })
    afterAll(async () =>{
        await app.close()
    })

    beforeEach(() =>{
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
    })


    
    it('should be able to create new user',async () =>{
       const users = await request(app.server)
        .post('/users')
        .send({
                name: "est asdae",
                login:"teste@mail.com",
                password:"teste teste teste"
        })
        .expect(201)

        const cookies = users.get('Set-Cookie')

        expect(cookies).toEqual(expect.arrayContaining([expect.stringContaining('session_id')]))
    })

    it('should be able to list all users', async () =>{
        const userRequest = await request(app.server)
        .post('/users')
        .send({
            name: "est asdae",
            login:"teste@mail.com",
            password:"teste teste teste"
        })

        const cookie = userRequest.get('Set-Cookie')

        const getUsersRequest = await request(app.server)
        .get('/users')
        .set('Cookie',cookie)
        .expect(200)

        expect(getUsersRequest.body.users).toEqual(expect.arrayContaining([expect.objectContaining({
            name: "est asdae",
            login:"teste@mail.com",
            password:"teste teste teste"
        })]))
    })

    it('should be able to list specific user', async () =>{
        const userRequest =  await request(app.server)
        .post('/users')
        .send({
                name: "est asdae",
                login:"teste@mail.com",
                password:"teste teste teste"
        })

        const cookie = userRequest.get('Set-Cookie')

        const users = await request(app.server)
        .get('/users')
        .set('Cookie',cookie)

        const userId = users.body.users[0].id

        const userIdRequest = await request(app.server)
        .get(`/users/${userId}`)
        .set('Cookie',cookie)

        expect(userIdRequest.body.users[0]).toEqual(expect.objectContaining({
            name: "est asdae",
            login:"teste@mail.com",
            password:"teste teste teste"
        }))
    })


})