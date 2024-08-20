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
        id = {rumour._id}
        currentUserId = {user?.id || ""}
        parentId = {rumour.parentId}
        content = {rumour.text}
        author = {rumour.author}  
        community = {rumour.community}
        createdAt = {rumour.createdAt}
        comments = {rumour.children}
        /> 
        </div>
        <div className="mt-7">
            <Comment 
            rumourId = {rumour.id}
            currentUserImg = {userInfo.image}
            currentUserId = {JSON.stringify(userInfo._id)}
            />
        </div>

        <div className='mt-10'>
        {rumour.children.map((childItem: any) => (
          <RumourCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
    )

}

export default Page;