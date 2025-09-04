import NavButton from "./NavButton";

const Links = () => {
  const Links: { name: string; path:  string }[] = [
    { name: "Overview", path: "/" },
    { name: "Transactions", path: "/transactions" },
    { name: "Accounts", path: "/accounts" },
    { name: "Categories", path: "/categories" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="flexcenter max-lg:flex-col max-lg:items-start  w-full">
      {Links.map(({ name, path }, i) => (
        <div className="w-full" key={i}>
          {" "}
          <NavButton sep={i < Links.length - 1} name={name} path={path} />
        </div>
      ))}
    </div>
  );
};

export default Links;
