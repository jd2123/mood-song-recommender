
import { useState } from 'react';
import { Song, getUserRecommendations, recordSongInteraction } from '@/services/api';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ThumbsUp, ThumbsDown, Disc, RefreshCw, Music } from 'lucide-react';

interface RecommendationSectionProps {
  userId: number;
}

const RecommendationSection = ({ userId }: RecommendationSectionProps) => {
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [interacting, setInteracting] = useState<Record<number, boolean>>({});

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const songs = await getUserRecommendations(userId);
      setRecommendations(songs);
    } catch (error) {
      console.error('Error loading recommendations:', error);
      // Mock data
      setRecommendations([
        {
          SID: 203,
          Title: 'Bohemian Rhapsody',
          Artist: 'Queen',
          Album: 'A Night at the Opera',
          DayReleased: 31,
          MonthReleased: 10,
          YearReleased: 1975,
          TotalFreq: 9000000
        },
        {
          SID: 204,
          Title: 'Imagine',
          Artist: 'John Lennon',
          Album: 'Imagine',
          DayReleased: 9,
          MonthReleased: 9,
          YearReleased: 1971,
          TotalFreq: 7000000
        },
        {
          SID: 205,
          Title: 'Hotel California',
          Artist: 'Eagles',
          Album: 'Hotel California',
          DayReleased: 22,
          MonthReleased: 2,
          YearReleased: 1977,
          TotalFreq: 6500000
        },
        {
          SID: 206,
          Title: 'Someone Like You',
          Artist: 'Adele',
          Album: '21',
          DayReleased: 24,
          MonthReleased: 1,
          YearReleased: 2011,
          TotalFreq: 7500000
        },
        {
          SID: 207,
          Title: 'Billie Jean',
          Artist: 'Michael Jackson',
          Album: 'Thriller',
          DayReleased: 2,
          MonthReleased: 1,
          YearReleased: 1983,
          TotalFreq: 10000000
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleInteraction = async (songId: number, liked: boolean) => {
    setInteracting({
      ...interacting,
      [songId]: true,
    });
    
    try {
      await recordSongInteraction(userId, songId, liked);
      
      // Remove the song from recommendations
      setRecommendations(recommendations.filter(song => song.SID !== songId));
    } catch (error) {
      console.error('Error recording interaction:', error);
      
      // Still remove from UI even if API fails (for demo purposes)
      setRecommendations(recommendations.filter(song => song.SID !== songId));
    } finally {
      setInteracting({
        ...interacting,
        [songId]: false,
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Recommended For You</h2>
          <p className="text-muted-foreground">
            Based on your genre preferences and listening history.
          </p>
        </div>
        <Button 
          onClick={loadRecommendations}
          disabled={loading}
          variant="outline"
          className="flex items-center gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Get Recommendations'}
        </Button>
      </div>

      {recommendations.length === 0 && !loading ? (
        <div className="bg-muted/30 border border-border rounded-lg p-8 text-center">
          <Disc className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">No Recommendations Yet</h3>
          <p className="text-muted-foreground mb-4">
            Click the button above to get personalized music recommendations
            based on your preferences.
          </p>
          <Button onClick={loadRecommendations}>
            Get Recommendations
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recommendations.map((song) => (
            <Card key={song.SID} className="overflow-hidden">
              <CardHeader className="pb-2 bg-primary/5">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Music className="h-5 w-5 text-primary" />
                  {song.Title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Artist</span>
                    <span className="font-medium">{song.Artist}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Album</span>
                    <span className="font-medium">{song.Album}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Released</span>
                    <span className="font-medium">{song.MonthReleased}/{song.DayReleased}/{song.YearReleased}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between gap-2 pt-2 border-t">
                <Button
                  variant="outline"
                  className="w-1/2"
                  onClick={() => handleInteraction(song.SID, false)}
                  disabled={interacting[song.SID]}
                >
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  Skip
                </Button>
                <Button
                  className="w-1/2"
                  onClick={() => handleInteraction(song.SID, true)}
                  disabled={interacting[song.SID]}
                >
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  Like
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecommendationSection;
