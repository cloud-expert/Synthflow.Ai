import { useSelector } from "react-redux";

const DashBoard = () => {
  const myUser = useSelector(state => state.auth.user)
  return (
    <div className="selection:select-none">
      This is { myUser && myUser.email }
    </div>
  );
};

export default DashBoard;
