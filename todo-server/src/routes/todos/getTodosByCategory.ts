import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const getTodoById: FastifyPluginAsyncTypebox = async (
  fastify
): Promise<void> => {
  fastify.route({
    method: "GET",

    url: "/completed/:isCompleted",

    schema: {
      params: Type.Object({
        isCompleted: Type.Boolean(),
      }),

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
      const { isCompleted } = request.params;

      //Handle errors
      try {
        //get the todo whose id matches with the requested id from database through Prisma
        const todos = await fastify.prisma.todo.findMany({
          where: {
            isCompleted: isCompleted,
          },
        });

        //check if the todo is null or not
        if (todos === null) {
          reply.send({
            status: "Not Found",
            error: "Todos not found",
          });
          return;
        }

        //send a response to the user
        reply.send({ result: todos, status: "Success" });
      } catch (error) {
        console.log("Error fetching Todos: ", error);

        //send an error response back to user
        reply.send({
          status: "Internal Server Error",
          error: "Failed to fetch Todos",
        });
      }
    },
  });
};

export default getTodoById;
