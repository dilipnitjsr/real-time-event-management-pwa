'use client'

import { Card,
    CardContent,
    CardHeader,
    CardFooter,

 } from "../ui/card";
import BackButton from "./backButton";
import Header from "./header";
import Social from "./social";

 
interface CardWrapperProps {
    children: React.ReactNode;
    headerLabel: string;
    backButtonLabel: string;
    backButtonHref: string;
    showSocial?: boolean;
}
const CardWrapper = ({
    children,
    headerLabel,
    backButtonLabel,
    backButtonHref,
    showSocial
    }: CardWrapperProps) => {
  return (
<Card className="">
    <CardHeader>
        <Header label={headerLabel} />
    </CardHeader>
    <CardContent>
    {children}
    </CardContent>
    {
        showSocial && (
            <CardFooter>
                <Social/>
            </CardFooter>
            
        )
    }
    <CardFooter>
        <BackButton href={backButtonHref} label={backButtonLabel} />
    </CardFooter>

</Card>  )
}

export default CardWrapper