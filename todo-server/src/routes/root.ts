import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { Type } from "@sinclair/typebox";

const root: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
  fastify.route({
    method: "GET",

    url: "/",

    schema: {
      response: {
        "2xx": Type.Object({
          hello: Type.String(),
        }),
      },
    },

    handler: async (request, reply) => {
      reply.send({ hello: "World!" });
    },
  });
};

export default root;
