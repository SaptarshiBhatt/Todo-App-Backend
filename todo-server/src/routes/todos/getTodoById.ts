import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const getTodoById: FastifyPluginAsyncTypebox = async (
  fastify
): Promise<void> => {
  fastify.route({
    method: "GET",

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
            text: Type.String(),
            isCompleted: Type.Boolean(),
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
        const todo = await fastify.prisma.todo.findUnique({
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
        reply.send({ result: todo, status: "Success" });
      } catch (error) {
        console.log("Error fetching Todo: ", error);

        //send an error response back to user
        reply.send({
          status: "Internal Server Error",
          error: "Failed to fetch Todo",
        });
      }
    },
  });
};

export default getTodoById;
