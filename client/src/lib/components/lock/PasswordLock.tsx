import { Input } from "@/lib/components/ui/input";
import { usePreferencesStore } from "@/lib/stores/preferencesStore";
import { Lock } from "lucide-react";

export default function PasswordLock() {
  const { setLockState, pageLock } = usePreferencesStore();

  return (
    <span className="flex items-center space-x-4">
      <Lock />
      <Input
        type="password"
        className="font-bold text-9xl bg-secondary"
        onChange={(e) => {
          if (e.target.value == pageLock) setLockState(false);
        }}
      />
    </span>
  );
}
