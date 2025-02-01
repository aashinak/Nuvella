// app/layout.tsx
// import TokenHandler from "@/components/TokenHandler";
import TopSection from "@/components/user/homepage/topSection";
import Navbar from "@/components/user/homepage/navbar";
import TokenHandler from "@/components/user/tokenHandler";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen flex flex-col">
      <TokenHandler /> 
      <TopSection />
      <Navbar />
      {children}
    </div>
  );
}
