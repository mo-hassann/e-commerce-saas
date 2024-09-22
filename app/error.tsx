"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, Home, ArrowLeft, Search } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ErrorPage() {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4">
      <div className="text-center">
        <AlertCircle className="mx-auto h-16 w-16 text-red-500 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Oops! Error</h1>
        <p className="text-xl text-gray-600 mb-8">Something went wrong</p>

        <div className="space-y-4">
          <p className="text-gray-600">Here are some helpful links:</p>

          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Button variant="outline" className="flex items-center justify-center" onClick={() => router.push("/")}>
              <Home className="mr-2 h-4 w-4" />
              Go to Home
            </Button>

            <Button variant="outline" className="flex items-center justify-center" onClick={() => router.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Go Back
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-gray-500">
          If you think this is a mistake, please contact our{" "}
          <a href="/support" className="text-blue-600 hover:underline">
            support team
          </a>
          .
        </p>
      </div>
    </div>
  );
}
