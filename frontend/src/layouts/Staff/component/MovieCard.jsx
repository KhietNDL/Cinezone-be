

const MovieCard = ({ movie, onSelect, selected }) => (
 <div
  onClick={() => onSelect(movie)}
  className={`cursor-pointer rounded-xl border border-gray-300  transition-transform  h-[440px]
    ${selected ? 'shadow-[0_10px_10px_gray]' : 'none'}`}
  style={{ width: 250, minHeight: 350 }}
>
 <img
  alt={movie.nameMovie}
  src={movie.image}
  loading="lazy"
  className="w-full h-[350px] object-cover rounded-tl-md rounded-tr-md mx-auto"
/>
  <div className="mt-2 text-sm p-2 font-semibold text-center uppercase text-gray-700">
    {movie.nameMovie}
  </div>
</div>

);



export default MovieCard;
