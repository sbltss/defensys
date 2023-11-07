import { useEffect, useState } from "react";
import { getDatabase, onValue, ref } from "firebase/database";
import firebaseApp from "../config/firebase";

const UseFirebaseDB = (path) => {
  const [state, setState] = useState(null);
  const fbdb = getDatabase(firebaseApp);
  const dbref = ref(fbdb, path);

  useEffect(() => {
    const subscription = onValue(dbref, (snapshot) => {
      const data = snapshot.val();
      setState(data);
    });
    return () => {
      subscription();
    };
  }, []);
  return [state];
};

export default UseFirebaseDB;
