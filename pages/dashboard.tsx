import { useQuery, QueryClient } from "react-query";
import { GraphQLClient } from "graphql-request";
import { dehydrate } from "react-query/hydration";
import Layout from "../components/Layouts/Layout";
import { OpenPositionsColumns } from "../components/Tables/TableColumns/OpenPositionsColumns";
import { RecentTransColumns } from "../components/Tables/TableColumns/RecentTransColumns";
import { RecentTransListCols } from "../components/Lists/ListColumns/RecentTransListCols";
import { OpenPositionsListCols } from "../components/Lists/ListColumns/OpenPositionsListCols";
import DASHBOARD_QUERY from "../api/queries/Dashboard.graphql";
import GenericReactTable from "../components/Tables/GenericReactTable";
import React from "react";
import List from "../components/Lists/List";
import StatsBoard from "../components/Dashboard/StatsBoard";
import PnlChart from "../components/Dashboard/PnlChart";
import PnlCompChart from "../components/Dashboard/PnlCompChart";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });
const queryClient = new QueryClient();
const graphQLClient = new GraphQLClient(process.env.NEXT_PUBLIC_GQL_ENDPOINT, {
  headers: {
    "x-hasura-admin-secret": process.env.NEXT_PUBLIC_HASURA_ADMIN_SECRET,
  },
});

export async function getStaticProps() {
  await queryClient.prefetchQuery("DASHBOARD_QUERY", () => getTrans());
  return { props: { dehydratedState: dehydrate(queryClient) } };
}

async function getTrans() {
  return graphQLClient.request(DASHBOARD_QUERY);
}

export default function Dashboard() {
  const { data } = useQuery("DASHBOARD_QUERY", getTrans);
  const { total_pnl, total_fees, avg_pnl, win_rate } = data.dashboard_stats[0];

  return (
    <Layout>
      <div className="page-body">
        <div className="row row-deck row-cards">
          <StatsBoard
            total_fees={total_fees}
            total_pnl={total_pnl}
            avg_pnl={avg_pnl}
            win_rate={win_rate}
          />
          {/*Switch to horizontal progress bar for current month in mobile*/}
          <PnlChart chart={Chart} />
          <PnlCompChart chart={Chart} />
          <div className="col-12 d-none d-md-block">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Open Positions</h3>
              </div>
              <GenericReactTable
                title={"Open Positions"}
                subProps={OpenPositionsColumns}
                data={data.open_positions}
              />
            </div>
          </div>
          <div className="col-12 d-block d-md-none">
            <List
              title={"Open Positions"}
              data={data.open_positions}
              columns={OpenPositionsListCols}
            />
          </div>
          <div className="col-12 d-none d-md-block">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">Recent Transactions</h3>
              </div>
              <GenericReactTable
                title={"Recent Transactions"}
                subProps={RecentTransColumns}
                data={data.trades}
              />
            </div>
          </div>
          <div className="col-12 d-block d-md-none">
            <List
              title={"Recent Transactions"}
              data={data.trades}
              columns={RecentTransListCols}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
