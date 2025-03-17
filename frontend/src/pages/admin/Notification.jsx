import {
  Box,
  Button,
  CloseButton,
  Pagination,
  Popover,
  SegmentedControl,
  Skeleton,
  Text,
} from "@mantine/core";
import React, { useEffect } from "react";
import { useState } from "react";
import { useDisclosure, useMediaQuery } from "@mantine/hooks";
import { useDispatch, useSelector } from "react-redux";
import { deleteNotifications, getNotifications, readNotifications } from "../../redux/actions/notificationsActions";
import { Fade } from "react-reveal";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { UseGetRole } from "../../hooks/auth";

const Notification = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const role = UseGetRole();
  const [activePage, setPage] = useState(1);
  const responsive = useMediaQuery('(max-width:767px)')
  const { notifications, loading, deleteLoading } = useSelector((state) => state?.notification);
  const per_page = 5;

  const handleTabChange = (value) => {
    setActiveTab(value);
  };

  useEffect(() => {
    if (!deleteLoading) {
      dispatch(getNotifications(activeTab, { page: activePage, per_page }))
    }
  }, [activeTab, activePage, deleteLoading]);

  const tabs = [
    { label: "All", value: "all" },
    { label: "Unread", value: "unread" },
    { label: "Latest", value: "latest" },
    { label: "Oldest", value: "oldest" },
  ];

  const handleDirectToUrl = (item) => {
    dispatch(readNotifications(item.id))
    if (item.url) {
      navigate(item.url)
      // if (role == 'Lawyer') {
      //   navigate('/lawyer/dashboard/#47')
      // } else {
      //   navigate('/client/dashboard/#37')
      // }
    }
  }
  return (
    <div className="pt-4 pb-3 px-1 px-md-4 mb-4">
      <div className="d-flex justify-content-between align-items-center">
        <h2>Notifications </h2>
      </div>
      <SegmentedControl
        value={activeTab}
        onChange={handleTabChange}
        data={tabs}
      />
      <div className="pb-5 mt-3">

        {loading ? (
          <>
            <Skeleton height={60} mt={6} width="100%" />
            <Skeleton height={60} mt={6} width="100%" />
            <Skeleton height={60} mt={6} width="100%" />
            <Skeleton height={60} mt={6} width="100%" />
            <Skeleton height={60} mt={6} width="100%" />
            <Skeleton height={60} mt={6} width="100%" />
          </>
        )
          : notifications?.data?.length > 0 ? (
            <div>
              {notifications.data.map((value, i) => {
                return (
                  <div key={i} 
                    className={`mb-2 p-3 notification-items  ${value.read == 1 ? 'mark-read' : ''}`} >

                    <div className="d-flex flex-column">
                      <h5 onClick={() => handleDirectToUrl(value)} className="mb-0 text-capitalize text-primary-color" style={{ fontSize: responsive ? '15px' : '16px' }}>
                        {value.title}
                      </h5>
                      <p onClick={() => handleDirectToUrl(value)} className="mb-0 fs-md-6" style={{ fontSize: responsive ? '13px' : '15px' }} title={value?.description}>
                        {value?.description?.length > 200
                          ? (() => {
                            let description = value.description;
                            let res = description.slice(
                              description.length / 2 - description.length / 3,
                              description.length / 2 + description.length / 3
                            );
                            let newDescription = description.replace(res, "<span class='mirror-fade'> ..... </span>");
                            return <div dangerouslySetInnerHTML={{ __html: newDescription }} />;
                          })()
                          : value.description}

                      </p>
                    </div>
                    <div className="d-flex gap-3 align-items-center mt-md-0 mt-2 justify-content-between">
                      <Box
                        className={`${!responsive && 'text-end'} mb-0 text-muted`}
                        style={{ fontSize: '12px', width: 'max-content', minWidth: '90px' }}>
                        {showDateTime(value.created_at, i)}
                      </Box>
                      <ActionButtons id={value.id} />
                    </div>
                  </div>
                );
              }
              )}

              {Math.ceil(notifications.total / per_page) > 1 && (
                <Pagination disabled={loading} value={activePage} onChange={setPage} total={Math.ceil(notifications.total / per_page)} className="mt-3" color="orange" />
              )}
            </div>
          )
            : (
              <div className="text-center">
                Nothing found!
              </div>
            )
        }
      </div>
    </div >
  );
};

const ActionButtons = ({ id }) => {

  const responsive = useMediaQuery('(max-width:767px)')
  const { deleteLoading } = useSelector((state) => state?.notification);
  const [opened, { close, open }] = useDisclosure(false);
  const dispatch = useDispatch()

  const dismissNotifications = () => {
    try {

      dispatch(deleteNotifications(id))
    } catch (error) {

    }
  }
  return (
    <Popover width={220} position="right" withArrow shadow="md" opened={opened} onClose={close}>
      <Popover.Target>
        <Button size={responsive ? 'xs' : 'xs'} disabled={deleteLoading} variant="light" color="gray" onClick={open} aria-label="Close modal" >
          Dismiss
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Text size="sm">Are you sure you want to delete this record?</Text>
        <Box
          mt={10}
          sx={{
            display: "flex",
            gap: "20px",
            justifyContent: "space-between",
          }}
        >
          <Button
            disabled={deleteLoading}
            variant="light"
            color="gray"
            onClick={close}>
            cancel
          </Button>
          <Button
            disabled={deleteLoading}
            variant="filled" color="red"
            // loading={loading}
            onClick={() => dismissNotifications()}
          >
            Confirm
          </Button>
        </Box>
      </Popover.Dropdown>
    </Popover>
  );
};


const showDateTime = (date, index) => {
  const formattedDate = moment(date);
  const currentDate = moment();
  moment.locale();
  // Format today and yesterday dates
  const today = currentDate.clone().startOf('day');
  const yesterday = currentDate.clone().subtract(1, 'days').startOf('day');

  let displayDate;

  if (formattedDate.isSame(today, 'day')) {
    displayDate = "Today";
  } else if (formattedDate.isSame(yesterday, 'day')) {
    displayDate = "Yesterday";
  } else {
    displayDate = formattedDate.format("MMM DD, YYYY");
  }

  // Rendering only if the formatted date is valid
  if (formattedDate.isValid()) {
    return (
      <Fade top key={`date-${index}`}>
        <Text>
          {displayDate}
        </Text>
        <Text>
          {formattedDate.format("LT")}
        </Text>
      </Fade>
    );
  }
};
export default Notification;
