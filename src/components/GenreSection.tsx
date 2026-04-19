
import { useState, useEffect } from 'react';
import { Genre, getUserGenres, updateUserGenrePreference } from '@/services/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Music, Check } from 'lucide-react';

interface GenreSectionProps {
  userId: number;
}

const GenreSection = ({ userId }: GenreSectionProps) => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<Record<number, boolean>>({});
  const [preferences, setPreferences] = useState<Record<number, number>>({});
  const [success, setSuccess] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const loadGenres = async () => {
      setLoading(true);
      try {
        const genreData = await getUserGenres(userId);
        setGenres(genreData);
        
        // Initialize preferences
        const initialPreferences: Record<number, number> = {};
        genreData.forEach(genre => {
          initialPreferences[genre.GID] = genre.PreferenceLevel || 5;
        });
        setPreferences(initialPreferences);
      } catch (error) {
        console.error('Error loading genres:', error);
        // Mock data
        const mockGenres = [
          { GID: 301, Name: 'Hip-Hop', PreferenceLevel: 5 },
          { GID: 302, Name: 'Pop', PreferenceLevel: 4 },
          { GID: 303, Name: 'Rock', PreferenceLevel: 3 },
          { GID: 304, Name: 'Jazz', PreferenceLevel: 5 },
          { GID: 305, Name: 'Classical', PreferenceLevel: 2 },
          { GID: 306, Name: 'R&B', PreferenceLevel: 4 },
          { GID: 307, Name: 'Electronic', PreferenceLevel: 3 }
        ];
        setGenres(mockGenres);
        
        // Initialize preferences
        const initialPreferences: Record<number, number> = {};
        mockGenres.forEach(genre => {
          initialPreferences[genre.GID] = genre.PreferenceLevel || 5;
        });
        setPreferences(initialPreferences);
      } finally {
        setLoading(false);
      }
    };

    loadGenres();
  }, [userId]);

  const handlePreferenceChange = (genreId: number, value: number[]) => {
    setPreferences({
      ...preferences,
      [genreId]: value[0],
    });
    
    // Clear success state when preference is changed
    if (success[genreId]) {
      setSuccess({
        ...success,
        [genreId]: false,
      });
    }
  };

  const handleSavePreference = async (genreId: number) => {
    setUpdating({
      ...updating,
      [genreId]: true,
    });
    
    try {
      await updateUserGenrePreference(userId, genreId, preferences[genreId]);
      
      // Show success indication
      setSuccess({
        ...success,
        [genreId]: true,
      });
      
      // Update the genre in the state
      setGenres(genres.map(genre => 
        genre.GID === genreId 
          ? { ...genre, PreferenceLevel: preferences[genreId] } 
          : genre
      ));
      
      // Hide success after 2 seconds
      setTimeout(() => {
        setSuccess(prev => ({
          ...prev,
          [genreId]: false,
        }));
      }, 2000);
    } catch (error) {
      console.error('Error updating preference:', error);
    } finally {
      setUpdating({
        ...updating,
        [genreId]: false,
      });
    }
  };

  const getPreferenceLevelLabel = (level: number): string => {
    if (level <= 2) return 'Not my thing';
    if (level <= 4) return 'It\'s okay';
    if (level <= 6) return 'I like it';
    if (level <= 8) return 'Love it!';
    return 'Obsessed!';
  };

  if (loading) {
    return <div className="text-center py-10">Loading genres...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Your Music Preferences</h2>
        <p className="text-muted-foreground">
          Rate how much you enjoy each genre on a scale of 1-10 to improve your recommendations.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {genres.map((genre) => (
          <Card key={genre.GID}>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Music className="h-5 w-5 text-primary" />
                {genre.Name}
              </CardTitle>
              <CardDescription>
                Your rating: <span className="font-medium">{preferences[genre.GID] || 5}/10</span> - {' '}
                <span className="italic">{getPreferenceLevelLabel(preferences[genre.GID] || 5)}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Slider
                  defaultValue={[genre.PreferenceLevel || 5]}
                  min={1}
                  max={10}
                  step={1}
                  value={[preferences[genre.GID] || 5]}
                  onValueChange={(value) => handlePreferenceChange(genre.GID, value)}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>1 - Not my thing</span>
                  <span>10 - Obsessed!</span>
                </div>
                <Button 
                  onClick={() => handleSavePreference(genre.GID)}
                  disabled={updating[genre.GID] || 
                          (genre.PreferenceLevel === preferences[genre.GID])}
                  className="w-full"
                  variant={success[genre.GID] ? "outline" : "default"}
                >
                  {updating[genre.GID] ? 'Saving...' : 
                   success[genre.GID] ? (
                     <span className="flex items-center gap-1">
                       <Check className="h-4 w-4" /> Saved!
                     </span>
                   ) : 'Save Preference'}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default GenreSection;
