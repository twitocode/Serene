import { Suspense } from "react";
import ActivitiesPage from "@/lib/components/activities/activities-page";

export default function Page() {
	return (
		<Suspense>
			<ActivitiesPage />
		</Suspense>
	);
}
