"use client";

import Image from "next/image";

function Header() {
  return (
    <header className="h-20 w-full p-4 sm:px-[76px] flex justify-between items-center bg-red-500 shadow-md">
      <h1 className="text-white text-2xl font-bold">Pill Chain</h1>
      <Image src="/logo.svg" alt="Pill chain" width={50} height={100} />
    </header>
  );
}

export default Header;