import fastify from "fastify";
import { userRoutes } from "./routes/users";
import cookie from "@fastify/cookie";
import { mealRoutes } from "./routes/meal";


export const app = fastify();

app.register(cookie)

app.register(userRoutes, {
    prefix: 'users'
  })

app.register(mealRoutes, {
    prefix: 'meal'
  })