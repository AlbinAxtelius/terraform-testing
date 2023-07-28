import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { z } from 'zod'
import { safeGet } from '../database/get'
import { safeScan } from '../database/scan'
import { DatabaseOperations } from './globals'
import { safeCreate } from '../database/create'
import { v4 as uuidv4 } from 'uuid'

export const ItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	completed: z.boolean(),
})

export const ItemsSchema = z.array(ItemSchema)

export const CreateItemSchema = z.object({
	id: z.string().optional(),
	title: z.string(),
	completed: z.boolean().optional(),
})

export const UpdateItemSchema = z.object({
	completed: z.boolean().optional(),
})

export type Item = z.infer<typeof ItemSchema>
export type Items = z.infer<typeof ItemsSchema>
export type CreateItem = z.infer<typeof ItemSchema>

const TABLE_NAME = 'env-items'

export const setupItemOperations = (db: DynamoDBDocument) =>
	({
		getById: safeGet(TABLE_NAME, ItemSchema)(db),
		scan: safeScan(TABLE_NAME, ItemsSchema)(db),
		create: safeCreate(TABLE_NAME, CreateItemSchema, {
			completed: false,
			id: uuidv4(),
		})(db),
	} satisfies DatabaseOperations)
