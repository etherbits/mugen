import OptionsDropdown from "./options-dropdown";

const Header = () => {
  return (
    <header className="flex justify-between px-8 py-6">
      <h1 className="text-2xl">Mugen</h1>
      <section className="flex gap-4">
        <OptionsDropdown />
      </section>
    </header>
  );
};

export default Header;
