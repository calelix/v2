import { z } from "zod"

type NullifiedShape<T extends z.ZodRawShape> = {
  [K in keyof T]: z.ZodNull
}

function nullifyShape<T extends z.ZodRawShape>(shape: T): NullifiedShape<T> {
  const result = {} as Record<string, z.ZodNull>

  for (const key of Object.keys(shape)) {
    result[key] = z.null()
  }

  return result as NullifiedShape<T>
}

const pendingBase = {
  status: z.literal("pending"),
  isPending: z.literal(true),
  isSuccess: z.literal(false),
  isError: z.literal(false),
  error: z.null(),
}

const successBase = {
  status: z.literal("success"),
  isPending: z.literal(false),
  isSuccess: z.literal(true),
  isError: z.literal(false),
  error: z.null(),
}

const errorBase = {
  status: z.literal("error"),
  isPending: z.literal(false),
  isSuccess: z.literal(false),
  isError: z.literal(true),
  error: z.string(),
}

export function createAsyncStateSchema<T extends z.ZodRawShape = Record<never, never>>(successFields?: T) {
  const nullFields = successFields ? nullifyShape(successFields) : ({} as NullifiedShape<T>)
  const extraSuccess = successFields ?? ({} as T)

  const pendingSchema = z.object({ ...pendingBase, ...nullFields })
  const successSchema = z.object({ ...successBase, ...extraSuccess })
  const errorSchema = z.object({ ...errorBase, ...nullFields })

  const schema = z.discriminatedUnion("status", [
    pendingSchema,
    successSchema,
    errorSchema,
  ])

  return {
    schema,
    pendingSchema,
    successSchema,
    errorSchema,
  }
}

export type AsyncState<T extends { schema: z.ZodTypeAny }> = z.infer<T["schema"]>
export type AsyncStatePending<T extends { pendingSchema: z.ZodTypeAny }> = z.infer<T["pendingSchema"]>
export type AsyncStateSuccess<T extends { successSchema: z.ZodTypeAny }> = z.infer<T["successSchema"]>
export type AsyncStateError<T extends { errorSchema: z.ZodTypeAny }> = z.infer<T["errorSchema"]>
