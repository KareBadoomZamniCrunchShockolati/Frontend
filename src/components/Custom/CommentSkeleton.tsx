import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const CommentSkeleton = () => {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-4 flex gap-3">
        {/* Avatar */}
        <Avatar>
          <AvatarFallback className="bg-muted" />
        </Avatar>

        {/* Content */}
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/4 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSkeleton;
