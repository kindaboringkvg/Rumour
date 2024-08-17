"use server";

import { revalidatePath } from "next/cache";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params {
    userId: string;
    username: string;
    name: string;
    bio: string;
    image: string;
    path: string;
}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}: Params): Promise<void> {
    // Ensure the database connection is established
    await connectToDB(); // Ensure connectToDB() returns a promise and handles connection properly

    try {

       
        await User.findOneAndUpdate(
            { id: userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded: true,
            },
            { upsert: true, new: true } // 'new: true' to return the updated document
        );

        if (path === '/profile/edit') {
            revalidatePath(path);
        }
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`);
    }
}

export async function fetchUser(userId: string) {
    // Ensure the database connection is established
    await connectToDB(); // Ensure connectToDB() returns a promise and handles connection properly

    try {
        return await User.findOne({ id: userId })
            // Uncomment and adjust if you want to populate fields
            // .populate({
            //     path: 'communities',
            //     model: Community
            // })
    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`);
    }
}
