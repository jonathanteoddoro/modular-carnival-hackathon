"use client";

import Image from "next/image";

function Header() {

  return (
    <>
    <header className="h-20 w-full p-4 sm:px-[76px] flex justify-center bg-red-500 shadow-md">
        <Image src="/logo.svg" alt="Pillchain" width={100} height={100} />
    </header>
    
    </>
  );
}

export default Header;