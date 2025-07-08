interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 mx-auto max-w-[393px] w-full h-[50px] flex items-center justify-center border-b border-[#5555558C] bg-white z-50">
      <h1
        style={{ fontFamily: "Hakgyoansim Mulgyeol" }}
        className="text-[24px] text-[#729A73]"
      >
        {title}
      </h1>
    </header>
  );
};

export default Header;
