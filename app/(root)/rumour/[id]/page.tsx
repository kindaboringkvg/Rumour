import RumourCard from "@/components/cards/RumourCard";
import Comment from "@/components/forms/Comment";
import { fetchRumourById, fetchRumours } from "@/lib/actions/rumour.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";


const Page = async ({params} : {params : {id : string}}) => {
    if(!params.id) return null;

    const user  = await currentUser();
    if(!user) return null;

    const userInfo = await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding')

        const rumour = await fetchRumourById(params.id);
    return (
    <section className="relative">
        <div>
        <RumourCard 
        key = {rumour._id}
        id = {rumour._id}
        currentUserId = {user?.id || ""}
        parentId = {rumour.parentId}
        content = {rumour.author}
        author = {rumour.author}  
        community = {rumour.community}
        createdAt = {rumour.createdAt}
        comments = {rumour.children}
        /> 
        </div>
        <div className="mt-7 ">
            <Comment 
            rumourId = {rumour.id}
            currentUserImg = {user.imageUrl}
            currentUserId = {JSON.stringify(userInfo._id)}
            />
        </div>
    </section>
    )

}

export default Page;