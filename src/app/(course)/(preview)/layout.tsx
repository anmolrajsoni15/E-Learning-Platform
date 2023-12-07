import Image from "next/image";
import Navbar from "@/app/(dashboard)/_components/Navbar";
import Sidebar from "@/app/(dashboard)/_components/Sidebar";

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <div className="hidden h-full bg-[#101828] md:flex items-center justify-start w-full fixed inset-y-0 z-50">
        <Sidebar />
        <div className="flex flex-col items-start justify-start h-full w-full py-3">
          <div className="h-[80px] sticky inset-y-0 w-full z-50">
            <Navbar />
          </div>
          <main className=" w-full h-full overflow-y-auto bg-white rounded-bl-[40px] border-b-[10px] border-solid border-white">
            {children}
          </main>
        </div>
      </div>

      <div className="md:hidden h-[80px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      {/* <div className="hidden md:flex w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div> */}
      <main className="md:pl-56 md:hidden pt-[80px] h-full">{children}</main>
      {/* <Image
        alt="curve"
        src={"/curve.svg"}
        className="hidden md:block md:fixed top-[11px] left-[239px] rotate-90 z-50"
        width={40}
        height={40}
      /> */}
      {/* <div className="border-y-0 md:border-y-[12px] h-full w-full border-solid border-[#101828] fixed overflow-auto">
        
      </div> */}
      {/* <Image
        alt="curve"
        src={"/curve.svg"}
        className="hidden md:block md:fixed bottom-[11px] left-[239.5px] z-50"
        width={40}
        height={40}
      /> */}
    </div>
  );
}
