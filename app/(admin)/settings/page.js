"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/ui/file-upload";
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
    <div className="p-2 md:p-2">
      <h1 className="text-2xl md:text-3xl font-bold dark:text-white mb-4 md:mb-6">
        Site Settings
      </h1>
      <div className="flex justify-center">
        <form
          onSubmit={handleSave}
          className="space-y-1 w-full max-w-sm bg-white dark:bg-gray-800 p-1 md:px-8 md:py-4 rounded-lg shadow-md"
        >
          <div>
            <label className="block text-sm font-medium dark:text-white mb-1">
              Site Name
            </label>
            <Input
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              placeholders={["Enter site name..."]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white mb-1">
              Contact Email
            </label>
            <Input
              name="contactEmail"
              type="email"
              value={settings.contactEmail}
              onChange={handleChange}
              placeholders={["Enter contact email..."]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium dark:text-white mb-1">
              Logo
            </label>
            <FileUpload
              onChange={(files) => {
                if (files.length > 0) {
                  const reader = new FileReader();
                  reader.onload = () => {
                    setSettings({ ...settings, logoUrl: reader.result });
                  };
                  reader.readAsDataURL(files[0]);
                }
              }}
            />
            {settings.logoUrl && (
              <img
                src={settings.logoUrl}
                alt="Site Logo"
                className="w-9 h-9 md:w-12 md:h-12 object-contain rounded"
              />
            )}
          </div>
          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </form>
      </div>
    </div>
  );
}