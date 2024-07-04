import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SheetTrigger, SheetContent, Sheet } from "@/components/ui/sheet"
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getDbUser } from "@/app/_actions/user";
import { getAuthorizedMiddleman, isAdmin } from "@/app/_actions/auth";
import { UserRole } from "@prisma/client";
import SearchBar from "./SearchBar";

// TODO can fix css 
export default async function NavBar() {
  const { getUser } = getKindeServerSession()
  const kindeUser = await getUser();
  const user = (kindeUser ? await getDbUser(kindeUser) : null); // Checks whether user is logged in
  return (
    <>
      <header className="flex h-20 w-full items-center px-4 md:px-6">
        <NavSheet />
        {/* Search bar */}
        <SearchBar />
        <nav className="ml-auto hidden lg:flex gap-6">
          {user?.role == UserRole.ADMIN &&
            <Link
              className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              href="/admin"
            >
              Admin panel
            </Link>
          }
          <Link
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
            href="/"
          >
            Home
          </Link>
          {user ? // Conditionally renders based on whether user is logged in
            <>
              {/* User is logged in */}
              <UserProfileDropdown name={user.name} username={user.username} />
              <LogoutLink
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              >
                Logout
              </LogoutLink>
            </> :
            <>
              {/* User not logged in */}
              <RegisterLink
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              >
                Register
              </RegisterLink>
              <LoginLink
                className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
              >
                Login
              </LoginLink>
            </>
          }
          <Link
            href="/sell"
            className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
          >
            Sell
          </Link>
        </nav>
      </header>
      {/* <div className="text-destructive text-center">App is hosted on free server, button clicks are slow but will load in 3s if they are meant to load.</div> */}
    </>
  )
}

// Returns a Dropdown menu
async function UserProfileDropdown({ name, username }: { name: string, username: string }) {
  const middleman = await getAuthorizedMiddleman();
  const admin = await isAdmin();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50"
      >
        Welcome, {name}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={`/users/${username}`} className="cursor-pointer"> Profile </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild >
          <Link href="/manage-listing" className="cursor-pointer">Manage Listings </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild >
          <Link href="/purchases" className="cursor-pointer">My Purchases</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/sales" className="cursor-pointer">My Sales</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/reports" className="cursor-pointer">My Reports</Link>
        </DropdownMenuItem>
        {middleman &&
          <DropdownMenuItem asChild>
            <Link href="/orders" className="cursor-pointer">Manage Orders</Link>
          </DropdownMenuItem>
        }
        {admin &&
          <DropdownMenuItem asChild>
            <Link href="/manage-reports" className="cursor-pointer">Manage Reports</Link>
          </DropdownMenuItem>
        }
      </DropdownMenuContent>
    </DropdownMenu>

  )
}

// Hamburger nav menu for when screen size shrinks
function NavSheet() {
  //TODO fix link
  return (
    <div>
      <Sheet>
        <SheetTrigger asChild>
          <Button className="lg:hidden mr-2" size="icon" variant="outline">
            <MenuIcon className="h-6 w-6" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Link className="mr-6 hidden lg:flex" href="/">
            <MountainIcon className="h-6 w-6" />
            <span className="sr-only">Acme Inc</span>
          </Link>
          <div className="grid gap-2 py-6">
            <Link className="flex w-full items-center py-2 text-lg font-semibold" href="/">
              Home
            </Link>
            <RegisterLink className="flex w-full items-center py-2 text-lg font-semibold" >
              Register
            </RegisterLink>
            <LoginLink className="flex w-full items-center py-2 text-lg font-semibold" >
              Login
            </LoginLink>
            <Link className="flex w-full items-center py-2 text-lg font-semibold" href="/sell">
              Sell
            </Link>
          </div>
        </SheetContent>
      </Sheet>
      <Link className="mr-6 hidden lg:flex" href="/">
        <MountainIcon className="h-6 w-6" />
        <span className="sr-only">Orbital Shop</span>
      </Link>
    </div>
  )
}

function MenuIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="4" x2="20" y1="12" y2="12" />
      <line x1="4" x2="20" y1="6" y2="6" />
      <line x1="4" x2="20" y1="18" y2="18" />
    </svg>
  )
}

function MountainIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
    </svg>
  )
}