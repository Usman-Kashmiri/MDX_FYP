import React, { useEffect, useState } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { SegmentedControl, Tabs } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import { GoLaw } from "react-icons/go";
import { FaUserTie, FaUserAlt } from "react-icons/fa";
import { ImHammer2 } from "react-icons/im";
import {
  addClient,
  addLawyer,
  deleteClient,
  deleteLawyer,
  fetchChartData,
  fetchClientList,
  fetchDashboard,
  fetchLawyerList,
  updateClient,
  updateLawyer,
} from "../../redux/actions/adminActions";
import DataTableWithActions from "../../components/admin/DataTableWithActions";

export const Dashboard = () => {
  const { dashboard } = useSelector((state) => state.admin);
  const [chartState, setChartState] = useState({
    series: [
      {
        name: "cases",
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
      },
      plotOptions: {
        bar: {
          borderRadius: 10,
          dataLabels: {
            position: "top", // top, center, bottom
          },
        },
      },
      colors: ["#da954c"],
      dataLabels: {
        enabled: true,
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"],
        },
      },
      xaxis: {
        categories: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ],
        position: "top",
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        crosshairs: {
          fill: {
            type: "gradient",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5,
            },
          },
        },
        tooltip: {
          enabled: true,
        },
      },
      yaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          show: false,
          formatter: function (val) {
            return val + "%";
          },
        },
      },
      title: {
        text: "Yearly Cases Analytics",
        floating: true,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444",
        },
      },
    },
  });

  const dispatch = useDispatch();

  const handleFetchChartData = async () => {
    try {
      const res = await dispatch(fetchChartData());
      if (res.res === "success") {
        setChartState({
          ...chartState,
          series: [
            {
              name: "cases",
              data: res.data,
            },
          ],
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    dispatch(fetchDashboard());
    handleFetchChartData();
  }, [dispatch]);

  const dashboardCard = [
    {
      heading: "Total Admins",
      value: dashboard?.total_admins,
      icon: <FaUserTie />,
    },
    {
      heading: "Total Lawyers",
      value: dashboard?.lawyers?.total_lawyers,
      icon: <ImHammer2 />,
    },
    {
      heading: "Total Clients",
      value: dashboard?.clients?.total_clients,
      icon: <FaUserAlt />,
    },
    {
      heading: "Total Cases",
      value: dashboard?.cases?.total_cases,
      icon: <GoLaw />,
    },
  ];

  return (
    <div className="first-div-of-dashboard-page-of-superadmin">
      <Row>
        {dashboardCard?.map((item, i) => (
          <Col xs={12} md={6} lg={4} xl={3} key={i}>
            <div className="dahsboardColumns">
              <i className="dashboardcardicon"> {item.icon}</i>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "start",
                  alignItems: "start",
                }}
              >
                <p className="jsadjoekm">{item.heading}</p>

                <p
                  style={{
                    fontSize: "18px",
                    fontWeight: "bold",

                    margin: "0",
                  }}
                >
                  {item.value}
                </p>
              </div>
              <span className="upperBall"></span>
              <span className="lowerBall"></span>
            </div>
          </Col>
        ))}
      </Row>

      <div className="chartBox">
        <div className="upperLine">
          <p className="font-poppins fs-4">Total Lawyers And Clients</p>
        </div>
        <Row className="row-in-dashboard-page-of-superadmin mx-0 px-0">
          <Col
            xs={12}
            xxl={8}
            style={{
              overflowX: "auto",
              overflowY: "hidden",
            }}
          >
            <div className="react-apex-container-in-dashboard px-0">
              <ReactApexChart
                options={chartState.options}
                series={chartState.series}
                type="bar"
                height={350}
              />
            </div>
          </Col>
          <Col xs={12} xxl={4}>
            <Tabs defaultValue="week" color="orange">
              <Tabs.List>
                <Tabs.Tab value="week">Weekly</Tabs.Tab>
                <Tabs.Tab value="month">Monthly</Tabs.Tab>
                <Tabs.Tab value="year">Yearly</Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="week" pt="xs">
                <div>
                  <div className="underLines">
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#da954c"
                        width="30"
                        height="30"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                        <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                      </svg>

                      <p>Total Lawyers </p>
                    </div>
                    <p>{dashboard?.lawyers?.new_lawyers_this_week}</p>
                  </div>
                  <div className="underLines">
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#da954c"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>

                      <p>Total Clients</p>
                    </div>
                    <p>{dashboard?.clients?.new_clients_this_week}</p>
                  </div>
                  <div className="underLines">
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#da954c"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                        />
                      </svg>

                      <p>Total Cases</p>
                    </div>
                    <p>{dashboard?.cases?.new_cases_this_week}</p>
                  </div>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="month" pt="xs">
                <div>
                  <div className="underLines">
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#da954c"
                        width="30"
                        height="30"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                        <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                      </svg>
                      <p>Total Lawyers </p>
                    </div>
                    <p>{dashboard?.lawyers?.new_lawyers_this_month}</p>
                  </div>
                  <div className="underLines">
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#da954c"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      <p>Total Clients</p>
                    </div>
                    <p>{dashboard?.clients?.new_clients_this_month}</p>
                  </div>
                  <div className="underLines">
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#da954c"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                        />
                      </svg>
                      <p>Total Cases</p>
                    </div>
                    <p>{dashboard?.cases?.new_cases_this_month}</p>
                  </div>
                </div>
              </Tabs.Panel>

              <Tabs.Panel value="year" pt="xs">
                <div>
                  <div className="underLines">
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="#da954c"
                        width="30"
                        height="30"
                      >
                        <path
                          fillRule="evenodd"
                          d="M7.5 5.25a3 3 0 013-3h3a3 3 0 013 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0112 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 017.5 5.455V5.25zm7.5 0v.09a49.488 49.488 0 00-6 0v-.09a1.5 1.5 0 011.5-1.5h3a1.5 1.5 0 011.5 1.5zm-3 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z"
                          clipRule="evenodd"
                        />
                        <path d="M3 18.4v-2.796a4.3 4.3 0 00.713.31A26.226 26.226 0 0012 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 01-6.477-.427C4.047 21.128 3 19.852 3 18.4z" />
                      </svg>
                      <p>Total Lawyers </p>
                    </div>
                    <p>{dashboard?.lawyers?.new_lawyers_this_year}</p>
                  </div>
                  <div className="underLines">
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#da954c"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      <p>Total Clients</p>
                    </div>
                    <p>{dashboard?.clients?.new_clients_this_year}</p>
                  </div>
                  <div className="underLines">
                    <div
                      style={{
                        display: "flex",
                        gap: "0.5rem",
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="#da954c"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z"
                        />
                      </svg>
                      <p>Total Cases</p>
                    </div>
                    <p>{dashboard?.cases?.new_cases_this_year}</p>
                  </div>
                </div>
              </Tabs.Panel>
            </Tabs>
          </Col>
        </Row>
      </div>
      <div className="dashboardTableBox">
        <TableOfDashboard />
      </div>
    </div>
  );
};

export default Dashboard;

const TableOfDashboard = () => {
  const { lawyers, clients } = useSelector((state) => state.admin);
  const [activeTab, setActiveTab] = useState("lawyers");
  const handleTabChange = (value) => {
    setActiveTab(value);
  };
  const tabs = [
    { label: "Lawyers", value: "lawyers" },
    { label: "Clients", value: "clients" },
  ];
  return (
    <>
      <Container fluid className="pb-md-5 pb-0 mb-md-5 px-md-4 px-3">
        <div className="d-flex justify-content-center mb-4">
          <SegmentedControl
            value={activeTab}
            onChange={handleTabChange}
            data={tabs}
            // style={{  color: "#da954c" }}
          />
        </div>

        {/* Lawyers' Tab */}
        {activeTab === "lawyers" && (
          <DataTableWithActions
            data={lawyers}
            fetchDispatch={fetchLawyerList}
            addDispatch={addLawyer}
            updateDispatch={updateLawyer}
            deleteDispatch={deleteLawyer}
            buttonText="Add Lawyer"
            tab={"lawyers"}
            fromDash={true}
          />
        )}
        {/* Clients' Tab */}
        {activeTab === "clients" && (
          <DataTableWithActions
            data={clients}
            fetchDispatch={fetchClientList}
            addDispatch={addClient}
            updateDispatch={updateClient}
            deleteDispatch={deleteClient}
            buttonText="Add Client"
            tab={"clients"}
            fromDash={true}
          />
        )}
      </Container>
    </>
  );
};
