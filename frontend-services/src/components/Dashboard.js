import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { getDashboardData } from "store/modules/dashboard/dashboard.action";
import ChartComponent from "./Chart";
import DashboardFilters from "./Filter";

const Dashboard = (props) => {
  const { fetchDashboardData } = props;
  const [dashboardData, setDashboardData] = useState([]);
  const [originalData, setOriginalData] = useState([]);

  useEffect(() => {
    fetchDashboardData()
      .then((res) => {
        const data = res?.data;
        setDashboardData(data);
        setOriginalData(data);
      })
      .catch((err) => console.log(err));
  }, []);

  function filterData(data, filterParams) {
    if (Object.keys(filterParams).length === 0) {
      return originalData; // Return all data if no filter parameters are specified
    }

    return data.filter((item) => {
      for (let key in filterParams) {
        if (filterParams[key] && item[key] !== filterParams[key]) {
          return false;
        }
      }
      return true;
    });
  }

  const handleFilterChange = (value) => {
    let filterOptions = Object.fromEntries(
      Object.entries(value).filter(([key, value]) => value)
    );
    let data = filterData(dashboardData, filterOptions);
    setDashboardData(data);
  };

  return (
    <div className="w-full p-5">
      <div className="mb-3">
        <DashboardFilters
          data={dashboardData}
          onFilterChange={handleFilterChange}
        />
      </div>
      <ChartComponent
        data={dashboardData}
        type="bar"
        xAxis="start_year"
        yAxis="intensity"
        aggKey="intensity"
        title="Intensity"
      />
      <div className="flex">
        <div className="w-1/2">
          <ChartComponent
            data={dashboardData}
            type="radar"
            xAxis="country"
            yAxis="likelihood"
            aggKey="likelihood"
            title="Likelihood"
          />
        </div>
        <div className="w-1/2">
          <ChartComponent
            data={dashboardData}
            type="doughnut"
            xAxis="region"
            yAxis="region"
            title="Region"
          />
        </div>
      </div>
      <div className="flex">
        <div className="w-1/2">
          <ChartComponent
            data={dashboardData}
            type="bubble"
            bubble={{
              y: "impact",
              x: "likelihood",
              r: "relevance",
            }}
            title="Relevance"
          />
        </div>
        <div className="w-1/2">
          <ChartComponent
            data={dashboardData}
            type="pie"
            xAxis="sector"
            yAxis="intensity"
            title="Sector"
          />
        </div>
      </div>
      <ChartComponent
        data={dashboardData}
        type="polarArea"
        xAxis="topic"
        yAxis="relevance"
        title="Topic"
        canvasHeight="100%"
        aggKey="relevance"
      />
    </div>
  );
};

const mapStateToProps = (state) => {};
const mapDispatchToProps = (dispatch) => {
  return {
    fetchDashboardData: (data) => dispatch(getDashboardData(data)),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
