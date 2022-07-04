import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useState } from "react";
import { useHistory, useParams, generatePath } from 'react-router-dom';

export const RootContext = createContext(null);

function navigationReducer(state, action) {
  let ret = { ...state };
  if (!ret[action.base]) {
    ret[action.base] = [];
  }

  return {
    ...ret,
    [action.base]: action.data,
  }
}

export const RootProvider = ({ children }) => {
  const history = useHistory();
  const [items, dispatchItems] = useReducer(navigationReducer, {});
  const currentNav = null;

  const navGoTo = useCallback((path) => {
    history.push(path);
  }, [history]);

  const nav = {
    path: items,
    current: currentNav,
    go: navGoTo
  }
  const __internal = {
    dispatchNavigation: dispatchItems
  };
  return (
    <RootContext.Provider value={{
      navigation: nav,
      __internal: __internal
    }}>
      {children}
    </RootContext.Provider>
  )
}

export const useRoot = () => {
  const root = useContext(RootContext);
  return root;
}

export const Navigation = ({ base, navigation, children }) => {
  const root = useRoot();
  const params = useParams();
  const { __internal } = root;
  useEffect(() => {
    __internal.dispatchNavigation({
      base: base,
      data: navigation,
      params
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return children;
}

export const useNav = (base) => {
  const { navigation } = useContext(RootContext);
  const [breadcrumb] = useState([]);
  const params = useParams();

  const items = useMemo(() => {
    let its = navigation.path[base] || [];
    its = its.map((itm) => {
      if (!itm.rendered) { itm.rendered = itm.path; }
      if (itm.path.indexOf(base) === 0) return itm;
      let path = base;

      if (base.slice(-1) !== "/")
        path = path.concat("/");

      itm.path = itm.path.replace("/", path);
      try {
        itm.rendered = generatePath(itm.path, params);
      } catch (err) {
        // do nothing
      }
      return itm;
    });
    return its || null;
  }, [navigation.path, base, params]);

  const push = useCallback((path) => {
    // navigation.go(path);
    console.log(path);
    // setBreadcrumb(crumbs => [...crumbs, path]);
  }, []);

  const go = useCallback((path) => {
    let goToPath = null;
    for (let item of items) {
      if (item["path"] === path) {
        goToPath = item["rendered"];
      }
    }
    if (goToPath === null) return;
    navigation.go(goToPath);
  }, [navigation, items]);

  return {
    breadcrumb: breadcrumb,
    items: items,
    go: go,
    push: push
  };
}