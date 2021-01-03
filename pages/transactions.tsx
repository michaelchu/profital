// @refresh reset
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import moment from "moment";
import { Button } from "react-bootstrap";

import Layout from "../components/Layout";
import AddTransactionModal from "../components/Modals/AddTransactionModal";
import DeleteTransactionModal from "../components/Modals/DeleteTransactionModal";
import EditTransactionModal from "../components/Modals/EditTransactionModal";
import TransactionTable from "../components/TransactionTable/TransactionTable";

import QUERY_TRANS_BY_ACCT from "../graphql/TransByAccountQuery.graphql";

export default function Transactions() {
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [trade, setTrade] = useState({});

  // TODO: add variable for user ID to query
  const { data, loading, error } = useQuery(QUERY_TRANS_BY_ACCT);

  const handleShowAdd = () => {
    setShowAdd(true);
  };
  const handleShowEdit = (row) => {
    setTrade(row);
    setShowEdit(true);
  };
  const handleShowDelete = (row) => {
    setTrade(row);
    setShowDelete(true);
  };

  const handleCloseDelete = () => {
    setShowDelete(false);
    setTrade({});
  };
  const handleCloseEdit = () => {
    setShowEdit(false);
    setTrade({});
  };
  const handleCloseAdd = () => {
    setShowAdd(false);
    setTrade({});
  };

  const cols = [
    "Account",
    "Trade Date",
    "Symbol",
    "Action",
    "Quantity",
    "Price",
    "Comm.",
    "Option Type",
    "Strike",
    "Expiration",
    "Amount",
  ];

  const formattedCols = ["price", "commission", "amount_with_comm"];
  const hiddenCols = ["id"];

  if (loading) {
    return <div>Loading..</div>;
  }

  if (error) {
    return <div>Error..</div>;
  }

  return (
    <Layout>
      <div className="page-header text-white d-print-none">
        <div className="row align-items-center">
          <div className="col">
            <div className="page-pretitle">As of {moment().format("LLL")}</div>
            <h2 className="page-title">Account Details</h2>
          </div>
          <div className="col-auto ms-auto d-print-none">
            <div className="btn-list">
              <Button variant={"primary"} onClick={handleShowAdd}>
                Add Transaction
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <TransactionTable
          cols={cols}
          rows={data.transactions_by_account}
          title={"Transactions"}
          formattedCols={formattedCols}
          hiddenCols={hiddenCols}
          onEdit={handleShowEdit}
          onDelete={handleShowDelete}
        />
      </div>

      <AddTransactionModal
        show={showAdd}
        trade={trade}
        handleClose={handleCloseAdd}
      />
      <EditTransactionModal
        show={showEdit}
        trade={trade}
        handleClose={handleCloseEdit}
      />
      <DeleteTransactionModal
        show={showDelete}
        trade={trade}
        handleClose={handleCloseDelete}
      />
    </Layout>
  );
}
