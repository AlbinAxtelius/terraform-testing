import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import * as E from "fp-ts/Either";
import { pipe } from "fp-ts/function";

const variable = process.env.myVariable;

export const handler: APIGatewayProxyHandlerV2 = async (_event, _context) =>
  pipe(
    variable,
    E.fromNullable("Invalid env"),
    E.map((message) => ({
      statusCode: 200,
      body: JSON.stringify({ message }),
    })),
    E.getOrElse((error) => ({
      statusCode: 400,
      body: JSON.stringify({ error }),
    }))
  );
