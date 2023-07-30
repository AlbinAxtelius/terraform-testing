import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { z } from 'zod'
import { safeGet } from '../database/get'
import { safeScan } from '../database/scan'
import { DatabaseOperations } from './globals'
import { safeCreate } from '../database/create'
import { nanoid } from 'nanoid'

export const NoteSchema = z.object({
	note_id: z.string(),
	item_id: z.string(),
})

export const NotesSchema = z.array(NoteSchema)

export const CreateNoteSchema = z.object({
	note_id: z.string().optional(),
	item_id: z.string(),
})

export type Note = z.infer<typeof NoteSchema>
export type Notes = z.infer<typeof NotesSchema>
export type CreateNote = z.infer<typeof NoteSchema>

const { NOTES_TABLE } = process.env

const generateNoteId = () => `n_${nanoid(10)}`

export const setupNoteOperations = (db: DynamoDBDocument) =>
	({
		getById: safeGet(NOTES_TABLE, NoteSchema)(db),
		scan: safeScan(NOTES_TABLE, NotesSchema)(db),
		create: safeCreate(NOTES_TABLE, CreateNoteSchema, {
			note_id: generateNoteId(),
		})(db),
	} satisfies DatabaseOperations)
