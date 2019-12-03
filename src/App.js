import React from "react";
import { useObserver } from "mobx-react";
import useStores from "./store/Common";
import Login from "./component/Login";
import Main from "./component/Main";
import "./App.css";

function useAuthData() {
  const { auth } = useStores();
  return useObserver(() => ({
    signState: auth.isSigned
  }));
}

function App() {
  const { signState } = useAuthData();
  return signState ? <Main /> : <Login />;
}

export default App;
