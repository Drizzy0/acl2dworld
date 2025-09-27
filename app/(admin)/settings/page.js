"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-toastify";

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    siteName: "Air Clothing Line",
    logoUrl: "/images/newest.PNG",
    contactEmail: "contact@acl.com",
  });
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      toast.success("Settings saved!");
      console.log("Saved settings:", settings);
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold dark:text-white mb-6">Site Settings</h1>
      <form onSubmit={handleSave} className="space-y-4 max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <div>
          <label className="block text-sm font-medium dark:text-white mb-2">Site Name</label>
          <Input name="siteName" value={settings.siteName} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white mb-2">Logo URL</label>
          <Input name="logoUrl" value={settings.logoUrl} onChange={handleChange} />
        </div>
        <div>
          <label className="block text-sm font-medium dark:text-white mb-2">Contact Email</label>
          <Input name="contactEmail" type="email" value={settings.contactEmail} onChange={handleChange} />
        </div>
        <Button type="submit" className="w-full" disabled={isSaving}>
          {isSaving ? "Saving..." : "Save Settings"}
        </Button>
      </form>
    </div>
  );
}