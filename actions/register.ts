"use server"

import { db } from "@/lib/db";
import { RegisterSchema } from "@/schemas";
import { revalidatePath,revalidateTag } from "next/cache";
import * as z from "zod";
import bcrypt from "bcryptjs"
import { getUserByEmail } from "@/data/user";
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";
export const register = async(data:z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(data);

    if(!validatedFields.success){
        return { error:"Invalid fields"};
    }

    const {name,email,password} = validatedFields.data;
    const hashPassword = await bcrypt.hash(password,10);
    const existingUser  = await getUserByEmail(email);
    if(existingUser){
        return {error:"Email already in use"}
    }
    await db.user.create({
        data:{
            name,
            email,
            password:hashPassword,
        }
        
    })
    const verificationToken = await generateVerificationToken(email);

    await sendVerificationEmail(
        verificationToken.email,
        verificationToken.token,
    );
    return { success:"Confirmation email sent!!"};
}