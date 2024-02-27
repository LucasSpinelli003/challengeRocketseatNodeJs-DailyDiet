import { it, afterAll, beforeAll, describe, beforeEach, expect } from "vitest";
import { app } from "../src/app";
import { execSync } from "child_process";
import request from "supertest";
import { randomUUID } from "crypto";


describe('Meal routes' ,()=>{
    beforeAll(async () => {
        await app.ready()
      })
    
      afterAll(async () => {
        await app.close()
      })
    
      beforeEach(() => {
        execSync('npm run knex migrate:rollback --all')
        execSync('npm run knex migrate:latest')
      })


    it('Should be able to create a new meal', async()=>{

        const userRequest = await request(app.server)
        .post('/users')
        .send({
            name: "est asdae",
            login:"teste@mail.com",
            password:"teste teste teste"
        })

        const cookies = userRequest.get('Set-Cookie')

       const test = await request(app.server)
        .post('/meal')
        .set('Cookie',cookies)
        .send({
            name: "shake",
            description:"shake dieta",
            type:"inside"
        })
        expect(test.status).toEqual(201)
    })

    it('should be able to list all meals', async ()=>{

      const userRequest = await request(app.server)
      .post('/users')
      .send({
        name: "est asdae",
        login:"teste@mail.com",
        password:"teste teste teste"
      })
      expect(userRequest.status).toEqual(201)

      const cookie = userRequest.get('Set-Cookie')


      const postRequest = await request(app.server)
      .post('/meal')
      .set('Cookie',cookie)
      .send({
        name: "shake",
        description:"shake dieta",
        type:"inside"
      })
      expect(postRequest.status).toEqual(201)

      const getMeal = await request(app.server)
      .get('/meal')
      .set('Cookie',cookie)
      expect(getMeal.body.meal).toEqual(expect.arrayContaining([expect.objectContaining({
        name: "shake",
        description:"shake dieta",
        type:"inside"
      })]))
    })

    it('should be able to list specific meal by user', async() =>{

      const userRequest = await request(app.server)
      .post('/users')
      .send({
        name: "est asdae",
        login:"teste@mail.com",
        password:"teste teste teste"
      })
      expect(userRequest.status).toEqual(201)

      const cookie = userRequest.get('Set-Cookie')

      

    })
})