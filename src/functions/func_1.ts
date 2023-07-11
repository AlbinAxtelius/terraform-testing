import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

export const handler: APIGatewayProxyHandlerV2 = async (event, context) => {
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Hello from func 1",
    }),
  };
};
