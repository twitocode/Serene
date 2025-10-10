"use client";
import SereneLogo from "@/lib/components/common/SereneLogo";
import DailyAffirmations from "@/lib/components/home/DailyAffirmations";
import PasswordLock from "@/lib/components/lock/PasswordLock";
import { usePreferencesStore } from "@/lib/stores/preferencesStore";

export default function HomeLock() {
  const preferences = usePreferencesStore();
  return (
    preferences.isLocked && (
      <div className="grid grid-rows-3 h-screen py-20 px-20">
        <section className="flex justify-center items-start">
          <SereneLogo  iconSize={40} textSize="4xl"/>
        </section>
        <section className="flex items-center flex-col justify-center space-y-8">
          <h2 className="font-medium font-sans text-5xl">
            Grant access to your inner world.
          </h2>
          <PasswordLock />
        </section>
        <section className="flex items-end">
          <DailyAffirmations colour="text-black opacity-50" />
        </section>
      </div>
    )
  );
}
