"use client";

import { useRouter } from "next/navigation";
import { authUtils } from "@/lib/localdata";
import { User } from "@prisma/client";

interface Headerelements {
   user?: User | null
}
export function Header({ user }: Headerelements) {
   const router = useRouter();
   if (user){
return (
    
    <header>
        <h1>Bekam</h1>
        <img src={user.imgUrl||""}/>
        <span style={{ cursor: "pointer", color: "#e2e8f0" }} onClick={() => {
            authUtils.clearId();
            router.replace("/login");
        }}>
          Logout
        </span>
    </header> 
)
   }
   else{
    return (<header><h1>Bekam</h1></header>)
   }
}