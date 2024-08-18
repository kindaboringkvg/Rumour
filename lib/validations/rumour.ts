import * as z from 'zod';

export const RumourValidation = z.object({
    rumour: z.string().nonempty().min(3, {message : 'Minimum 3 characters'}), 
    accountId: z.string(),

})

export const CommentValidation = z.object({
    rumour: z.string().nonempty().min(3, {message : 'Minimum 3 characters'}), 

})