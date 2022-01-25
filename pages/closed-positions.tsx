import { useQuery } from "@apollo/client";
import Layout from "../components/Layouts/Layout";
import CLOSED_POSITIONS from "../api/queries/ClosedPositions.graphql";
import { ClosedPositionColumns } from "../components/Tables/TableColumns/ClosedPositionColumns";
import Accordion from "../components/Accordion";
import GenericReactTable from "../components/Tables/GenericReactTable";
import _ from "lodash";
import dayjs from "dayjs";
import React from "react";
import ListGroup from "../components/Lists/ListGroup";
import { ClosedPositionsListCols } from "../components/Lists/ListColumns/ClosedPositionsListCols";
import ErrorPage from "../components/ErrorPage";

export default function ClosedPositions() {
  const { data, loading, error } = useQuery(CLOSED_POSITIONS);

  if (loading) return <Layout />;
  if (error) return <ErrorPage />;

  const grouped_positions = _.groupBy(data.closedPositions, ({ exitDate }) => {
    return dayjs(exitDate).format("MMM YYYY");
  });

  return (
    <Layout>
      <div className="page-body">
        <div className="row row-cards">
          <div className="col-12 d-none d-md-block">
            <Accordion
              title={"Closed Positions"}
              data={grouped_positions}
              subComponent={{
                component: GenericReactTable,
                subProps: ClosedPositionColumns,
              }}
            />
          </div>
          <div className="col-12 d-block d-md-none">
            <ListGroup
              title={"Closed Positions"}
              data={data.closedPositions}
              groupFunc={({ exitDate }) => {
                return dayjs(exitDate).format("MMM YYYY");
              }}
              columns={ClosedPositionsListCols}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
