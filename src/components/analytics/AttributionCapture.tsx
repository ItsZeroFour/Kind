"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/tracking";

export function AttributionCapture() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
