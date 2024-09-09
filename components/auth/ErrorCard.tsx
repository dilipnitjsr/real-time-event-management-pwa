import { ExclamationTriangleIcon } from "@radix-ui/react-icons"
import CardWrapper from "./cardWrapper"

const ErrorCard = () => {
  return (
   <CardWrapper 
   headerLabel="Oops! Something went wrong!!"
   backButtonHref="/auth/login"
   backButtonLabel="Back to login"
   showSocial
   >
<div>
    <ExclamationTriangleIcon/>
</div>
   </CardWrapper>
  )
}

export default ErrorCard