import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

function SignupImage() {
  return (
    <div className="w-1/2 hidden md:flex justify-center items-center relative">
      {/* Skeleton Loader (Only visible if image hasn't loaded) */}
      <Skeleton className="absolute w-3/4 h-3/4 rounded-md shadow-md animate-pulse" />

      {/* Optimized Image */}
      <Image
        className="w-3/4 h-3/4 object-cover rounded-md shadow-md"
        src="/signupBanner.jpeg"
        alt="Signup Banner"
        width={600}
        height={600}
        sizes="(max-width: 768px) 100vw, 50vw"
        priority
      />
    </div>
  );
}

export default SignupImage;
