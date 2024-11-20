import Link from "next/link";

import { Button } from "../ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "../ui/sheet";
import { Menu } from "lucide-react";

const NavbarLinks = () => {
  return (
    <>
      <Button asChild variant="link">
        <Link href="/about">About</Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/about">Contact</Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/about">Support</Link>
      </Button>
      <Button asChild variant="link">
        <Link href="/about">Resources</Link>
      </Button>
    </>
  );
};

export const Navbar = () => {
  return (
    <div className="w-full flex flex-row py-8 px-16 justify-between items-center">
      <h1 className="text-xl font-bold">ClusterLogger</h1>
      <nav className="hidden lg:flex flex-row gap-2 items-center">
        <NavbarLinks />
        <Button asChild>
          <Link href="/auth/login">Login</Link>
        </Button>
      </nav>
      <Sheet>
        <SheetTrigger className="lg:hidden" asChild>
          <Button variant="outline" size="icon">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent className="flex flex-col justify-between">
          <div>
            <SheetHeader>
              <SheetClose />
            </SheetHeader>
            <div className="flex flex-col gap-2 my-8">
              <NavbarLinks />
            </div>
          </div>
          <SheetFooter>
            <Button asChild className="w-full my-auto">
              <Link href="/auth/login">Login</Link>
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
};
