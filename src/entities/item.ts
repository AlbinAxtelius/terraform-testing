import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { z } from 'zod'
import { safeGet } from '../database/get'
import { safeScan } from '../database/scan'
import { DatabaseOperations } from './globals'
import { safeCreate } from '../database/create'
import { nanoid } from 'nanoid'

export const ItemSchema = z.object({
	id: z.string(),
	title: z.string(),
	completed: z.boolean(),
})

export const ItemsSchema = z.array(ItemSchema)

export const CreateItemSchema = z.object({
	item_id: z.string().optional(),
	title: z.string(),
	completed: z.boolean().optional(),
})

export const UpdateItemSchema = z.object({
	completed: z.boolean().optional(),
})

export type Item = z.infer<typeof ItemSchema>
export type Items = z.infer<typeof ItemsSchema>
export type CreateItem = z.infer<typeof ItemSchema>

const { ITEMS_TABLE } = process.env

const generateItemId = () => `i_${nanoid(10)}`

export const setupItemOperations = (db: DynamoDBDocument) =>
	({
		getById: safeGet(ITEMS_TABLE, ItemSchema)(db),
		scan: safeScan(ITEMS_TABLE, ItemsSchema)(db),
		create: safeCreate(ITEMS_TABLE, CreateItemSchema, {
			completed: false,
			item_id: generateItemId(),
		})(db),
	} satisfies DatabaseOperations)
