
import React from 'react'
import { Link, Route, withRouter } from 'react-router-dom';
import _ from 'lodash';

export const PageStage = React.createContext({ fromIndex: 0, toIndex: 0, loading: true, toPath: "", fromPath: "" });

export const NavLinks = [
  { title: "Home", to: "/" },
  { title: "About Me", to: "/aboutme" },
  { title: "Skill Sets", to: "/techstack" },
  { title: "Experience", to: "/history" },
  { title: "Contact me", to: "/blog" },
  { title: "About Site", to: "/aboutwebsite" },
];

export default withRouter(({ children, location }) => {

  const getCurrentIndex = _.findIndex(NavLinks, (v) => {
    return v.to === location.pathname;
  });


  const [fromIndex, setFromIndex] = React.useState(getCurrentIndex);
  const [toIndex, setToIndex] = React.useState(getCurrentIndex);
  const [loading, dispatch] = React.useReducer(reducer, true);
  const [toPath, setToPath] = React.useState(location.pathname);
  const [fromPath, setTromPath] = React.useState(location.pathname);

  // const store = {
  //   fromIndex: { value: fromIndex},
  //   toIndex: { value: toIndex },
  //   loading: { value: loading, setValue: (value) => {
  //     dispatch({payload: value})
  //   } },
  //   toPath: { value: toPath },
  //   fromPath: { value: fromPath },
  // }

  const store = {
    fromIndex: fromIndex,
    toIndex: toIndex,
    loading: loading,
    toPath: toPath,
    fromPath: fromPath,
    set loading(value){ dispatch({payload: value})},
    get loading() {return loading}
  };

  React.useEffect(() => {
    setFromIndex(toIndex);
    setTromPath(toPath);
    setToIndex(getCurrentIndex);
    setToPath(location.pathname);

    return () => {
    };
  }, [location])

  return <PageStage.Provider value={store}>{children}</PageStage.Provider>
});

const reducer = (state, action) => {
  if (action.payload !== state){
    return action.payload;
  } else {
    return state;
  }
}
