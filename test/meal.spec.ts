import { it, afterAll, beforeAll, describe, beforeEach, expect } from "vitest";
import { app } from "../src/app";
import { execSync } from "child_process";
import request from "supertest";


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

      await request(app.server)
      .post('/meal')
      .set('Cookie',cookie)
      .send({
        name: "shake",
        description:"shake dieta",
        type:"inside"
      })

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

      const firstUserRequest = await request(app.server)
      .post('/users')
      .send({
        name: "est asdae",
        login:"teste@mail.com",
        password:"teste teste teste"
      })
      expect(firstUserRequest.status).toEqual(201)

      const cookie = firstUserRequest.get('Set-Cookie')

      const secondUserRequest = await request(app.server)
      .post('/users')
      .send({
        name: "est asdae",
        login:"teste@mail.com",
        password:"teste teste teste"
      })
      expect(firstUserRequest.status).toEqual(201)

      const secondCookie = secondUserRequest.get('Set-Cookie')

      const getUser = await request(app.server)
      .get('/users')
      .set('Cookie', cookie)

      const userId = getUser.body.users[0].id

       await request(app.server)
      .post('/meal')
      .set('Cookie', cookie)
      .send({
        name: "shake",
        description:"shake dieta",
        type:"inside"
      })
      await request(app.server)
      .post('/meal')
      .set('Cookie', secondCookie)
      .send({
        name: "ovos",
        description:"ovos graudos",
        type:"outside"
      })

      const getSpecificMeal = await request(app.server)
      .get(`/meal/${userId}`)
      .set('Cookie',cookie)

      expect(getSpecificMeal.body.meal).toEqual(expect.arrayContaining([expect.objectContaining({
        name: "shake",
        description:"shake dieta",
        type:"inside"
      })]))
    })

    it('should be able to get meal metric', async ()=>{

      const newUser = await request(app.server)
      .post('/users')
      .send({
        name: "est asdae",
        login:"teste@mail.com",
        password:"teste teste teste"
      })

      const cookie = newUser.get('Set-Cookie')

      await request(app.server)
      .post('/meal')
      .set('Cookie', cookie)
      .send({
        name: "shake",
        description:"shake dieta",
        type:"inside"
      })

      const metricMeal = await request(app.server)
      .get('/meal/metrics')
      .set('Cookie',cookie)


      expect(metricMeal.body).toEqual(expect.objectContaining({
        total:1,
        inside:1,
        outside:0,
        bestSequence:1
      }))
    })

    it('should be able to edit any meal', async() =>{

      const newUser = await request(app.server)
      .post('/users')
      .send({
        name: "est asdae",
        login:"teste@mail.com",
        password:"teste teste teste"
      })

      const cookie = newUser.get('Set-Cookie')

      await request(app.server)
      .post('/meal')
      .set('Cookie',cookie)
      .send({
        name: "shake",
        description:"shake dieta",
        type:"inside"
      })

      const meal = await request(app.server)
      .get('/meal')
      .set('Cookie',cookie)

      const idMeal = meal.body.meal[0].id

      await request(app.server)
      .put(`/meal/${idMeal}`)
      .set('Cookie',cookie)
      .send({
        name: "teste",
        description:"teste dieta",
        createdAt:"2024-02-22 19:20:51",
        type:"outside"
      })


      const mealCheck = await request(app.server)
      .get('/meal')
      .set('Cookie',cookie)

      expect(mealCheck.body.meal).toEqual(expect.arrayContaining([expect.objectContaining({
        name: "teste",
        description:"teste dieta",
        createdAt:1708640451000,
        type:"outside"
      })]))
    })

    it('should be able to delete any user', async () =>{

      const newUser = await request(app.server)
      .post('/users')
      .send({
        name: "est asdae",
        login:"teste@mail.com",
        password:"teste teste teste"
      })

      const cookie = newUser.get('Set-Cookie')

      await request(app.server)
      .post('/meal')
      .set('Cookie',cookie)
      .send({
        name: "shake",
        description:"shake dieta",
        type:"inside"
      })

      const meal = await request(app.server)
      .get('/meal')
      .set('Cookie',cookie)

      const idMeal = meal.body.meal[0].id

      const deleteMeal = await request(app.server)
      .delete(`/meal/${idMeal}`)
      .set('Cookie',cookie)
      .expect(204)

    })
})