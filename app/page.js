"use client";

import { useState } from "react";
import BootSequence from "./components/BootSequence";
import Desktop from "./components/Desktop";

export default function Home() {
    const [bootComplete, setBootComplete] = useState(false);

    return (
        <div>
            {!bootComplete
                ? <BootSequence onComplete={() => setBootComplete(true)} />
                : <Desktop />}
        </div>
    );
}
