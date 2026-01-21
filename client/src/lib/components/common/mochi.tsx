import Image from "next/image";
import Default from "../../../../public/mochi/Mochi.svg";
import Happy from "../../../../public/mochi/Mochi_Happy.svg";
import Sleepy from "../../../../public/mochi/Mochi_Sleepy.svg";

export function MochiDefault({ className }: { className?: string }) {
  return <Image src={Default} alt="" className={className} height={40} />;
}
export function MochiSleepy({ className }: { className?: string }) {
  return <Image src={Sleepy} alt="" className={className} height={40} />;
}
export function MochiHappy({ className }: { className?: string }) {
  return <Image src={Happy} alt="" className={className} height={40} />;
}
