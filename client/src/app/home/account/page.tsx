"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/lib/components/ui/avatar";
import { Button } from "@/lib/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/lib/components/ui/card";
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/lib/components/ui/field";
import { Input } from "@/lib/components/ui/input";
import { Label } from "@/lib/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/lib/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/lib/components/ui/tabs";
import { useSettingsQuery, useUpdateSettingsMutation } from "@/lib/hooks/queries/use-settings";
import { useChangePasswordMutation, useUpdateProfileMutation, useUserQuery } from "@/lib/hooks/queries/use-user";
import { useForm } from "@tanstack/react-form";
import { Check, Eye, EyeOff, KeyRound, Loader2, Palette, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data: user, isLoading: userLoading } = useUserQuery();
  const { data: settings, isLoading: settingsLoading } = useSettingsQuery();
  const updateProfile = useUpdateProfileMutation();
  const changePassword = useChangePasswordMutation();
  const updateSettings = useUpdateSettingsMutation();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { theme, setTheme } = useTheme();

  const profileForm = useForm({
    defaultValues: {
      name: user?.name ?? "",
    },
    onSubmit: async ({ value }) => {
      try {
        await updateProfile.mutateAsync({ name: value.name });
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to update profile");
      }
    },
  });

  const passwordForm = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    onSubmit: async ({ value }) => {
      if (value.newPassword !== value.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      try {
        await changePassword.mutateAsync({
          currentPassword: value.currentPassword,
          newPassword: value.newPassword,
        });
        toast.success("Password changed successfully!");
        passwordForm.reset();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : "Failed to change password");
      }
    },
  });

  if (userLoading || settingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full max-w-lg grid-cols-3 mb-8">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="size-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center gap-2">
            <Palette className="size-4" />
            Preferences
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <KeyRound className="size-4" />
            Security
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="card-organic border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Profile Details</CardTitle>
              <CardDescription>
                Update your personal information and how others see you
              </CardDescription>
            </CardHeader>
            <CardContent>

              <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
                <Avatar className="size-20 ring-4 ring-primary/10">
                  <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
                  <AvatarFallback className="bg-primary/10 text-primary text-xl font-semibold">
                    {user?.name?.charAt(0) ?? user?.email?.charAt(0) ?? "U"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-foreground">{user?.name || "No name set"}</h3>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  profileForm.handleSubmit();
                }}
              >
                <FieldGroup>
                  <profileForm.Field name="name">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="name">Display Name</FieldLabel>
                        <FieldDescription>
                          This is the name that will be displayed to others
                        </FieldDescription>
                        <Input
                          id="name"
                          placeholder="Enter your name"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          className="max-w-md"
                        />
                        {field.state.meta.errors.length > 0 && (
                          <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                        )}
                      </Field>
                    )}
                  </profileForm.Field>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={updateProfile.isPending}
                      className="btn-playful"
                    >
                      {updateProfile.isPending ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Check className="size-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="card-organic border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Appearance</CardTitle>
              <CardDescription>
                Customize how Serene looks and feels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Theme</h3>
                  <RadioGroup
                    value={settings?.theme ?? "light"}
                    onValueChange={async (value) => {
                      try {
                        // Apply theme immediately
                        setTheme(value.toLowerCase());
                        // Save to database
                        await updateSettings.mutateAsync({ theme: value });
                        toast.success(`Theme changed to ${value}`);
                      } catch (error) {
                        toast.error("Failed to update theme");
                      }
                    }}
                    className="grid grid-cols-3 gap-4 max-w-md"
                  >
                    <div>
                      <RadioGroupItem
                        value="Light"
                        id="theme-light"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="theme-light"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-200 mb-2" />
                        <span className="text-sm font-medium">Light</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="Dark"
                        id="theme-dark"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="theme-dark"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-slate-600 mb-2" />
                        <span className="text-sm font-medium">Dark</span>
                      </Label>
                    </div>
                    <div>
                      <RadioGroupItem
                        value="System"
                        id="theme-system"
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor="theme-system"
                        className="flex flex-col items-center justify-between rounded-xl border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                      >
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-50 to-slate-800 border-2 border-muted mb-2" />
                        <span className="text-sm font-medium">System</span>
                      </Label>
                    </div>
                  </RadioGroup>
                  <p className="text-sm text-muted-foreground mt-3">
                    Choose how Serene appears to you. Select System to match your device settings.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="card-organic border-0 shadow-lg">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  passwordForm.handleSubmit();
                }}
              >
                <FieldGroup>
                  <passwordForm.Field name="currentPassword">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="currentPassword">Current Password</FieldLabel>
                        <FieldDescription>
                          Enter your current password to verify your identity
                        </FieldDescription>
                        <div className="relative max-w-md">
                          <Input
                            id="currentPassword"
                            type={showCurrentPassword ? "text" : "password"}
                            placeholder="Enter current password"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showCurrentPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                        )}
                      </Field>
                    )}
                  </passwordForm.Field>

                  <passwordForm.Field name="newPassword">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="newPassword">New Password</FieldLabel>
                        <FieldDescription>
                          Choose a strong password with at least 8 characters
                        </FieldDescription>
                        <div className="relative max-w-md">
                          <Input
                            id="newPassword"
                            type={showNewPassword ? "text" : "password"}
                            placeholder="Enter new password"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showNewPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                        )}
                      </Field>
                    )}
                  </passwordForm.Field>

                  <passwordForm.Field name="confirmPassword">
                    {(field) => (
                      <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirm New Password</FieldLabel>
                        <FieldDescription>
                          Re-enter your new password to confirm
                        </FieldDescription>
                        <div className="relative max-w-md">
                          <Input
                            id="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={field.state.value}
                            onChange={(e) => field.handleChange(e.target.value)}
                            onBlur={field.handleBlur}
                            className="pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="size-4" />
                            ) : (
                              <Eye className="size-4" />
                            )}
                          </button>
                        </div>
                        {field.state.meta.errors.length > 0 && (
                          <FieldError>{field.state.meta.errors.join(", ")}</FieldError>
                        )}
                      </Field>
                    )}
                  </passwordForm.Field>

                  <div className="pt-4">
                    <Button
                      type="submit"
                      disabled={changePassword.isPending}
                      className="btn-playful"
                    >
                      {changePassword.isPending ? (
                        <>
                          <Loader2 className="size-4 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <KeyRound className="size-4 mr-2" />
                          Update Password
                        </>
                      )}
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}