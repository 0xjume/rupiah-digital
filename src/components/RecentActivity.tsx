
import { Card, CardContent } from "@/components/ui/card";
import { Check, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface Activity {
  id: string;
  message: string;
  time: string;
  type: string;
}

const RecentActivity = () => {
  // Dummy data for recent activity
  const activities: Activity[] = [
    {
      id: "act1",
      message: "KYC verification completed",
      time: "2 hours ago",
      type: "verification",
    },
    {
      id: "act2",
      message: "Wallet connected to Phantom",
      time: "Yesterday",
      type: "wallet",
    },
    {
      id: "act3",
      message: "Private transfers enabled",
      time: "2 days ago",
      type: "privacy",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "verification":
        return <Check className="h-4 w-4 text-green-500" />;
      case "wallet":
      case "privacy":
      default:
        return <User className="h-4 w-4 text-rupiah-blue" />;
    }
  };

  return (
    <div>
      {activities.map((activity, index) => (
        <div key={activity.id}>
          <div className="flex items-start gap-3 p-4">
            <div className="mt-0.5">
              {getActivityIcon(activity.type)}
            </div>
            <div>
              <p className="text-sm">{activity.message}</p>
              <p className="text-xs text-muted-foreground">{activity.time}</p>
            </div>
          </div>
          {index < activities.length - 1 && <Separator />}
        </div>
      ))}
      
      {activities.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No recent activity
        </div>
      )}
    </div>
  );
};

export default RecentActivity;
