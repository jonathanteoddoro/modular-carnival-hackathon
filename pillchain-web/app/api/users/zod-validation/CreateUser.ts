import { z } from 'zod';
import { cpf } from 'cpf-cnpj-validator';


interface CreateUserInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const CreateUser: z.ZodType<CreateUserInput> = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(6),
    cpf: z.string().length(11).refine((cpfInput) => cpf.isValid(cpfInput), {
        message: 'Invalid CPF',
    }).transform((cpfInput) => cpf.format(cpfInput)),
    confirmPassword: z.string().min(6),
    }).superRefine((data) => {
        if (data.password !== data.confirmPassword) {
            throw new z.ZodError([{ path: ['confirmPassword'], message: 'Passwords do not match', code: 'custom' }]);
        }
});