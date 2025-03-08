import Image from "next/image";
import Link from "next/link";

interface Props {
    accountId: string;
    authUserId: string;
    name: string;
    username: string;
    imgUrl: string;
    bio: string;
}

const ProfileHeader = ({
    accountId,
    authUserId,
    name,
    username,
    imgUrl,
    bio,
}: Props) => {
    const isOwnProfile = accountId === authUserId;

    return (
        <div className="flex w-full flex-col justify-start">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="relative h-20 w-20 object-cover">
                        <Image
                            src={imgUrl}
                            alt="profile Image"
                            fill
                            className="rounded-full object-cover shadow-2xl"
                        />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-left text-heading3-bold text-light-1">{name}</h2>
                        <p className="text-base-medium text-gray-1">@{username}</p>
                    </div>
                </div>

                {isOwnProfile && (
                    <Link
                        href="/profile/edit"
                        className="flex items-center gap-2 rounded-lg bg-primary-500 px-4 py-2 text-light-1"
                    >
                        <Image
                            src="/assets/edit.svg"
                            alt="Edit"
                            width={16}
                            height={16}
                            className="object-contain"
                        />
                        Edit Profile
                    </Link>
                )}
            </div>

            {/* todo community */}

            <p className="mt-6 max-w-lg text-base-regular text-light-2">{bio}</p>

            <div className="mt-12 h-0.5 w-full bg-dark-3" />
        </div>
    )
}

export default ProfileHeader;