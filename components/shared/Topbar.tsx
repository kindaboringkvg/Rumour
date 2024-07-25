import React from "react";
import Link from "next/link";
import { OrganizationSwitcher, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

function Topbar() {
    return (
        <nav className="topbar">
            <Link href = "/" className="flex
            items-center gap-4">
                <img src="/assets/logo.svg"
                alt="logo"
                width={28}
                height={28}/>


                <p className="text-heading3-bold
                text-light-1 mex-xs:hidden"> 
                    Rumour
                </p>
            </Link>
            <div className = "flex items-center">
                <div className="block md:hidden">
                    <SignedIn>
                        <SignOutButton>
                            <div className="flex
                            cursor-pointer">
                                <img src = "/assets/logout.svg" 
                                alt = "logout"
                                width = {24}
                                height = {24} />
                            </div>
                        </SignOutButton>
                    </SignedIn>

                </div>

                <OrganizationSwitcher
                    appearance={{
                        baseTheme: dark,
                        elements: {
                            organizationSwitcherTrigger: "py-2 px-4"
                        }
                    }}
                />

            </div>
        </nav>
    )
   
}

export default Topbar;