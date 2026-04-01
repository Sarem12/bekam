
import type { Metadata } from "next";
import { Analogy } from "@/components/InfoCards/Analogy";

export const metadata: Metadata = {
    title: "Experiment",
};

export default function ExpermentPage() {
    return (
    <div>
        <Analogy text="This is an *example* analogy." />
    </div>
    )
}
