import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';


interface BackButtonprops{
    label: string;
    href: string;
}
const BackButton = ({
    label,
    href
}:BackButtonprops) => {

  return (
    <Button 
    variant={"link"}
    size={"sm"}
    className='font-normal w-full'
    asChild>
      <Link href={href}>
      {label}
      </Link>
    </Button>
  )
}

export default BackButton