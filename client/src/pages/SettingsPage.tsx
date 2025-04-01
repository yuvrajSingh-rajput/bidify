import { useState } from "react";
import MainLayout from "@/components/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const SettingsPage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isAdmin] = useState(user?.role === "admin");

  // User profile state
  const [profileData, setProfileData] = useState({
    name: user?.name || "John Doe",
    email: user?.email || "john.doe@example.com",
    phone: "+1 123-456-7890",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod auctor diam, id finibus nisl.",
    teamName: isAdmin ? "" : "Super Kings",
    profileImage: "/placeholder.svg"
  });

  // Settings state
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    bidAlerts: true,
    matchReminders: true,
    newsUpdates: false
  });

  // Admin settings state (only relevant for admin users)
  const [adminSettings, setAdminSettings] = useState({
    allowNewRegistrations: true,
    allowTeamEditing: true,
    publicVisibility: true,
    maintenanceMode: false
  });
  
  // Loading states
  const [isProfileSaving, setIsProfileSaving] = useState(false);
  const [isNotificationSaving, setIsNotificationSaving] = useState(false);
  const [isAdminSaving, setIsAdminSaving] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings({
      ...notificationSettings,
      [key]: !notificationSettings[key]
    });
  };

  const handleAdminSettingChange = (key) => {
    setAdminSettings({
      ...adminSettings,
      [key]: !adminSettings[key]
    });
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    setIsProfileSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProfileSaving(false);
      toast({
        title: "Profile updated",
        description: "Your profile information has been updated successfully.",
      });
    }, 1000);
  };

  const handleNotificationSubmit = (e) => {
    e.preventDefault();
    setIsNotificationSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsNotificationSaving(false);
      toast({
        title: "Notification preferences updated",
        description: "Your notification settings have been saved.",
      });
    }, 1000);
  };

  const handleAdminSubmit = (e) => {
    e.preventDefault();
    setIsAdminSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsAdminSaving(false);
      toast({
        title: "System settings updated",
        description: "The platform settings have been updated successfully.",
      });
    }, 1000);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-6">
        <div className="flex flex-col gap-6">
          <h1 className="text-3xl font-bold">Settings</h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
              {isAdmin && <TabsTrigger value="admin">Admin Settings</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <form onSubmit={handleProfileSubmit}>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account information and profile details.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-col items-center space-y-2">
                      <Avatar className="h-24 w-24">
                        <AvatarImage src={profileData.profileImage} />
                        <AvatarFallback>{profileData.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Button variant="outline" size="sm">
                        Change Avatar
                      </Button>
                    </div>
                    
                    <Separator />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          name="name"
                          value={profileData.name}
                          onChange={handleProfileChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={profileData.email}
                          onChange={handleProfileChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          name="phone"
                          value={profileData.phone}
                          onChange={handleProfileChange}
                        />
                      </div>
                      {!isAdmin && (
                        <div className="space-y-2">
                          <Label htmlFor="teamName">Team Name</Label>
                          <Input
                            id="teamName"
                            name="teamName"
                            value={profileData.teamName}
                            onChange={handleProfileChange}
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                      />
                    </div>

                    <Separator />
                    
                    <div className="space-y-2">
                      <h3 className="font-medium">Account Security</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Button variant="outline" type="button">
                          Change Password
                        </Button>
                        <Button variant="outline" type="button">
                          Two-Factor Authentication
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isProfileSaving}>
                      {isProfileSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Changes
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="notifications">
              <Card>
                <form onSubmit={handleNotificationSubmit}>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Configure how you receive notifications about auctions, matches and updates.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">General Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Email Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive updates via email
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={() => handleNotificationChange("emailNotifications")}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Push Notifications</p>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications on your device
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={() => handleNotificationChange("pushNotifications")}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Auction Alerts</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Bid Alerts</p>
                          <p className="text-sm text-muted-foreground">
                            Receive alerts about new bids during auctions
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.bidAlerts}
                          onCheckedChange={() => handleNotificationChange("bidAlerts")}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Match Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">Match Reminders</p>
                          <p className="text-sm text-muted-foreground">
                            Receive reminders before matches start
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.matchReminders}
                          onCheckedChange={() => handleNotificationChange("matchReminders")}
                        />
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className="space-y-4">
                      <h3 className="font-medium">Other Notifications</h3>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">News & Updates</p>
                          <p className="text-sm text-muted-foreground">
                            Receive news and platform updates
                          </p>
                        </div>
                        <Switch
                          checked={notificationSettings.newsUpdates}
                          onCheckedChange={() => handleNotificationChange("newsUpdates")}
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit" disabled={isNotificationSaving}>
                      {isNotificationSaving && (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      )}
                      Save Preferences
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            {isAdmin && (
              <TabsContent value="admin">
                <Card>
                  <form onSubmit={handleAdminSubmit}>
                    <CardHeader>
                      <CardTitle>Administrator Settings</CardTitle>
                      <CardDescription>
                        Configure system-wide settings for the auction platform.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="font-medium">Registration Settings</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Allow New Registrations</p>
                            <p className="text-sm text-muted-foreground">
                              Allow new team owners to register
                            </p>
                          </div>
                          <Switch
                            checked={adminSettings.allowNewRegistrations}
                            onCheckedChange={() => handleAdminSettingChange("allowNewRegistrations")}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Team Management</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Allow Team Editing</p>
                            <p className="text-sm text-muted-foreground">
                              Allow team owners to edit their team details
                            </p>
                          </div>
                          <Switch
                            checked={adminSettings.allowTeamEditing}
                            onCheckedChange={() => handleAdminSettingChange("allowTeamEditing")}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">Platform Settings</h3>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Public Visibility</p>
                            <p className="text-sm text-muted-foreground">
                              Make the platform visible to visitors
                            </p>
                          </div>
                          <Switch
                            checked={adminSettings.publicVisibility}
                            onCheckedChange={() => handleAdminSettingChange("publicVisibility")}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Maintenance Mode</p>
                            <p className="text-sm text-muted-foreground">
                              Put the platform in maintenance mode
                            </p>
                          </div>
                          <Switch
                            checked={adminSettings.maintenanceMode}
                            onCheckedChange={() => handleAdminSettingChange("maintenanceMode")}
                          />
                        </div>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-4">
                        <h3 className="font-medium">System Actions</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Button variant="outline" type="button">
                            Backup Database
                          </Button>
                          <Button variant="outline" type="button">
                            Clear Cache
                          </Button>
                          <Button variant="outline" type="button" className="md:col-span-2">
                            Generate System Report
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" disabled={isAdminSaving}>
                        {isAdminSaving && (
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        )}
                        Save Settings
                      </Button>
                    </CardFooter>
                  </form>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
