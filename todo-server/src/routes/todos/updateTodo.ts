import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const updateTodo: FastifyPluginAsyncTypebox = async (
  fastify
): Promise<void> => {
  fastify.route({
    method: "PATCH",

    url: "/:id",

    schema: {
      params: Type.Object({
        id: Type.String(),
      }),

      body: Type.Object({
        text: Type.Optional(Type.String()),
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
      //get the requested id from the parameter
      const { id } = request.params;

      //get the todo data from the request body
      const todoData = request.body;

      //Handle errors
      try {
        //get the todo whose id matches with the requested id from database and then update it through Prisma
        const todo = await fastify.prisma.todo.update({
          where: {
            uid: id,
          },
          data: todoData,
        });

        //send a response to the user
        reply.send({ result: todo, status: "Success" });
      } catch (error) {
        console.log("Error updating Todo: ", error);

        //send an error response back to user
        reply.send({
          status: "Internal Server Error",
          error: "Failed to update Todo",
        });
      }
    },
  });
};

export default updateTodo;
