
import { useState } from 'react';
import { Playlist, Song, createPlaylist, getPlaylistSongs } from '@/services/api';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose
} from '@/components/ui/dialog';
import { Music, Plus, ListMusic } from 'lucide-react';

interface PlaylistSectionProps {
  userId: number;
  playlists: Playlist[];
  onPlaylistCreated: () => void;
}

const PlaylistSection = ({ userId, playlists, onPlaylistCreated }: PlaylistSectionProps) => {
  const [selectedPlaylist, setSelectedPlaylist] = useState<Playlist | null>(null);
  const [playlistSongs, setPlaylistSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistSize, setNewPlaylistSize] = useState('');
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);

  const handlePlaylistClick = async (playlist: Playlist) => {
    setSelectedPlaylist(playlist);
    setLoading(true);
    
    try {
      const songs = await getPlaylistSongs(playlist.PID);
      setPlaylistSongs(songs);
    } catch (error) {
      console.error('Error loading playlist songs:', error);
      // Use mock data for testing
      setPlaylistSongs([
        {
          SID: 201,
          Title: 'Lose Yourself',
          Artist: 'Eminem',
          Album: '8 Mile',
          DayReleased: 22,
          MonthReleased: 10,
          YearReleased: 2002,
          TotalFreq: 5000000
        },
        {
          SID: 202,
          Title: 'Shape of You',
          Artist: 'Ed Sheeran',
          Album: 'Divide',
          DayReleased: 6,
          MonthReleased: 1,
          YearReleased: 2017,
          TotalFreq: 8000000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!newPlaylistName || !newPlaylistSize) return;
    
    setCreatingPlaylist(true);
    
    try {
      await createPlaylist(newPlaylistName, parseInt(newPlaylistSize), userId);
      setNewPlaylistName('');
      setNewPlaylistSize('');
      onPlaylistCreated();
    } catch (error) {
      console.error('Error creating playlist:', error);
    } finally {
      setCreatingPlaylist(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Your Playlists</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Plus className="mr-2 h-4 w-4" />
              Create Playlist
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Playlist</DialogTitle>
              <DialogDescription>
                Enter a name and the number of songs for your new playlist.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Playlist Name
                </label>
                <Input
                  id="name"
                  placeholder="My Awesome Playlist"
                  value={newPlaylistName}
                  onChange={(e) => setNewPlaylistName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="songs" className="text-sm font-medium">
                  Number of Songs
                </label>
                <Input
                  id="songs"
                  type="number"
                  placeholder="10"
                  value={newPlaylistSize}
                  onChange={(e) => setNewPlaylistSize(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <DialogClose asChild>
                <Button 
                  onClick={handleCreatePlaylist} 
                  disabled={creatingPlaylist || !newPlaylistName || !newPlaylistSize}
                >
                  {creatingPlaylist ? 'Creating...' : 'Create Playlist'}
                </Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {playlists.map((playlist) => (
          <Card 
            key={playlist.PID} 
            className={`cursor-pointer transition-colors hover:bg-accent/50 ${
              selectedPlaylist?.PID === playlist.PID ? 'border-primary' : ''
            }`}
            onClick={() => handlePlaylistClick(playlist)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-xl">{playlist.Name}</CardTitle>
              <CardDescription>
                Created on {playlist.MonthCreated}/{playlist.DayCreated}/{playlist.YearCreated}
              </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center gap-2">
                <ListMusic className="h-5 w-5 text-muted-foreground" />
                <span>{playlist.NoOfSongs} songs</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" size="sm" onClick={() => handlePlaylistClick(playlist)}>
                View Songs
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedPlaylist && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Songs in "{selectedPlaylist.Name}"
          </h3>
          {loading ? (
            <p>Loading songs...</p>
          ) : (
            <div className="bg-card rounded-lg shadow-sm overflow-hidden">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left py-3 px-4">Title</th>
                    <th className="text-left py-3 px-4">Artist</th>
                    <th className="text-left py-3 px-4 hidden md:table-cell">Album</th>
                    <th className="text-left py-3 px-4 hidden lg:table-cell">Release Date</th>
                  </tr>
                </thead>
                <tbody>
                  {playlistSongs.map((song) => (
                    <tr key={song.SID} className="border-b border-border hover:bg-muted/20">
                      <td className="py-3 px-4 flex items-center gap-2">
                        <Music className="h-4 w-4 text-primary" />
                        {song.Title}
                      </td>
                      <td className="py-3 px-4">{song.Artist}</td>
                      <td className="py-3 px-4 hidden md:table-cell">{song.Album}</td>
                      <td className="py-3 px-4 hidden lg:table-cell">
                        {song.MonthReleased}/{song.DayReleased}/{song.YearReleased}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default PlaylistSection;
