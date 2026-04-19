
import { User } from '@/services/api';
import { Music } from 'lucide-react';

interface DashboardHeaderProps {
  user: User | null;
  playlistCount: number;
}

const DashboardHeader = ({ user, playlistCount }: DashboardHeaderProps) => {
  if (!user) return null;
  
  return (
    <div className="flex flex-col md:flex-row justify-between items-center py-6 mb-8 border-b border-border">
      <div className="flex items-center gap-4 mb-4 md:mb-0">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <Music className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user.Username}'s Music</h1>
          <p className="text-muted-foreground">Join date: {user.MonthJoined}/{user.DayJoined}/{user.YearJoined}</p>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <div className="text-sm text-muted-foreground">Total Playlists</div>
        <div className="text-3xl font-bold">{playlistCount}</div>
      </div>
    </div>
  );
};

export default DashboardHeader;
