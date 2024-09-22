import { InferResponseType, ClientRequestOptions, ClientResponse } from "hono/client";

// Define allowed HTTP methods
type HttpMethod = "$get" | "$post" | "$put" | "$delete" | "$patch";

// Define the client route type
type HonoClientRoute = {
  [K in HttpMethod]?: (args: any, options?: ClientRequestOptions<any>) => Promise<ClientResponse<any, any, any>>;
} & {
  $url: (...args: any[]) => URL;
};

// Define types for success and error responses
type SuccessResponse<T> = {
  isError: false;
} & T;

type ErrorResponse = {
  isError: true;
  errorMessage: string;
};

// Combined type for the response
type RequestDataResponse<T> = SuccessResponse<T> | ErrorResponse;

// Helper type to get only the methods that exist on T
type AvailableMethods<T> = {
  [K in HttpMethod]: K extends keyof T ? (T[K] extends Function ? K : never) : never;
}[HttpMethod];

export async function requestData<T extends HonoClientRoute, M extends AvailableMethods<T>>(route: T, method: M, args?: Parameters<NonNullable<T[M]>>[0], options?: ClientRequestOptions<any>): Promise<RequestDataResponse<Exclude<InferResponseType<NonNullable<T[M]>>, { errorMessage: string }>>> {
  const methodFn = route[method];
  if (typeof methodFn !== "function") {
    throw new Error(`Method ${method} is not supported on this route`);
  }

  try {
    // Call the method with the provided arguments and options
    const res = await methodFn(args, options);

    // Attempt to parse the response as JSON, but check for empty response
    const text = await res.text();
    if (!text) {
      return {
        isError: true,
        errorMessage: `Empty response body for request to ${route.$url().toString()}`,
      };
    }

    // Safely parse JSON response
    const json = JSON.parse(text);
    console.log(`fetch data from server`, json);

    // Check if response is okay (status code 2xx)
    if (!res.ok) {
      return {
        isError: true,
        errorMessage: json.errorMessage || `Request failed with status ${res.status}`,
      };
    }

    // Return success response with type assertion
    return json as Exclude<InferResponseType<NonNullable<T[M]>>, { errorMessage: string }>;
  } catch (error: any) {
    console.log(`server error: ${error.message}`, error);
    return {
      isError: true,
      errorMessage: `Request failed: ${error.message}`,
    };
  }
}
