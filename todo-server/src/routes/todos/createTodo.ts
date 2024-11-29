import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const createTodo: FastifyPluginAsyncTypebox = async (
  fastify
): Promise<void> => {
  fastify.route({
    method: "POST",

    url: "/",

    schema: {
      body: Type.Object({
        text: Type.String(),
        isCompleted: Type.Optional(Type.Boolean()),
      }),
      response: {
        "2xx": Type.Object({
          status: Type.String(),
          result: Type.Object({
            uid: Type.String(),
            text: Type.String(),
            isCompleted: Type.Boolean(),
          }),
        }),

        "5xx": Type.Object({
          status: Type.String(),
          error: Type.String(),
        }),
      },
    },

    handler: async (request, reply) => {
      //get the todo data from the request body
      const todoData = request.body;

      //Handle the error
      try {
        //post the todoData to the database through Prisma
        const newTodo = await fastify.prisma.todo.create({
          data: todoData,
        });

        //send a response back to the user
        reply.send({ result: newTodo, status: "Todo Created Successfully" });
      } catch (error) {
        console.log("Error creating Todo: ", error);

        //send an error response back to user
        reply.send({
          status: "Internal Server Error",
          error: "Failed to create Todo",
        });
      }
    },
  });
};

export default createTodo;
