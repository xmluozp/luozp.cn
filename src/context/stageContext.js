import React from 'react';

const PageStage = React.createContext({fromIndex: 0, toIndex:0, loading: false, toPath:"/", fromPath : "/"});

export {PageStage};