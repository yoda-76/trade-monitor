import React from "react";

const MarketPlaceItem = (props) => {
  return (
    <tr className="bg-[#262832]  border-2 border-[#212126]">
      <th>{props.symbol}</th>
      <td>{props.timeStamp}</td>
      <td>{props.qty}</td>
      <td>{props.orderType}</td>
      <td>{props.transactionType}</td>
      <td>{props.status}</td>
    </tr>
  );
};

export default MarketPlaceItem;
