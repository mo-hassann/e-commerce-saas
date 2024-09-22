import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBag, Zap, Globe } from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <header className="container mx-auto py-6">
        <nav className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">StoreCreator</h1>
          <div>
            <Link href="/sign-in">
              <Button variant="ghost" className="mr-2">
                Login
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4">
        <section className="text-center py-20">
          <h2 className="text-4xl font-bold mb-4">Create Your Online Store in Minutes</h2>
          <p className="text-xl text-gray-600 mb-8">Powerful, easy-to-use tools to build and grow your e-commerce business</p>
          <Link href="/sign-up">
            <Button size="lg" className="text-lg">
              Get Started for Free
            </Button>
          </Link>
        </section>

        <section className="py-16">
          <h3 className="text-3xl font-semibold text-center mb-12">Why Choose StoreCreator?</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard icon={<ShoppingBag className="w-12 h-12 text-blue-500" />} title="Easy Setup" description="Launch your store quickly with our intuitive interface and pre-built templates." />
            <FeatureCard icon={<Zap className="w-12 h-12 text-blue-500" />} title="Powerful Tools" description="Access advanced features like inventory management, analytics, and marketing tools." />
            <FeatureCard icon={<Globe className="w-12 h-12 text-blue-500" />} title="Global Reach" description="Sell to customers worldwide with multi-language support and international shipping options." />
          </div>
        </section>

        <section className="py-16 text-center">
          <h3 className="text-3xl font-semibold mb-8">Ready to Start Selling?</h3>
          <Link href="/sign-up">
            <Button size="lg" className="text-lg">
              Create Your Store Now
            </Button>
          </Link>
        </section>
      </main>

      <footer className="bg-gray-100 py-8">
        <div className="container mx-auto text-center text-gray-600">&copy; 2024 StoreCreator. All rights reserved.</div>
      </footer>
    </div>
  );
}

const FeatureCard = ({ icon, title, description }: { icon: any; title: string; description: string }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex flex-col items-center">
          {icon}
          <span className="mt-4 text-xl">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardContent>
    </Card>
  );
};
