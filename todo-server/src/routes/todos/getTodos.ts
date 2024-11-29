import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const getTodos: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.route({
    method: "GET",

    url: "/",

    schema: {
      response: {
        "2xx": Type.Object({
          status: Type.String(),
          result: Type.Array(
            Type.Object({
              uid: Type.String(),
              text: Type.String(),
              isCompleted: Type.Boolean(),
            })
          ),
        }),

        "5xx": Type.Object({
          status: Type.String(),
          error: Type.String(),
        }),
      },
    },

    handler: async (request, reply) => {
      try {
        //get all todos from database through Prisma
        const allTodos = await fastify.prisma.todo.findMany();

        //send a response to the user
        reply.send({ result: allTodos, status: "Success" });
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

export default getTodos;
