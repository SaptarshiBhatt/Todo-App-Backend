import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const getTodoById: FastifyPluginAsyncTypebox = async (
  fastify
): Promise<void> => {
  fastify.route({
    method: "DELETE",

    url: "/:id",

    schema: {
      params: Type.Object({
        id: Type.String(),
      }),

      response: {
        "2xx": Type.Object({
          status: Type.String(),
          result: Type.Object({
            uid: Type.String(),
          }),
        }),

        "4xx": Type.Object({
          status: Type.String(),
          error: Type.String(),
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

      //Handle errors
      try {
        //get the todo whose id matches with the requested id from database through Prisma
        const todo = await fastify.prisma.todo.delete({
          where: {
            uid: id,
          },
        });

        //check if the todo is null or not
        if (todo === null) {
          reply.send({
            status: "Not Found",
            error: "Todo not found",
          });
          return;
        }

        //send a response to the user
        reply.send({ result: todo, status: "Deleted" });
      } catch (error) {
        console.log("Error deleting Todo: ", error);

        //send an error response back to user
        reply.send({
          status: "Internal Server Error",
          error: "Failed to delete Todo",
        });
      }
    },
  });
};

export default getTodoById;
