"use server"

import { revalidatePath } from "next/cache";
import Rumour from "../models/rumour.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { pages } from "next/dist/build/templates/app-page";

interface Params {
    text : string,
    author : string,
    communityId : string | null,
    path : string,  
}

export async function createRumour({text, author, communityId, path } : Params) {

    try {
        connectToDB();

        const createdRumour= await Rumour.create({
            text, 
            author,
            community : null,
        });
    
        //updating user model 
        await User.findByIdAndUpdate(author, {
            $push : {rumours : createdRumour._id}
        })
    
        revalidatePath(path); 
    } catch (error : any) {
        throw new Error(`Error creating thread : ${error.message}`)
    }
    
}

export async function fetchRumours(pageNumber = 1, pageSize = 20) {
    connectToDB();
    //calculate the number of skip post
    const skipAmount = (pageNumber - 1) * pageSize;

    //fetching posts that have no parents
    const postsQuery = Rumour.find({ parentId : {$in : [null, undefined]}})

    .sort({createdAt : 'desc'})
    .skip(skipAmount)
    .limit(pageSize)
    .populate({path : 'author', model : User})
    .populate({ 
        path : 'children', 
        populate : {
            path : 'author',
            model : User,
            select : "_id name parentId image"
        }
    })

    const totalPostCount = await Rumour.countDocuments({ parentId : {$in : [null, undefined]}})

    const posts = await postsQuery.exec();

    const isNext = totalPostCount > (skipAmount + posts.length);

    return {posts, isNext};


}

export async function fetchRumourById(id : string) {
    connectToDB();

    try {
        //todo populate community
        const rumour = await Rumour.findById(id)
        .populate({
            path : 'author',
            model : User,
            select : "_id id name image",
        })
        .populate({
            path : 'children',
            populate : [
            {
                path : 'author',
                model : User,
                select : "_id id name parentId image",

            },
            {
                path : 'children',
                model : Rumour,
                populate : {
                    path : 'author',
                    model : User,
                    select : "_id id name parentId image",
                },
            },
        
        ],

        }).exec();

        return rumour;
    } catch (error : any) {
        throw new Error(`Error fetching rumour : ${error.message}`)
    }
}