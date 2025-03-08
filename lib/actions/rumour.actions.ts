"use server"

import { revalidatePath } from "next/cache";
import Rumour from "../models/rumour.model";
import { connectToDB } from "../mongoose";
import User from "../models/user.model";
import { pages } from "next/dist/build/templates/app-page";
import Community from "../models/community.model";

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
        throw new Error(`Error creating rumour : ${error.message}`)
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

export async function fetchRumourById(id: string) {
    connectToDB();

    try {
        //todo put communities
        const rumour = await Rumour.findById(id)
            .populate({
                path: 'author',
                model: User,
                select: "_id name image",
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: User,
                        select: "_id name parentId image",
                    },
                    {
                        path: 'children',
                        model: Rumour,
                        populate: {
                            path: 'author',
                            model: User,
                            select: "_id name parentId image",
                        },
                    },
                ],
            })
            .exec();

        return rumour;
    } catch (error: any) {
        throw new Error(`Error fetching rumour: ${error.message}`);
    }
}

export async function addCommentToRumour(
    rumourId : string,
    commentText  :string,
    userId : string,
    path : string,
) {
    connectToDB();

    try {
        // Find the original rumour by its ID
        const originalRumour = await Rumour.findById(rumourId);

        if(!originalRumour){
            throw new Error("Rumour not there")
        }

        // Create the new comment rumour
        const commentRumour = new Rumour({
            text : commentText,
            author : userId,
            parentId : rumourId, // Set the parentId to the original rumour's ID
        })

        // Save the comment rumour to the database
        const savedCommentRumour = await commentRumour.save();

        //Add the comment rumour's ID to the original rumour's children array
        originalRumour.children.push(savedCommentRumour._id);

        // Add the comment rumour's ID to the original rumour's children array
        await originalRumour.save();

        revalidatePath(path);

    } catch (error : any) {
        throw new Error(`Error adding comment to rumour; ${error.message}`)
    }
}

async function fetchAllChildRumours(rumourId: string): Promise<any[]> {
    const childRumours = await Rumour.find({ parentId: rumourId });
  
    const descendantRumours = [];
    for (const childRumour of childRumours) {
      const descendants = await fetchAllChildRumours(childRumour._id);
      descendantRumours.push(childRumour, ...descendants);
    }
  
    return descendantRumours;
  }

export async function deleteRumour(id: string, path: string): Promise<void> {
    try {
      connectToDB();
  
      // Find the rumour to be deleted (the main rumour)
      const mainRumour = await Rumour.findById(id).populate("author community");
  
      if (!mainRumour) {
        throw new Error("Rumour not found");
      }
  
      // Fetch all child Rumours and their descendants recursively
      const descendantRumours = await fetchAllChildRumours(id);
  
      // Get all descendant rumour IDs including the main rumour ID and child rumour IDs
      const descendantRumourIds = [
        id,
        ...descendantRumours.map((rumour) => rumour._id),
      ];
  
      // Extract the authorIds and communityIds to update User and Community models respectively
      const uniqueAuthorIds = new Set(
        [
          ...descendantRumours.map((rumour) => rumour.author?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainRumour.author?._id?.toString(),
        ].filter((id) => id !== undefined)
      );
  
      const uniqueCommunityIds = new Set(
        [
          ...descendantRumours.map((rumour) => rumour.community?._id?.toString()), // Use optional chaining to handle possible undefined values
          mainRumour.community?._id?.toString(),
        ].filter((id) => id !== undefined)
      );
  
      // Recursively delete child rumours and their descendants
      await Rumour.deleteMany({ _id: { $in: descendantRumourIds } });
  
      // Update User model
      await User.updateMany(
        { _id: { $in: Array.from(uniqueAuthorIds) } },
        { $pull: { rumours: { $in: descendantRumourIds } } }
      );
  
      // Update Community model
      await Community.updateMany(
        { _id: { $in: Array.from(uniqueCommunityIds) } },
        { $pull: { rumours: { $in: descendantRumourIds } } }
      );
  
      revalidatePath(path);
    } catch (error: any) {
      throw new Error(`Failed to delete rumour: ${error.message}`);
    }
  }
