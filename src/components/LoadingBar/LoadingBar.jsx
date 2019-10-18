import React from 'react';


export default (props) => {

    const {title, status} = props;

    // console.log(props)

    return (
        <div>
        {title} {status}:====================>
        </div>
    )
}