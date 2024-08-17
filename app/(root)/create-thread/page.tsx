import PostThread from "@/components/forms/PostThreads";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

async function Page(){
    const user = await currentUser();

    if (!user) {
        redirect('/sign-in'); // Redirect to login page
        return null; // Prevent further code execution
    }

    const userInfo = await fetchUser(user.id);
    console.log('onboarded Status', userInfo?.onboarded);
    // if(!userInfo?.onboarded) redirect('/onboarding');

    if (!userInfo?.onboarded) {
        redirect('/onboarding');
    }

    return (
        <>
        <h1 className="head-text">Create Rumour</h1>

        <PostThread userId = {userInfo._id}/>
        </>
    )
}
    

export default Page; 