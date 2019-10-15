
import React from 'react'
import { withRouter } from 'react-router-dom';
import { isMobileOnly } from 'react-device-detect';
import _ from 'lodash';

export const PageStage = React.createContext({ fromIndex: 0, toIndex: 0, loading: true, toPath: "", fromPath: "", scroll:{ anchor: 'top', y: 0, direction: 0 }, globalStage:'NONE'});

export const NavLinks = [
  { title: "Home", to: "/" },
  { title: "About Me", to: "/aboutme" },
  { title: "Skill Sets", to: "/techstack" },
  { title: "Experience", to: "/history" },
  { title: "Contact me", to: "/blog" },
  { title: "About Site", to: "/aboutwebsite" },
];
export const isMobile = isMobileOnly;




export default withRouter(({ children, location }) => {

  const getCurrentIndex = _.findIndex(NavLinks, (v) => {
    return v.to === location.pathname;
  });


  const [fromIndex, setFromIndex] = React.useState(getCurrentIndex);
  const [toIndex, setToIndex] = React.useState(getCurrentIndex);
  const [toPath, setToPath] = React.useState(location.pathname);
  const [fromPath, setTromPath] = React.useState(location.pathname);

  const [c_loading, dispatchLoading] = React.useReducer(reducer, true);
  const [c_scroll, dispatchScroll] = React.useReducer(reducer, { anchor: 'top', y: 0, direction: 0 });
  const [c_globalStage, dispatchGlobalStage] = React.useReducer(reducer, 'NONE');


  const store = {
    fromIndex: fromIndex,
    toIndex: toIndex,
    loading: c_loading,
    toPath: toPath,
    fromPath: fromPath,
    set loading(value) { dispatchLoading({ type: 'loading', payload: value }) },
    get loading() { return c_loading },
    set scroll(value) { dispatchScroll({ type: 'scroll', payload: value }) },
    get scroll() { return c_scroll },
    set globalStage(value) { dispatchGlobalStage({ type: 'globalStage', payload: value }) },
    get globalStage() { return c_globalStage },
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

  switch (action.type) {

    //==============================================
    case 'loading':
      return action.payload !== state ? action.payload : state;
      break;
    //==============================================
    case 'scroll':
      const {anchor, y, direction} = action.payload;
      if (y ==  state.y) return state;
      if (y > state.y) return {anchor, y, direction: 1};
      if (y < state.y) return {anchor, y, direction: -1};

      break;
    //==============================================
    case 'globalStage':
      console.log("changing global stage");
      return action.payload !== state ? action.payload : state;
      break;
    //==============================================
    default:
        return state;
      break;
  }

}
