import searchIcon from "../../assets/search.png";

const SearchBar = () => {
  return (
    <div className="flex items-center w-[306px] border-[1.5px] border-[#729A73] rounded-[10px] px-[10px] py-[7px] gap-[7px]">
      <img src={searchIcon} alt="search" className="w-4 h-4 mr-2" />
      <input
        type="text"
        placeholder="궁금한 내용을 찾아보세요"
        className="w-full bg-transparent text-gray-700 placeholder-gray-400 outline-none"
      />
    </div>
  );
};

export default SearchBar;
