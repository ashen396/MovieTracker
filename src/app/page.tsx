import { getMovies } from './actions/movieActions';
import { MovieList } from '@/components/MovieList';
import { AddMovieModal } from '@/components/AddMovieModal';
import { Film } from 'lucide-react';

export default async function Home() {
  const result = await getMovies(1, 10);
  
  return (
    <div className="flex flex-col gap-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
            My Collection
          </h2>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <Film className="w-4 h-4" />
            Track all the wonderful movies you have experienced.
          </p>
        </div>
      </div>

      <MovieList 
        initialMovies={result.success ? result.movies : []} 
        initialHasMore={result.success ? result.hasMore : false} 
      />

      <AddMovieModal />
    </div>
  );
}
