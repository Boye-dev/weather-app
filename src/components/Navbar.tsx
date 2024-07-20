import logo from "../assets/logo.png";
import classes from "../styles/app.module.css";

const Navbar = ({
  location,
  onChange,
  search,
}: {
  location: string;
  onChange: any;
  search: () => void;
}) => {
  return (
    <>
      <div className={classes.navbar}>
        <img src={logo} width={80} height={80} />
        <div>
          <input
            value={location}
            onChange={onChange}
            type="text"
            className={classes.navbar_input}
            placeholder="Search Location..."
          />
          <button onClick={search}>Search</button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
