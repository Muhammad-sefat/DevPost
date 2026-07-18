"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, BarChart3, Zap, Globe, Lock } from "lucide-react";

const services = [
  {
    title: "User Management",
    description: "Complete user lifecycle management with role-based access control and permissions.",
    icon: Users,
  },
  {
    title: "Analytics Dashboard",
    description: "Real-time analytics and reporting with interactive charts and data visualizations.",
    icon: BarChart3,
  },
  {
    title: "Security First",
    description: "Enterprise-grade security with JWT authentication, encryption, and audit logging.",
    icon: Lock,
  },
  {
    title: "High Performance",
    description: "Blazing fast performance with optimized queries, caching, and CDN delivery.",
    icon: Zap,
  },
  {
    title: "Scalable Architecture",
    description: "Microservices-ready architecture that scales horizontally as your user base grows.",
    icon: Globe,
  },
  {
    title: "Admin Panel",
    description: "Full-featured admin panel for managing users, services, and system settings.",
    icon: Shield,
  },
];

/**
 * Services section — showcases the main features/offerings.
 * Displayed on the landing page in a responsive grid layout.
 */
export function ServicesSection() {
  return (
    <section id="services" className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything You Need
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A complete toolkit for building and scaling your application.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Card key={service.title} className="group transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className="mt-4 text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">
                    {service.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
