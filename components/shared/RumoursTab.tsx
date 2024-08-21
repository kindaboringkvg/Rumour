import { redirect } from "next/navigation";

import RumourCard from "../cards/RumourCard";
import { fetchUserPosts } from "@/lib/actions/user.actions";

interface Result {
  name: string;
  image: string;
  id: string;
  rumours: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

const RumoursTab = async ({ currentUserId, accountId, accountType }: Props) => {
  
    let result = await fetchUserPosts(accountId);

    if(!result) redirect('/');

  return (
    <section className='mt-9 flex flex-col gap-10'>
      {result.rumours.map((rumour : any) => (
        <RumourCard
          key={rumour._id}
          id={rumour._id}
          currentUserId={currentUserId}
          parentId={rumour.parentId}
          content={rumour.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: rumour.author.name,
                  image: rumour.author.image,
                  id: rumour.author.id,
                }
          }
          community={
            accountType === "Community"
              ? { name: result.name, id: result.id, image: result.image }
              : rumour.community
          }
          createdAt={rumour.createdAt}
          comments={rumour.children}
        />
      ))}
    </section>
  );
}

export default RumoursTab;