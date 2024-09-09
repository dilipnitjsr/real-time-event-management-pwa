import { FaUser } from "react-icons/fa"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { LogoutButton } from "./logout-button"
import { ExitIcon } from "@radix-ui/react-icons"
import { currentUser } from "@/lib/auth"
import { useCurrentUser } from "@/hooks/use-current-user"





export const UserButton = () => {
    const user = useCurrentUser()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar>
                    <AvatarImage src={user?.image || ""}/>
                    <AvatarFallback className=" bg-sky-500">
                        <FaUser className=" text-white"/>
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className=" w-40" align="end">
                <LogoutButton>
                <DropdownMenuItem>
                    <ExitIcon className=" h-4 w-4 mr-2"/>
                    Logout
                </DropdownMenuItem>
                </LogoutButton>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}