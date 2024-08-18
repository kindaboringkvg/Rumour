// src/pages/index.js
import RumourCard from "@/components/cards/RumourCard";
import { fetchRumours } from "@/lib/actions/rumour.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  const result = await fetchRumours(1,20);
  const user  = await currentUser();
  return (
    <>
      <h1 className="head-text text-left">
      Home
      </h1>

      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
          <p className="no-result">No rumours here</p>
        ) : (
          <>
            {result.posts.map((post) => (
              <RumourCard 
              key = {post._id}
              id = {post._id}
              currentUserId = {user?.id || ""}
              parentId = {post.parentId}
              content = {post.author}
              author = {post.author}  
              community = {post.community}
              createdAt = {post.createdAt}
              comments = {post.children}
              />
            ))}
          </>
        )}
      </section>
    </>
      
  )
}
