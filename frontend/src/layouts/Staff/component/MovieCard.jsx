

const MovieCard = ({ movie, onSelect, selected }) => (
 <div
  onClick={() => onSelect(movie)}
  className={`cursor-pointer rounded-xl border border-gray-300 p-1 transition-transform hover:scale-105 h-[400px]
    ${selected ? 'shadow-lg' : 'none'}`}
  style={{ width: 200, minHeight: 350 }}
>
 <img
  alt={movie.nameMovie}
  src={movie.image}
  className="w-full h-[290px] object-cover rounded-md mx-auto"
/>
  <div className="mt-2 text-sm font-semibold text-center uppercase text-gray-700">
    {movie.nameMovie}
  </div>
</div>

);



export default MovieCard;
