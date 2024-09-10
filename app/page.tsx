import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function Home() {
  return (
    <div className=" flex h-full flex-col justify-center items-center text-2xl font-bold bg-blue-600">
      <h1>Home Page</h1>

      <Button>
        <Link href="/auth/login">SignIn</Link>
      </Button>
    </div>
  );
}
