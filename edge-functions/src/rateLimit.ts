import { getStore } from "@netlify/blobs";
import type { Context } from "@netlify/edge-functions";

const rateLimitConfig = { maxUpdates: 3, timeSpan: 86400 };

export default async (request: Request, context: Context) => {
  console.log(request);
  const response = await context.next();
  const identifier = "limiter_" + context.ip;

  const visits = getStore("visits");
  const t = await visits.get(identifier);
  if (t) {
    const { count_updates, last_update } = JSON.parse(t);

    const currentTime = new Date().getTime();
    const timeDifference = Math.floor(
      (currentTime - new Date(last_update).getTime()) / 1000
    );

    if (timeDifference >= rateLimitConfig.timeSpan) {
      await visits.set(
        identifier,
        JSON.stringify({ count_updates: 1, last_update: currentTime })
      );
      // Continue with your processing
      return response;
    }
    // Check if the request count is below the limit
    if (count_updates < rateLimitConfig.maxUpdates) {
      // Increment the number of updates in the store
      await visits.set(
        identifier,
        JSON.stringify({
          count_updates: count_updates + 1,
          last_update: new Date().getTime(),
        })
      );
      // Continue with your processing
      return response;
    } else {
      // If the limits equal or exceeds, return with a rate limit exceeded message
      return new Response(`Rate limit exceeded!!! by ${context.ip}`);
    }
  } else {
    // If a key is not found, set the key with a single update and continue
    await visits.set(
      identifier,
      JSON.stringify({ count_updates: 1, last_update: new Date().getTime() })
    );
    return response;
  }
};
