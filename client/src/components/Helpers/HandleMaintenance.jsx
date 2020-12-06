import { useHistory } from "react-router-dom";
import { useEffect } from "react";

export default function HandleMaintenance({ currentUser }) {
  const history = useHistory();

  useEffect(() => {
    if (!currentUser) {
      setTimeout(function () {
        alert("We're under a maintenance!");
        history.push("/maintenance");
      }, 5000);
    } else if (currentUser) {
      return null;
    }
  }, [history, currentUser]);
  return null;
}
