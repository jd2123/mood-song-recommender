
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DashboardHeader from '@/components/DashboardHeader';
import PlaylistSection from '@/components/PlaylistSection';
import GenreSection from '@/components/GenreSection';
import RecommendationSection from '@/components/RecommendationSection';
import ProfileSection from '@/components/ProfileSection';
import { 
  User,
  getUser, 
  getUserPlaylists, 
  getUserPlaylistCount,
  mockApi 
} from '@/services/api';
import { ListMusic, Disc, Radio, UserCircle } from 'lucide-react';

const DEMO_USER_ID = 1; // For demo, using Jaydev (UID = 1)

const Index = () => {
  const [user, setUser] = useState<User | null>(null);
  const [playlists, setPlaylists] = useState([]);
  const [playlistCount, setPlaylistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('playlists');

  const loadUserData = async () => {
    setLoading(true);
    try {
      // Try to fetch from API
      const userData = await getUser(DEMO_USER_ID);
      const userPlaylists = await getUserPlaylists(DEMO_USER_ID);
      const { count } = await getUserPlaylistCount(DEMO_USER_ID);
      
      setUser(userData);
      setPlaylists(userPlaylists);
      setPlaylistCount(count);
    } catch (error) {
      console.error('Error loading user data, using mock data:', error);
      // Fall back to mock data
      const userData = await mockApi.getUser(DEMO_USER_ID);
      const userPlaylists = await mockApi.getUserPlaylists(DEMO_USER_ID);
      const { count } = await mockApi.getUserPlaylistCount(DEMO_USER_ID);
      
      setUser(userData);
      setPlaylists(userPlaylists);
      setPlaylistCount(count);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  const handlePlaylistCreated = async () => {
    try {
      const userPlaylists = await getUserPlaylists(DEMO_USER_ID);
      const { count } = await getUserPlaylistCount(DEMO_USER_ID);
      
      setPlaylists(userPlaylists);
      setPlaylistCount(count);
    } catch (error) {
      console.error('Error refreshing playlists:', error);
      // Fall back to mock data with one more playlist
      const mockPlaylists = await mockApi.getUserPlaylists(DEMO_USER_ID);
      mockPlaylists.push({
        PID: 999,
        Name: 'New Playlist',
        NoOfSongs: 0,
        DayCreated: new Date().getDate(),
        MonthCreated: new Date().getMonth() + 1,
        YearCreated: new Date().getFullYear()
      });
      
      setPlaylists(mockPlaylists);
      setPlaylistCount(playlistCount + 1);
    }
  };

  const handleProfileUpdated = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const handleProfileDeleted = () => {
    // In a real app, we would redirect to a logout page
    // For demo purposes, just reset the user
    setUser(null);
    setPlaylists([]);
    setPlaylistCount(0);
    setTimeout(() => {
      loadUserData();
    }, 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Disc className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
          <h1 className="text-2xl font-bold mb-2">Loading Music App...</h1>
          <p className="text-muted-foreground">Please wait while we set up your experience</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container py-8">
        <DashboardHeader user={user} playlistCount={playlistCount} />
        
        <Tabs defaultValue="playlists" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="playlists" className="flex items-center gap-2">
              <ListMusic className="h-4 w-4" />
              <span className="hidden sm:inline">Playlists</span>
            </TabsTrigger>
            <TabsTrigger value="genres" className="flex items-center gap-2">
              <Radio className="h-4 w-4" />
              <span className="hidden sm:inline">Genres</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center gap-2">
              <Disc className="h-4 w-4" />
              <span className="hidden sm:inline">Recommendations</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <UserCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="playlists" className="space-y-6">
            {user && (
              <PlaylistSection 
                userId={user.UID} 
                playlists={playlists} 
                onPlaylistCreated={handlePlaylistCreated} 
              />
            )}
          </TabsContent>
          
          <TabsContent value="genres" className="space-y-6">
            {user && <GenreSection userId={user.UID} />}
          </TabsContent>
          
          <TabsContent value="recommendations" className="space-y-6">
            {user && <RecommendationSection userId={user.UID} />}
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-6">
            {user && (
              <ProfileSection 
                user={user} 
                playlistCount={playlistCount} 
                onProfileUpdated={handleProfileUpdated}
                onProfileDeleted={handleProfileDeleted}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
