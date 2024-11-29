import fp from "fastify-plugin";
import fastifyRateLimit, { FastifyRateLimitOptions } from "@fastify/rate-limit";

export default fp<FastifyRateLimitOptions>(async (fastify) => {
  fastify.register(fastifyRateLimit, {
    max: 1000,
    timeWindow: 60 * 10000,
    errorResponseBuilder: (request, context) => ({
      statusCode: 429,
      error: "Too Many Requests",
      message: `Slow Down Nigga...you hit the rate-limit, retry in ${context.after}`,
    }),
  });
});
