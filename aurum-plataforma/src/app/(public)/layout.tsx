import Navbar from "@/components/home/Navbar"

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <div className="bg-black text-white min-h-screen pt-16">
        {children}
      </div>
    </>
  )
}
