import NavBar from "@/components/NavBar";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="container">
    <NavBar />
    <div>{children}</div>
  </div>
};
