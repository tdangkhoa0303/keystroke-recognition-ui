import { createFileRoute, Link } from '@tanstack/react-router';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { Bell, Lock, Menu, Paintbrush, Settings } from 'lucide-react';
import KeystrokeDynamicSettings from '@/components/pages/settings/kd-settings';

export const Route = createFileRoute('/__auth/settings')({
  component: SettingsPage,
});

const data = {
  nav: [
    { name: 'Account', icon: Bell, path: '' },
    { name: 'Security Settings', icon: Menu, path: '' },
    { name: 'Appearance', icon: Paintbrush, path: '' },
    { name: 'Privacy & visibility', icon: Lock, path: '' },
    { name: 'Advanced', icon: Settings, path: '' },
  ],
};

function SettingsPage() {
  return (
    <>
      <main className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Security</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Behavioural biometrics</CardTitle>
              <CardDescription>
                By using your behavioural biometrics data like keystroke
                dynamics, we enhance your account security level and quick reply
                to account take over incident
              </CardDescription>
            </CardHeader>
            <CardContent>
              <KeystrokeDynamicSettings />
            </CardContent>
          </Card>
        </div>
      </main>
      <div className="flex justify-between items-center mb-2"></div>
    </>
  );
}
